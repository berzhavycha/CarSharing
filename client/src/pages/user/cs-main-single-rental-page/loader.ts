import { defer, LoaderFunctionArgs } from 'react-router-dom';

import { getRental } from '@/services';

export const singleRentalLoader = (args: LoaderFunctionArgs): ReturnType<typeof defer> => {
  const data = getRental(args.params.rentalId ?? '');

  return defer({
    data,
  });
};
