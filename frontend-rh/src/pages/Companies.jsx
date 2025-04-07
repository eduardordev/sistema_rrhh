import { useState } from 'react';
import CompanyTable from '../components/CompanyTable';
import CompanyModal from '../components/CompanyModal';
import { Button } from 'reactstrap';
import api from '../services/api';

function Companies() {
  const [refresh, setRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setEditData(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      await api.delete(`/empresas/${id}`);
      setRefresh(!refresh);
    }
  };

  return (
    <div>
      <h2>Empresas</h2>
      <Button color="success" onClick={toggleModal}>Añadir</Button>
      <hr />
      <CompanyTable
        key={refresh}
        onEdit={(data) => {
          setEditData(data);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />
      <CompanyModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onSaved={() => setRefresh(!refresh)}
        initialData={editData}
      />
    </div>
  );
}

export default Companies;
