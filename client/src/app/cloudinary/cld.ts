import { Env } from "@/core";
import { Cloudinary } from "@cloudinary/url-gen";

export const cld = new Cloudinary({ cloud: { cloudName: Env.CLOUDINARY_NAME } });