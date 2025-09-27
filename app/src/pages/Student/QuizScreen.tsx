// src/pages/Student/QuizScreen.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  Button,
  Sheet,
  Box,
  Stack,
  Alert,
} from "@mui/joy";
import { REPO } from "@services/index";
import type { QuizDetail } from "@services/repositories/api";
import { shuffleQuizDetails } from "@utils/helpers";

export default function QuizScreen() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (quizId) fetchQuizDetails(quizId);
  }, [quizId]);

  // ⏲ Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      if (quiz) handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const fetchQuizDetails = async (quizId: string) => {
    try {
      const response = await REPO.API.getQuizDetails(Number(quizId));
      const { data, status } = response.getResponse();
      if (status === 200 && data?.records) {
        const shuffledQuiz = shuffleQuizDetails(data.records);
        setQuiz(shuffledQuiz);
        setTimeLeft((shuffledQuiz.duration_minutes || 10) * 60); // fallback 10 min
      } else {
        setError("Unable to load quiz details. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong while fetching quiz.");
    }
  };

  const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleNext = () => {
    if (!quiz) return;
    const question = quiz.questions[current];

    // ✅ Validation: answer required
    if (!answers[question.id]) {
      setFormError("Please select an answer before continuing.");
      return;
    }
    setFormError(null);

    if (current < quiz.questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const ansObj = Object.entries(answers).map(([question_id, option_id]) => ({
      question_id: Number(question_id),
      option_id: Number(option_id),
    }));
    const result = await REPO.API.submitQuizAnswers(quiz.id, ansObj);
    const { status, message, data } = result.getResponse();
    if (status === 200) {
      navigate(-2);
    } else {
      setFormError(message || "Failed to submit answers. Please try again.");
    }
  };

  // ✅ Validation: quiz not loaded
  if (error) {
    return (
      <Alert
        color="danger"
        variant="soft"
        sx={{ maxWidth: 600, mx: "auto", mt: 4 }}
      >
        {error}
      </Alert>
    );
  }

  if (!quiz) {
    return (
      <Typography level="h3" sx={{ textAlign: "center", mt: 4 }}>
        Loading quiz...
      </Typography>
    );
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <Typography level="h3" sx={{ textAlign: "center", mt: 4 }}>
        No questions available for this quiz.
      </Typography>
    );
  }

  const question = quiz.questions[current];

  return (
    <Sheet sx={{ mt: 4, p: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          border: "1px solid",
          borderColor: "neutral.outlinedBorder",
          borderRadius: "sm",
          mb: 2,
        }}
      >
        <Typography level="h3">
          Question {current + 1} of {quiz.questions.length}
        </Typography>
        <Typography
          level="h3"
          sx={{ background: "neutral.softBg", p: 1, borderRadius: "sm" }}
        >
          {formatTime(timeLeft)}
        </Typography>
      </Box>

      {/* Question Card */}
      <Card sx={{ my: 5 }} variant="outlined">
        <CardContent sx={{ p: 3 }}>
          <Typography level="body-lg" mb={2}>
            Q. {question.question_text}
          </Typography>

          <RadioGroup
            value={answers[question.id] || ""}
            onChange={(e) =>
              setAnswers({ ...answers, [question.id]: Number(e.target.value) })
            }
          >
            <Stack spacing={1}>
              {question.options.map((opt, idx) => (
                <Radio
                  sx={{ py: 1 }}
                  key={opt.id}
                  value={opt.id.toString()}
                  label={`${String.fromCharCode(65 + idx)}. ${opt.option_text}`}
                />
              ))}
            </Stack>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button disabled={!answers[question.id]} onClick={handleNext}>
          {current === quiz.questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </Box>
      {/* Error alert (e.g. no answer selected) */}
      {formError && (
        <Typography color="danger" level="body-sm" mb={2}>
          {formError}
        </Typography>
      )}
    </Sheet>
  );
}
