const Pin = require("../models/pin.model");

// create a pin
exports.createPin = async (req, res) => {
  try {
    const newPin = new Pin(req.body);
    const savedPin = await newPin.save();

    res.status(200).json({
      success: true,
      message: "Created Pin",
      pin: savedPin,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

// delete a pin
exports.deletePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.pinId);
    if (!pin) {
      return res.status(400).json({ error: true, message: "Invalid pin" });
    }

    await pin.deleteOne();

    res.status(200).json({
      success: true,
      message: "Pin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// get all pins
exports.getAllPins = async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
