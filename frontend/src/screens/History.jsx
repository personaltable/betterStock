import React, { useEffect, useState, useMemo } from 'react';
import SideBar from '../components/SideBar';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';


import { FaArrowDownShortWide, FaArrowUpWideShort } from 'react-icons/fa6';

const History = () => {
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        const requestData = async () => {
            try {
                const res = await axios.get(`http://localhost:5555/api/actions`);
                setHistoryData(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        requestData();
    }, []);

    console.log(historyData);

    // Table configuration

    const changesOnProduct = () => {

    }


    const [sorting, setSorting] = useState([]);

    const allColumns = useMemo(
        () => [
            {
                id: 'name',
                header: 'Ação',
                accessorKey: 'name',
                cell: (info) => (
                    <span className={`font-bold ${info.getValue() === 'Adicionar' ? 'text-green-700' : info.getValue() === 'Eliminar' ? 'text-red-700' : info.getValue() === 'Editar' ? 'text-blue-700' : ''}`}>
                        {info.getValue()}
                    </span>
                ),
            },
            {
                id: 'product',
                header: 'Produto',
                accessorKey: 'product',
            },
            {
                id: 'changes',
                header: 'Alterações',
                accessorKey: 'changes',
            },
            {
                id: 'user',
                header: 'Utilizador',
                accessorKey: 'user.name',
            },
            {
                id: 'date',
                header: 'Data / Hora',
                accessorKey: 'date',
                cell: (info) =>
                    DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATETIME_MED),
            },
        ],
        []
    );

    const table = useReactTable({
        data: historyData,
        columns: allColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
    });

    return (
        <div className="flex flex-row">
            <SideBar />
            <div className="flex flex-col p-3 w-full relative">
                <table>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() ? (
                                                header.column.getIsSorted() === 'asc' ? (
                                                    <FaArrowDownShortWide className="ml-1" />
                                                ) : (
                                                    <FaArrowUpWideShort className="ml-1" />
                                                )
                                            ) : null}
                                        </div>
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

export default History;
