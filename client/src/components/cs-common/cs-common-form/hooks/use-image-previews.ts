import { Env } from '@/core';
import { ChangeEvent, useState } from 'react';

type HookReturn = {
  previews: Preview[];
  handleUploadedFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  resetPreviews: () => void;
};

export type Preview = {
  id?: string;
  url: string;
}

export const useImagePreviews = (defaultImage: string, actualImages?: string[]): HookReturn => {
  const [previews, setPreviews] = useState<Preview[]>(() => {
    if (actualImages && actualImages.length > 0) {
      return actualImages.map(img => ({ id: img, url: `${Env.API_BASE_URL}/local-files/${img}` }));
    }
    return [{ url: defaultImage }];
  });

  const handleUploadedFiles = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [
      ...prevPreviews.filter((preview) => preview.url !== defaultImage),
      ...previewUrls.map((url) => ({ url })),
    ]);
  };

  const removeImage = (index: number): void => {
    setPreviews((prevPreviews) => {
      const updatedPreviews = prevPreviews.filter((_, i) => i !== index);
      return updatedPreviews.length > 0 ? updatedPreviews : [{ id: 'default-id', url: defaultImage }];
    });
  };

  const resetPreviews = (): void => {
    setPreviews(actualImages && actualImages.length > 0
      ? actualImages.map(img => ({ id: img, url: `${Env.API_BASE_URL}/local-files/${img}` }))
      : [{ url: defaultImage }]
    );
  };

  return { previews, handleUploadedFiles, removeImage, resetPreviews };
};
