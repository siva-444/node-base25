import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Typography,
  Box,
  Card,
  IconButton,
  Sheet,
  Divider,
} from "@mui/joy";
import { useParams } from "react-router-dom";
import {
  createQuiz,
  updateQuiz,
  getQuizById,
} from "@services/repositories/api/quiz";

const SvgIcon = ({ src, ...props }: { src: string; [key: string]: any }) => (
  <span style={{ display: "inline-flex", alignItems: "center" }} {...props}>
    <img src={src} alt="icon" style={{ width: 24, height: 24 }} />
  </span>
);

import addSvg from "../../assets/add.svg";
import removeSvg from "../../assets/remove.svg";
import checkSvg from "../../assets/check.svg";
import uncheckSvg from "../../assets/uncheck.svg";

interface Option {
  id?: number;
  option_text: string;
  is_correct?: boolean;
}

interface Question {
  id?: number;
  question_text: string;
  options: Option[];
  explanation?: string;
}

interface QuizFormData {
  title: string;
  description: string;
  duration_minutes: number;
  questions?: Question[];
}

const defaultOption = (): Option => ({ option_text: "", is_correct: false });
const defaultQuestion = (): Question => ({
  question_text: "",
  options: [defaultOption(), defaultOption()],
  explanation: "",
});

export default function CreateQuiz() {
  const { id } = useParams();

  const [form, setForm] = useState<QuizFormData>({
    title: "",
    description: "",
    duration_minutes: 20,
    questions: [defaultQuestion()],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isEdit = Boolean(id);

  // Load quiz data if editing
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getQuizById(Number(id));
        const { status, data } = res.getResponse();
        if (status !== 200) {
          setError("Failed to load quiz");
          return;
        }
        const { records } = data;
        // Populate form with fetched data
        setForm({
          title: records.title,
          description: records.description,
          duration_minutes: records.duration_minutes,
          questions: records.questions,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Quiz field handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Question handlers
  const handleQuestionChange = (
    idx: number,
    key: keyof Question,
    value: any,
  ) => {
    if (form.questions === undefined) return;
    const questions = [...form.questions];
    questions[idx][key] = value;
    setForm({ ...form, questions });
  };

  const addQuestion = () => {
    setForm({ ...form, questions: [...form.questions, defaultQuestion()] });
  };

  const removeQuestion = (idx: number) => {
    if (form.questions?.length !== 0) {
      setForm({
        ...form,
        questions: form.questions?.filter((_, i) => i !== idx),
      });
    }
  };

  // Option handlers
  const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
    const questions = [...form.questions];
    questions[qIdx].options[oIdx].option_text = value;
    setForm({ ...form, questions });
  };

  const addOption = (qIdx: number) => {
    const questions = [...form.questions];
    if (questions[qIdx].options.length < 5) {
      questions[qIdx].options.push(defaultOption());
      setForm({ ...form, questions });
    }
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    const questions = [...form.questions];
    if (questions[qIdx].options.length > 2) {
      questions[qIdx].options = questions[qIdx].options.filter(
        (_, i) => i !== oIdx,
      );
      setForm({ ...form, questions });
    }
  };

  // Only one correct answer per question
  const setCorrectOption = (qIdx: number, oIdx: number) => {
    const questions = [...form.questions];
    questions[qIdx].options = questions[qIdx].options.map((opt, idx) => ({
      ...opt,
      is_correct: idx === oIdx,
    }));
    setForm({ ...form, questions });
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (isEdit) {
        await updateQuiz(Number(id), form);
        setSuccess("Quiz updated successfully!");
      } else {
        await createQuiz(form);
        setSuccess("Quiz created successfully!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error saving quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet sx={{ p: 3 }}>
      <Typography level="h3" mb={2}>
        {isEdit ? "Edit Quiz" : "Create Quiz"}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Quiz Meta */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Quiz Title"
            required
            sx={{ mb: 2 }}
          />
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>Duration (minutes):</Typography>
            <Input
              sx={{ flex: 1 }}
              name="duration_minutes"
              type="number"
              value={form.duration_minutes}
              onChange={handleChange}
              placeholder="Duration (minutes)"
              required
            />
          </Box>
        </Card>

        {/* Questions */}
        {form.questions.map((q, qIdx) => (
          <Card key={qIdx} sx={{ mb: 3, p: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography level="h4">Question {qIdx + 1}</Typography>
              <IconButton
                onClick={() => removeQuestion(qIdx)}
                disabled={form.questions.length === 1}
                title="Remove Question"
                color="danger"
              >
                <SvgIcon src={removeSvg} />
              </IconButton>
            </Box>

            <Input
              value={q.question_text}
              onChange={(e) =>
                handleQuestionChange(qIdx, "question_text", e.target.value)
              }
              placeholder="Question Text"
              required
              sx={{ mb: 2 }}
            />

            <Input
              value={q.explanation || ""}
              onChange={(e) =>
                handleQuestionChange(qIdx, "explanation", e.target.value)
              }
              placeholder="Explanation (optional)"
              sx={{ mb: 3 }}
            />

            <Typography level="body-lg" sx={{ mb: 1 }}>
              Options (min 2, max 5)
            </Typography>

            {q.options.map((opt, oIdx) => (
              <Box key={oIdx} display="flex" alignItems="center" sx={{ mb: 1 }}>
                <IconButton
                  onClick={() => setCorrectOption(qIdx, oIdx)}
                  color={opt.is_correct ? "success" : "neutral"}
                  title={opt.is_correct ? "Correct Answer" : "Mark as Correct"}
                >
                  <SvgIcon src={opt.is_correct ? checkSvg : uncheckSvg} />
                </IconButton>

                <Input
                  value={opt.option_text}
                  onChange={(e) =>
                    handleOptionChange(qIdx, oIdx, e.target.value)
                  }
                  placeholder={`Option ${oIdx + 1}`}
                  required
                  sx={{ flex: 1, mr: 1 }}
                />

                <IconButton
                  onClick={() => removeOption(qIdx, oIdx)}
                  disabled={q.options.length <= 2}
                  title="Remove Option"
                  color="danger"
                >
                  <SvgIcon src={removeSvg} />
                </IconButton>
              </Box>
            ))}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                onClick={() => addOption(qIdx)}
                startDecorator={<SvgIcon src={addSvg} />}
                disabled={q.options.length >= 5}
                variant="outlined"
                size="sm"
              >
                Add Option
              </Button>
            </Box>
          </Card>
        ))}

        {/* Add Question */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Button
            onClick={addQuestion}
            startDecorator={<SvgIcon src={addSvg} />}
            variant="outlined"
          >
            Add Question
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {error && (
          <Typography color="danger" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        <Button
          type="submit"
          loading={loading}
          variant="solid"
          color="primary"
          fullWidth
        >
          {isEdit ? "Update Quiz" : "Create Quiz"}
        </Button>
      </form>
    </Sheet>
  );
}
