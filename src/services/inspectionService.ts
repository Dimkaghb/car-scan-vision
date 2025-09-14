import { supabase } from '@/lib/supabaseClient';
import { ScratchDetectionResponse } from './roboflowApi';

export interface CarInspection {
  id: string;
  driver_id: string;
  inference_id: string;
  image_url: string;
  detection_results: ScratchDetectionResponse;
  scratches_found: number;
  high_severity_count: number;
  medium_severity_count: number;
  low_severity_count: number;
  average_confidence: number;
  processing_time: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InspectionSummary {
  total_inspections: number;
  recent_inspections: CarInspection[];
  last_inspection_date?: string;
  average_scratches_per_inspection: number;
  total_scratches_found: number;
}

// Create inspections table SQL
export const createInspectionsTableSQL = `
  CREATE TABLE IF NOT EXISTS car_inspections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    driver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    inference_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    detection_results JSONB NOT NULL,
    scratches_found INTEGER DEFAULT 0,
    high_severity_count INTEGER DEFAULT 0,
    medium_severity_count INTEGER DEFAULT 0,
    low_severity_count INTEGER DEFAULT 0,
    average_confidence DECIMAL(5,4) DEFAULT 0,
    processing_time DECIMAL(10,6) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Create index for faster queries
  CREATE INDEX IF NOT EXISTS idx_car_inspections_driver_id ON car_inspections(driver_id);
  CREATE INDEX IF NOT EXISTS idx_car_inspections_created_at ON car_inspections(created_at);
`;

// Save inspection results to database
export const saveInspectionResults = async (
  driverId: string,
  imageUrl: string,
  detectionResult: ScratchDetectionResponse,
  notes?: string
): Promise<{ success: boolean; inspection?: CarInspection; error?: string }> => {
  try {
    // Calculate statistics
    const scratchesFound = detectionResult.predictions.length;
    const highSeverityCount = detectionResult.predictions.filter(p => p.confidence >= 0.8).length;
    const mediumSeverityCount = detectionResult.predictions.filter(p => p.confidence >= 0.6 && p.confidence < 0.8).length;
    const lowSeverityCount = detectionResult.predictions.filter(p => p.confidence < 0.6).length;
    const averageConfidence = scratchesFound > 0 
      ? detectionResult.predictions.reduce((sum, p) => sum + p.confidence, 0) / scratchesFound 
      : 0;

    const inspectionData = {
      driver_id: driverId,
      inference_id: detectionResult.inference_id,
      image_url: imageUrl,
      detection_results: detectionResult,
      scratches_found: scratchesFound,
      high_severity_count: highSeverityCount,
      medium_severity_count: mediumSeverityCount,
      low_severity_count: lowSeverityCount,
      average_confidence: averageConfidence,
      processing_time: detectionResult.time,
      notes: notes || null,
    };

    const { data: inspection, error } = await supabase
      .from('car_inspections')
      .insert([inspectionData])
      .select()
      .single();

    if (error) {
      console.error('Error saving inspection:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      inspection: inspection as CarInspection,
    };
  } catch (error) {
    console.error('Error saving inspection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Get inspection history for a driver
export const getDriverInspectionHistory = async (
  driverId: string,
  limit: number = 10,
  offset: number = 0
): Promise<{ success: boolean; inspections?: CarInspection[]; error?: string }> => {
  try {
    const { data: inspections, error } = await supabase
      .from('car_inspections')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching inspection history:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      inspections: inspections as CarInspection[],
    };
  } catch (error) {
    console.error('Error fetching inspection history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Get inspection summary for a driver
export const getDriverInspectionSummary = async (
  driverId: string
): Promise<{ success: boolean; summary?: InspectionSummary; error?: string }> => {
  try {
    const { data: inspections, error } = await supabase
      .from('car_inspections')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inspection summary:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    const totalInspections = inspections?.length || 0;
    const recentInspections = inspections?.slice(0, 5) as CarInspection[] || [];
    const lastInspectionDate = inspections?.[0]?.created_at;
    const totalScratchesFound = inspections?.reduce((sum, inspection) => sum + inspection.scratches_found, 0) || 0;
    const averageScratchesPerInspection = totalInspections > 0 ? totalScratchesFound / totalInspections : 0;

    const summary: InspectionSummary = {
      total_inspections: totalInspections,
      recent_inspections: recentInspections,
      last_inspection_date: lastInspectionDate,
      average_scratches_per_inspection: Math.round(averageScratchesPerInspection * 10) / 10,
      total_scratches_found: totalScratchesFound,
    };

    return {
      success: true,
      summary,
    };
  } catch (error) {
    console.error('Error fetching inspection summary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Delete an inspection
export const deleteInspection = async (
  inspectionId: string,
  driverId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('car_inspections')
      .delete()
      .eq('id', inspectionId)
      .eq('driver_id', driverId); // Ensure driver can only delete their own inspections

    if (error) {
      console.error('Error deleting inspection:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting inspection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Update inspection notes
export const updateInspectionNotes = async (
  inspectionId: string,
  driverId: string,
  notes: string
): Promise<{ success: boolean; inspection?: CarInspection; error?: string }> => {
  try {
    const { data: inspection, error } = await supabase
      .from('car_inspections')
      .update({ 
        notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', inspectionId)
      .eq('driver_id', driverId)
      .select()
      .single();

    if (error) {
      console.error('Error updating inspection notes:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      inspection: inspection as CarInspection,
    };
  } catch (error) {
    console.error('Error updating inspection notes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
