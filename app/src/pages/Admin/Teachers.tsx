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
type Teacher = {
  id: number;
  name: string;
  email: string;
  role: string;
  department_id: number;
  department: string;
  phone: string;
};
type Department = {
  id: number;
  name: string;
};
export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    reset,
    register,
    control,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Teacher, "id" | "department"> & { password?: string }>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      department_id: 1,
      phone: "",
    },
  });

  // Fetch teachers on mount
  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const req = await REPO.API.getAllDepartments();
    const response = req.getResponse();
    const { status, data } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      const { records } = data;
      setDepartments(records ?? []);
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    const req = await REPO.API.getAllTeachers();
    const response = req.getResponse();
    const { status, data, message } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      const { records } = data;
      setTeachers(records ?? []);
    } else {
      setError(message ?? "Failed to fetch teachers");
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditTeacher(null);
    reset({
      name: "",
      email: "",
      password: "",
      department_id: departments[0]?.id ?? 0,
      phone: "",
    });
    setOpen(true);
  };
  const handleEdit = (teacher: Teacher) => {
    setEditTeacher(teacher);
    reset({ ...teacher, department_id: teacher.department_id });
    setOpen(true);
  };
  const handleDelete = async (id: number) => {
    if (id === 1) return; // Prevent deleting id 1
    setLoading(true);
    setError(null);
    const req = await REPO.API.deleteTeacher(id);
    const response = req.getResponse();
    const { status, message } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      setTeachers((prev) => prev.filter((u) => u.id !== id));
    } else {
      setError(message ?? "Failed to delete teacher");
    }
    setLoading(false);
  };

  const onSubmit = async (data: {
    name: string;
    email: string;
    password?: string;
    department_id: number;
    phone: string;
  }) => {
    setLoading(true);
    setError(null);
    if (editTeacher) {
      // Update teacher
      const req = await REPO.API.updateTeacher(editTeacher.id, data);
      const response = req.getResponse();
      const { status, data: resData } = response;
      if (status === CONSTANTS.STATUS_CODES.OK) {
        const { records } = resData;
        setTeachers((prev) =>
          prev.map((u) => (u.id === records.id ? { ...u, ...records } : u)),
        );
        setOpen(false);
        reset();
      } else {
        setFormError("email", { type: "server", message: response.message });
      }
    } else {
      // Add teacher
      const req = await REPO.API.createTeacher(data);
      const response = req.getResponse();
      const { status, data: resData } = response;
      if (status === CONSTANTS.STATUS_CODES.CREATED) {
        const { records } = resData;
        setTeachers((prev) => [...prev, records]);
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
        Manage Teachers
      </Typography>
      <Button variant="soft" sx={{ mb: 2 }} onClick={handleAdd}>
        Add Teacher
      </Button>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Table size="sm" sx={{ minWidth: 650 }}>
          <thead>
            <tr>
              <th style={{ width: 60, textAlign: "center" }}>S.No</th>
              <th style={{ minWidth: 120 }}>Name</th>
              <th style={{ minWidth: 180 }}>Email</th>
              <th style={{ minWidth: 120 }}>Department</th>
              <th style={{ minWidth: 100 }}>Phone</th>
              <th style={{ minWidth: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher.id}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.department}</td>
                <td>{teacher.phone}</td>
                <td>
                  <Button
                    size="sm"
                    variant="plain"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(teacher)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="soft"
                    color="danger"
                    disabled={teacher.id === 1}
                    onClick={() => handleDelete(teacher.id)}
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
            {editTeacher ? "Edit Teacher" : "Add Teacher"}
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
                  {...register("password", { required: !editTeacher })}
                  type="password"
                />
                {errors.password && (
                  <Typography color="danger" level="body-sm">
                    {errors.password.message}
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
                <FormLabel>Phone</FormLabel>
                <Input {...register("phone", { required: true })} />
                {errors.phone && (
                  <Typography color="danger" level="body-sm">
                    {errors.phone.message}
                  </Typography>
                )}
              </FormControl>
              <Button
                type="submit"
                variant="solid"
                disabled={isSubmitting || loading}
              >
                {editTeacher ? "Update" : "Add"}
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
