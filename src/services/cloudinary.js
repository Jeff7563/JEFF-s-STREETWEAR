const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

export const getImageUrl = (publicId) => {
  if (!publicId) return "";
  if (publicId.startsWith('http')) return publicId;
  return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/${publicId}`;
};

export const uploadImage = async (file) => {
  const timestamp = Math.round((new Date()).getTime() / 1000);
  
  // Generate Signature (SHA1 of params + secret)
  const paramsToSign = `timestamp=${timestamp}${apiSecret}`;
  const signature = await sha1(paramsToSign);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.public_id; // Return the Public ID
};

// Helper: SHA1 hashing using Web Crypto API
async function sha1(str) {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-1', enc.encode(str));
  return Array.from(new Uint8Array(hash))
    .map(v => v.toString(16).padStart(2, '0'))
    .join('');
}

export const cloudinaryConfig = {
  cloudName,
  apiKey,
};
