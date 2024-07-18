import { Cloudinary } from '@cloudinary/url-gen';

import { Env } from '@/core';

export const cld = new Cloudinary({ cloud: { cloudName: Env.CLOUDINARY_NAME } });
