import { ChangeEvent, useState } from 'react';

import { PublicFile } from '@/types';

type HookReturn = {
  previews: Preview[];
  handleUploadedFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  resetPreviews: () => void;
};

export type Preview = {
  id?: string;
  url: string;
};

export const useImagePreviews = (
  defaultImage: string,
  actualImages?: PublicFile[],
  multiple?: boolean,
): HookReturn => {
  const [previews, setPreviews] = useState<Preview[]>(() => {
    if (actualImages && actualImages.length > 0) {
      return actualImages;
    }
    return [{ url: defaultImage }];
  });

  const handleUploadedFiles = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setPreviews((prevPreviews) => {
      if (multiple) {
        return [
          ...prevPreviews.filter((preview) => preview.url !== defaultImage),
          ...previewUrls.map((url) => ({ url })),
        ];
      } else {
        return [...previewUrls.map((url) => ({ url }))];
      }
    });
  };

  const removeImage = (index: number): void => {
    setPreviews((prevPreviews) => {
      const updatedPreviews = prevPreviews.filter((_, i) => i !== index);
      return updatedPreviews.length > 0 ? updatedPreviews : [{ url: defaultImage }];
    });
  };

  const resetPreviews = (): void => {
    setPreviews(actualImages && actualImages.length > 0 ? actualImages : [{ url: defaultImage }]);
  };

  return { previews, handleUploadedFiles, removeImage, resetPreviews };
};
