import { useEffect, useState } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Label, Input, Row, Col
} from 'reactstrap';
import api from '../services/api';

function CompanyModal({ isOpen, toggle, onSaved, initialData }) {
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState({
    nombre_comercial: '',
    razon_social: '',
    nit: '',
    telefono: '',
    correo: '',
    id_pais: '',
    id_departamento: '',
    id_municipio: ''
  });

  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    api.get('/paises').then(res => setPaises(res.data));
  }, []);

  useEffect(() => {
    if (form.id_pais) {
      api.get('/departamentos').then(res =>
        setDepartamentos(res.data.filter(dep => dep.id_pais === parseInt(form.id_pais)))
      );
    }
  }, [form.id_pais]);

  useEffect(() => {
    if (form.id_departamento) {
      api.get('/municipios').then(res =>
        setMunicipios(res.data.filter(m => m.id_departamento === parseInt(form.id_departamento)))
      );
    }
  }, [form.id_departamento]);

  useEffect(() => {
    if (initialData) {
      const mun = initialData.Municipio;
      const dep = mun?.id_departamento;
      const pais = mun?.Departamento?.id_pais;

      setForm({
        nombre_comercial: initialData.nombre_comercial || '',
        razon_social: initialData.razon_social || '',
        nit: initialData.nit || '',
        telefono: initialData.telefono || '',
        correo: initialData.correo || '',
        id_pais: pais || '',
        id_departamento: dep || '',
        id_municipio: initialData.id_municipio || ''
      });
    } else {
      setForm({
        nombre_comercial: '',
        razon_social: '',
        nit: '',
        telefono: '',
        correo: '',
        id_pais: '',
        id_departamento: '',
        id_municipio: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      nombre_comercial: form.nombre_comercial,
      razon_social: form.razon_social,
      nit: form.nit,
      telefono: form.telefono,
      correo: form.correo,
      id_municipio: parseInt(form.id_municipio)
    };

    if (isEdit) {
      await api.put(`/empresas/${initialData.id}`, body);
    } else {
      await api.post('/empresas', body);
    }

    onSaved?.();
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{isEdit ? 'Editar' : 'Nueva'} empresa</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nombre Comercial</Label>
            <Input name="nombre_comercial" value={form.nombre_comercial} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Razón Social</Label>
            <Input name="razon_social" value={form.razon_social} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>NIT</Label>
            <Input name="nit" value={form.nit} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Teléfono</Label>
            <Input name="telefono" value={form.telefono} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label>Correo</Label>
            <Input type="email" name="correo" value={form.correo} onChange={handleChange} />
          </FormGroup>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label>País</Label>
                <Input type="select" name="id_pais" value={form.id_pais} onChange={handleChange} required>
                  <option value="">Seleccione</option>
                  {paises.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Departamento</Label>
                <Input type="select" name="id_departamento" value={form.id_departamento} onChange={handleChange} required>
                  <option value="">Seleccione</option>
                  {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Municipio</Label>
                <Input type="select" name="id_municipio" value={form.id_municipio} onChange={handleChange} required>
                  <option value="">Seleccione</option>
                  {municipios.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleSubmit}>{isEdit ? 'Actualizar' : 'Crear'}</Button>
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
}

export default CompanyModal;
