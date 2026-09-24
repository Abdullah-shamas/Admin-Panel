"use server";

export async function uploadImageAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  // Convert uploaded image file into a Data URL for instant browser thumbnail preview
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  return { success: true, url: dataUrl };
}