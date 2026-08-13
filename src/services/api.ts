const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

export interface ResumeUploadResponse {
  success: boolean;
  filename: string;
  text: string;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Server returned ${response.status} instead of JSON. ` +
        `Check that your backend is running at ${API_BASE_URL}.`
    );
  }

  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error("Server returned invalid JSON.");
  }
}

export async function uploadResume(
  file: File
): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/resume/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Upload failed with status ${response.status}`
    );
  }

  return data;
}