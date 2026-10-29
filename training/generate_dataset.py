#!/usr/bin/env python3
"""
Generates the benchmark 2,200 sample crop recommendation dataset for training & replication.
Each of the 22 classes has exactly 100 rows with normal variations around empirical ICAR centroids.
"""

import os
import numpy as np
import pandas as pd

CROPS_SPEC = {
    'rice': {'N': (79.89, 12), 'P': (47.58, 8), 'K': (39.87, 5), 'temp': (23.69, 2.5), 'hum': (82.27, 3.5), 'ph': (6.43, 0.4), 'rain': (236.18, 25)},
    'maize': {'N': (77.76, 11), 'P': (48.44, 7), 'K': (19.79, 4), 'temp': (22.39, 3.0), 'hum': (65.09, 5.0), 'ph': (6.25, 0.35), 'rain': (84.77, 12)},
    'chickpea': {'N': (40.09, 8), 'P': (67.73, 6), 'K': (79.92, 5), 'temp': (18.87, 2.0), 'hum': (16.86, 2.0), 'ph': (7.34, 0.4), 'rain': (80.05, 10)},
    'kidneybeans': {'N': (20.75, 5), 'P': (67.54, 7), 'K': (20.05, 4), 'temp': (20.12, 2.5), 'hum': (21.61, 2.5), 'ph': (5.75, 0.3), 'rain': (105.92, 15)},
    'pigeonpeas': {'N': (20.73, 6), 'P': (67.73, 7), 'K': (20.29, 4), 'temp': (27.74, 3.5), 'hum': (48.06, 6.0), 'ph': (5.79, 0.5), 'rain': (149.46, 20)},
    'mothbeans': {'N': (21.44, 5), 'P': (48.01, 6), 'K': (20.23, 4), 'temp': (28.19, 2.5), 'hum': (53.16, 5.0), 'ph': (6.83, 0.45), 'rain': (51.20, 8)},
    'mungbean': {'N': (20.99, 5), 'P': (47.28, 6), 'K': (19.87, 4), 'temp': (28.53, 2.0), 'hum': (85.94, 3.5), 'ph': (6.74, 0.3), 'rain': (48.40, 7)},
    'blackgram': {'N': (40.02, 7), 'P': (67.47, 6), 'K': (19.24, 3), 'temp': (29.98, 2.0), 'hum': (65.28, 4.0), 'ph': (7.13, 0.35), 'rain': (67.88, 10)},
    'lentil': {'N': (18.77, 4), 'P': (68.36, 7), 'K': (19.41, 3), 'temp': (24.51, 2.5), 'hum': (64.80, 4.5), 'ph': (6.93, 0.4), 'rain': (45.68, 8)},
    'pomegranate': {'N': (18.87, 4), 'P': (18.75, 4), 'K': (40.21, 4), 'temp': (21.84, 2.0), 'hum': (90.13, 2.5), 'ph': (6.43, 0.35), 'rain': (107.53, 10)},
    'banana': {'N': (100.23, 10), 'P': (82.01, 8), 'K': (50.05, 5), 'temp': (27.38, 2.0), 'hum': (80.36, 3.0), 'ph': (5.98, 0.3), 'rain': (104.63, 12)},
    'mango': {'N': (20.07, 5), 'P': (27.18, 5), 'K': (29.92, 4), 'temp': (31.21, 2.5), 'hum': (50.16, 4.5), 'ph': (5.77, 0.4), 'rain': (94.70, 11)},
    'grapes': {'N': (23.18, 5), 'P': (132.53, 8), 'K': (200.11, 4), 'temp': (23.85, 3.5), 'hum': (81.88, 3.0), 'ph': (6.03, 0.35), 'rain': (69.61, 8)},
    'watermelon': {'N': (99.42, 11), 'P': (17.00, 4), 'K': (50.22, 5), 'temp': (25.59, 2.5), 'hum': (85.16, 3.0), 'ph': (6.50, 0.3), 'rain': (50.79, 7)},
    'muskmelon': {'N': (100.32, 10), 'P': (17.72, 4), 'K': (50.08, 5), 'temp': (28.65, 2.0), 'hum': (92.34, 2.5), 'ph': (6.36, 0.3), 'rain': (24.69, 4)},
    'apple': {'N': (20.80, 5), 'P': (134.22, 8), 'K': (199.89, 4), 'temp': (22.63, 2.0), 'hum': (92.33, 2.5), 'ph': (5.93, 0.3), 'rain': (112.65, 12)},
    'orange': {'N': (19.58, 4), 'P': (16.55, 4), 'K': (10.01, 3), 'temp': (22.77, 3.0), 'hum': (92.17, 2.5), 'ph': (7.01, 0.4), 'rain': (110.47, 10)},
    'papaya': {'N': (49.88, 8), 'P': (59.05, 7), 'K': (50.04, 5), 'temp': (33.72, 3.5), 'hum': (92.40, 2.5), 'ph': (6.74, 0.35), 'rain': (142.63, 16)},
    'coconut': {'N': (21.98, 5), 'P': (16.93, 4), 'K': (30.59, 4), 'temp': (27.41, 2.0), 'hum': (94.84, 2.0), 'ph': (5.98, 0.3), 'rain': (175.69, 18)},
    'cotton': {'N': (117.77, 12), 'P': (46.24, 7), 'K': (19.56, 4), 'temp': (23.99, 2.5), 'hum': (79.84, 3.5), 'ph': (6.91, 0.35), 'rain': (80.40, 10)},
    'jute': {'N': (78.40, 10), 'P': (46.86, 7), 'K': (39.99, 5), 'temp': (24.96, 2.0), 'hum': (79.64, 3.5), 'ph': (6.73, 0.35), 'rain': (174.79, 15)},
    'coffee': {'N': (101.20, 11), 'P': (28.74, 5), 'K': (29.94, 4), 'temp': (25.54, 2.0), 'hum': (58.87, 4.0), 'ph': (6.79, 0.35), 'rain': (158.07, 16)}
}

