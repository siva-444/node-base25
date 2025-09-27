import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Table,
  Sheet,
  Modal,
  ModalDialog,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Box,
  Select,
  Option,
} from "@mui/joy";
import { useForm, Controller } from "react-hook-form";
import { REPO, CONSTANTS } from "@services/index";

type Student = {
  id: number;
  name: string;
  email: string;
  role: string;
  roll_number: string;
  department_id: number;
  department: string; // returned as joined name from API
  batch_year: number;
};

type Department = {
  id: number;
  name: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    reset,
    register,
    control,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<{
    name: string;
    email: string;
    password?: string;
    roll_number: string;
    department_id: number;
    batch_year: number;
  }>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roll_number: "",
      department_id: 0,
      batch_year: new Date().getFullYear(),
    },
  });

  // Fetch students + departments
  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const req = await REPO.API.getAllDepartments();
    const response = req.getResponse();
    const { status, data } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      setDepartments(data.records ?? []);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    const req = await REPO.API.getAllStudents();
    const response = req.getResponse();
    const { status, data, message } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      setStudents(data.records ?? []);
    } else {
      setError(message ?? "Failed to fetch students");
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditStudent(null);
    reset({
      name: "",
      email: "",
      password: "",
      roll_number: "",
      department_id: departments[0]?.id ?? 0,
      batch_year: new Date().getFullYear(),
    });
    setOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditStudent(student);
    reset({
      ...student,
      department_id: student.department_id,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (id === 1) return; // Prevent deleting id 1
    setLoading(true);
    setError(null);
    const req = await REPO.API.deleteStudent(id);
    const response = req.getResponse();
    const { status, message } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      setStudents((prev) => prev.filter((u) => u.id !== id));
    } else {
      setError(message ?? "Failed to delete student");
    }
    setLoading(false);
  };

  const onSubmit = async (data: {
    name: string;
    email: string;
    password?: string;
    roll_number: string;
    department_id: number;
    batch_year: number;
  }) => {
    setLoading(true);
    setError(null);

    if (editStudent) {
      // Update student
      const req = await REPO.API.updateStudent(editStudent.id, data);
      const response = req.getResponse();
      const { status, data: resData } = response;
      if (status === CONSTANTS.STATUS_CODES.OK) {
        const { records } = resData;
        setStudents((prev) =>
          prev.map((u) => (u.id === records.id ? { ...u, ...records } : u)),
        );
        setOpen(false);
        reset();
      } else {
        setFormError("email", { type: "server", message: response.message });
      }
    } else {
      // Add student
      const req = await REPO.API.createStudent(data);
      const response = req.getResponse();
      const { status, data: resData } = response;
      if (status === CONSTANTS.STATUS_CODES.CREATED) {
        setStudents((prev) => [...prev, resData.records]);
        setOpen(false);
        reset();
      } else {
        setFormError("email", { type: "server", message: response.message });
      }
    }
    setLoading(false);
  };

  return (
    <Sheet sx={{ p: 3 }}>
      <Typography level="h3" mb={2}>
        Manage Students
      </Typography>
      <Button variant="soft" sx={{ mb: 2 }} onClick={handleAdd}>
        Add Student
      </Button>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Table size="sm" sx={{ minWidth: 750 }}>
          <thead>
            <tr>
              <th style={{ width: 60, textAlign: "center" }}>S.No</th>
              <th style={{ minWidth: 120 }}>Name</th>
              <th style={{ minWidth: 180 }}>Email</th>
              <th style={{ minWidth: 120 }}>Roll No</th>
              <th style={{ minWidth: 120 }}>Department</th>
              <th style={{ minWidth: 100 }}>Batch</th>
              <th style={{ minWidth: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.roll_number}</td>
                <td>{student.department}</td>
                <td>{student.batch_year}</td>
                <td>
                  <Button
                    size="sm"
                    variant="plain"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="soft"
                    color="danger"
                    disabled={student.id === 1}
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <Typography level="h4" mb={2}>
            {editStudent ? "Edit Student" : "Add Student"}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input {...register("name", { required: true })} />
                {errors.name && (
                  <Typography color="danger" level="body-sm">
                    {errors.name.message}
                  </Typography>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  {...register("email", { required: true })}
                  type="email"
                />
                {errors.email && (
                  <Typography color="danger" level="body-sm">
                    {errors.email.message}
                  </Typography>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  {...register("password", { required: !editStudent })}
                  type="password"
                />
                {errors.password && (
                  <Typography color="danger" level="body-sm">
                    {errors.password.message}
                  </Typography>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Roll Number</FormLabel>
                <Input {...register("roll_number", { required: true })} />
                {errors.roll_number && (
                  <Typography color="danger" level="body-sm">
                    {errors.roll_number.message}
                  </Typography>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Department</FormLabel>
                <Controller
                  name="department_id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(_, value) => field.onChange(value)}
                      disabled={departments.length === 0}
                    >
                      {departments.map((dept) => (
                        <Option key={dept.id} value={dept.id}>
                          {dept.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.department_id && (
                  <Typography color="danger" level="body-sm">
                    {errors.department_id.message}
                  </Typography>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Batch Year</FormLabel>
                <Input
                  type="number"
                  {...register("batch_year", {
                    required: true,
                    min: 2000,
                    max: new Date().getFullYear(),
                  })}
                />
                {errors.batch_year && (
                  <Typography color="danger" level="body-sm">
                    {errors.batch_year.message}
                  </Typography>
                )}
              </FormControl>
              <Button
                type="submit"
                variant="solid"
                disabled={isSubmitting || loading}
              >
                {editStudent ? "Update" : "Add"}
              </Button>
              {error && (
                <Typography color="danger" level="body-sm">
                  {error}
                </Typography>
              )}
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
}
