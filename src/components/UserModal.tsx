import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import type { AppDispatch } from '../store';
import { addUser, editUser, fetchUsers } from '../store/usersSlice';
import type { User } from '../types/user';

interface Props { open: boolean; onClose: () => void; user: User | null; }

export default function UserModal({ open, onClose, user }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, role: user.role });
    else setForm({ name: '', email: '', role: '' });
  }, [user, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (user) await dispatch(editUser({ id: user.id, data: form }));
    else await dispatch(addUser(form));
    dispatch(fetchUsers({ page: 1, limit: 10 }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{user ? 'Редактировать' : 'Создать'} пользователя</DialogTitle>
      <DialogContent>
        <TextField name="name" label="Имя" fullWidth margin="normal" value={form.name} onChange={handleChange} />
        <TextField name="email" label="Email" fullWidth margin="normal" value={form.email} onChange={handleChange} />
        <TextField name="role" label="Роль" fullWidth margin="normal" value={form.role} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
}