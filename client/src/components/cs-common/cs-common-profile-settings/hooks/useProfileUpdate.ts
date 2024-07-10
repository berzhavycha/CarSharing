import { useEffect, useState } from 'react';

import { FieldErrorsState, PublicFile, UpdateUserDto } from '@/types';

type HookReturn = {
  isUpdateSuccessful: boolean;
  setIsUpdateSuccessful: (state: boolean) => void;
  existingImages: PublicFile[];
  onSubmit: (user: UpdateUserDto) => Promise<void>;
  onPreviewRemove: (removeId: string) => void;
  setExistingImages: (ids: PublicFile[]) => void;
};

export const useProfileUpdate = (
  updateUser: (user: UpdateUserDto) => Promise<void>,
  viewImages: PublicFile[],
  updateErrors?: FieldErrorsState<UpdateUserDto> | null,
): HookReturn => {
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState<boolean>(false);
  const [existingImages, setExistingImages] = useState<PublicFile[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setExistingImages(viewImages);

    if (isSubmitted) {
      if (!updateErrors) {
        setIsUpdateSuccessful(true);
      }
      setIsSubmitted(false);
    }
  }, [viewImages, isSubmitted, updateErrors]);

  const onSubmit = async (user: UpdateUserDto): Promise<void> => {
    const userDtoWithoutEmptyPasswords = Object.fromEntries(
      Object.entries(user).filter(
        ([, value]) => value !== '' && value !== null && value !== undefined,
      ),
    );

    await updateUser({ ...userDtoWithoutEmptyPasswords, existingImagesIds: existingImages.map(img => img.id) });
    setIsSubmitted(true);
  };

  const onPreviewRemove = (removeId: string): void => {
    setExistingImages((imgs) => imgs.filter((img) => img.id !== removeId));
  };

  return {
    isUpdateSuccessful,
    setIsUpdateSuccessful,
    existingImages,
    onSubmit,
    onPreviewRemove,
    setExistingImages,
  };
};
