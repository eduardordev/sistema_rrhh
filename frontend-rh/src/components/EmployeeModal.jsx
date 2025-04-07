import { useEffect, useState } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Label, Input
} from 'reactstrap';
import api from '../services/api';

function EmployeeModal({ isOpen, toggle, onSaved, initialData }) {
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState({
    nombre_completo: '',
    edad: '',
    telefono: '',
    correo: '',
    empresas: []
  });
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre_completo: initialData.nombre_completo || '',
        edad: initialData.edad || '',
        telefono: initialData.telefono || '',
        correo: initialData.correo || '',
        empresas: initialData.Empresas?.map(e => e.id) || []
      });
    } else {
      setForm({ nombre_completo: '', edad: '', telefono: '', correo: '', empresas: [] });
    }
  }, [initialData]);

  useEffect(() => {
    api.get('/empresas').then(res => setEmpresas(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEmpresaSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, opt => parseInt(opt.value));
    setForm(prev => ({ ...prev, empresas: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await api.put(`/colaboradores/${initialData.id}`, form);
    } else {
      await api.post('/colaboradores', form);
    }
    onSaved?.();
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{isEdit ? 'Editar' : 'Nuevo'} colaborador</ModalHeader>
      <ModalBody>
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
            <Input type="select" multiple value={form.empresas} onChange={handleEmpresaSelect}>
              {empresas.map(e => (
                <option key={e.id} value={e.id}>{e.nombre_comercial}</option>
              ))}
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>{isEdit ? 'Actualizar' : 'Crear'}</Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
}

export default EmployeeModal;
