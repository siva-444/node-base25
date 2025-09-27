import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Select,
  Option,
  Typography,
  Box,
  Divider,
} from "@mui/joy";
import { assignQuiz } from "@services/repositories/api/quiz";
import { useParams, useNavigate } from "react-router-dom";
import { getAllDepartments } from "@services/repositories/api";

interface Department {
  id: number;
  name: string;
}

export default function AssignQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batchYear, setBatchYear] = useState<number>(new Date().getFullYear());
  const [departmentId, setDepartmentId] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await getAllDepartments();
      const { status, data } = res.getResponse();
      if (status === 200) {
        const { records } = data;
        setDepartments(records || []);
        if (records?.length) {
          setDepartmentId(records[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await assignQuiz(Number(id), {
        batch_year: batchYear,
        department_id: departmentId,
      });
      if (result.getResponse().status !== 200)
        throw new Error("Failed to assign");
      alert("Quiz Assigned Successfully!");
      navigate(-1);
    } catch (err) {
      alert("Error assigning quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography level="h4" mb={2}>
        Assign Quiz
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Select
          placeholder="Select batch year"
          value={batchYear}
          onChange={(_, v) => setBatchYear(Number(v))}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <Option key={i} value={new Date().getFullYear() - 7 + i}>
              {new Date().getFullYear() - 7 + i}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Department"
          value={departmentId}
          onChange={(_, v) => setDepartmentId(Number(v))}
        >
          {departments.map((d) => (
            <Option key={d.id} value={d.id}>
              {d.name}
            </Option>
          ))}
        </Select>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button onClick={handleAssign} loading={loading}>
          Assign Quiz
        </Button>
      </Box>
    </Card>
  );
}
