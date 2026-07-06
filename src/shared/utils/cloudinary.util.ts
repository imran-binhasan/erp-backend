import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder = 'products'
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else if (result) resolve({ url: result.secure_url, publicId: result.public_id });
        else reject(new Error('Upload failed'));
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (
  publicId: string
): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export const uploadFromPath = async (
  filePath: string,
  folder = 'products'
): Promise<{ url: string; publicId: string }> => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'image',
  });
  return { url: result.secure_url, publicId: result.public_id };
};
