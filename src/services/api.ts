const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export async function uploadResume(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/resume/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || `Upload failed with status ${response.status}`
    );
  }

  return data;
}