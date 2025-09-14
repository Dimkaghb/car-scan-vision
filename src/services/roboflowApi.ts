// Roboflow API service for car scratch detection
const ROBOFLOW_API_URL = 'https://detect.roboflow.com/car-scratch-xgxzs-yozzg/3';
const ROBOFLOW_API_KEY = 'c57FoTijFtYh0tKwLM1C';

export interface ScratchPrediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id: number;
  detection_id: string;
}

export interface ScratchDetectionResponse {
  inference_id: string;
  time: number;
  image: {
    width: number;
    height: number;
  };
  predictions: ScratchPrediction[];
}

export interface DetectionResult {
  success: boolean;
  data?: ScratchDetectionResponse;
  error?: string;
}

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Detect scratches in the uploaded image
export const detectCarScratches = async (imageFile: File): Promise<DetectionResult> => {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Make API call to Roboflow
    const response = await fetch(`${ROBOFLOW_API_URL}?api_key=${ROBOFLOW_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: base64Image,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ScratchDetectionResponse = await response.json();
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error detecting car scratches:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Utility function to format confidence percentage
export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(1)}%`;
};

// Utility function to determine severity based on confidence
export const getScratchSeverity = (confidence: number): 'low' | 'medium' | 'high' => {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.6) return 'medium';
  return 'low';
};

// Utility function to get severity color
export const getSeverityColor = (severity: 'low' | 'medium' | 'high'): string => {
  switch (severity) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};
