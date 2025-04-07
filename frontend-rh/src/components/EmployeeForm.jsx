import { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import api from '../services/api';

function EmployeeForm({ onCreated }) {
  const [form, setForm] = useState({
    nombre_completo: '',
    edad: '',
    telefono: '',
    correo: '',
    empresas: []
  });

  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    api.get('/empresas').then(res => setEmpresas(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmpresaSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setForm(prev => ({ ...prev, empresas: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/colaboradores', form);
    onCreated?.();
    setForm({
      nombre_completo: '',
      edad: '',
      telefono: '',
      correo: '',
      empresas: []
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Nombre completo</Label>
        <Input name="nombre_completo" value={form.nombre_completo} onChange={handleChange} required />
      </FormGroup>
      <FormGroup>
        <Label>Edad</Label>
        <Input type="number" name="edad" value={form.edad} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Teléfono</Label>
        <Input name="telefono" value={form.telefono} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Correo</Label>
        <Input type="email" name="correo" value={form.correo} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Empresas</Label>
        <Input type="select" multiple onChange={handleEmpresaSelect}>
          {empresas.map(e => (
            <option key={e.id} value={e.id}>
              {e.nombre_comercial}
            </option>
          ))}
        </Input>
      </FormGroup>
      <Button color="primary">Crear colaborador</Button>
    </Form>
  );
}

export default EmployeeForm;
