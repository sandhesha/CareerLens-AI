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
  onInterviewComplete?: (score: number) => void;
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

/* =====================================================
   INTERVIEW QUESTIONS
===================================================== */

const questions = [
  {
    type: "Introduction",
    question: "Tell me about yourself and your background.",
  },
  {
    type: "Resume Experience",
    question:
      "Can you describe one important project or experience from your resume?",
  },
  {
    type: "Technical Skills",
    question:
      "What are your strongest technical skills, and how have you used them in your projects?",
  },
  {
    type: "Problem Solving",
    question:
      "Tell me about a difficult problem you faced in a project and how you solved it.",
  },
  {
    type: "Career & Resume",
    question:
      "Why should we hire you based on the skills and experience shown in your resume?",
  },
];

/* =====================================================
   STOP WORDS
===================================================== */

const STOP_WORDS = new Set([
  "this",
  "that",
  "with",
  "from",
  "your",
  "have",
  "will",
  "using",
  "into",
  "been",
  "were",
  "they",
  "their",
  "about",
  "which",
  "where",
  "when",
  "what",
  "there",
  "also",
  "then",
  "than",
  "them",
  "very",
  "some",
  "more",
  "such",
  "only",
  "would",
  "could",
  "should",
  "because",
  "while",
  "after",
  "before",
  "project",
  "experience",
  "skills",
  "resume",
]);

/* =====================================================
   TECHNICAL KEYWORDS
===================================================== */

const TECHNICAL_KEYWORDS = [
  "python",
  "java",
  "javascript",
  "typescript",
  "react",
  "reactjs",
  "node",
  "nodejs",
  "html",
  "css",
  "sql",
  "mongodb",
  "mysql",
  "postgresql",
  "machine learning",
  "deep learning",
  "artificial intelligence",
  "ai",
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
  "power bi",
  "tableau",
  "excel",
  "api",
  "frontend",
  "backend",
  "full stack",
  "tailwind",
  "vite",
  "nextjs",
];

/* =====================================================
   TEXT HELPERS
===================================================== */

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getWords = (text: string) => {
  return normalizeText(text)
    .split(" ")
    .filter(
      (word) =>
        word.length >= 4 &&
        !STOP_WORDS.has(word)
    );
};

const unique = (items: string[]) => [
  ...new Set(items),
];

/* =====================================================
   ANSWER EVALUATION
===================================================== */

const evaluateAnswer = (
  answerText: string,
  questionIndex: number,
  resumeText: string
) => {
  /*
   * Introduction is not scored.
   */
  if (questionIndex === 0) {
    return 0;
  }

  const answer = normalizeText(answerText);
  const resume = normalizeText(resumeText);

  if (!answer) {
    return 0;
  }

  const answerWords = unique(getWords(answer));
  const resumeWords = unique(getWords(resume));

  const wordCount = answerWords.length;

  /*
   * ---------------------------------------------------
   * 1. ANSWER COMPLETENESS - 5 MARKS
   * ---------------------------------------------------
   */

  let completenessScore = 0;

  if (wordCount >= 10) {
    completenessScore += 1;
  }

  if (wordCount >= 20) {
    completenessScore += 1;
  }

  if (wordCount >= 35) {
    completenessScore += 1;
  }

  if (wordCount >= 50) {
    completenessScore += 1;
  }

  if (wordCount >= 70) {
    completenessScore += 1;
  }

  /*
   * ---------------------------------------------------
   * 2. RESUME RELEVANCE - 8 MARKS
   * ---------------------------------------------------
   */

  const matchedResumeWords = answerWords.filter(
    (word) =>
      resume.includes(` ${word} `) ||
      resume.includes(word)
  );

  const uniqueMatchedResumeWords =
    unique(matchedResumeWords);

  let resumeRelevanceScore = 0;

  if (uniqueMatchedResumeWords.length >= 1) {
    resumeRelevanceScore += 2;
  }

  if (uniqueMatchedResumeWords.length >= 3) {
    resumeRelevanceScore += 2;
  }

  if (uniqueMatchedResumeWords.length >= 6) {
    resumeRelevanceScore += 2;
  }

  if (uniqueMatchedResumeWords.length >= 10) {
    resumeRelevanceScore += 2;
  }

  /*
   * ---------------------------------------------------
   * 3. TECHNICAL RELEVANCE - 6 MARKS
   * ---------------------------------------------------
   */

  const resumeTechnicalSkills =
    TECHNICAL_KEYWORDS.filter((skill) =>
      resume.includes(skill)
    );

  const answerTechnicalSkills =
    resumeTechnicalSkills.filter((skill) =>
      answer.includes(skill)
    );

  let technicalScore = 0;

  if (answerTechnicalSkills.length >= 1) {
    technicalScore += 2;
  }

  if (answerTechnicalSkills.length >= 2) {
    technicalScore += 2;
  }

  if (answerTechnicalSkills.length >= 3) {
    technicalScore += 2;
  }

  /*
   * ---------------------------------------------------
   * 4. ANSWER QUALITY - 6 MARKS
   * ---------------------------------------------------
   *
   * Look for explanation words that indicate
   * the candidate actually explained their answer.
   */

  const explanationWords = [
    "because",
    "therefore",
    "implemented",
    "developed",
    "created",
    "designed",
    "built",
    "solved",
    "improved",
    "achieved",
    "learned",
    "used",
    "worked",
    "handled",
    "managed",
    "result",
    "resulted",
    "increased",
    "reduced",
  ];

  const matchedExplanationWords =
    explanationWords.filter((word) =>
      answer.includes(word)
    );

  let qualityScore = 0;

  if (matchedExplanationWords.length >= 1) {
    qualityScore += 2;
  }

  if (matchedExplanationWords.length >= 2) {
    qualityScore += 2;
  }

  if (matchedExplanationWords.length >= 4) {
    qualityScore += 2;
  }

  /*
   * ---------------------------------------------------
   * FINAL SCORE
   * ---------------------------------------------------
   */

  const finalQuestionScore =
    completenessScore +
    resumeRelevanceScore +
    technicalScore +
    qualityScore;

  return Math.min(finalQuestionScore, 25);
};

