import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Table,
  Sheet,
  Select,
  Option,
  Stack,
  CircularProgress,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { REPO, CONSTANTS } from "@services/index";
import { useAppSelector } from "@app/store/hooks";

export default function AdminResultsPage() {
  const [results, setResults] = useState<REPO.API.QuizResultResponse[]>([]);
  const [departments, setDepartments] = useState<REPO.API.DepartmentModel[]>(
    [],
  );
  const [quizzes, setQuizzes] = useState<REPO.API.QuizModel[]>([]);
  const [teachers, setTeachers] = useState<REPO.API.TeacherModel[]>([]);

  const [deptFilter, setDeptFilter] = useState<number>(0);
  const [quizFilter, setQuizFilter] = useState<number>(0);
  const [teacherFilter, setTeacherFilter] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [loadingLists, setLoadingLists] = useState(true);

  const auth = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    // fetch lists in parallel
    const fetchLists = async () => {
      setLoadingLists(true);
      try {
        await Promise.allSettled([
          fetchDepartments(),
          fetchQuizzes(),
          fetchTeachers(),
        ]);
      } catch (err) {
        console.error("Failed to load lists", err);
      } finally {
        setLoadingLists(false);
      }
    };
    fetchLists();
  }, []);

  // when a teacher opens the page, default the teacher filter to their id
  useEffect(() => {
    if (auth?.role === "teacher" && auth?.id) {
      setTeacherFilter(auth.id);
    }
    // only run when auth changes
  }, [auth?.role, auth?.id]);

  const fetchDepartments = async () => {
    const req = await REPO.API.getAllDepartments();
    const response = req.getResponse();
    const { status, data } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      setDepartments(data.records ?? []);
    }
  };

  const fetchQuizzes = async () => {
    const req = await REPO.API.getAllQuizzes();
    const response = req.getResponse();
    const { status, data } = response;
    if (status === 200) {
      setQuizzes(data.records ?? []);
    }
  };

  const fetchTeachers = async () => {
    const req = await REPO.API.getAllTeachers();
    const response = req.getResponse();
    const { status, data } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      const { records } = data;
      setTeachers(records ?? []);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deptFilter, quizFilter, teacherFilter]);

  const fetchResults = async () => {
    setLoading(true);
    const req = await REPO.API.getQuizResult({
      department_id: deptFilter || null,
      quiz_id: quizFilter || null,
      teacher_id: teacherFilter || null,
    });
    const response = req.getResponse();
    const { status, data } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      const { records } = data;
      setResults(records);
    }
    setLoading(false);
  };

  const handleView = (row: REPO.API.QuizResultResponse) => {
    goToFullResult(row);
  };

  const goToFullResult = (row: REPO.API.QuizResultResponse) => {
    // Navigate to a full result page. Adjust this route if your app uses a different path.

    navigate(`/${auth.role}/quizzes/${row.quiz_id}/results/${row.student_id}`);
  };

  return (
    <Sheet sx={{ p: 3 }}>
      <Typography level="h3" mb={2}>
        Quiz Results
      </Typography>

      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <Select
          placeholder={
            loadingLists ? "Loading departments..." : "All departments"
          }
          value={deptFilter}
          onChange={(_, v) => setDeptFilter(Number(v ?? 0))}
          sx={{ minWidth: 200 }}
        >
          <Option value={0}>All departments</Option>
          {departments.map((d) => (
            <Option key={d.id} value={d.id}>
              {d.name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder={loadingLists ? "Loading quizzes..." : "All quizzes"}
          value={quizFilter}
          onChange={(_, v) => setQuizFilter(Number(v ?? 0))}
          sx={{ minWidth: 220 }}
        >
          <Option value={0}>All quizzes</Option>
          {quizzes.map((q) => (
            <Option key={q.id} value={q.id}>
              {q.title}
            </Option>
          ))}
        </Select>

        <Select
          placeholder={loadingLists ? "Loading teachers..." : "All teachers"}
          value={teacherFilter}
          onChange={(_, v) => setTeacherFilter(Number(v ?? 0))}
          sx={{ minWidth: 220 }}
        >
          <Option value={0}>All teachers</Option>
          {teachers.map((t) => (
            <Option key={t.id} value={t.id}>
              {t.name}
            </Option>
          ))}
        </Select>

        <Button
          variant="outlined"
          onClick={() => {
            setDeptFilter(0);
            setQuizFilter(0);
            // if teacher, keep their id as the default filter
            if (auth?.role === "teacher") setTeacherFilter(auth.id ?? 0);
            else setTeacherFilter(0);
          }}
        >
          Clear
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <thead>
            <tr>
              <th style={{ minWidth: 180 }}>Quiz Title</th>
              <th style={{ minWidth: 160 }}>Teacher Name</th>
              <th style={{ minWidth: 160 }}>Teacher Department</th>
              <th style={{ minWidth: 160 }}>Student Name</th>
              <th style={{ minWidth: 160 }}>Student Department</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 12 }}>
                  No results found
                </td>
              </tr>
            ) : (
              results.map((r) => (
                <tr key={`${r.assignment_id ?? r.quiz_id}-${r.student_id}`}>
                  <td>{r.quiz_title}</td>
                  <td>{r.teacher_name ?? "-"}</td>
                  <td>{r.teacher_department ?? "-"}</td>
                  <td>{r.student_name}</td>
                  <td>{r.student_department ?? "-"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outlined"
                      onClick={() => handleView(r)}
                      sx={{ mr: 1 }}
                    >
                      View Results
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Sheet>
  );
}
