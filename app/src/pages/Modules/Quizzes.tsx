// Quizzes.tsx
import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Table,
  Sheet,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import type { QuizModel } from "@services/repositories/api/quiz";
import { getAllQuizzes, deleteQuiz } from "@services/repositories/api/quiz";

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizModel[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch quizzes
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await getAllQuizzes();
      const { status, data } = res.getResponse();
      if (status === 200) {
        setQuizzes(data.records ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Redirect handlers
  const handleAdd = () => navigate("add"); // CreateQuizzes.tsx
  const handleEdit = (id: number) => navigate(`${id}/edit`); // Edit inside CreateQuizzes.tsx
  const handleAssign = (id: number) => navigate(`${id}/assign`); // AssignStudents.tsx

  // Delete logic
  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteQuiz(deleteId);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== deleteId));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteId(null);
      setLoading(false);
    }
  };

  return (
    <Sheet sx={{ p: 3 }}>
      <Typography level="h3" mb={2}>
        Manage Quizzes
      </Typography>
      <Button variant="soft" sx={{ mb: 2 }} onClick={handleAdd}>
        Add Quiz
      </Button>
      <Table>
        <thead>
          <tr>
            <th style={{ width: 60 }}>ID</th>
            <th style={{ minWidth: 160 }}>Title</th>
            <th>Description</th>
            <th style={{ width: 100 }}>Duration</th>
            <th style={{ width: 220 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td>{quiz.id}</td>
              <td>{quiz.title}</td>
              <td>{quiz.description}</td>
              <td>{quiz.duration_minutes} min</td>
              <td>
                <Button
                  size="sm"
                  variant="plain"
                  sx={{ mr: 1 }}
                  onClick={() => handleEdit(quiz.id)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outlined"
                  sx={{ mr: 1 }}
                  onClick={() => handleAssign(quiz.id)}
                >
                  Assign
                </Button>
                <Button
                  size="sm"
                  variant="soft"
                  color="danger"
                  onClick={() => setDeleteId(quiz.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this quiz? This will also delete all
            related questions and options.
          </DialogContent>
          <DialogActions>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              loading={loading}
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
}
