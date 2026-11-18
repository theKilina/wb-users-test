import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../api/users';
import { Paper, Typography, Button, CircularProgress, Alert, Avatar, Box } from '@mui/material';
import type { User } from '../types/user';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getUserById(id)
      .then(setUser)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  if (!user) return null;

  return (
    <Paper sx={{ p: 4, m: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>Назад</Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>        <Avatar src={user.avatar} sx={{ width: 80, height: 80 }} />
        <Box>
          <Typography variant="h4">{user.name}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Роль: {user.role}</Typography>
          <Typography>Создан: {new Date(user.createdAt).toLocaleDateString()}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}