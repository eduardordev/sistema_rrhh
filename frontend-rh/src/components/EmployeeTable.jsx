import { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { Table, Spinner, Button } from 'reactstrap';
import api from '../services/api';

function EmployeeTable({ onEdit, onDelete }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/colaboradores')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo(() => [
    { Header: 'Nombre', accessor: 'nombre_completo' },
    { Header: 'Correo', accessor: 'correo' },
    { Header: 'Teléfono', accessor: 'telefono' },
    {
      Header: 'Empresas',
      accessor: row => row.Empresas.map(e => e.nombre_comercial).join(', ')
    },
    {
      Header: 'Acciones',
      Cell: ({ row }) => (
        <>
          <Button
            size="sm"
            color="warning"
            onClick={() => onEdit(row.original)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            color="danger"
            onClick={() => onDelete(row.original.id)}
          >
            Eliminar
          </Button>
        </>
      )
    }
  ], [onEdit, onDelete]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  if (loading) return <Spinner color="primary" />;

  return (
    <Table bordered hover {...getTableProps()}>
      <thead>
        {headerGroups.map(group => (
          <tr {...group.getHeaderGroupProps()}>
            {group.headers.map(col => (
              <th {...col.getHeaderProps()}>{col.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default EmployeeTable;
