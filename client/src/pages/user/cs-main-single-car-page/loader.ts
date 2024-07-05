import { defer, LoaderFunctionArgs } from 'react-router-dom';

import { getCar } from '@/services';

export const singleCarLoader = (args: LoaderFunctionArgs): ReturnType<typeof defer> => {
  const data = getCar(args.params.carId ?? '');

  return defer({
    data,
  });
};
