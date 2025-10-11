import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  Chip,
  Sheet,
} from "@mui/joy";
import { REPO } from "@services/index";
import { useAppSelector } from "@app/store/hooks";

export default function QuizResultDetail() {
  const { id, studentId } = useParams();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<REPO.API.QuizDetailedResult | null>(
    null,
  );

  useEffect(() => {
    if (!id || !studentId) return;
    const fetch = async () => {
      setLoading(true);
      const req = await REPO.API.getQuizResultDetail(
        Number(id),
        Number(studentId),
      );
      const { status, data } = req.getResponse();
      if (status === 200) {
        setResult(data.records);
      }
      setLoading(false);
    };
    fetch();
  }, [id, studentId]);

  if (!id || !studentId) return <div>Invalid route</div>;

  return (
    <Sheet sx={{ p: 3 }}>
      <Typography level="h3" mb={2}>
        Quiz Result - {result?.quiz?.title ?? "-"}
      </Typography>
      <Card sx={{ maxWidth: 900, mx: "auto" }}>
        <CardContent>
          <Typography level="h4" mb={1}>
            Detailed Result
          </Typography>
          <Typography mb={2}>
            Description: {result?.quiz?.description ?? "-"}
          </Typography>
          <Typography mb={1}>
            Student: {result?.student?.name ?? `#${studentId}`}
          </Typography>
          <Typography mb={2}>
            Score: {typeof result?.score === "number" ? result.score : "-"} /{" "}
            {typeof result?.total_questions === "number"
              ? result.total_questions
              : (result?.quiz?.questions?.length ?? "-")}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <div>Loading...</div>
          ) : result ? (
            <List>
              {(() => {
                const answersMap = new Map<number, REPO.API.Answer>(
                  (result.answers || []).map((a) => [a.question_id, a]),
                );
                return result.quiz.questions.map((q, idx) => {
                  const userAns = answersMap.get(q.id) ?? null;
                  const correctId = userAns?.correct_option_id ?? null;
                  return (
                    <ListItem key={q.id} sx={{ display: "block", mb: 1 }}>
                      <Typography fontWeight={600}>
                        Q{idx + 1}. {q.question_text}
                      </Typography>
                      <div>
                        {q.options.map((opt) => {
                          const isCorrect = opt.id === correctId;
                          const isSelected =
                            userAns?.selected_option_id === opt.id;
                          return (
                            <div
                              key={opt.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <Typography
                                sx={{
                                  color: isCorrect
                                    ? "green"
                                    : isSelected
                                      ? "red"
                                      : undefined,
                                }}
                              >
                                {opt.option_text}
                              </Typography>
                              {isSelected ? (
                                <Chip
                                  size="sm"
                                  color={isCorrect ? "success" : "danger"}
                                >
                                  Your answer
                                </Chip>
                              ) : null}
                              {isCorrect ? (
                                <Chip size="sm" color="success">
                                  Correct
                                </Chip>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                      {q.explanation ? (
                        <Typography sx={{ mt: 1, color: "neutral.500" }}>
                          Explanation: {q.explanation}
                        </Typography>
                      ) : null}
                      <Divider sx={{ my: 1 }} />
                    </ListItem>
                  );
                });
              })()}
            </List>
          ) : (
            <div>No data</div>
          )}

          <Button
            sx={{ mt: 2 }}
            onClick={() => {
              if (auth.role === "student") {
                navigate("/student/quizzes");
              } else navigate(-1);
            }}
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </Sheet>
  );
}