/* =====================================================
   COMPONENT
===================================================== */

function Interview({ onBack }: InterviewProps) {
  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [isRecording, setIsRecording] =
    useState(false);

  const [answer, setAnswer] = useState("");

  const [time, setTime] = useState(0);

  const [submitted, setSubmitted] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const [questionScores, setQuestionScores] =
    useState<number[]>([]);

  const [finalScore, setFinalScore] =
    useState(0);

  const [speechSupported, setSpeechSupported] =
    useState(true);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  const questionData =
    questions[currentQuestion];

  /*
   * Get resume uploaded by Resume Analyzer.
   */

  const resumeText =
    localStorage.getItem("resumeText") || "";

  /* =====================================================
     SPEECH RECOGNITION
  ===================================================== */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition =
      new SpeechRecognition();

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
        transcript +=
          event.results[i][0].transcript + " ";
      }

      setAnswer(transcript.trim());
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

  /* =====================================================
     START RECORDING
  ===================================================== */

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
        setTime(
          (previous) => previous + 1
        );
      }, 1000);
    } catch {
      console.log(
        "Recording already started."
      );
    }
  };

  /* =====================================================
     STOP RECORDING
  ===================================================== */

  const stopRecording = () => {
    recognitionRef.current?.stop();

    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  /* =====================================================
     SUBMIT ANSWER
  ===================================================== */

  const submitAnswer = () => {
    if (!answer.trim()) {
      return;
    }

    stopRecording();

    const score = evaluateAnswer(
      answer,
      currentQuestion,
      resumeText
    );

    setQuestionScores((previous) => {
      const updated = [...previous];

      updated[currentQuestion] = score;

      return updated;
    });

    setSubmitted(true);
  };

  /* =====================================================
     NEXT QUESTION
  ===================================================== */

  const nextQuestion = () => {
    /*
     * Final question
     */

    if (
      currentQuestion ===
      questions.length - 1
    ) {
      const scores = [...questionScores];

      /*
       * Make sure the latest answer is included.
       */

      scores[currentQuestion] =
        evaluateAnswer(
          answer,
          currentQuestion,
          resumeText
        );

      /*
       * Q1 is introduction.
       * Q2-Q5 = actual scored questions.
       */

      const totalScore = scores
        .slice(1, 5)
        .reduce(
          (total, score) =>
            total + (score || 0),
          0
        );

      /*
       * Maximum = 100.
       */

      setQuestionScores(scores);

      setFinalScore(totalScore);

      /*
       * Save actual score to dashboard.
       */

      localStorage.setItem(
        "interviewScore",
        totalScore.toString()
      );

      /*
       * Notify dashboard.
       */

      window.dispatchEvent(
        new CustomEvent(
          "careerlens-dashboard-update"
        )
      );

      setCompleted(true);

      return;
    }

    /*
     * Move to next question.
     */

    setCurrentQuestion(
      (previous) => previous + 1
    );

    setAnswer("");
    setTime(0);
    setSubmitted(false);
  };

  /* =====================================================
     SPEAK QUESTION
  ===================================================== */

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

    window.speechSynthesis.speak(
      speech
    );
  };

  /* =====================================================
     FORMAT TIME
  ===================================================== */

  const formatTime = (
    seconds: number
  ) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  /* =====================================================
     PROGRESS
  ===================================================== */

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  /* =====================================================
     COMPLETED SCREEN
  ===================================================== */

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
              Your score was calculated from
              the actual answers you provided
              during the interview.
            </p>

            {/* FINAL SCORE */}

            <div className="mx-auto mt-8 max-w-sm rounded-3xl border border-blue-500/20 bg-blue-500/10 p-8">

              <p className="text-sm font-medium text-slate-400">
                Your Interview Score
              </p>

              <p className="mt-3 text-6xl font-bold text-blue-400">
                {finalScore}%
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Maximum 100 points
              </p>

            </div>

            {/* QUESTION SCORES */}

            <div className="mt-8 space-y-3 text-left">

              {questions.map(
                (question, index) => (
                  <div
                    key={question.type}
                    className="flex items-center justify-between rounded-xl bg-slate-800 p-4"
                  >

                    <div>
                      <p className="text-sm font-semibold">
                        Question {index + 1}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {question.type}
                      </p>
                    </div>

                    <div className="text-right">

                      {index === 0 ? (
                        <span className="text-sm text-slate-500">
                          Not scored
                        </span>
                      ) : (
                        <span className="text-lg font-bold text-green-400">
                          {questionScores[index] || 0}/25
                        </span>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-500"
                >
                  Back to Dashboard
                  <FiArrowRight size={17} />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswer("");
                  setTime(0);
                  setSubmitted(false);
                  setCompleted(false);
                  setQuestionScores([]);
                  setFinalScore(0);

                  localStorage.setItem(
                    "interviewScore",
                    "0"
                  );

                  window.dispatchEvent(
                    new CustomEvent(
                      "careerlens-dashboard-update"
                    )
                  );
                }}
                className="rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                Restart Interview
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     INTERVIEW SCREEN
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

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

        {/* HEADER */}

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

          {!resumeText && (
            <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-300">
              No resume has been uploaded.
              Resume-related questions cannot
              be evaluated accurately.
            </div>
          )}

        </div>

        {/* PROGRESS */}

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="mb-3 flex items-center justify-between text-sm">

            <span className="text-slate-400">
              Interview Progress
            </span>

            <span className="font-semibold text-white">
              {currentQuestion + 1} /{" "}
              {questions.length}
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* MAIN CARD */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

          {/* QUESTION */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
                {questionData.type}
              </p>

              <h2 className="max-w-3xl text-2xl font-semibold leading-relaxed sm:text-3xl">
                {questionData.question}
              </h2>

              {currentQuestion === 0 && (
                <p className="mt-3 text-xs text-slate-500">
                  Introduction question —
                  this answer will not affect
                  your interview score.
                </p>
              )}

              {currentQuestion > 0 && (
                <p className="mt-3 text-xs text-blue-400">
                  This answer will be evaluated
                  based on its relevance,
                  completeness and connection
                  to your uploaded resume.
                  Maximum: 25 marks.
                </p>
              )}

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

          {/* TIMER */}

          <div className="mt-8 flex justify-center">

            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-5 py-2 text-sm text-slate-300">
              <FiClock />
              {formatTime(time)}
            </div>

          </div>

          {/* MICROPHONE */}

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

          {/* BROWSER WARNING */}

          {!speechSupported && (
            <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-center text-sm text-yellow-300">
              Speech recognition is not
              supported in this browser.
            </div>
          )}

          {/* ANSWER */}

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
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              placeholder="Type your answer here, or tap the microphone and speak..."
              className="min-h-[180px] w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-5 leading-7 text-slate-300 outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <FiMic />
              <span>
                Voice input automatically
                appears here
              </span>
            </div>

          </div>

          {/* SUBMIT */}

          {!submitted ? (

            <button
              type="button"
              onClick={submitAnswer}
              disabled={
                !answer.trim() ||
                isRecording
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiCheckCircle />
              Submit Answer
            </button>

          ) : (

            <div className="mt-6">

              {/* EVALUATED */}

              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2 text-green-400">

                    <FiCheckCircle />

                    <span className="font-semibold">
                      Answer Evaluated
                    </span>

                  </div>

                  {currentQuestion === 0 ? (

                    <span className="text-sm text-slate-500">
                      Not scored
                    </span>

                  ) : (

                    <span className="text-2xl font-bold text-green-400">
                      {questionScores[
                        currentQuestion
                      ] || 0}
                      /25
                    </span>

                  )}

                </div>

                <p className="mt-2 text-sm leading-6 text-slate-400">

                  {currentQuestion === 0
                    ? "Your introduction was recorded successfully. This question does not affect your final score."
                    : "Your score was calculated from the content of your answer, its relevance to your resume, technical relevance and answer completeness."}

                </p>

              </div>

              {/* NEXT */}

              <button
                type="button"
                onClick={nextQuestion}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500"
              >

                {currentQuestion ===
                questions.length - 1
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