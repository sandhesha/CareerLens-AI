import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiMic,
  FiMicOff,
  FiClock,
  FiVolume2,
  FiArrowRight,
} from "react-icons/fi";

interface InterviewProps {
  onBack?: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult:
    | ((event: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((event: SpeechRecognitionErrorEvent) => void)
    | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const questions = [
  {
    type: "Introduction",
    question:
      "Tell me about yourself and your background.",
  },
  {
    type: "Experience",
    question:
      "Can you describe one important project or experience from your resume?",
  },
  {
    type: "Technical",
    question:
      "What are your strongest technical skills, and how have you used them in your projects?",
  },
  {
    type: "Problem Solving",
    question:
      "Tell me about a difficult problem you faced in a project and how you solved it.",
  },
  {
    type: "HR",
    question:
      "Why should we hire you for this position?",
  },
];

function Interview({ onBack }: InterviewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const questionData = questions[currentQuestion];

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        transcript += event.results[i][0].transcript;
      }

      setAnswer(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    recognition.onend = () => {
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) {
      return;
    }

    setAnswer("");
    setSubmitted(false);
    setTime(0);

    try {
      recognitionRef.current.start();

      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setTime((previous) => previous + 1);
      }, 1000);
    } catch (error) {
      console.log("Recording already started.");
    }
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();

    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const submitAnswer = () => {
    if (!answer.trim()) {
      return;
    }

    stopRecording();
    setSubmitted(true);
  };

  const nextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      setCompleted(true);
      return;
    }

    setCurrentQuestion((previous) => previous + 1);

    setAnswer("");
    setTime(0);
    setSubmitted(false);
  };

  const speakQuestion = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        questionData.question
      );

    speech.lang = "en-US";
    speech.rate = 0.95;

    window.speechSynthesis.speak(speech);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <FiArrowLeft />
              Back to Dashboard
            </button>
          )}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl sm:p-12">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              <FiCheckCircle size={52} />
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-blue-400">
              Interview Complete
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Great job! 🎉
            </h1>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              You completed all the interview questions.
              Your responses are ready for AI evaluation.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Questions
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {questions.length}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Voice Answers
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-400">
                  {questions.length}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Status
                </p>
                <p className="mt-2 text-xl font-bold text-green-400">
                  Completed
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() => {
                setCurrentQuestion(0);
                setAnswer("");
                setTime(0);
                setSubmitted(false);
                setCompleted(false);
              }}
              className="mt-8 rounded-xl bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-500"
            >
              Restart Interview
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* Back */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <FiArrowLeft />
            Back
          </button>
        )}

        {/* Header */}
        <div className="mb-8">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            CareerLens AI Interview
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            AI Mock Interview
          </h1>

          <p className="mt-2 text-slate-400">
            Answer every question using your voice.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Interview Progress
            </span>

            <span className="font-semibold text-white">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

          {/* Question Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
                {questionData.type}
              </p>

              <h2 className="max-w-3xl text-2xl font-semibold leading-relaxed sm:text-3xl">
                {questionData.question}
              </h2>

            </div>

            <button
              type="button"
              onClick={speakQuestion}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-blue-400 transition hover:bg-slate-700"
              title="Listen to question"
            >
              <FiVolume2 size={22} />
            </button>

          </div>

          {/* Timer */}
          <div className="mt-8 flex justify-center">

            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-5 py-2 text-sm text-slate-300">
              <FiClock />
              {formatTime(time)}
            </div>

          </div>

          {/* Microphone */}
          <div className="my-10 flex flex-col items-center">

            <button
              type="button"
              onClick={
                isRecording
                  ? stopRecording
                  : startRecording
              }
              disabled={!speechSupported}
              className={`relative flex h-32 w-32 items-center justify-center rounded-full transition ${
                isRecording
                  ? "bg-red-500 shadow-[0_0_70px_rgba(239,68,68,0.35)]"
                  : "bg-blue-600 shadow-[0_0_70px_rgba(37,99,235,0.35)] hover:bg-blue-500"
              } ${
                !speechSupported
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >

              {isRecording ? (
                <FiMicOff size={42} />
              ) : (
                <FiMic size={42} />
              )}

              {isRecording && (
                <span className="absolute inset-0 animate-ping rounded-full border border-red-400 opacity-30" />
              )}

            </button>

            <p className="mt-5 font-semibold text-slate-200">
              {isRecording
                ? "Listening..."
                : "Tap to speak"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {isRecording
                ? "Tap again when you finish"
                : "Answer using your microphone"}
            </p>

          </div>

          {/* Browser Warning */}
          {!speechSupported && (
            <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-center text-sm text-yellow-300">
              Speech recognition is not supported in this
              browser.
            </div>
          )}

          {/* Answer */}
          <div>

            <div>
  <div className="mb-2 flex items-center justify-between">
    <label className="block text-sm font-medium text-slate-300">
      Your Answer
    </label>

    <span className="text-xs text-slate-500">
      Type or speak your answer
    </span>
  </div>

  <textarea
    value={answer}
    onChange={(e) => setAnswer(e.target.value)}
    placeholder="Type your answer here, or tap the microphone and speak..."
    className="min-h-[180px] w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-5 leading-7 text-slate-300 outline-none transition placeholder:text-slate-600 focus:border-blue-500"
  />

  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
    <FiMic />
    <span>
      Voice input automatically appears here
    </span>
  </div>
</div>

          </div>

          {/* Submit */}
          {!submitted ? (
            <button
              type="button"
              onClick={submitAnswer}
              disabled={
                !answer.trim() || isRecording
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiCheckCircle />
              Submit Answer
            </button>
          ) : (
            <div className="mt-6">

              {/* Demo Evaluation */}
              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

                <div className="flex items-center gap-2 text-green-400">
                  <FiCheckCircle />
                  <span className="font-semibold">
                    Answer Recorded
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Your answer has been recorded. AI evaluation
                  will be connected in the next stage.
                </p>

              </div>

              <button
                type="button"
                onClick={nextQuestion}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500"
              >
                {currentQuestion === questions.length - 1
                  ? "Finish Interview"
                  : "Next Question"}

                <FiArrowRight />
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Interview;