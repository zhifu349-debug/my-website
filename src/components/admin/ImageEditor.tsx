"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { MediaFile } from "@/lib/cms-types";

interface ImageEditorProps {
  image: MediaFile;
  onSave: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export default function ImageEditor({ image, onSave, onCancel }: ImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    if (!croppedAreaPixels) return;

    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(
          img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        
        canvas.toBlob((blob) => {
          if (blob) {
            setCroppedImage(URL.createObjectURL(blob));
            onSave(blob);
          }
        }, 'image/jpeg', 0.9);
      };
      img.src = image.url;
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  }, [image.url, croppedAreaPixels, onSave]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">编辑图片</h3>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="aspect-square border border-gray-200 rounded-lg overflow-hidden">
                <Cropper
                  image={image.url}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  style={{
                    containerStyle: { height: '400px', width: '100%' }
                  }}
                />
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => setZoom((prev) => Math.max(1, prev - 0.1))}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                >
                  缩小
                </button>
                <button
                  onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                >
                  放大
                </button>
                <button
                  onClick={() => {
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                >
                  重置
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">预览</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {croppedImage ? (
                  <img
                    src={croppedImage}
                    alt="Cropped preview"
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">裁剪后将显示预览</p>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  拖动图片调整位置，使用缩放控制调整大小。
                </p>
                <p className="text-sm text-gray-600">
                  点击"应用裁剪"按钮保存修改。
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleCrop}
              disabled={!croppedAreaPixels}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              应用裁剪
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
