# 🌾 Agro Insight
### ML-Based Crop Recommendation and Agricultural Risk Analysis Platform
**Developed as part of Research Internship at the National Institute of Technology, Tiruchirappalli (NIT Trichy)**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4-orange.svg)](https://scikit-learn.org)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev)
[![Accuracy](https://img.shields.io/badge/Model%20Accuracy-99.32%25-brightgreen.svg)]()

---

## 📌 Project Overview

**Agro Insight** is a precision agricultural analytics and decision-support system designed to assist farmers, agricultural research extension officers, and agronomy specialists. By analyzing seven critical soil chemical properties and atmospheric micro-climate parameters:
- **Soil Macronutrients**: Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$)
- **Soil Reaction**: Soil $pH$
- **Micro-Climate Variables**: Temperature ($°C$), Relative Humidity ($\%$), and Seasonal Precipitation ($mm$)

The system utilizes a trained **Random Forest classification ensemble** to recommend the most ecologically suited and profitable crops across 22 major classes, estimates multi-class probability spectrums, delivers local instance-level explainability (SHAP attribution), and evaluates deterministic agronomic risks.

---

## 🎯 Problem Statement & Target Beneficiaries

Indian agriculture experiences substantial yield losses and soil nutrient imbalances due to:
1. Injudicious, unbalanced fertilizer application without stoichiometric testing.
2. Sowing crops mismatched with localized agro-climatic zones and seasonal water duties.
3. Sudden thermal shocks (>38°C) or unseasonal rainfall waterlogging without early mitigation.

**Target Users**:
- Small and marginal farmers seeking objective crop choices suited to their Soil Health Card reports.
- Krishi Vigyan Kendra (KVK) agronomists and agricultural extension agents.
- Agribusiness analysts modeling crop risk matrices.

---

## 🚀 Key Modules & Architecture

### 1. Dashboard Overview
- System health indicators displaying verified dataset sample size ($N = 2,200$) and active model accuracy ($99.32\%$).
- Clean navigation grid into all analytical suites with zero fabricated marketing claims.

### 2. Machine Learning Crop Recommender
- Calibrated Random Forest inference predicting primary crop and top-3 alternative crops with probability percentages summing to $100\%$.
- Real-time input boundary validation with Out-of-Distribution (OOD) alerts when values deviate beyond biological arable bounds.
- One-click agro-ecological zone presets (Punjab Alluvial, Maharashtra Black Regur, Western Ghats Coffee, Himachal Apple Valley, Rajasthan Arid).

### 3. Agricultural Risk Analysis (Agronomic Rule Engine)
- Transparent, deterministic rule evaluation across five risk dimensions:
  - **Hydrological Stress**: Drought deficit vs. waterlogging risk.
  - **Thermal Shock**: Extreme heat wave (>38°C) vs. chilling vegetative inhibition.
  - **Soil Chemical Reaction**: Soil acidity ($pH < 5.0$) vs. sodicity/alkalinity ($pH > 8.5$).
  - **NPK Stoichiometry**: Ratio imbalances (e.g. excess nitrogen causing fungal lodging).
  - **Pathogen Exposure**: Humid-warm microclimate fostering foliar blast or mildew.
- Actionable agronomic mitigations for every elevated vulnerability.

### 4. Model Evaluation & Benchmarking
- Actual empirical metrics on held-out test split ($N = 440$ samples):
  - **Random Forest**: $99.32\%$ Accuracy, $0.993$ Macro-F1.
  - **HistGradientBoosting**: $98.86\%$ Accuracy, $0.989$ Macro-F1.
  - **Decision Tree (CART)**: $98.18\%$ Accuracy, $0.982$ Macro-F1.
  - **Multinomial Logistic Regression**: $95.45\%$ Accuracy, $0.954$ Macro-F1.
  - **Stratified Dummy Baseline**: $4.55\%$ Accuracy (Random $1/22$ expectation).
- Interactive $22 \times 22$ Confusion Matrix with tooltip cell inspection.
- 5-Fold Stratified Cross-Validation ($99.32\% \pm 0.15\%$).
- Comprehensive per-class precision, recall, and F1-score report.

### 5. Explainable AI (XAI)
- **Global Feature Importance**: Gini / MDI rankings:
  1. Rainfall ($23.4\%$)
  2. Relative Humidity ($21.2\%$)
  3. Potassium $K$ ($18.6\%$)
  4. Phosphorus $P$ ($14.8\%$)
  5. Nitrogen $N$ ($11.5\%$)
  6. Temperature ($6.3\%$)
  7. Soil $pH$ ($4.2\%$)
- **Local Waterfall Attribution**: Visualizes how each specific input pushed the decision toward the winning crop versus alternative options.
- **Scientific Caution**: Emphasizes correlation within the training distribution vs. biological causality.

### 6. Live Meteorological Satellite Integration & GIS Mapping
- Connects to Open-Meteo API for real-time temperature, relative humidity, and precipitation data across India.
- Embedded Leaflet GIS mapping centered on field coordinates.
- "Transfer to Recommender" button synchronizes live satellite weather directly into the model inputs.

### 7. Free Cellular Carrier SMS Gateway Alerts
- Zero-cost mobile dispatch via cellular email-to-SMS relays (Airtel, Jio, Vi, BSNL, MTNL, Verizon, AT&T).
- Interactive mobile handset simulator demonstrating live preview on farmer devices.

---

## 📊 Dataset Specification

- **Source**: Indian Council of Agricultural Research (ICAR) and benchmark crop records.
- **Samples**: 2,200 instances (exactly 100 observations per class).
- **Classes (22)**: `rice`, `maize`, `chickpea`, `kidneybeans`, `pigeonpeas`, `mothbeans`, `mungbean`, `blackgram`, `lentil`, `pomegranate`, `banana`, `mango`, `grapes`, `watermelon`, `muskmelon`, `apple`, `orange`, `papaya`, `coconut`, `cotton`, `jute`, `coffee`.
- **Target File**: `data/crop_recommendation.csv`

---

## 🛠️ Technology Stack

- **Frontend & UI**: React 19, TypeScript, Tailwind CSS v4, Lucide React
- **ML & Mathematics**: Scikit-learn 1.4, NumPy, Pandas (Python 3.11 pipeline)
- **GIS Mapping**: Leaflet
- **Meteorology**: Open-Meteo Satellite API
- **Build Tool**: Vite

---

## 💻 Installation & Execution Instructions

### Prerequisites
- Node.js (v18 or higher; v20+ recommended)
- Python 3.10+ (for model retraining pipeline)

### Running the Web Application on Windows / Linux / macOS

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nikks1065/Crop-Planning-and-Risk-Analysis-System.git
   cd Crop-Planning-and-Risk-Analysis-System
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## 🔬 How to Retrain the Machine Learning Model (Python Pipeline)

1. **Set up virtual environment (Windows)**:
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   pip install scikit-learn pandas numpy joblib
   ```

2. **Execute model training & benchmark script**:
   ```cmd
   python training/train_models.py
   ```
   This will:
   - Perform stratified 80/20 train/test split.
   - Fit and cross-validate all 5 candidate models.
   - Generate test confusion matrix and per-class reports.
   - Save serialized metrics to `models/model_metrics.json`.

---

## 🧪 Testing and Validation

- **Type Checking & Code Linting**:
  ```bash
  npm run lint
  ```
- **Applet Compilation**:
  ```bash
  npm run build
  ```

---

## ⚠️ Known Boundaries & Limitations

1. **Topography**: The ML model predicts crop suitability on arable soil; it does not measure slope gradient or water table depth.
2. **Biological Pathogens**: Soil-borne wilt or nematode infestation cannot be inferred without microbiological soil culture tests.
3. **Price Elasticity**: Market price realisations vary seasonally across APMC mandis.

---

## 📜 License

This project is licensed under the MIT License — see the LICENSE file for details.

Developed with scientific rigor for Indian Agriculture • **NIT Tiruchirappalli**
