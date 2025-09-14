import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScratchDetectionResponse } from '@/services/roboflowApi';
import { CarInspection, saveInspectionResults, getDriverInspectionHistory } from '@/services/inspectionService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ScratchDetectionUpload from './ScratchDetectionUpload';
import DetectionResults from './DetectionResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  Camera, 
  FileText, 
  History, 
  Plus,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const CarInspectionForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentResult, setCurrentResult] = useState<ScratchDetectionResponse | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [inspectionHistory, setInspectionHistory] = useState<CarInspection[]>([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);

  const handleDetectionComplete = (result: ScratchDetectionResponse) => {
    setCurrentResult(result);
    setActiveTab('results');
  };

  const handleDetectionError = (error: string) => {
    console.error('Detection error:', error);
    // Error is already handled by the upload component with toast
  };

  // Load inspection history on component mount
  useEffect(() => {
    if (user?.id) {
      loadInspectionHistory();
    }
  }, [user?.id]);

  const loadInspectionHistory = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const result = await getDriverInspectionHistory(user.id, 20);
      if (result.success && result.inspections) {
        setInspectionHistory(result.inspections);
      } else {
        console.error('Failed to load inspection history:', result.error);
      }
    } catch (error) {
      console.error('Error loading inspection history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResults = async (result: ScratchDetectionResponse) => {
    if (!currentImageUrl || !user?.id) {
      toast({
        title: 'Save Failed',
        description: 'Missing required data to save inspection',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const saveResult = await saveInspectionResults(user.id, currentImageUrl, result);
      
      if (saveResult.success && saveResult.inspection) {
        toast({
          title: 'Inspection Saved',
          description: 'Your car inspection has been saved successfully',
        });
        
        // Reload inspection history to show the new entry
        await loadInspectionHistory();
      } else {
        toast({
          title: 'Save Failed',
          description: saveResult.error || 'Failed to save inspection',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Save Error',
        description: 'An unexpected error occurred while saving',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewInspection = () => {
    setCurrentResult(null);
    setCurrentImageUrl(null);
    setActiveTab('upload');
  };

  const getTotalScratches = (inspection: CarInspection) => {
    return inspection.scratches_found;
  };

  const getHighSeverityCount = (inspection: CarInspection) => {
    return inspection.high_severity_count;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Car Inspection</h2>
          <p className="text-muted-foreground">
            Upload photos of your vehicle to detect scratches and damage automatically
          </p>
        </div>
        {currentResult && (
          <Button onClick={handleNewInspection} className="bg-lime-600 hover:bg-lime-700">
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Button>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!currentResult} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Results
            {currentResult && (
              <Badge variant="secondary" className="ml-1">
                {currentResult.predictions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
            <Badge variant="outline" className="ml-1">
              {inspectionHistory.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <ScratchDetectionUpload
            onDetectionComplete={handleDetectionComplete}
            onDetectionError={handleDetectionError}
            onImageSelected={setCurrentImageUrl}
          />
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          {currentResult ? (
            <DetectionResults
              result={currentResult}
              imageUrl={currentImageUrl}
              onSaveResults={handleSaveResults}
            />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No results to display</p>
                <p className="text-muted-foreground">
                  Upload and analyze an image first to see the results here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <div className="space-y-4">
            {inspectionHistory.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No inspection history</p>
                  <p className="text-muted-foreground">
                    Your completed inspections will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              inspectionHistory.map((inspection) => (
                <Card key={inspection.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Inspection {new Date(inspection.created_at).toLocaleDateString()}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getTotalScratches(inspection) === 0 ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Clean
                          </Badge>
                        ) : getHighSeverityCount(inspection) > 0 ? (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Issues Found
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Minor Issues
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription>
                      {new Date(inspection.created_at).toLocaleTimeString()} • 
                      ID: {inspection.inference_id.slice(0, 8)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <img
                        src={inspection.image_url}
                        alt="Inspection"
                        className="w-24 h-24 object-cover rounded border"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Total Scratches:</span> {getTotalScratches(inspection)}
                          </div>
                          <div>
                            <span className="font-medium">High Severity:</span> {getHighSeverityCount(inspection)}
                          </div>
                          <div>
                            <span className="font-medium">Processing Time:</span> {(inspection.processing_time * 1000).toFixed(0)}ms
                          </div>
                          <div>
                            <span className="font-medium">Avg Confidence:</span> {(inspection.average_confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentResult(inspection.detection_results);
                            setCurrentImageUrl(inspection.image_url);
                            setActiveTab('results');
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarInspectionForm;
