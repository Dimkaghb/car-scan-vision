import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { fileToBase64 } from '@/services/onboardingService';

interface StepCarImageProps {
  carImage: File | null;
  carImagePreview: string | null;
  onCarImageChange: (file: File | null, preview: string | null) => void;
  errors?: {
    carImage?: string;
  };
}

const StepCarImage: React.FC<StepCarImageProps> = ({
  carImage,
  carImagePreview,
  onCarImageChange,
  errors = {},
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setIsUploading(true);
    try {
      const preview = await fileToBase64(file);
      onCarImageChange(file, preview);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    onCarImageChange(null, null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Фото автомобиля
        </h2>
        <p className="text-gray-600">
          Загрузите фотографию вашего автомобиля для профиля водителя
        </p>
      </div>

      <div className="space-y-6">
        {/* Image Preview or Upload Area */}
        {carImagePreview ? (
          <div className="relative">
            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border">
              <img
                src={carImagePreview}
                alt="Car preview"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span className="text-xs">Загружено</span>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Фото автомобиля</p>
              <p className="text-sm text-gray-400">
                {isUploading ? 'Обработка...' : 'Выберите способ загрузки ниже'}
              </p>
            </div>
          </div>
        )}

        {/* Upload Buttons */}
        {!carImagePreview && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleCameraClick}
              disabled={isUploading}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Camera className="h-6 w-6" />
              <span className="text-sm">Камера</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleGalleryClick}
              disabled={isUploading}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Upload className="h-6 w-6" />
              <span className="text-sm">Галерея</span>
            </Button>
          </div>
        )}

        {/* File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />

        {/* Error Message */}
        {errors.carImage && (
          <p className="text-sm text-red-600 text-center">{errors.carImage}</p>
        )}

        {/* Requirements */}
        <Alert>
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Требования к фото:</p>
              <ul className="text-sm space-y-1">
                <li>• Автомобиль должен быть хорошо виден</li>
                <li>• Фото сделано при хорошем освещении</li>
                <li>• Размер файла не более 5 МБ</li>
                <li>• Поддерживаемые форматы: JPG, PNG</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Советы для лучшего фото:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Сфотографируйте автомобиль с боковой стороны</li>
            <li>• Убедитесь, что номерной знак читается</li>
            <li>• Избегайте теней и бликов</li>
            <li>• Сделайте фото на фоне нейтрального окружения</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StepCarImage;
