const API_URL = "/api";

export async function uploadResume(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/resume/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  let data: any;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server returned ${response.status} ${response.statusText}`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.detail || "Resume upload failed."
    );
  }

  return data;
}