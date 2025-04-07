import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Table, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from 'reactstrap';
import { useTable } from 'react-table';
import api from '../services/api';

function Geografia() {
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [tipo, setTipo] = useState('');
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: '', id_pais: '', id_departamento: '' });

  const [detallePais, setDetallePais] = useState(null);
  const [detalleDepartamento, setDetalleDepartamento] = useState(null);

  const fetchAll = useCallback(() => {
    api.get('/paises').then(res => setPaises(res.data));
    api.get('/departamentos').then(res => setDepartamentos(res.data));
    api.get('/municipios').then(res => setMunicipios(res.data));
  }, []);

  useEffect(() => {
    fetchAll();
  }, []);

  const tipoPorEntidad = useCallback((item) => {
    if ('id_pais' in item) return 'departamento';
    if ('id_departamento' in item) return 'municipio';
    return 'pais';
  }, []);

  const toggleModal = (nuevoTipo = '') => {
    setTipo(nuevoTipo);
    setEditId(null);
    setForm({ nombre: '', id_pais: '', id_departamento: '' });
    setModalOpen(!modalOpen);
  };

  const handleEdit = useCallback((item) => {
    const nuevoTipo = tipoPorEntidad(item);
    setTipo(nuevoTipo);
    setEditId(item.id);
    setForm({
      nombre: item.nombre,
      id_pais: item.id_pais || '',
      id_departamento: item.id_departamento || ''
    });
    setModalOpen(true);
  }, [tipoPorEntidad]);

  const handleDelete = useCallback(async (id, tipoEliminacion) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      if (tipoEliminacion === 'pais') await api.delete(`/paises/${id}`);
      if (tipoEliminacion === 'departamento') await api.delete(`/departamentos/${id}`);
      if (tipoEliminacion === 'municipio') await api.delete(`/municipios/${id}`);
      fetchAll();
    }
  }, [fetchAll]);

  const handleSubmit = async () => {
    if (tipo === 'pais') {
      if (editId) {
        await api.put(`/paises/${editId}`, { nombre: form.nombre });
      } else {
        await api.post('/paises', { nombre: form.nombre });
      }
    }
    if (tipo === 'departamento') {
      const body = { nombre: form.nombre, id_pais: parseInt(form.id_pais) };
      if (editId) {
        await api.put(`/departamentos/${editId}`, body);
      } else {
        await api.post('/departamentos', body);
      }
    }
    if (tipo === 'municipio') {
      const body = { nombre: form.nombre, id_departamento: parseInt(form.id_departamento) };
      if (editId) {
        await api.put(`/municipios/${editId}`, body);
      } else {
        await api.post('/municipios', body);
      }
    }
    toggleModal();
    fetchAll();
  };

  const RenderTable = ({ data, columns }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });
    return (
      <Table bordered hover {...getTableProps()}>
        <thead>
          {headerGroups.map(group => (
            <tr {...group.getHeaderGroupProps()}>
              {group.headers.map(col => <th {...col.getHeaderProps()}>{col.render('Header')}</th>)}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  const paisColumns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Nombre', accessor: 'nombre' },
    {
      Header: 'Acciones', Cell: ({ row }) => <>
        <Button size="sm" color="info" onClick={() => setDetallePais(row.original)}>Ver Departamentos</Button>{' '}
        <Button size="sm" color="warning" onClick={() => handleEdit(row.original)}>Editar</Button>{' '}
        <Button size="sm" color="danger" onClick={() => handleDelete(row.original.id, 'pais')}>Eliminar</Button>
      </>
    }
  ], [handleDelete, handleEdit]);

  const departamentoColumns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Nombre', accessor: 'nombre' },
    {
      Header: 'Acciones', Cell: ({ row }) => <>
        <Button size="sm" color="info" onClick={() => setDetalleDepartamento(row.original)}>Ver Municipios</Button>{' '}
        <Button size="sm" color="warning" onClick={() => handleEdit(row.original)}>Editar</Button>{' '}
        <Button size="sm" color="danger" onClick={() => handleDelete(row.original.id, 'departamento')}>Eliminar</Button>
      </>
    }
  ], [handleDelete, handleEdit]);

  return (
    <div className="container mt-4">
      <h2>Mantenimiento de Geografía</h2>

      <div className="my-4">
        <h4>Países</h4>
        <Button color="success" onClick={() => toggleModal('pais')}>Añadir País</Button>
        <RenderTable data={paises} columns={paisColumns} />
      </div>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{editId ? 'Editar' : 'Nuevo'} {tipo}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Nombre</Label>
              <Input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            </FormGroup>
            {tipo === 'departamento' && (
              <FormGroup>
                <Label>País</Label>
                <Input type="select" value={form.id_pais} onChange={e => setForm({ ...form, id_pais: e.target.value })}>
                  <option value="">Seleccione</option>
                  {paises.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </Input>
              </FormGroup>
            )}
            {tipo === 'municipio' && (
              <FormGroup>
                <Label>Departamento</Label>
                <Input type="select" value={form.id_departamento} onChange={e => setForm({ ...form, id_departamento: e.target.value })}>
                  <option value="">Seleccione</option>
                  {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                </Input>
              </FormGroup>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>Guardar</Button>
          <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>

      {/* Detalle de País */}
      <Modal isOpen={!!detallePais} toggle={() => setDetallePais(null)} size="lg">
        <ModalHeader toggle={() => setDetallePais(null)}>Detalle de {detallePais?.nombre}</ModalHeader>
        <ModalBody>
          {detallePais && (
            <>
              <h5>Departamentos</h5>
              <Button size="sm" color="success" onClick={() => {
                setTipo('departamento');
                setForm({ nombre: '', id_pais: detallePais.id });
                setEditId(null);
                setModalOpen(true);
              }}>Añadir Departamento</Button>
              <RenderTable data={departamentos.filter(d => d.id_pais === detallePais.id)} columns={departamentoColumns} />
            </>
          )}
        </ModalBody>
      </Modal>

      {/* Detalle de Departamento */}
      <Modal isOpen={!!detalleDepartamento} toggle={() => setDetalleDepartamento(null)} size="lg">
        <ModalHeader toggle={() => setDetalleDepartamento(null)}>Municipios de {detalleDepartamento?.nombre}</ModalHeader>
        <ModalBody>
          {detalleDepartamento && (
            <>
              <h5>Municipios</h5>
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {municipios.filter(m => m.id_departamento === detalleDepartamento.id).map(m => (
                    <tr key={m.id}>
                      <td>{m.nombre}</td>
                      <td>
                        <Button size="sm" color="warning" onClick={() => handleEdit(m)}>Editar</Button>{' '}
                        <Button size="sm" color="danger" onClick={() => handleDelete(m.id, 'municipio')}>Eliminar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button size="sm" color="success" onClick={() => {
                setTipo('municipio');
                setForm({ nombre: '', id_departamento: detalleDepartamento.id });
                setEditId(null);
                setModalOpen(true);
              }}>Añadir Municipio</Button>
            </>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default Geografia;
