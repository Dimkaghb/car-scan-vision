import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ImageIcon, 
  Target,
  Download,
  Eye,
  EyeOff,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { 
  ScratchDetectionResponse, 
  ScratchPrediction, 
  formatConfidence, 
  getScratchSeverity, 
  getSeverityColor 
} from '@/services/roboflowApi';

interface DetectionResultsProps {
  result: ScratchDetectionResponse;
  imageUrl?: string;
  onSaveResults?: (result: ScratchDetectionResponse) => void;
}

const DetectionResults: React.FC<DetectionResultsProps> = ({
  result,
  imageUrl,
  onSaveResults,
}) => {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  const totalScratches = result.predictions.length;
  const highSeverityScratches = result.predictions.filter(p => getScratchSeverity(p.confidence) === 'high').length;
  const mediumSeverityScratches = result.predictions.filter(p => getScratchSeverity(p.confidence) === 'medium').length;
  const lowSeverityScratches = result.predictions.filter(p => getScratchSeverity(p.confidence) === 'low').length;

  const averageConfidence = totalScratches > 0 
    ? result.predictions.reduce((sum, p) => sum + p.confidence, 0) / totalScratches 
    : 0;

  const handleDownloadReport = () => {
    const reportData = {
      inference_id: result.inference_id,
      timestamp: new Date().toISOString(),
      image_dimensions: result.image,
      processing_time: result.time,
      total_scratches: totalScratches,
      high_severity: highSeverityScratches,
      medium_severity: mediumSeverityScratches,
      low_severity: lowSeverityScratches,
      average_confidence: averageConfidence,
      detailed_predictions: result.predictions,
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `car-inspection-${result.inference_id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderImageWithBoundingBoxes = () => {
    if (!imageUrl) return null;

    return (
      <div className="relative">
        <img
          src={imageUrl}
          alt="Detection analysis"
          className="w-full rounded-lg border"
          style={{ maxHeight: '400px', objectFit: 'contain' }}
        />
        
        {showBoundingBoxes && result.predictions.map((prediction, index) => {
          const severity = getScratchSeverity(prediction.confidence);
          const left = ((prediction.x - prediction.width / 2) / result.image.width) * 100;
          const top = ((prediction.y - prediction.height / 2) / result.image.height) * 100;
          const width = (prediction.width / result.image.width) * 100;
          const height = (prediction.height / result.image.height) * 100;

          const boxColor = severity === 'high' ? 'border-red-500' : 
                          severity === 'medium' ? 'border-yellow-500' : 'border-green-500';

          return (
            <div
              key={prediction.detection_id}
              className={`absolute border-2 ${boxColor} bg-black bg-opacity-20`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
            >
              <div className={`absolute -top-6 left-0 px-1 py-0.5 text-xs font-medium rounded ${
                severity === 'high' ? 'bg-red-500 text-white' :
                severity === 'medium' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
              }`}>
                {formatConfidence(prediction.confidence)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalScratches}</p>
                <p className="text-sm text-muted-foreground">Total Scratches</p>
              </div>
              <Target className="h-8 w-8 text-lime-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatConfidence(averageConfidence)}</p>
                <p className="text-sm text-muted-foreground">Avg. Confidence</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{(result.time * 1000).toFixed(0)}ms</p>
                <p className="text-sm text-muted-foreground">Processing Time</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {totalScratches === 0 ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : highSeverityScratches > 0 ? (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
            Vehicle Condition Assessment
          </CardTitle>
          <CardDescription>
            Analysis ID: {result.inference_id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalScratches === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Great news! No scratches or damage detected in this image. Your vehicle appears to be in excellent condition.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert variant={highSeverityScratches > 0 ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {highSeverityScratches > 0 
                    ? `Found ${totalScratches} scratch(es) including ${highSeverityScratches} with high confidence. Inspection recommended.`
                    : `Found ${totalScratches} potential scratch(es) with moderate to low confidence. Consider manual inspection.`
                  }
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                {highSeverityScratches > 0 && (
                  <Badge variant="destructive">{highSeverityScratches} High Severity</Badge>
                )}
                {mediumSeverityScratches > 0 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {mediumSeverityScratches} Medium Severity
                  </Badge>
                )}
                {lowSeverityScratches > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {lowSeverityScratches} Low Severity
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image with Bounding Boxes */}
      {imageUrl && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Detection Visualization
                </CardTitle>
                <CardDescription>
                  Image dimensions: {result.image.width} × {result.image.height}px
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              >
                {showBoundingBoxes ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showBoundingBoxes ? 'Hide' : 'Show'} Boxes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {renderImageWithBoundingBoxes()}
          </CardContent>
        </Card>
      )}

      {/* Detailed Results */}
      {totalScratches > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Detection Results</CardTitle>
            <CardDescription>
              Individual scratch detections with confidence scores and locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.predictions.map((prediction, index) => {
                const severity = getScratchSeverity(prediction.confidence);
                const severityColor = getSeverityColor(severity);

                return (
                  <div key={prediction.detection_id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">Scratch #{index + 1}</span>
                        <Badge className={severityColor}>
                          {severity.toUpperCase()} - {formatConfidence(prediction.confidence)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          ({Math.round(prediction.x)}, {Math.round(prediction.y)})
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Size:</span> {Math.round(prediction.width)} × {Math.round(prediction.height)}px
                      </div>
                      <div>
                        <span className="font-medium">ID:</span> {prediction.detection_id.slice(0, 8)}...
                      </div>
                    </div>
                    
                    {index < result.predictions.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleDownloadReport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
        
        {onSaveResults && (
          <Button onClick={() => onSaveResults(result)} className="bg-lime-600 hover:bg-lime-700">
            Save to Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default DetectionResults;
