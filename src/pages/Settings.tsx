import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiUser,
  FiTarget,
  FiBell,
  FiMoon,
  FiShield,
  FiInfo,
  FiTrash2,
  FiSave,
  FiMapPin,
  FiBriefcase,
  FiCheckCircle,
} from "react-icons/fi";

import {
  getSettings,
  saveSettingsToServer,
} from "../services/api";

interface SettingsProps {
  onBack?: () => void;
}

interface UserSettings {
  name: string;
  email: string;
  careerGoal: string;
  location: string;
  workType: string;
  jobNotifications: boolean;
  interviewNotifications: boolean;
  darkMode: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  name: "",
  email: "",
  careerGoal: "AI/ML Engineer",
  location: "India",
  workType: "Any",
  jobNotifications: true,
  interviewNotifications: true,
  darkMode: true,
};

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [name, setName] = useState(DEFAULT_SETTINGS.name);
  const [email, setEmail] = useState(DEFAULT_SETTINGS.email);
  const [careerGoal, setCareerGoal] = useState(
    DEFAULT_SETTINGS.careerGoal
  );
  const [location, setLocation] = useState(
    DEFAULT_SETTINGS.location
  );
  const [workType, setWorkType] = useState(
    DEFAULT_SETTINGS.workType
  );

  const [jobNotifications, setJobNotifications] = useState(
    DEFAULT_SETTINGS.jobNotifications
  );

  const [interviewNotifications, setInterviewNotifications] =
    useState(DEFAULT_SETTINGS.interviewNotifications);

  const [darkMode, setDarkMode] = useState(
    DEFAULT_SETTINGS.darkMode
  );

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const applyTheme = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  /*
   * LOAD SETTINGS FROM SERVER
   */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        setName(data.name || "");
        setEmail(data.email || "");
        setCareerGoal(
          data.careerGoal || DEFAULT_SETTINGS.careerGoal
        );
        setLocation(
          data.location || DEFAULT_SETTINGS.location
        );
        setWorkType(
          data.workType || DEFAULT_SETTINGS.workType
        );

        setJobNotifications(
          data.jobNotifications ??
            DEFAULT_SETTINGS.jobNotifications
        );

        setInterviewNotifications(
          data.interviewNotifications ??
            DEFAULT_SETTINGS.interviewNotifications
        );

        setDarkMode(
          data.darkMode ?? DEFAULT_SETTINGS.darkMode
        );

        applyTheme(
          data.darkMode ?? DEFAULT_SETTINGS.darkMode
        );
      } catch (error) {
        console.error(
          "Failed to load settings from server:",
          error
        );

        // Fallback to local storage
        setName(localStorage.getItem("userName") || "");
        setEmail(localStorage.getItem("userEmail") || "");

        setCareerGoal(
          localStorage.getItem("careerGoal") ||
            DEFAULT_SETTINGS.careerGoal
        );

        setLocation(
          localStorage.getItem("preferredLocation") ||
            DEFAULT_SETTINGS.location
        );

        setWorkType(
          localStorage.getItem("workType") ||
            DEFAULT_SETTINGS.workType
        );

        setJobNotifications(
          localStorage.getItem("jobNotifications") !== "false"
        );

        setInterviewNotifications(
          localStorage.getItem("interviewNotifications") !==
            "false"
        );

        setDarkMode(
          localStorage.getItem("darkMode") !== "false"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    applyTheme(darkMode);
  }, [darkMode]);

  /*
   * SAVE SETTINGS TO SERVER
   */
  const saveSettings = async () => {
    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    const settings: UserSettings = {
      name,
      email,
      careerGoal,
      location,
      workType,
      jobNotifications,
      interviewNotifications,
      darkMode,
    };

    try {
      setLoading(true);

      await saveSettingsToServer(settings);

      // Keep local cache as backup
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("careerGoal", careerGoal);
      localStorage.setItem("preferredLocation", location);
      localStorage.setItem("workType", workType);
      localStorage.setItem(
        "jobNotifications",
        String(jobNotifications)
      );
      localStorage.setItem(
        "interviewNotifications",
        String(interviewNotifications)
      );
      localStorage.setItem(
        "darkMode",
        String(darkMode)
      );

      applyTheme(darkMode);

      setSaved(true);

      window.dispatchEvent(
        new CustomEvent("careerlens-dashboard-update")
      );

      window.dispatchEvent(
        new CustomEvent("careerlens-client-notification", {
          detail: {
            message: "Settings saved successfully.",
          },
        })
      );

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Failed to save settings:", error);

      alert(
        "Could not save settings to the server. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * CLEAR RESUME
   */
  const clearResumeData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your uploaded resume data?"
    );

    if (!confirmed) return;

    localStorage.removeItem("resumeText");
    localStorage.removeItem("resumeFileName");
    localStorage.removeItem("resumeScore");
    localStorage.removeItem("skillsMatched");
    localStorage.removeItem("jobMatches");
    localStorage.removeItem("careerlens_resume");
    localStorage.removeItem("userSkills");

    window.dispatchEvent(
      new CustomEvent("careerlens-dashboard-update")
    );

    alert("Resume data cleared successfully.");
  };
  // =====================================================
  // CLEAR ALL DATA
  // =====================================================

const clearAllData = () => {
    const confirmed = window.confirm(
      "This will delete all CareerLens saved data. Continue?"
    );

    if (!confirmed) return;

    localStorage.clear();

    setName("");
    setEmail("");
    setCareerGoal("AI/ML Engineer");
    setLocation("India");
    setWorkType("Any");
    setJobNotifications(true);
    setInterviewNotifications(true);
    setDarkMode(true);

    applyTheme(true);

    window.dispatchEvent(
      new CustomEvent("careerlens-dashboard-update")
    );

    alert("All CareerLens data has been cleared.");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400"
          >
            <FiArrowLeft />
            Back to Dashboard
          </button>
        )}

        {/* HEADER */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <FiShield size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Settings
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your CareerLens preferences and account.
              </p>
            </div>
          </div>
        </div>

        {/* PROFILE */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <FiUser />
            </div>

            <div>
              <h2 className="font-bold">
                Profile
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Update your basic information.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          </div>
        </section>

        {/* CAREER */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <FiTarget />

            <div>
              <h2 className="font-bold">
                Career Preferences
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tell CareerLens what type of career you want.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Career Goal
              </label>

              <select
                value={careerGoal}
                onChange={(e) =>
                  setCareerGoal(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
              >
                <option>AI/ML Engineer</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Full Stack Developer</option>
                <option>Data Analyst</option>
                <option>Data Scientist</option>
                <option>Software Engineer</option>
                <option>DevOps Engineer</option>
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <FiMapPin size={14} />
                Preferred Location
              </label>

              <select
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
              >
                <option>India</option>
                <option>Bangalore</option>
                <option>Mangalore</option>
                <option>Hyderabad</option>
                <option>Chennai</option>
                <option>Pune</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Remote</option>
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <FiBriefcase size={14} />
                Work Type
              </label>

              <select
                value={workType}
                onChange={(e) =>
                  setWorkType(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
              >
                <option>Any</option>
                <option>Internship</option>
                <option>Full-time</option>
                <option>Remote</option>
              </select>
            </div>

          </div>
        </section>

        {/* NOTIFICATIONS */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <FiBell />

            <div>
              <h2 className="font-bold">
                Notifications
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose which updates you want to receive.
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div>
                <p className="font-medium">
                  Job Match Notifications
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Get notified about suitable job opportunities.
                </p>
              </div>

              <input
                type="checkbox"
                checked={jobNotifications}
                onChange={(e) =>
                  setJobNotifications(
                    e.target.checked
                  )
                }
                className="h-5 w-5 accent-blue-600"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <div>
                <p className="font-medium">
                  Interview Reminders
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Receive reminders for interview preparation.
                </p>
              </div>

              <input
                type="checkbox"
                checked={interviewNotifications}
                onChange={(e) =>
                  setInterviewNotifications(
                    e.target.checked
                  )
                }
                className="h-5 w-5 accent-blue-600"
              />
            </label>

          </div>
        </section>

        {/* APPEARANCE */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <FiMoon />

            <div>
              <h2 className="font-bold">
                Appearance
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Customize the appearance of CareerLens.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div>
              <p className="font-medium">
                Dark Mode
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Use a dark interface throughout CareerLens.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !darkMode;

                setDarkMode(next);
                applyTheme(next);
              }}
              className={`relative h-7 w-12 rounded-full ${
                darkMode
                  ? "bg-blue-600"
                  : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white ${
                  darkMode
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* PRIVACY */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="mb-6 flex items-center gap-3">
            <FiShield />

            <div>
              <h2 className="font-bold">
                Resume & Privacy
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage information stored by CareerLens.
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-medium">
                  Clear Resume Data
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Remove your uploaded resume and analysis.
                </p>
              </div>

              <button
                type="button"
                onClick={clearResumeData}
                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <FiTrash2 />
                Clear Resume
              </button>

            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900 dark:bg-red-950/20 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-medium text-red-700 dark:text-red-400">
                  Delete All CareerLens Data
                </p>

                <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/70">
                  Permanently remove all saved CareerLens data.
                </p>
              </div>

              <button
                type="button"
                onClick={clearAllData}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                <FiTrash2 />
                Delete All
              </button>

            </div>

          </div>
        </section>

        {/* INFORMATION */}

        <div className="mb-6 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">

          <FiInfo className="mt-0.5 shrink-0" />

          <p className="text-sm leading-6">
            Settings are saved locally and synchronized
            with the CareerLens backend when backend
            synchronization is enabled.
          </p>

        </div>

        {/* SAVE */}

        <div className="sticky bottom-4 flex justify-end">

          <button
            type="button"
            onClick={saveSettings}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
          >
            {loading ? (
  <>
    <FiSave />
    Saving...
  </>
) : saved ? (
  <>
    <FiCheckCircle />
    Settings Saved
  </>
) : (
  <>
    <FiSave />
    Save Settings
  </>
)}
          </button>

        </div>

      </div>
    </div>
  );
};

export default Settings;