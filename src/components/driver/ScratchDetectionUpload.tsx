import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Camera, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { detectCarScratches, DetectionResult, ScratchDetectionResponse } from '@/services/roboflowApi';

interface ScratchDetectionUploadProps {
  onDetectionComplete?: (result: ScratchDetectionResponse) => void;
  onDetectionError?: (error: string) => void;
  onImageSelected?: (imageUrl: string) => void;
}

const ScratchDetectionUpload: React.FC<ScratchDetectionUploadProps> = ({
  onDetectionComplete,
  onDetectionError,
  onImageSelected,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an image file (JPG, PNG, etc.)',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select an image smaller than 10MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Notify parent component about image selection
      onImageSelected?.(url);
      
      // Clear previous results
      setDetectionResult(null);
    }
  };

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    
    if (file) {
      // Create a synthetic event to reuse the existing validation logic
      const syntheticEvent = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleFileSelect(syntheticEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setDetectionResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Start detection process
  const handleDetection = async () => {
    if (!selectedFile) {
      toast({
        title: 'No Image Selected',
        description: 'Please select an image to analyze',
        variant: 'destructive',
      });
      return;
    }

    setIsDetecting(true);
    
    try {
      const result = await detectCarScratches(selectedFile);
      setDetectionResult(result);
      
      if (result.success && result.data) {
        toast({
          title: 'Detection Complete',
          description: `Found ${result.data.predictions.length} potential scratch(es)`,
        });
        onDetectionComplete?.(result.data);
      } else {
        toast({
          title: 'Detection Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
        onDetectionError?.(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Detection Error',
        description: errorMessage,
        variant: 'destructive',
      });
      onDetectionError?.(errorMessage);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-lime-600" />
          Car Scratch Detection
        </CardTitle>
        <CardDescription>
          Upload a photo of your car to detect any scratches or damage automatically
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        {!selectedFile ? (
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              Drop your car image here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports JPG, PNG files up to 10MB
            </p>
            <Button variant="outline" className="mt-2">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          /* Image Preview */
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img
                src={previewUrl!}
                alt="Car preview"
                className="w-full h-64 object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* File Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{selectedFile.name}</span>
              <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
        )}

        {/* Detection Controls */}
        {selectedFile && (
          <div className="space-y-4">
            <Button
              onClick={handleDetection}
              disabled={isDetecting}
              className="w-full bg-lime-600 hover:bg-lime-700"
              size="lg"
            >
              {isDetecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Detect Scratches
                </>
              )}
            </Button>

            {/* Quick Status */}
            {detectionResult && (
              <div className={`flex items-center gap-2 p-3 rounded-lg border ${
                detectionResult.success 
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {detectionResult.success ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">
                      Detection completed successfully
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">
                      Detection failed: {detectionResult.error}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Tips for better results:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Take photos in good lighting conditions</li>
            <li>• Ensure the car surface is clearly visible</li>
            <li>• Avoid shadows and reflections when possible</li>
            <li>• Capture close-up shots of specific areas for detailed analysis</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScratchDetectionUpload;
