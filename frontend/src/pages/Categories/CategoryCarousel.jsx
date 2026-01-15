import { useRef, useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";


export default function CarouselWithImage({ categories, onCategoryClick }) {
  const carouselRef = useRef(null);
  const cubeRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [cubeLeft, setCubeLeft] = useState(0);

  // Scroll carousel according to cube position
  const updateCarouselScroll = (newLeft) => {
    if (!carouselRef.current || !cubeRef.current) return;

    const maxLeft = cubeRef.current.parentElement.offsetWidth - cubeRef.current.offsetWidth;
    const ratio = newLeft / maxLeft;
    const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.offsetWidth;

    carouselRef.current.scrollTo({
      left: ratio * maxScroll,
      behavior: "auto",
    });
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartX(e.clientX - cubeLeft);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const maxLeft = cubeRef.current.parentElement.offsetWidth - cubeRef.current.offsetWidth;
    let newLeft = e.clientX - startX;

    if (newLeft < 0) newLeft = 0;
    if (newLeft > maxLeft) newLeft = maxLeft;

    setCubeLeft(newLeft);
    updateCarouselScroll(newLeft);
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dragging, startX]);

  return (
    <div className="relative">
      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex space-x-4 overflow-x-hidden py-4"
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.title} category={cat} onClick={onCategoryClick} />
        ))}
      </div>

      {/* Image Scrollbar */}
      <div className="relative h-20 mt-4 bg-blue-200 rounded-lg ">
        <img
          ref={cubeRef}
          src="/binkitscooter.jpg"
          alt="draggable scooter"
          onMouseDown={handleMouseDown}
          style={{ left: cubeLeft }}
          className="absolute top-1/2 -translate-y-1/2 w-20 h-20 cursor-grab select-none border rounded"
        />
      </div>
    </div>
  );
}
