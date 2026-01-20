import { useRef, useEffect } from "react";
import CategoryCard from "./CategoryCard";

export default function CarouselWithImage({ categories, onCategoryClick }) {
  const carouselRef = useRef(null);
  const handleRef = useRef(null);

  const dragging = useRef(false);
  const startX = useRef(0);
  const left = useRef(0);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    const onPointerDown = (e) => {
      e.preventDefault(); // 🔥 critical
      dragging.current = true;
      startX.current = e.clientX - left.current;
      handle.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!dragging.current) return;

      const track = handle.parentElement;
      const maxLeft = track.offsetWidth - handle.offsetWidth;

      let newLeft = e.clientX - startX.current;
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));

      left.current = newLeft;
      handle.style.left = `${newLeft}px`;

      // sync carousel scroll
      const maxScroll =
        carouselRef.current.scrollWidth -
        carouselRef.current.offsetWidth;

      carouselRef.current.scrollLeft =
        (newLeft / maxLeft) * maxScroll;
    };

    const onPointerUp = (e) => {
      dragging.current = false;
      handle.releasePointerCapture(e.pointerId);
    };

    handle.addEventListener("pointerdown", onPointerDown);
    handle.addEventListener("pointermove", onPointerMove);
    handle.addEventListener("pointerup", onPointerUp);
    handle.addEventListener("pointercancel", onPointerUp);

    return () => {
      handle.removeEventListener("pointerdown", onPointerDown);
      handle.removeEventListener("pointermove", onPointerMove);
      handle.removeEventListener("pointerup", onPointerUp);
      handle.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* CATEGORY CAROUSEL */}
      <div
        ref={carouselRef}
        className="flex gap-3 sm:gap-4 overflow-x-hidden py-4"
      >
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onClick={onCategoryClick}
          />
        ))}
      </div>

      {/* CUSTOM SCROLLBAR */}
      <div className="relative h-14 sm:h-20 mt-4 bg-blue-200 rounded-lg">
        {/* IMAGE DRAG HANDLE */}
        <img
          ref={handleRef}
          src="/binkitscooter.jpg"
          alt="Drag to scroll"
          draggable={false}
          style={{ left: 0 }}
          className="
            absolute top-1/2 -translate-y-1/2
            w-10 h-10 sm:w-16 sm:h-16
            cursor-grab active:cursor-grabbing
            rounded-full bg-white shadow-md
            touch-none select-none
          "
        />
      </div>
    </div>
  );
}
