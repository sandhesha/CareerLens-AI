import { useRef, useState } from "react";
import {
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiTrash2,
  FiArrowRight,
} from "react-icons/fi";

import { uploadResume } from "../services/api";

interface ResumeAnalyzerProps {
  onBack?: () => void;
}

function ResumeAnalyzer({ onBack }: ResumeAnalyzerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [resumeText, setResumeText] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;

    setUploadError("");
    setResumeText("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setUploadError("Please select a PDF resume.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Resume must be smaller than 10 MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a PDF resume first.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      setResumeText("");

      const result = await uploadResume(selectedFile);

      console.log("Resume uploaded successfully:", result);

      const extractedText = result.text || "";

      setResumeText(extractedText);

      // Save resume text for the AI interview
      localStorage.setItem("resumeText", extractedText);

      // Save resume filename
      localStorage.setItem(
        "resumeFileName",
        selectedFile.name
      );
    } catch (error) {
      console.error(error);

      setUploadError(
        error instanceof Error
          ? error.message
          : "Resume upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResumeText("");
    setUploadError("");

    localStorage.removeItem("resumeText");
    localStorage.removeItem("resumeFileName");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleStartInterview = () => {
    if (!resumeText) {
      setUploadError(
        "Please analyze your resume before starting the interview."
      );
      return;
    }

    // Tell App.tsx that the user wants to start the interview
    window.dispatchEvent(
      new CustomEvent("start-careerlens-interview")
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            ← Back
          </button>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            <FiFileText />
            CareerLens AI
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Resume Analyzer
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Upload your resume and let CareerLens AI analyze your
            profile, skills, experience and career opportunities.
          </p>
        </div>

        {/* Upload Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Hidden input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Upload Area */}
          {!selectedFile ? (
            <button
              type="button"
              onClick={handleChooseFile}
              className="group flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-blue-400 hover:bg-blue-50"
            >
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:scale-105">
                <FiUploadCloud size={40} />
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                Upload your resume
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                Click here to select your resume in PDF format.
              </p>

              <span className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition group-hover:bg-blue-700">
                Choose Resume
              </span>

              <p className="mt-4 text-xs text-slate-400">
                PDF files only • Maximum 10 MB
              </p>
            </button>
          ) : (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

              {/* Selected file */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <FiFileText size={28} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      PDF • {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={uploading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2 />
                  Remove
                </button>

              </div>

              {/* Analyze */}
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error */}
          {uploadError && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              <FiXCircle className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Upload failed
                </p>

                <p className="mt-1 text-sm">
                  {uploadError}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Resume Result */}
        {resumeText && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <FiCheckCircle size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Resume Uploaded Successfully
                </h2>

                <p className="text-sm text-slate-500">
                  Your resume text has been extracted and saved
                  for CareerLens AI.
                </p>
              </div>
            </div>

            {/* Extracted Text */}
            <div className="rounded-2xl bg-slate-50 p-5">
              <h3 className="mb-3 font-semibold text-slate-900">
                Extracted Resume Text
              </h3>

              <div className="max-h-[500px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-5">
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-600">
                  {resumeText}
                </pre>
              </div>
            </div>

            {/* Interview Button */}
            <button
              type="button"
              onClick={handleStartInterview}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:bg-slate-800"
            >
              Start AI Interview
              <FiArrowRight />
            </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              CareerLens will use your resume to personalize
              your interview questions.
            </p>

          </div>
        )}

        {/* Feature Cards */}
        {!resumeText && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <FiFileText />
              </div>

              <h3 className="font-semibold text-slate-900">
                Resume Analysis
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Understand the important information inside your
                resume.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <FiCheckCircle />
              </div>

              <h3 className="font-semibold text-slate-900">
                Skill Detection
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Identify your technical skills, experience and
                strengths.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <FiCheckCircle />
              </div>

              <h3 className="font-semibold text-slate-900">
                Career Matching
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Find suitable jobs and prepare for interviews.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default ResumeAnalyzer;