// src/pages/Student/QuizResult.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, Divider } from "@mui/joy";

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers } = (location.state as any) || { answers: {} };

  const correctAnswers: Record<number, string> = {
    1: "Java Virtual Machine",
    2: "extends",
  };

  const score = Object.keys(answers).reduce(
    (acc, qId) => (answers[+qId] === correctAnswers[+qId] ? acc + 1 : acc),
    0,
  );

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, mx: "auto" }}>
      <CardContent>
        <Typography level="h4" textAlign="center" mb={2}>
          Quiz Completed 🎉
        </Typography>
        <Typography level="body-lg" textAlign="center" mb={3}>
          Your Score: {score} / {Object.keys(correctAnswers).length}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {Object.keys(correctAnswers).map((qId) => (
          <div key={qId}>
            <Typography level="body-md" fontWeight="lg">
              Q{qId}
            </Typography>
            <Typography level="body-sm">
              Your Answer: {answers[+qId] || "Not answered"}
            </Typography>
            <Typography level="body-sm" color="success">
              Correct Answer: {correctAnswers[+qId]}
            </Typography>
            <Divider sx={{ my: 1 }} />
          </div>
        ))}

        <Button fullWidth onClick={() => navigate("/student/quizzes")}>
          Back to Quizzes
        </Button>
      </CardContent>
    </Card>
  );
}
