import React, { useState, useMemo, useEffect } from 'react';
import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { setProducts, setStatus, setError, resetFilters, setColumns, setSearchName } from '../slices/productsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { FaArrowDownShortWide, FaArrowUpWideShort } from 'react-icons/fa6';
import './StockTable.css';

const StockTable = () => {
    const dispatch = useDispatch();

    //TABLE DATA / COLUMNS____________________________

    const productsList = useSelector((state) => state.productsList.products);
    const columnsList = useSelector((state) => state.productsList.columns);
    const data = useMemo(() => productsList, [productsList]);

    const allColumns = useMemo(
        () => [
            {
                id: 'name',
                header: 'Nome',
                accessorKey: 'name',
                filterFn: 'customFilterFunction',
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
            {
                id: 'information',
                header: 'Informação',
                accessorKey: 'information',
            },
            {
                id: 'price',
                header: 'Preço',
                accessorFn: (row) => `${row.price}€`,
            },
            {
                id: 'creationDate',
                header: 'Data / Hora',
                accessorKey: 'creationDate',
                cell: (info) =>
                    DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATETIME_MED),
            },
            {
                id: 'createdBy',
                header: 'Criador',
                accessorKey: 'createdBy.name',
            },
            {
                id: 'reStock',
                header: 'Reposição',
                accessorKey: 'reStock',
            },
            {
                id: 'lowStock',
                header: 'Stock Baixo',
                accessorKey: 'lowStock',
            },
            {
                id: 'stock',
                header: 'Stock',
                accessorKey: 'stock',
            },
        ],
        []
    );

    //COLUMNS OPTIONS_______________________

    //Filter Columns
    const filteredColumns = useMemo(
        () => allColumns.filter((column) => columnsList.includes(column.header)),
        [allColumns, columnsList]
    );

    //Sort Columns
    const initialSorting = [{ id: 'creationDate', desc: false, },];
    const [sorting, setSorting] = useState(initialSorting);

    //FILTERS OPTIONS_______________________

    //Reset Filters
    const isResettingFilters = useSelector((state) => state.productsList.filters);
    useEffect(() => {
        if (isResettingFilters) {
            dispatch(setSearchName(''));
            dispatch(resetFilters(false));
        }
    }, [isResettingFilters]);

    //Filter By Name
    const searchName = useSelector((state) => state.productsList.searchName);
    console.log(searchName)

    const customFilterFunction = (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId);
        return cellValue.toLowerCase().startsWith(filterValue.toLowerCase());
    };


    //TABLE CONFIG___________________

    const table = useReactTable({
        data,
        columns: filteredColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters: useMemo(() => [{ id: 'name', value: searchName }], [searchName]),
        },
        onSortingChange: setSorting,
        filterFns: {
            customFilterFunction,
        },
    });

    return (
        <div>
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
                                        {header.column.getIsSorted() === 'asc' ? (
                                            <FaArrowDownShortWide className="ml-1" />
                                        ) : header.column.getIsSorted() === 'desc' ? (
                                            <FaArrowUpWideShort className="ml-1" />
                                        ) : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-b">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-2">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
