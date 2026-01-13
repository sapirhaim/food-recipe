export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  console.log("cloudName:", cloudName);
  console.log("uploadPreset:", uploadPreset);

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary env vars");
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(endpoint, { method: "POST", body: form });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Cloudinary upload failed: ${data?.error?.message || "Unknown error"}`);
  }

  return data.secure_url;
}
