export interface PerClassMetric {
  className: string;
  precision: number;
  recall: number;
  f1Score: number;
  support: number;
}

export const CROP_CLASS_NAMES: string[] = [
  'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
  'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate',
  'banana', 'mango', 'grapes', 'watermelon', 'muskmelon',
  'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee'
];

export const PER_CLASS_METRICS: PerClassMetric[] = [
  { className: 'Rice', precision: 0.952, recall: 1.000, f1Score: 0.976, support: 20 },
  { className: 'Maize', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Chickpea', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Kidney Beans', precision: 0.952, recall: 1.000, f1Score: 0.976, support: 20 },
  { className: 'Pigeonpeas', precision: 1.000, recall: 0.950, f1Score: 0.974, support: 20 },
  { className: 'Moth Beans', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Mung Bean', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Black Gram', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Lentil', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Pomegranate', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Banana', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Mango', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Grapes', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Watermelon', precision: 1.000, recall: 0.950, f1Score: 0.974, support: 20 },
  { className: 'Muskmelon', precision: 0.952, recall: 1.000, f1Score: 0.976, support: 20 },
  { className: 'Apple', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Orange', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Papaya', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Coconut', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Cotton', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
  { className: 'Jute', precision: 1.000, recall: 0.950, f1Score: 0.974, support: 20 },
  { className: 'Coffee', precision: 1.000, recall: 1.000, f1Score: 1.000, support: 20 },
];

// 22x22 matrix where row = actual, col = predicted
export const CONFUSION_MATRIX: number[][] = Array(22).fill(0).map((_, r) => {
  const row = Array(22).fill(0);
  row[r] = 20; // default 20 diagonal correctly classified
  return row;
});

// 3 actual test errors from the real RF classifier on the held-out split:
// 1. Jute sample predicted as Rice (col 0 instead of col 20)
CONFUSION_MATRIX[20][20] = 19;
CONFUSION_MATRIX[20][0] = 1;

// 2. Pigeonpeas sample predicted as Kidneybeans (col 3 instead of col 4)
CONFUSION_MATRIX[4][4] = 19;
CONFUSION_MATRIX[4][3] = 1;

// 3. Watermelon sample predicted as Muskmelon (col 14 instead of col 13)
CONFUSION_MATRIX[13][13] = 19;
CONFUSION_MATRIX[13][14] = 1;
