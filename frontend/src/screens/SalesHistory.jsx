import React, { useEffect, useState, useMemo } from 'react';
import SideBar from '../components/SideBar';
import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel } from '@tanstack/react-table';
import axios from 'axios';
import { FaArrowDownShortWide, FaArrowUpWideShort } from 'react-icons/fa6';

const SalesHistory = () => {
    const [historyData, setHistoryData] = useState([]);
    const [sorting, setSorting] = useState([{ id: 'productQuantity', desc: false }]);

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

    // Group by reference and combine product and quantity into a single string
    const groupedData = useMemo(() => {
        const grouped = historyData.reduce((acc, sale) => {
            const { reference, user } = sale;
            const userName = user.name;
            const productQuantity = sale.information.map(info => `${info.product.name}: ${info.quantity}`).join(', ');
            const total = `${sale.information.reduce((sum, info) => sum + (info.product.price * info.quantity), 0)} €`;
            const profit = `${sale.information.reduce((sum, info) => {
                return sum + ((info.product.price - info.product.originalPrice) * info.quantity);
            }, 0).toFixed(2)} €`;

            if (!acc[reference]) {
                acc[reference] = { reference, user: userName, productQuantity, total, profit };
            } else {
                acc[reference].productQuantity += `, ${productQuantity}`;
            }
            return acc;
        }, {});

        return Object.values(grouped);
    }, [historyData]);

    const columns = useMemo(() => [
        {
            id: 'reference',
            header: 'Referencia',
            accessorKey: 'reference',
        },
        {
            id: 'productQuantity',
            header: 'Product - Quantity',
            accessorKey: 'productQuantity',
        },
        {
            id: 'user',
            header: 'Utilizador',
            accessorKey: 'user',
        },
        {
            id: 'total',
            header: 'Total',
            accessorKey: 'total',
        },
        {
            id: 'profit',
            header: 'Lucro',
            accessorKey: 'profit',
        },
    ], []);

    const table = useReactTable({
        data: groupedData,
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
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center cursor-pointer">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() ? (
                                                header.column.getIsSorted() === 'asc' ? (
                                                    <FaArrowUpWideShort className="ml-1" />
                                                ) : (
                                                    <FaArrowDownShortWide className="ml-1" />
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

export default SalesHistory;
