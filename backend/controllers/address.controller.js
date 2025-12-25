import User from "../model/User.model.js"

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const {
      label,
      addressLine,
      city,
      pincode,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    // Make sure variable is unique
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // If default → unset previous defaults
    if (isDefault) {
      foundUser.addresses.forEach((addr) => (addr.isDefault = false));
    }

    foundUser.addresses.push({
      label,
      addressLine,
      city,
      pincode,
      latitude,
      longitude,
      isDefault: isDefault || false,
    });

    await foundUser.save();

    const addedAddress = foundUser.addresses[foundUser.addresses.length - 1];

    res.status(201).json({
      message: "Address added successfully",
      address: addedAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("addresses");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ msg: "Address not found" });
    }

    Object.assign(address, req.body);

    // Handle default switch
    if (req.body.isDefault) {
      user.addresses.forEach((addr) => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    await user.save();

    res.json({
      message: "Address updated",
      addresses: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);

    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();

    res.json({
      message: "Default address updated",
      addresses: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await user.save();

    res.json({
      message: "Address deleted",
      addresses: user.addresses,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

