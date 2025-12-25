import Order from "../model/Order.js";
import User from "../model/User.model.js";
import Product from "../model/Product.js";

export const getAdminStats = async (req, res) => {
  try {
    const customers = await User.countDocuments({ isAdmin: false });
    const menus = await Product.countDocuments();
    const orders = await Order.countDocuments();

    const incomeAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
          orderStatus: { $ne: "CANCELLED" },
        },
      },
      {
        $group: {
          _id: null,
          income: { $sum: "$totalAmount" },
        },
      },
    ]);

    const income = incomeAgg[0]?.income || 0;

    res.json({
      success: true,
      stats: { menus, orders, customers, income },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ✅ THIS EXPORT WAS MISSING OR WRONG */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select("name email createdAt")
      .sort({ createdAt: -1 });

    const customers = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({
          userId: user._id,
        });

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          orderCount,
          createdAt: user.createdAt,
        };
      })
    );

    res.json({ success: true, customers });
  } catch (error) {
    console.error("Customers error:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};
