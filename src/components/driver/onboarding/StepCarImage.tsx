import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Image as ImageIcon, CheckCircle, Check } from 'lucide-react';
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
      {/* Trust badge */}
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-2 py-1 bg-lime-50 mb-4">
        <Check className="h-3 w-3" />
        <span>Шаг 5 из 5</span>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="hero-text mb-3">
          Фото <mark className="highlight"><span>автомобиля</span></mark>
        </h1>
        <p className="body-text text-muted-foreground">
          Загрузите фотографию вашего автомобиля для профиля водителя
        </p>
      </div>

      <div className="space-y-4">
        {/* Image Preview or Upload Area */}
        {carImagePreview ? (
          <div className="relative">
            <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden border">
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
            <div className="absolute bottom-2 left-2 bg-lime-600 text-white px-2 py-1 rounded-md flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span className="text-xs">Загружено</span>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="body-text text-muted-foreground mb-2">Фото автомобиля</p>
              <p className="text-xs text-muted-foreground">
                {isUploading ? 'Обработка...' : 'Выберите способ загрузки ниже'}
              </p>
            </div>
          </div>
        )}

        {/* Upload Buttons */}
        {!carImagePreview && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleCameraClick}
              disabled={isUploading}
              className="flex flex-col items-center gap-2 h-auto py-3 border-border hover:bg-muted"
            >
              <Camera className="h-5 w-5" />
              <span className="text-xs">Камера</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleGalleryClick}
              disabled={isUploading}
              className="flex flex-col items-center gap-2 h-auto py-3 border-border hover:bg-muted"
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs">Галерея</span>
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
          <p className="text-xs text-destructive text-center">{errors.carImage}</p>
        )}

        {/* Requirements */}
        <div className="bg-muted rounded-lg p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Требования к фото:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Автомобиль должен быть хорошо виден</li>
            <li>• Фото сделано при хорошем освещении</li>
            <li>• Размер файла не более 5 МБ</li>
            <li>• Поддерживаемые форматы: JPG, PNG</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StepCarImage;
