import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert, CircularProgress, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { AppDispatch, RootState } from '../store';
import { fetchUsers, setPage } from '../store/usersSlice';
import UserModal from '../components/UserModal';
import type { User } from '../types/user';

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, status, error, page, limit } = useSelector((s: RootState) => s.users);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers({ page: page + 1, limit }));
  }, [dispatch, page, limit]);

  const handleEditClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setEditingUser(user);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <Button variant="contained" onClick={() => { setEditingUser(null); setModalOpen(true); }} sx={{ mb: 2 }}>
        Создать пользователя
      </Button>

      {status === 'loading' && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Аватар</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(user => (
              <TableRow key={user.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/users/${user.id}`)}>
                <TableCell><Avatar src={user.avatar} alt={user.name} /></TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleEditClick(e, user)}><EditIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="outlined" disabled={page === 0} onClick={() => dispatch(setPage(page - 1))}>Назад</Button>
        <span>Страница {page + 1}</span>
        <Button variant="outlined" onClick={() => dispatch(setPage(page + 1))}>Вперёд</Button>
      </div>

      <UserModal open={modalOpen} onClose={() => setModalOpen(false)} user={editingUser} />
    </div>
  );
}
