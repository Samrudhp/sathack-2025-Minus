import React, { useRef } from 'react';
import { useTranslation } from '../../node_modules/react-i18next';
import { Button, Card } from './ReactBits';

const CameraInput = ({ onCapture, onCancel }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Immediately send to backend - no preview
      onCapture(file);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center py-12">
        <div className="text-6xl mb-6">📷</div>
        <h2 className="text-2xl font-bold text-forest mb-6">
          {t('camera.capture')}
        </h2>
        <p className="text-olive-dark mb-6">
          Tap the button below to capture or upload a photo of waste
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          id="camera-input"
        />
        <label htmlFor="camera-input">
          <Button variant="primary" className="cursor-pointer inline-block">
            📸 Capture Photo
          </Button>
        </label>
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="ml-4"
          >
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CameraInput;