def generate_benchmark_dataset(output_csv_path: str):
    np.random.seed(42)
    rows = []
    
    for crop_name, specs in CROPS_SPEC.items():
        n_samples = 100
        n_vals = np.clip(np.random.normal(specs['N'][0], specs['N'][1], n_samples), 0, 140)
        p_vals = np.clip(np.random.normal(specs['P'][0], specs['P'][1], n_samples), 5, 145)
        k_vals = np.clip(np.random.normal(specs['K'][0], specs['K'][1], n_samples), 5, 205)
        temp_vals = np.clip(np.random.normal(specs['temp'][0], specs['temp'][1], n_samples), 8.8, 43.7)
        hum_vals = np.clip(np.random.normal(specs['hum'][0], specs['hum'][1], n_samples), 14.3, 99.9)
        ph_vals = np.clip(np.random.normal(specs['ph'][0], specs['ph'][1], n_samples), 3.5, 9.9)
        rain_vals = np.clip(np.random.normal(specs['rain'][0], specs['rain'][1], n_samples), 20.2, 298.6)
        
        for i in range(n_samples):
            rows.append({
                'N': int(round(n_vals[i])),
                'P': int(round(p_vals[i])),
                'K': int(round(k_vals[i])),
                'temperature': float(round(temp_vals[i], 4)),
                'humidity': float(round(hum_vals[i], 4)),
                'ph': float(round(ph_vals[i], 4)),
                'rainfall': float(round(rain_vals[i], 4)),
                'label': crop_name
            })
            
    df = pd.DataFrame(rows)
    os.makedirs(os.path.dirname(output_csv_path), exist_ok=True)
    df.to_csv(output_csv_path, index=False)
    print(f"Generated {len(df)} rows across {df['label'].nunique()} crops -> {output_csv_path}")
    return df

if __name__ == "__main__":
    generate_benchmark_dataset("/data/crop_recommendation.csv")
