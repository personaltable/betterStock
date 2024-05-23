import React, { useState, useEffect } from 'react';
import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { setProducts, setStatus, setError } from '../slices/productsSlice';

const StockTable = () => {
    const productsState = useSelector((state) => state.productsList.products);

    const data = React.useMemo(() => productsState, [productsState]);

    const columns = React.useMemo(
        () => [
            {
                id: 'name',
                header: 'Nome',
                accessorKey: 'name',
            },
            {
                id: 'category',
                header: 'Categoria',
                accessorKey: 'category.name',
            },
            {
                id: 'brand',
                header: 'Marca',
                accessorKey: 'brand',
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            {productsState.map((produto, index) => (
                <div key={index}>{produto.name}</div>
            ))}

            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockTable;
