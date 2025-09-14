import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Database, Settings } from 'lucide-react';
import { setupDriverStorage, testStorage } from '@/utils/setupStorage';

const StorageSetup: React.FC = () => {
  const [isSetupLoading, setIsSetupLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [setupResult, setSetupResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSetupStorage = async () => {
    setIsSetupLoading(true);
    setSetupResult(null);
    
    try {
      const result = await setupDriverStorage();
      setSetupResult(result);
    } catch (error) {
      setSetupResult({
        success: false,
        message: `Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsSetupLoading(false);
    }
  };

  const handleTestStorage = async () => {
    setIsTestLoading(true);
    setTestResult(null);
    
    try {
      const result = await testStorage();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Setup
          </CardTitle>
          <CardDescription>
            Set up Supabase storage for driver car images. This needs to be done once.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Setup Section */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Initialize Storage Bucket
            </h3>
            <p className="text-sm text-gray-600">
              This will create the "driver-assets" storage bucket in your Supabase project if it doesn't exist.
            </p>
            
            <Button
              onClick={handleSetupStorage}
              disabled={isSetupLoading}
              className="w-full"
            >
              {isSetupLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Setting up storage...
                </>
              ) : (
                'Setup Storage Bucket'
              )}
            </Button>

            {setupResult && (
              <Alert variant={setupResult.success ? "default" : "destructive"}>
                {setupResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{setupResult.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Test Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Test Storage</h3>
            <p className="text-sm text-gray-600">
              Test if the storage bucket is working correctly by uploading and deleting a test file.
            </p>
            
            <Button
              onClick={handleTestStorage}
              disabled={isTestLoading}
              variant="outline"
              className="w-full"
            >
              {isTestLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                  Testing storage...
                </>
              ) : (
                'Test Storage'
              )}
            </Button>

            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Manual Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Manual Setup (Alternative)</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>If automatic setup fails, you can create the bucket manually:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to Storage section</li>
                <li>Click "Create a new bucket"</li>
                <li>Name it "driver-assets"</li>
                <li>Make it public</li>
                <li>Set file size limit to 5MB</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageSetup;
