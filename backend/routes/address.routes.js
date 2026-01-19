import express from "express";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  reverseGeocode,
} from "../controllers/address.controller.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, addAddress);
router.get("/", auth, getAddresses);
router.put("/:addressId", auth, updateAddress);
router.patch("/:addressId/default", auth, setDefaultAddress);
router.delete("/:addressId", auth, deleteAddress);
router.get("/reverse", reverseGeocode);

export default router;
