// src/pages/Student/QuizSelection.tsx
import { Card, CardContent, Typography, Button, Grid, Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { REPO } from "@services/index";
import { useEffect, useState } from "react";

export default function QuizSelection() {
  const navigate = useNavigate();
  const [assignedQuizzes, setAssignedQuizzes] = useState<
    REPO.API.QuizAssignment[]
  >([]);
  const fetchAssignedQuizzes = async () => {
    try {
      const result = await REPO.API.getAssignedQuizzes();
      const { status, data } = result.getResponse();
      if (status === 200) {
        setAssignedQuizzes(data.records || []);
      }

      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  useEffect(() => {
    fetchAssignedQuizzes();
  }, []);
  console.log("Assigned Quizzes:", assignedQuizzes);
  return (
    <Grid container spacing={2}>
      {assignedQuizzes.map((quiz) => (
        <Grid xs={12} md={6} lg={4} key={quiz.assignment_id}>
          <Card variant="outlined">
            <CardContent>
              <Typography level="h3" mb={1}>
                {quiz.title}
              </Typography>
              <Typography level="body-sm" mb={1}>
                {quiz.description}
              </Typography>
              <Box
                sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
              >
                <Typography level="body-xs" mb={2} color="neutral">
                  Duration: {quiz.duration_minutes} mins
                </Typography>
                <Typography
                  level="body-lg"
                  mb={2}
                  color={
                    quiz.score / quiz.total_questions > 50
                      ? "success"
                      : "danger"
                  }
                >
                  {quiz.score}/{quiz.total_questions} correct
                </Typography>
              </Box>
              <Button
                disabled={quiz.is_answered}
                variant="solid"
                color="primary"
                fullWidth
                onClick={() => {
                  // if (quiz.is_answered)
                  //   navigate(`${quiz.quiz_id}/result/${quiz.answer_id}`);
                  // else
                  navigate(`/student/quizzes/${quiz.quiz_id}/progress`);
                }}
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
