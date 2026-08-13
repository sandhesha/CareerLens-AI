import { useRef, useState } from "react";
import {
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiTrash2,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";

import { uploadResume } from "../services/api";
import { saveResume } from "../services/careerService";

interface ResumeAnalyzerProps {
  onBack?: () => void;
  onAnalysisComplete?: (
    score: number,
    skills: number,
    jobs: number
  ) => void;
}

interface ResumeResult {
  success?: boolean;
  filename?: string;
  text?: string;
}
function createResumeProfile(
  text: string
) {
  const normalizedText = text.toLowerCase();

  const technicalKeywords = [
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "node.js",
    "nodejs",
    "html",
    "css",
    "sql",
    "mysql",
    "mongodb",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "generative ai",
    "data science",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "git",
    "github",
    "aws",
    "azure",
    "docker",
    "fastapi",
    "flask",
    "express",
    "rest api",
    "power bi",
    "tableau",
    "excel",
  ];

  const softSkillKeywords = [
    "communication",
    "leadership",
    "teamwork",
    "problem solving",
    "problem-solving",
    "adaptability",
    "time management",
    "critical thinking",
    "collaboration",
  ];

  const skills = technicalKeywords.filter(
    (skill) =>
      normalizedText.includes(skill)
  );

  const softSkills = softSkillKeywords.filter(
    (skill) =>
      normalizedText.includes(skill)
  );

  return {
    name:
      text.match(
        /(?:name\s*[:\-]?\s*)([a-z .'-]{2,50})/i
      )?.[1]
        ?.trim() || "Candidate",

    skills,

    technicalSkills: skills,

    softSkills,

    education: [],

    experience: [],

    projects: [],

    certifications: [],

    interests: [],

    summary: text.slice(0, 500),
  };
}

function ResumeAnalyzer({
  onBack,
  onAnalysisComplete,
}: ResumeAnalyzerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [resumeText, setResumeText] = useState("");

  const [analysis, setAnalysis] = useState({
    score: 0,
    skills: 0,
    jobMatches: 0,
  });

  // =========================
  // FILE SELECTION
  // =========================

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

    // PDF validation
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setUploadError("Please select a PDF resume.");
      setSelectedFile(null);
      return;
    }

    // 10 MB validation
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Resume must be smaller than 10 MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // =========================
  // CHOOSE FILE
  // =========================

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  // =========================
  // UPLOAD + ANALYZE
  // =========================

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a PDF resume first.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      setResumeText("");

      // FIXED
      const result: ResumeResult =
        await uploadResume(selectedFile);

      const extractedText = result.text || "";

      if (!extractedText.trim()) {
        throw new Error(
          "The resume was uploaded, but no text could be extracted from the PDF."
        );
      }

      setResumeText(extractedText);
      const resumeProfile =
        createResumeProfile(extractedText);

      saveResume(resumeProfile);

      // =========================
      // SAVE RESUME INFORMATION
      // =========================

      localStorage.setItem(
        "resumeText",
        extractedText
      );

      localStorage.setItem(
        "resumeFileName",
        selectedFile.name
      );

      // =========================
      // BASIC RESUME ANALYSIS
      // =========================

      const text = extractedText.toLowerCase();

      const skillKeywords = [
        "python",
        "java",
        "javascript",
        "typescript",
        "react",
        "node.js",
        "nodejs",
        "html",
        "css",
        "sql",
        "mongodb",
        "mysql",
        "machine learning",
        "deep learning",
        "artificial intelligence",
        " ai ",
        "data science",
        "pandas",
        "numpy",
        "tensorflow",
        "git",
        "github",
        "aws",
        "azure",
        "docker",
        "fastapi",
        "flask",
      ];

      const matchedSkills = skillKeywords.filter(
        (skill) => text.includes(skill)
      );

      const skillsCount = matchedSkills.length;

      // =========================
      // RESUME SCORE
      // =========================

      let score = 40;

      if (text.includes("education")) {
        score += 10;
      }

      if (text.includes("experience")) {
        score += 10;
      }

      if (text.includes("projects")) {
        score += 10;
      }

      if (text.includes("skills")) {
        score += 5;
      }

      if (text.includes("certification")) {
        score += 5;
      }

      score += Math.min(
        skillsCount * 2,
        20
      );

      score = Math.min(score, 100);

      // =========================
      // JOB MATCHES
      // =========================

      const matches = Math.min(
        Math.max(Math.floor(score / 3), 5),
        30
      );

      // =========================
      // UPDATE PAGE
      // =========================

      setAnalysis({
        score,
        skills: skillsCount,
        jobMatches: matches,
      });

      // =========================
      // SAVE DASHBOARD VALUES
      // =========================

      localStorage.setItem(
        "resumeScore",
        score.toString()
      );

      localStorage.setItem(
        "skillsMatched",
        skillsCount.toString()
      );

      localStorage.setItem(
        "jobMatches",
        matches.toString()
      );

      // =========================
      // UPDATE APP DASHBOARD
      // =========================

      onAnalysisComplete?.(
        score,
        skillsCount,
        matches
      );

      // Notify other components
      window.dispatchEvent(
        new CustomEvent(
          "careerlens-dashboard-update"
        )
      );

      console.log(
        "Resume analysis complete"
      );

      console.log("Score:", score);
      console.log(
        "Skills:",
        skillsCount
      );
      console.log(
        "Job matches:",
        matches
      );
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      setUploadError(
        error instanceof Error
          ? error.message
          : "Resume upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // REMOVE FILE
  // =========================

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResumeText("");
    setUploadError("");

    setAnalysis({
      score: 0,
      skills: 0,
      jobMatches: 0,
    });

    localStorage.removeItem(
      "resumeText"
    );

    localStorage.removeItem(
      "resumeFileName"
    );

    localStorage.removeItem(
      "resumeScore"
    );

    localStorage.removeItem(
      "skillsMatched"
    );

    localStorage.removeItem(
      "jobMatches"
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.dispatchEvent(
      new CustomEvent(
        "careerlens-dashboard-update"
      )
    );
  };

  // =========================
  // START INTERVIEW
  // =========================

  const handleStartInterview = () => {
    if (!resumeText) {
      setUploadError(
        "Please analyze your resume before starting the interview."
      );
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        "start-careerlens-interview"
      )
    );
  };

  // =========================
  // FILE SIZE
  // =========================

  const formatFileSize = (
    bytes: number
  ) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* BACK BUTTON */}

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <FiArrowLeft size={17} />
            Back to Dashboard
          </button>
        )}

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Resume Analyzer
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Upload your resume and get an
            instant AI-powered analysis.
          </p>
        </div>

        {/* UPLOAD CARD */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Upload your resume
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              PDF files only. Maximum size:
              10 MB.
            </p>
          </div>

          {/* HIDDEN INPUT */}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* UPLOAD AREA */}

          {!selectedFile && (
            <button
              type="button"
              onClick={handleChooseFile}
              className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center transition hover:border-blue-400 hover:bg-blue-50"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <FiUploadCloud size={30} />
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                Click to choose your resume
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Select a PDF file from your computer
              </p>

              <span className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
                Choose PDF
              </span>
            </button>
          )}

          {/* SELECTED FILE */}

          {selectedFile && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <FiFileText size={23} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-800">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatFileSize(
                        selectedFile.size
                      )}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <FiTrash2 size={16} />
                  Remove
                </button>

              </div>

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <FiLoader
                      size={18}
                      className="animate-spin"
                    />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <FiUploadCloud size={18} />
                    Analyze Resume
                  </>
                )}
              </button>

            </div>
          )}

          {/* ERROR */}

          {uploadError && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

              <FiXCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="text-sm font-semibold">
                  Resume analysis failed
                </p>

                <p className="mt-1 text-sm">
                  {uploadError}
                </p>
              </div>

            </div>
          )}

        </div>

        {/* ANALYSIS RESULTS */}

        {resumeText && (
          <div className="mt-6 space-y-6">

            {/* SUCCESS */}

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700">

              <FiCheckCircle size={22} />

              <div>
                <p className="font-semibold">
                  Resume analyzed successfully
                </p>

                <p className="mt-1 text-sm">
                  {selectedFile?.name}
                </p>
              </div>

            </div>

            {/* SCORES */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  Resume Score
                </p>

                <p className="mt-2 text-4xl font-bold text-blue-600">
                  {analysis.score}%
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Profile strength
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  Skills Matched
                </p>

                <p className="mt-2 text-4xl font-bold text-violet-600">
                  {analysis.skills}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Skills identified
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                  Job Matches
                </p>

                <p className="mt-2 text-4xl font-bold text-emerald-600">
                  {analysis.jobMatches}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Suitable positions
                </p>
              </div>

            </div>

            {/* EXTRACTED TEXT */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Extracted Resume Text
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Text successfully extracted
                    from your PDF.
                  </p>
                </div>

                <FiCheckCircle
                  size={22}
                  className="text-emerald-500"
                />

              </div>

              <div className="mt-5 max-h-96 overflow-y-auto rounded-xl bg-slate-50 p-5">

                <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">
                  {resumeText}
                </pre>

              </div>

            </div>

            {/* INTERVIEW CTA */}

            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white sm:flex-row">

              <div>

                <h2 className="text-lg font-bold">
                  Ready for your interview?
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  Use your analyzed resume to
                  prepare for an AI interview.
                </p>

              </div>

              <button
                type="button"
                onClick={handleStartInterview}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                Start Interview
                <FiArrowRight size={17} />
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default ResumeAnalyzer;