import pandas as pd
import numpy as np
import json
import os

# Set seed for reproducibility
np.random.seed(42)

# Locations / Zones centered in Kharar, Punjab, India (Coordinates ~30.7450° N, 76.6450° E)
LOCATIONS = [
    {"name": "Kharar Bus Stand & Market", "lat": 30.7460, "lng": 76.6470, "base_density": 18500, "area_type": "Commercial"},
    {"name": "CU Campus & Student Zone", "lat": 30.7700, "lng": 76.5750, "base_density": 16500, "area_type": "Commercial"},
    {"name": "Landran Road Commercial Belt", "lat": 30.7380, "lng": 76.6550, "base_density": 14000, "area_type": "Commercial"},
    {"name": "Greater Mohali Highway Junction", "lat": 30.7420, "lng": 76.6350, "base_density": 17500, "area_type": "Transit Hub"},
    {"name": "Kharar-Ropar Flyover Corridor", "lat": 30.7550, "lng": 76.6400, "base_density": 12500, "area_type": "Transit Hub"},
    {"name": "Model Town Kharar", "lat": 30.7480, "lng": 76.6520, "base_density": 9500, "area_type": "Residential"},
    {"name": "Gillco Valley & Sector 127", "lat": 30.7320, "lng": 76.6620, "base_density": 11000, "area_type": "Residential"},
    {"name": "Swaraj Nagar & Old City", "lat": 30.7490, "lng": 76.6410, "base_density": 13500, "area_type": "Residential"},
    {"name": "Kharar Industrial Focal Point", "lat": 30.7300, "lng": 76.6300, "base_density": 4500, "area_type": "Industrial"},
    {"name": "Kharar Main Market & Night Hub", "lat": 30.7410, "lng": 76.6490, "base_density": 15500, "area_type": "Nightlife"}
]

# Real Punjab / Kharar Police Crime Classifications
CRIME_TYPES = [
    "Snatching & Mobile Theft",
    "Vehicle Theft (Auto-Lifting)",
    "House Trespass & Burglary",
    "Brawl & Group Assault",
    "Cyber & Online Fraud",
    "Highway Robbery & Extortion"
]

AREA_TYPES = ["Commercial", "Transit Hub", "Residential", "Industrial", "Nightlife"]

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def generate_crime_data(n_samples=5000):
    records = []
    
    for i in range(n_samples):
        # Pick random location
        loc = LOCATIONS[np.random.choice(len(LOCATIONS))]
        
        # Jitter coordinates slightly around Kharar
        lat = loc["lat"] + np.random.uniform(-0.008, 0.008)
        lng = loc["lng"] + np.random.uniform(-0.008, 0.008)
        
        # Time features
        hour_probs = np.array([
            0.05, 0.04, 0.03, 0.02, 0.02, 0.02, 0.03, 0.04,  # 00:00 - 07:00
            0.04, 0.04, 0.03, 0.03, 0.03, 0.04, 0.04, 0.04,  # 08:00 - 15:00
            0.05, 0.06, 0.07, 0.08, 0.08, 0.07, 0.05, 0.03   # 16:00 - 23:00 (peak night)
        ])
        hour_probs = hour_probs / np.sum(hour_probs)
        hour = int(np.random.choice(24, p=hour_probs))
        
        day_idx = np.random.choice(7)
        day_of_week = DAYS_OF_WEEK[day_idx]
        is_weekend = 1 if day_idx in [5, 6] else 0
        
        # Population density with random variance
        density = int(np.clip(loc["base_density"] + np.random.normal(0, 1500), 1000, 25000))
        
        # Previous crime records in area (0 to 60)
        base_prev = 35 if loc["area_type"] in ["Nightlife", "Transit Hub"] else (20 if loc["area_type"] == "Commercial" else 8)
        prev_crimes = int(np.clip(base_prev + np.random.normal(0, 8), 0, 60))
        
        # Compute realistic Crime Risk Score (0 to 100)
        night_factor = 25 if (hour >= 21 or hour <= 4) else (10 if hour >= 18 else 0)
        weekend_factor = 15 if is_weekend else 0
        density_factor = (density / 25000.0) * 20.0
        prev_factor = (prev_crimes / 60.0) * 30.0
        area_factor = 10 if loc["area_type"] in ["Nightlife", "Transit Hub"] else 5
        
        noise = np.random.normal(0, 5)
        raw_score = night_factor + weekend_factor + density_factor + prev_factor + area_factor + noise
        risk_score = round(float(np.clip(raw_score, 5.0, 98.0)), 2)
        
        # Determine Risk Level
        if risk_score >= 65.0:
            risk_level = "High"
        elif risk_score >= 38.0:
            risk_level = "Medium"
        else:
            risk_level = "Low"
            
        # Determine Crime Type based on Punjab Kharar area characteristics
        if loc["area_type"] == "Nightlife" and hour >= 21:
            crime_p = [0.20, 0.15, 0.05, 0.40, 0.05, 0.15]
        elif loc["area_type"] == "Transit Hub":
            crime_p = [0.40, 0.25, 0.05, 0.10, 0.05, 0.15]
        elif loc["area_type"] == "Residential":
            crime_p = [0.15, 0.25, 0.45, 0.05, 0.05, 0.05]
        elif loc["name"] == "CU Campus & Student Zone":
            crime_p = [0.25, 0.25, 0.05, 0.20, 0.20, 0.05]
        elif loc["area_type"] == "Industrial":
            crime_p = [0.10, 0.35, 0.25, 0.10, 0.05, 0.15]
        else:
            crime_p = [0.35, 0.20, 0.15, 0.15, 0.10, 0.05]
            
        crime_type = np.random.choice(CRIME_TYPES, p=crime_p)
        
        records.append({
            "id": f"PB-KH-{10000 + i}",
            "location": loc["name"],
            "latitude": round(lat, 5),
            "longitude": round(lng, 5),
            "area_type": loc["area_type"],
            "crime_type": crime_type,
            "hour": hour,
            "day_of_week": day_of_week,
            "is_weekend": is_weekend,
            "population_density": density,
            "previous_crime_records": prev_crimes,
            "risk_score": risk_score,
            "risk_level": risk_level
        })
        
    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    print("Generating Kharar, Punjab crime dataset with real local crime categories...")
    df = generate_crime_data(5000)
    
    os.makedirs("data", exist_ok=True)
    csv_path = os.path.join("data", "crime_dataset.csv")
    json_path = os.path.join("data", "crime_dataset.json")
    
    df.to_csv(csv_path, index=False)
    df.to_json(json_path, orient="records", indent=2)
    
    print(f"Kharar dataset successfully created with {len(df)} records!")
    print(f"Saved to: {csv_path} and {json_path}")
