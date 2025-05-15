import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { Edit, Delete, Add, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

export default function Users() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', phones: [''] });
  const [editingIndex, setEditingIndex] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchName, setSearchName] = useState('');
const [searchPhone, setSearchPhone] = useState('');

const fetchFilteredContacts = async () => {
  const params = new URLSearchParams();
  if (searchName) params.append('name', searchName);
  if (searchPhone) params.append('phone', searchPhone);

  try {
    const response = await fetch(`http://localhost:3000/contact?${params.toString()}`);
    const data = await response.json();
    setContacts(data);
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    const mapFields = { nome: 'name', idade: 'age' };
    if (mapFields[name]) {
      setForm({ ...form, [mapFields[name]]: value });
    }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    const match = numbers.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (!match) return '';
    const [, ddd, prefixo, sufixo] = match;
    if (numbers.length <= 2) return `(${ddd}`;
    if (numbers.length <= 7) return `(${ddd}) ${prefixo}`;
    return `(${ddd}) ${prefixo}${sufixo ? '-' + sufixo : ''}`;
  };

  const handlePhoneChange = (index, value) => {
    const updatedPhones = [...form.phones];
    updatedPhones[index] = formatPhone(value);
    setForm({ ...form, phones: updatedPhones });
  };

  const adicionarTelefone = () => {
    setForm({ ...form, phones: [...form.phones, ''] });
  };

  const removerTelefone = (indexToRemove) => {
    const updatedPhones = form.phones.filter((_, i) => i !== indexToRemove);
    setForm({ ...form, phones: updatedPhones.length ? updatedPhones : [''] });
  };

  const handleEdit = (index) => {
    const contact = contacts[index];
    const phonesFormatted = Array.isArray(contact.phones)
      ? contact.phones.map((p) => (typeof p === 'string' ? p : p.number || ''))
      : [];

    setForm({
      name: contact.name,
      age: contact.age.toString(),
      phones: phonesFormatted.length ? phonesFormatted : [''],
    });

    setEditingIndex(index);
  };

  const handleSalvar = async () => {
    if (form.name && form.age && form.phones.some((phone) => phone.trim() !== '')) {
      try {
        const body = { ...form, age: parseInt(form.age) };

        const response = await fetch('http://localhost:3000/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          credentials: 'include',
        });

        if (response.ok) {
          const savedContact = await response.json();
          let updatedContacts = [...contacts];

          if (editingIndex !== null) {
            updatedContacts[editingIndex] = savedContact;
          } else {
            updatedContacts = [...contacts, savedContact];
          }

          setContacts(updatedContacts);
          setForm({ name: '', age: '', phones: [''] });
          setEditingIndex(null);
          setOpenSnackbar(true);
        } else {
          console.error('Erro ao salvar:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao salvar usuário:', error);
      }
    }
  };

const handleDelete = async (index) => {
  const contact = contacts[index];

  try {
    const response = await fetch(`http://localhost:3000/contact/${contact.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      const newContacts = contacts.filter((_, i) => i !== index);
      setContacts(newContacts);

      if (editingIndex === index) {
        setForm({ name: '', age: '', phones: [''] });
        setEditingIndex(null);
      }

      console.log('Contato deletado com sucesso.');
    } else {
      console.error('Erro ao excluir:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao excluir contato:', error);
  }
};


  return (
    <StyledBox>
      <Typography variant="h5" align="center" gutterBottom>
        Agenda
      </Typography>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField label="Nome" name="nome" value={form.name} onChange={handleChange} />
        <TextField label="Idade" name="idade" type="number" value={form.age} onChange={handleChange} />
      </Box>

      <Box display="flex" flexDirection="column" gap={1} mb={2}>
        {form.phones.map((fone, index) => (
          <Box key={index} display="flex" gap={1} alignItems="center">
            <TextField
              fullWidth
              label={`Telefone ${index + 1}`}
              value={fone}
              onChange={(e) => handlePhoneChange(index, e.target.value)}
              inputProps={{ maxLength: 15 }}
            />
            {form.phones.length > 1 && (
              <IconButton color="error" onClick={() => removerTelefone(index)}>
                <Close fontSize="small" />
              </IconButton>
            )}
            {index === form.phones.length - 1 && (
              <IconButton onClick={adicionarTelefone} color="primary">
                <Add />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>

      <Button variant="contained" onClick={handleSalvar}>
        {editingIndex !== null ? 'ATUALIZAR' : 'SALVAR'}
      </Button>
<Box display="flex" gap={2} mb={2}>
  <TextField
    label="Pesquisar por nome"
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
  />
  <TextField
    label="Pesquisar por telefone"
    value={searchPhone}
    onChange={(e) => setSearchPhone(e.target.value)}
  />
  <Button variant="outlined" onClick={fetchFilteredContacts}>Buscar</Button>
</Box>

      <Box mt={4} borderRadius={2} overflow="hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Idade</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact, index) => (
              <TableRow key={index}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.age}</TableCell>
                <TableCell>
                  {Array.isArray(contact.phones)
                    ? contact.phones.map((p) => (typeof p === 'string' ? p : p.number)).join(', ')
                    : contact.phone}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(index)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(index)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {editingIndex !== null ? 'Usuário atualizado com sucesso.' : 'Usuário criado com sucesso.'}
        </Alert>
      </Snackbar>
    </StyledBox>
  );
}
