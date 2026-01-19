import Order from "../model/Order.js";
import User from "../model/User.model.js";
import Product from "../model/Product.js";

export const getAdminStats = async (req, res) => {
  try {
    const customers = await User.countDocuments({ isAdmin: false });
    const menus = await Product.countDocuments();
    const orders = await Order.countDocuments();

    // Aggregate total income from PAID orders that are not cancelled
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
          income: { $sum: "$totalAmount" }, // totalAmount is Number in schema
        },
      },
    ]);

    const income = incomeAgg[0]?.income || 0; // fallback to 0 if no orders

    res.json({
      success: true,
      stats: { menus, orders, customers, income },
    });
  } catch (err) {
    console.error("Stats error:", err);
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

// Approve a delivery partner
export const approveDeliveryPartner = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== "delivery") {
      return res.status(404).json({ msg: "Delivery partner not found" });
    }

    // Approve only if not already active
    if (!user.isVerified || user.status !== "ACTIVE") {
      user.isVerified = true;
      user.status = "ACTIVE";
      await user.save();
    }

    // Always return success
    res.json({ 
      msg: "Delivery partner approved successfully", 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        status: user.status, 
        isVerified: user.isVerified 
      } 
    });

  } catch (err) {
    console.error("Approve delivery error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


