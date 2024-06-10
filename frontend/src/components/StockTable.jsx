import React, { useState, useMemo, useEffect } from 'react';
import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { setDeleteList, setDeleteConfirmation } from '../slices/productsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import './StockTable.css';

import { useEditProductMutation } from "../slices/productsApiSlice";

import { FaArrowDownShortWide, FaArrowUpWideShort } from 'react-icons/fa6';
import { FaPen } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";




const StockTable = () => {
    const dispatch = useDispatch();


    //TABLE DATA / COLUMNS____________________________

    const productsList = useSelector((state) => state.productsList.products);
    const columnsList = useSelector((state) => state.productsList.columns);
    const deleteConfirmation = useSelector((state) => state.productsList.deleteConfirmation);
    const data = useMemo(() => productsList, [productsList]);


    //Delete____________________________________________
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        if (deleteConfirmation) {
            setSelectedProducts([]);
            dispatch(setDeleteConfirmation(false));
        }
    }, [deleteConfirmation, dispatch]);

    useEffect(() => {
        dispatch(setDeleteList(selectedProducts));
    }), [selectedProducts, dispatch]


    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        handleAllRowSelectionChange();
    }, [isChecked])

    const handleAllRowSelectionChange = () => {
        setSelectedProducts(isChecked ? [...productsList] : []);
    };


    const handleRowSelectionChange = (row, isSelected) => {
        const selectedProduct = row.original;
        if (isSelected) {
            setSelectedProducts(prevSelectedProducts => [...prevSelectedProducts, selectedProduct]);
        } else {
            setSelectedProducts(prevSelectedProducts =>
                prevSelectedProducts.filter(product => product !== selectedProduct)
            );
        }
    };

    //Edit____________________________________________

    const [editingRow, setEditingRow] = useState(null);
    const [editedData, setEditedData] = useState({
        name: '',
        category: '',
        brand: '',
        information: '',
        // adicione outras propriedades aqui, se necessário
    });


    const [changeProduct, { isLoading }] = useEditProductMutation();

    console.log(editedData)

    const handleEditClick = (row) => {
        setEditingRow(row.original._id);
        setEditedData(prevState => ({
            ...prevState,
            ...row.original,
            category: row.original.category.name // Guarda apenas o nome da categoria
        }));
    };


    const handleInputChange = (e, field) => {
        setEditedData(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };


    const handleConfirmChanges = async () => {

        const res = await changeProduct({ id: editedData._id, data: editedData })
        setEditingRow(null)
    }

    const allColumns = useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <input
                        className='h-3.5 w-3.5'
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                    />
                ),
                cell: ({ row }) => (
                    <input
                        className='h-3.5 w-3.5'
                        type="checkbox"
                        checked={selectedProducts.includes(row.original)}
                        onChange={(e) => handleRowSelectionChange(row, e.target.checked)}
                    />
                ),
            },
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
                filterFn: 'customFilterCategory',
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
                accessorFn: (row) => { return row.price !== null ? `${row.price}€` : '' }
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
                filterFn: 'customFilterUser',
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
                filterFn: 'customFilterStock',
            },
            {
                id: 'edit',
                header: ({ table }) => (
                    <FaPen />
                ),
                cell: ({ row }) => (
                    <div>
                        {editingRow === row.original._id ?
                            (<FaCheck
                                className='cursor-pointer'
                                onClick={() => { handleConfirmChanges() }}
                            />)
                            :
                            (<FaPen
                                className='cursor-pointer'
                                onClick={() => handleEditClick(row)}
                            />)
                        }
                    </div>
                ),
            },
        ],
        [editingRow, selectedProducts, editedData]
    );

    //COLUMNS OPTIONS_______________________

    //Filter Columns
    const filteredColumns = useMemo(
        () => allColumns.filter((column) => columnsList.includes(column.header) || column.id === 'select' || column.id === 'edit'),
        [allColumns, columnsList]
    );


    //Sort Columns
    const initialSorting = [{ id: 'creationDate', desc: false, },];
    const [sorting, setSorting] = useState(initialSorting);




    //FILTERS OPTIONS_____________________________________________________________

    //Filter By Name
    const searchName = useSelector((state) => state.productsList.searchName);

    const customFilterFunction = (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId);
        return cellValue.toLowerCase().startsWith(filterValue.toLowerCase());
    };

    //Filter by Stock

    const searchStock = useSelector((state) => state.productsList.searchStock);

    const customFilterStock = (row, columnId, filterValue) => {
        const cellValue = parseInt(row.getValue(columnId), 10);
        const stockInput = parseInt(filterValue.stockInput, 10);
        const stockSecondInput = parseInt(filterValue.stockSecondInput, 10);

        if (!stockInput) {
            return true;
        }

        switch (filterValue.stockChoice) {

            case "Exato":
                return cellValue === stockInput;
            case "Entre":
                return cellValue >= stockInput && cellValue <= stockSecondInput;
            case "Acima":
                return cellValue > stockInput;
            case "Abaixo":
                return cellValue < stockInput;
            default:
                return true;
        }
    };

    //Filter By Category
    const searchCategory = useSelector((state) => state.productsList.searchCategory);

    const customFilterCategory = (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId);
        return cellValue.toLowerCase().includes(filterValue.toLowerCase());
    };

    //Filter By User
    const searchUser = useSelector((state) => state.productsList.searchUser);

    const customFilterUser = (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId);
        if (!filterValue) {
            return true;
        }
        return cellValue.toLowerCase() === filterValue.toLowerCase();
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
            rowSelection: selectedProducts,
            columnFilters: useMemo(
                () => [
                    { id: 'name', value: searchName },
                    { id: 'category', value: searchCategory },
                    { id: 'createdBy', value: searchUser },
                    { id: 'stock', value: searchStock },
                ],
                [searchName, searchCategory, searchUser, searchStock]
            )
        },
        onSortingChange: setSorting,
        filterFns: {
            customFilterFunction,
            customFilterCategory,
            customFilterUser,
            customFilterStock
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
                                <td key={cell.id} className="px-3 py-2">
                                    {cell.column.id === 'name' && editingRow === row.original._id ? (
                                        <input
                                            className='w-full border border-gray-400 pl-1'
                                            value={editedData.name}
                                            onChange={(e) => handleInputChange(e, 'name')}
                                        />
                                    ) : cell.column.id === 'category' && editingRow === row.original._id ? (
                                        <input
                                            className='w-full border border-gray-400 pl-1'
                                            value={editedData.category}
                                            onChange={(e) => handleInputChange(e, 'category')}
                                        />
                                    ) : cell.column.id === 'brand' && editingRow === row.original._id ? (
                                        <input
                                            className='w-full border border-gray-400 pl-1'
                                            value={editedData.brand}
                                            onChange={(e) => handleInputChange(e, 'brand')}
                                        />
                                    ) : cell.column.id === 'information' && editingRow === row.original._id ? (
                                        <input
                                            className='w-full border border-gray-400 pl-1'
                                            value={editedData.information}
                                            onChange={(e) => handleInputChange(e, 'information')}
                                        />
                                    ) : cell.column.id === 'price' && editingRow === row.original._id ? (
                                        <input
                                            className='w-full border border-gray-400 pl-1'
                                            value={editedData.price}
                                            onChange={(e) => handleInputChange(e, 'price')}
                                        />
                                    ) : cell.column.id === 'reStock' && editingRow === row.original._id ? (
                                        <input
                                            className='w-full border border-gray-400 pl-1'
                                            value={editedData.reStock}
                                            onChange={(e) => handleInputChange(e, 'reStock')}
                                        />
                                    ) : cell.column.id === 'lowStock' && editingRow === row.original._id ? (
                                        <input
                                            className='w-full border border-gray-400 pl-1'
                                            value={editedData.lowStock}
                                            onChange={(e) => handleInputChange(e, 'lowStock')}
                                        />
                                    ) : cell.column.id === 'stock' && editingRow === row.original._id ? (
                                        <input
                                            className='w-full border border-gray-400 pl-1'
                                            value={editedData.stock}
                                            onChange={(e) => handleInputChange(e, 'stock')}
                                        />
                                    ) : (
                                        flexRender(cell.column.columnDef.cell, cell.getContext())
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
