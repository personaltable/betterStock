import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel } from '@tanstack/react-table';
import axios from 'axios';

const SalesHistory = () => {
    const [historyData, setHistoryData] = useState([]);

    const initialSorting = [{ id: 'product', desc: true }];
    const [sorting, setSorting] = useState([initialSorting]);

    useEffect(() => {
        const requestData = async () => {
            try {
                const res = await axios.get(`http://localhost:5555/api/sales`);
                setHistoryData(res.data);
                console.log(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        requestData();
    }, []);


    const columns = [
        {
            id: 'reference',
            header: 'Referencia',
            accessorKey: 'reference',
        },
        {
            id: 'product',
            header: 'Product',
            accessorKey: 'information.product',
        },
        {
            id: 'quantity',
            header: 'Quantity',
            accessorKey: 'information.quantity',
        },
        {
            id: 'user',
            header: 'Utilizador',
            accessorKey: 'user',
            cell: (user) => (
                <span>{user.row.original.user.name}</span>
            ),
        },
    ];

    const table = useReactTable({
        data: historyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
    });

    return (
        <div className="flex flex-row">
            <SideBar />
            <div className="flex flex-col justify-between p-3 w-full relative">
                <table>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesHistory;
