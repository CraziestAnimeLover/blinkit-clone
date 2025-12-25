import Order from "../model/Order.js";
import Product from "../model/Product.js";

export const getRecommendations = async (req, res) => {
  try {
    const orders = await Order.find().limit(100);

    const productCount = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (!item.productId) return; // ✅ SAFE CHECK

        const productId = item.productId.toString();
        productCount[productId] = (productCount[productId] || 0) + 1;
      });
    });

    const topProductIds = Object.keys(productCount)
      .sort((a, b) => productCount[b] - productCount[a])
      .slice(0, 6);

    const products = await Product.find({
      _id: { $in: topProductIds },
    });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Recommendation failed" });
  }
};
