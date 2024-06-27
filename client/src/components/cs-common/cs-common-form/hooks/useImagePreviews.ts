import { ChangeEvent, useState } from 'react';

type HookReturn = {
  previews: string[];
  handleUploadedFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
};

export const useImagePreviews = (defaultImage: string, actualImages?: string[]): HookReturn => {
  const [previews, setPreviews] = useState<string[]>(
    actualImages && actualImages.length > 0 ? [...actualImages] : [defaultImage],
  );

  const handleUploadedFiles = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls.length > 0 ? previewUrls : [defaultImage]);
  };

  const removeImage = (index: number): void => {
    setPreviews((prevPreviews) => {
      const updatedPreviews = prevPreviews.filter((_, i) => i !== index);
      return updatedPreviews.length > 0 ? updatedPreviews : [defaultImage];
    });
  };

  return { previews, handleUploadedFiles, removeImage };
};
