import React, { useEffect, useState, useMemo } from 'react';
import SideBar from '../components/SideBar';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';


import { FaArrowDownShortWide, FaArrowUpWideShort } from 'react-icons/fa6';
import { IoClose } from "react-icons/io5";

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

    // Table _________________________________

    const [viewChanges, setViewChanges] = useState(false);
    const [productChanges, setProductChanges] = useState({});

    const getAlteredKeys = (original, modified) => {



        const alteredKeys = [];
        Object.keys(original).forEach(key => {
            if (key !== 'createdBy' && original[key] !== modified[key]) {
                alteredKeys.push(key);
            }
        });
        return alteredKeys;
    };

    const handleChangesClick = ({ original, modified }) => {
        setProductChanges({ original, modified });
        setViewChanges(true);
    };





    const [sorting, setSorting] = useState([]);

    const allColumns = useMemo(
        () => [
            {
                id: 'name',
                header: 'Ação',
                accessorKey: 'name',
                cell: (name) => (
                    <span className={`font-bold ${name.getValue() === 'Adicionar' ? 'text-green-700' : name.getValue() === 'Eliminar' ? 'text-red-700' : name.getValue() === 'Editar' ? 'text-blue-700' : ''}`}>
                        {name.getValue()}
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
                cell: (change) => {
                    const value = change.getValue();
                    if (!value) {
                        return <span></span>;
                    }
                    const { original, modified } = value;
                    const alteredKeys = getAlteredKeys(original, modified);
                    return (
                        <span onClick={() => handleChangesClick({ original, modified })} className="cursor-pointer text-blue-500">
                            {alteredKeys.join(', ')}
                        </span>
                    );
                },
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
                {viewChanges &&
                    <div className={`fixed inset-0 z-50 ${viewChanges ? 'flex' : 'hidden'} justify-center items-center`}>
                        <div className="fixed inset-0 bg-black opacity-50" onClick={() => setViewChanges(false)}></div>
                        <div className='relative flex flex-col w-[657px] min-h-[388px] gap-3 p-5 bg-white shadow-lg rounded-lg border border-gray-300 z-50 left-32'>
                            <div className="flex flex-row justify-between items-center">
                                <div className="font-bold">Alterações</div>
                                <IoClose onClick={() => { setViewChanges(false) }} className="flex self-end text-xl cursor-pointer" />
                            </div>
                            <ul>
                                {Object.keys(productChanges.original).map(key => (
                                    key !== 'createdBy' && productChanges.original[key] !== productChanges.modified[key] && (
                                        <li key={key}>
                                            <strong>{key}</strong>: {productChanges.original[key]} &rarr; {productChanges.modified[key]}
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default History;
