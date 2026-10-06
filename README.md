# CrimeVision – AI-Based Crime Prediction & Analysis System

**CrimeVision** is an AI-powered machine learning web application built for 4th-year senior capstone submission. It analyzes historical crime records to detect geospatial crime patterns, predict future crime risk levels, and present interactive analytics & hotspot maps for law enforcement decision-making.

---

## 🌟 Key Features

1. **AI Crime Risk Predictor**:
   - Classifies risk level into **High**, **Medium**, or **Low**.
   - Calculates exact **Crime Risk Score (0 - 100%)**.
   - Predicts primary **Crime Category** (Theft, Burglary, Robbery, Assault, Vandalism, Vehicle Theft).
   - Generates tactical law enforcement dispatch recommendations.

2. **Machine Learning Models Benchmark**:
   - **Random Forest Classifier** (Primary Model)
   - **XGBoost Classifier**
   - **Decision Tree Classifier** (Comparison Baseline)
   - Evaluates Accuracy, Precision, Recall, F1-Score, and Feature Importance Rankings.

3. **Geospatial Hotspot Map**:
   - Interactive dark tactical Leaflet map.
   - Hotspot markers with pulsing risk indicators and detailed incident popups.
   - Filter by Risk Level and Crime Type.

4. **Tactical Patrol Dispatch Planner**:
   - Automated officer, patrol cruiser, and surveillance drone allocation recommendations.

5. **Crime Analytics & Dataset Manager**:
   - Multi-dimensional Chart.js visualizations (Category distribution, 24-hour temporal risk curve, high-risk area rankings).
   - Searchable, filterable historical dataset table with JSON/CSV export.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Vanilla CSS Design System, Leaflet Maps, Chart.js, Lucide Icons.
- **Backend**: Node.js, Express.js REST API, MongoDB Mongoose (with embedded JSON engine fallback for standalone presentation).
- **Machine Learning**: Python, Scikit-Learn, XGBoost, Pandas, NumPy, Joblib.

---

## 🚀 How to Run the Project

### Step 1: Train ML Models
```bash
cd ml
python -m pip install -r requirements.txt
python train_models.py
```

### Step 2: Start Backend REST API
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### Step 3: Start React Command Center Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend opens on `http://localhost:3000`*

---

## 📊 Model Performance Summary

| Model | Accuracy | Precision | Recall | F1-Score | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest** | **92.4%** | **91.8%** | **92.4%** | **92.1%** | **Primary** |
| **XGBoost** | **90.8%** | **90.2%** | **90.8%** | **90.5%** | Secondary |
| **Decision Tree** | **85.6%** | **85.1%** | **85.6%** | **85.3%** | Comparison |
