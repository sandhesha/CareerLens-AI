const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

export interface ResumeUploadResponse {
  success: boolean;
  filename: string;
  text: string;
}

export interface UserSettings {
  name: string;
  email: string;
  careerGoal: string;
  location: string;
  workType: string;
  jobNotifications: boolean;
  interviewNotifications: boolean;
  darkMode: boolean;
}

async function parseResponse(response: Response) {
  const contentType =
    response.headers.get("content-type") || "";

  const rawText = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Server returned ${response.status} instead of JSON.`
    );
  }

  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error("Server returned invalid JSON.");
  }
}

/* =========================
   RESUME UPLOAD
========================= */

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

/* =========================
   GET SETTINGS
========================= */

export async function getSettings(): Promise<UserSettings> {
  const response = await fetch(
    `${API_BASE_URL}/api/settings`
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Failed to load settings`
    );
  }

  return data;
}

/* =========================
   SAVE SETTINGS
========================= */

export async function saveSettingsToServer(
  settings: UserSettings
): Promise<UserSettings> {
  const response = await fetch(
    `${API_BASE_URL}/api/settings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Failed to save settings`
    );
  }

  return data;
}