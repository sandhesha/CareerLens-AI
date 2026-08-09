const API_URL = "http://localhost:8000";

export async function uploadResume(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/resume/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Resume upload failed");
  }

  return data;
}