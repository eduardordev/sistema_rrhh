import { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { Table, Spinner, Button } from 'reactstrap';
import api from '../services/api';

function CompanyTable({ onEdit, onDelete }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/empresas')
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const columns = useMemo(() => [
        { Header: 'Nombre Comercial', accessor: 'nombre_comercial' },
        { Header: 'Razón Social', accessor: 'razon_social' },
        { Header: 'Correo', accessor: 'correo' },
        {
            Header: 'Municipio',
            accessor: row => row.Municipio?.nombre || ''
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

    if (loading) return <Spinner color="secondary" />;

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

export default CompanyTable;
