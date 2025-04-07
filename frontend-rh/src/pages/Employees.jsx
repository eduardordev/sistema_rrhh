import { useState } from 'react';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeModal from '../components/EmployeeModal';
import { Button } from 'reactstrap';
import api from '../services/api';

function Employees() {
  const [refresh, setRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) setEditData(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este colaborador?')) {
      await api.delete(`/colaboradores/${id}`);
      setRefresh(!refresh);
    }
  };

  return (
    <div>
      <h2>Colaboradores</h2>
      <Button color="success" onClick={toggleModal}>Añadir</Button>
      <hr />
      <EmployeeTable
        key={refresh}
        onEdit={(data) => {
          setEditData(data);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />
      <EmployeeModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onSaved={() => setRefresh(!refresh)}
        initialData={editData}
      />
    </div>
  );
}

export default Employees;
