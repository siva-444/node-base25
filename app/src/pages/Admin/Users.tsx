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
type User = REPO.API.UserModel;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    reset,
    register,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<{
    name: string;
    email: string;
    password?: string;
  }>({
    defaultValues: editUser || { name: "", email: "", password: "" },
  });

  // Fetch admin users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const req = await REPO.API.getAdminUsers();
    const response = req.getResponse();
    const { status, data, message } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      const { records } = data;
      setUsers(records ?? []);
    } else {
      setError(message ?? "Failed to fetch users");
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditUser(null);
    setOpen(true);
  };
  const handleEdit = (user: User) => {
    setEditUser(user);
    reset(user);
    setOpen(true);
  };
  const handleDelete = async (id: number) => {
    if (id === 1) return; // Prevent deleting id 1
    setLoading(true);
    setError(null);
    const req = await REPO.API.deleteUser(id);
    const response = req.getResponse();
    const { status, message } = response;
    if (status === CONSTANTS.STATUS_CODES.OK) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      setError(message ?? "Failed to delete user");
    }
    setLoading(false);
  };

  const onSubmit = async (data: {
    name: string;
    email: string;
    password?: string;
  }) => {
    setLoading(true);
    setError(null);
    if (editUser) {
      // Update user
      const req = await REPO.API.updateUser(editUser.id, data);
      const response = req.getResponse();
      const { status, data: resData } = response;

      if (status === CONSTANTS.STATUS_CODES.OK) {
        const { records } = resData;
        setUsers((prev) =>
          prev.map((u) => (u.id === records.id ? { ...u, ...records } : u)),
        );
        setOpen(false);
        reset();
      } else {
        setFormError("email", { type: "server", message: response.message });
      }
    } else {
      // Add user
      const req = await REPO.API.createUser({ ...data, role: "admin" });
      const response = req.getResponse();
      const { status, data: resData } = response;
      if (status === CONSTANTS.STATUS_CODES.CREATED) {
        const { records } = resData;
        setUsers((prev) => [...prev, records]);
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
        Manage Users
      </Typography>
      <Button variant="soft" sx={{ mb: 2 }} onClick={handleAdd}>
        Add User
      </Button>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Table size="sm" sx={{ minWidth: 650 }}>
          <thead>
            <tr>
              <th style={{ width: 60, textAlign: "center" }}>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    size="sm"
                    variant="plain"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="soft"
                    color="danger"
                    disabled={user.id === 1}
                    onClick={() => handleDelete(user.id)}
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
            {editUser ? "Edit User" : "Add User"}
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
                  {...register("password", { required: !editUser })}
                  type="password"
                />
                {errors.password && (
                  <Typography color="danger" level="body-sm">
                    {errors.password.message}
                  </Typography>
                )}
              </FormControl>
              <Button
                type="submit"
                variant="solid"
                disabled={isSubmitting || loading}
              >
                {editUser ? "Update" : "Add"}
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
