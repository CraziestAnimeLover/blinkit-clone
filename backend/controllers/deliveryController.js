import User from "../model/User.model.js";

export const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng)
      return res.status(400).json({ msg: "Location required" });

    const deliveryBoy = await User.findById(req.user.id);

    deliveryBoy.currentLocation = { lat, lng };
    await deliveryBoy.save();

    res.json({ msg: "Location updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
