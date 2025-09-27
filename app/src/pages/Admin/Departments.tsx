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
} from "@mui/joy";
import { useForm } from "react-hook-form";
import { REPO, CONSTANTS } from "@services/index";
type Department = {
  id: number;
  name: string;
};
export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    reset,
    register,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string }>({
    defaultValues: editDepartment || { name: "" },
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    const req = await REPO.API.getAllDepartments();
    const response = req.getResponse();
    const { status, data, message } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      const { records } = data;
      setDepartments(records ?? []);
    } else {
      setError(message ?? "Failed to fetch departments");
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditDepartment(null);
    reset({ name: "" });
    setOpen(true);
  };
  const handleEdit = (department: Department) => {
    setEditDepartment(department);
    reset(department);
    setOpen(true);
  };
  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    const req = await REPO.API.deleteDepartment(id);
    const response = req.getResponse();
    const { status, message } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } else {
      setError(message ?? "Failed to delete department");
    }
    setLoading(false);
  };

  const onSubmit = async (data: { name: string }) => {
    setLoading(true);
    setError(null);
    if (editDepartment) {
      // Update department
      const req = await REPO.API.updateDepartment(editDepartment.id, data);
      const response = req.getResponse();
      const { status, data: resData } = response;
      if (status === CONSTANTS.STATUS_CODES.OK) {
        const { records } = resData;
        setDepartments((prev) =>
          prev.map((d) => (d.id === records.id ? { ...d, ...records } : d)),
        );
        setOpen(false);
        reset();
      } else {
        setFormError("name", { type: "server", message: response.message });
      }
    } else {
      // Add department
      const req = await REPO.API.createDepartment(data);
      const response = req.getResponse();
      const { status, data: resData } = response;
      if (status === CONSTANTS.STATUS_CODES.CREATED) {
        const { records } = resData;
        setDepartments((prev) => [...prev, records]);
        setOpen(false);
        reset();
      } else {
        setFormError("name", { type: "server", message: response.message });
      }
    }
    setLoading(false);
  };

  return (
    <Sheet sx={{ p: 3 }}>
      <Typography level="h3" mb={2}>
        Manage Departments
      </Typography>
      <Button variant="soft" sx={{ mb: 2 }} onClick={handleAdd}>
        Add Department
      </Button>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Table size="sm" sx={{ minWidth: 400 }}>
          <thead>
            <tr>
              <th style={{ width: 60, textAlign: "center" }}>S.No</th>
              <th style={{ minWidth: 200 }}>Name</th>
              <th style={{ minWidth: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department, index) => (
              <tr key={department.id}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>{department.name}</td>
                <td>
                  <Button
                    size="sm"
                    variant="plain"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(department)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="soft"
                    color="danger"
                    onClick={() => handleDelete(department.id)}
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
            {editDepartment ? "Edit Department" : "Add Department"}
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
              <Button
                type="submit"
                variant="solid"
                disabled={isSubmitting || loading}
              >
                {editDepartment ? "Update" : "Add"}
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
