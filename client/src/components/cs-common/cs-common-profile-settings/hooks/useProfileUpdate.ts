import { useEffect, useState } from 'react';

import { FieldErrorsState, UpdateUserDto } from '@/types';

type HookReturn = {
  isUpdateSuccessful: boolean;
  setIsUpdateSuccessful: (state: boolean) => void;
  existingImagesIds: string[];
  onSubmit: (user: UpdateUserDto) => Promise<void>;
  onPreviewRemove: (removeId: string) => void;
  setExistingImagesIds: (ids: string[]) => void;
};

export const useProfileUpdate = (
  updateUser: (user: UpdateUserDto) => Promise<void>,
  viewImagesIds: string[],
  updateErrors?: FieldErrorsState<UpdateUserDto> | null,
): HookReturn => {
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState<boolean>(false);
  const [existingImagesIds, setExistingImagesIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setExistingImagesIds(viewImagesIds);


    if (isSubmitted) {
      if (!updateErrors) {
        setIsUpdateSuccessful(true);
      }
      setIsSubmitted(false);
    }
  }, [viewImagesIds, isSubmitted, updateErrors]);

  const onSubmit = async (user: UpdateUserDto): Promise<void> => {
    const userDtoWithoutEmptyPasswords = Object.fromEntries(
      Object.entries(user).filter(
        ([, value]) => value !== '' && value !== null && value !== undefined,
      ),
    );

    await updateUser({
      ...userDtoWithoutEmptyPasswords,
      existingImagesIds
    });
    setIsSubmitted(true);
  };

  const onPreviewRemove = (removeId: string): void => {
    setExistingImagesIds((ids) => ids.filter((id) => id !== removeId));
  };

  return {
    isUpdateSuccessful,
    setIsUpdateSuccessful,
    existingImagesIds,
    onSubmit,
    onPreviewRemove,
    setExistingImagesIds,
  };
};
