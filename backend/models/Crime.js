const mongoose = require("mongoose");

const crimeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  area_type: { type: String, required: true },
  crime_type: { type: String, required: true },
  hour: { type: Number, required: true },
  day_of_week: { type: String, required: true },
  is_weekend: { type: Number, required: true },
  population_density: { type: Number, required: true },
  previous_crime_records: { type: Number, required: true },
  risk_score: { type: Number, required: true },
  risk_level: { type: String, enum: ["Low", "Medium", "High"], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Crime", crimeSchema);
