import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { setDeleteList, setDeleteConfirmation } from '../slices/productsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import './StockTable.css';
import axios from 'axios';

import { useEditProductMutation } from "../slices/productsApiSlice";

import { FaArrowDownShortWide, FaArrowUpWideShort } from 'react-icons/fa6';
import { FaPen } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";



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
    const [originalData, setOriginalData] = useState({});
    const [editedData, setEditedData] = useState({});

    const [showReStockList, setShowReStockList] = useState(false);

    const [changeProduct, { isLoading }] = useEditProductMutation();

    const handleEditClick = (row) => {
        setEditingRow(row.original._id);
        setEditedData(prevState => ({
            ...prevState,
            ...row.original,
            category: row.original.category.name
        }));
        setOriginalData(prevState => ({
            ...prevState,
            ...row.original,
            category: row.original.category.name
        }));
    };

    const handleInputChange = (e, field) => {
        setEditedData(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    };

    const { userInfo } = useSelector((state) => state.auth)

    const handleConfirmChanges = async () => {
        try {

            const hasChanges = Object.keys(editedData).some(
                key => editedData[key] !== originalData[key]
            );

            if (hasChanges) {
                const res = await changeProduct({ id: editedData._id, data: editedData });

                const sendData = {
                    name: "Editar",
                    product: editedData.name,
                    changes: {
                        original: originalData,
                        modified: editedData
                    },
                    user: userInfo.name
                };

                await axios.post(`http://localhost:5555/api/actions`, sendData);
            }

            setEditingRow(null);
        } catch (error) {
            console.error('Error confirming changes:', error);
        }
    };

    //getCategories
    const [categoriesList, setCategoriesList] = useState([]);
    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5555/api/products/categories');
                const list = (response.data.map((option) => (option.name)));
                setCategoriesList(list);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchData();
    }, []);


    const dropdownRef = useRef(null);
    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowCategories(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    //expand Row________________________________________

    const [expandedRows, setExpandedRows] = useState("")

    const handleExpandClick = (rowId) => {
        setExpandedRows(prevRowId => (prevRowId === rowId ? "" : rowId));
    };

    const allColumns = useMemo(
        () => [
            {
                id: 'expand',
                header: ({ table }) => (
                    <div></div>
                ),
                cell: ({ row }) => (
                    expandedRows === row.id ? (
                        <IoIosArrowDown onClick={() => handleExpandClick(row.id)} className='text-lg cursor-pointer' />
                    ) : (
                        <IoIosArrowForward onClick={() => handleExpandClick(row.id)} className='text-lg cursor-pointer' />
                    )
                ),
            },
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
                accessorKey: 'price',
                cell: (info) => {
                    const value = info.getValue();
                    return value !== undefined && value !== null ? `${value}€` : '';
                },
                filterFn: 'customFilterPrice',

            },
            {
                id: 'originalPrice',
                header: 'Preço Original',
                accessorKey: 'originalPrice',
                cell: (info) => {
                    const value = info.getValue();
                    return value !== undefined && value !== null ? `${value}€` : '';
                },
            },
            {
                id: 'creationDate',
                header: 'Data / Hora',
                accessorKey: 'creationDate',
                cell: (info) =>
                    DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATETIME_MED),
                filterFn: 'customFilterDate',
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
                filterFn: 'customFilterReStock',
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
                cell: ({ row }) => (
                    <span className={parseInt(row.original.stock) < parseInt(row.original.lowStock) ? 'text-red-500' : ''}>
                        {row.original.stock}
                    </span>
                ),
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
        [editingRow, selectedProducts, editedData, expandedRows]
    );

    //COLUMNS OPTIONS_______________________

    //Print
    const printStockTable = useSelector((state) => state.productsList.printStockTable);

    //Filter Columns

    const filteredColumns = useMemo(() => (

        allColumns.filter((column) => columnsList.includes(column.header) || column.id === 'select' || column.id === 'edit' || column.id === 'expand')
    ), [allColumns, columnsList]
    );

    //Sort Columns
    const initialSorting = [{ id: 'creationDate', desc: true }];
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

    //Filter By Price

    const searchPrice = useSelector((state) => state.productsList.searchPrice);

    const customFilterPrice = (row, columnId, filterValue) => {
        const cellValue = parseInt(row.getValue(columnId), 10);
        const priceInput = parseInt(filterValue.priceInput, 10);
        const priceSecondInput = parseInt(filterValue.priceSecondInput, 10);

        if (isNaN(priceInput)) {
            return true;
        }

        switch (filterValue.priceChoice) {
            case "Exato":
                return cellValue === priceInput;
            case "Entre":
                return cellValue >= priceInput && cellValue <= priceSecondInput;
            case "Acima":
                return cellValue > priceInput;
            case "Abaixo":
                return cellValue < priceInput;
            default:
                return true;
        }
    };

    //Filter By Date

    const searchDate = useSelector((state) => state.productsList.searchDate);

    const customFilterDate = (row, columnId, filterValue) => {
        const cellValue = DateTime.fromISO(row.getValue(columnId)).startOf('day').toJSDate();
        const { startDate, endDate } = filterValue;

        if (!startDate && !endDate) {
            return true;
        }

        const start = startDate ? DateTime.fromISO(startDate).startOf('day').toJSDate() : null;
        const end = endDate ? DateTime.fromISO(endDate).startOf('day').toJSDate() : null;

        if (start && !end) {
            return cellValue.getTime() === start.getTime();
        }

        if (!start && end) {
            return cellValue.getTime() <= end.getTime();
        }

        if (start && end) {
            return cellValue.getTime() >= start.getTime() && cellValue.getTime() <= end.getTime();
        }

        return false;
    };


    //Filter By Restock
    const reStockList = ["", "Necessária", "Não necessária", "Em progresso"]

    const searchReStock = useSelector((state) => state.productsList.searchReStock);

    const customFilterReStock = (row, columnId, filterValue) => {
        const reStockValue = row.original.reStock;

        if (!filterValue) {
            return true;
        }

        switch (filterValue) {
            case "":
                return reStockValue === "";
            case "Necessária":
                return reStockValue === "Necessária";
            case "Não necessária":
                return reStockValue === "Não necessária";
            case "Em progresso":
                return reStockValue === "Em progresso";
            default:
                return true; // Retorna true por padrão se nenhum caso corresponder
        }
    };


    //TABLE CONFIG___________________

    const table = useReactTable({
        data,
        columns: filteredColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0, //custom initial page index
                pageSize: 13, //custom default page size
            },
        },
        state: {
            sorting,
            rowSelection: selectedProducts,
            columnFilters: useMemo(
                () => [
                    { id: 'name', value: searchName },
                    { id: 'category', value: searchCategory },
                    { id: 'createdBy', value: searchUser },
                    { id: 'stock', value: searchStock },
                    { id: 'price', value: searchPrice },
                    { id: 'creationDate', value: searchDate },
                    { id: 'reStock', value: searchReStock },
                ],
                [searchName, searchCategory, searchUser, searchStock, searchPrice, searchDate, searchReStock]
            )
        },
        onSortingChange: setSorting,
        filterFns: {
            customFilterFunction,
            customFilterCategory,
            customFilterUser,
            customFilterStock,
            customFilterPrice,
            customFilterDate,
            customFilterReStock,
        },
    });

    return (
        <div className='flex flex-col justify-between h-full'>
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
                        <tr key={row.id} className={expandedRows.length != 0 && expandedRows === row.id ? 'h-20 border-b' : 'border-b'}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-2 py-2">
                                    {cell.column.id === 'information' && expandedRows === row.id && editingRow !== row.original._id ? (
                                        <textarea rows="3" cols="50" className='px-1 w-full overflow-y-auto whitespace-pre-wrap break-words'>
                                            {row.original.information}
                                        </textarea>
                                    ) : cell.column.id === 'name' && editingRow === row.original._id ? (
                                        <input
                                            className='w-full border border-gray-400 pl-1'
                                            value={editedData.name}
                                            onChange={(e) => handleInputChange(e, 'name')}
                                        />
                                    ) : cell.column.id === 'category' && editingRow === row.original._id ? (
                                        <div ref={dropdownRef}>
                                            <div onClick={() => { setShowCategories(!showCategories) }} className='bg-white cursor-pointer w-full border border-gray-400 px-1'>
                                                {editedData.category}
                                            </div>
                                            {showCategories &&
                                                <div className='absolute h-fit px-1 mt-0.5 bg-white border border-gray-500 z-50'>
                                                    {categoriesList.map((option) => (
                                                        <div onClick={() => {
                                                            setEditedData(prevState => ({
                                                                ...prevState,
                                                                category: option
                                                            }));
                                                        }} className='hover:bg-gray-100 cursor-pointer h-7' key={option}>{option}</div>
                                                    ))}
                                                </div>
                                            }
                                        </div>

                                    ) : cell.column.id === 'brand' && editingRow === row.original._id ? (
                                        <input
                                            className='w-full border border-gray-400 pl-1'
                                            value={editedData.brand}
                                            onChange={(e) => handleInputChange(e, 'brand')}
                                        />
                                    ) : cell.column.id === 'information' && editingRow === row.original._id ? (
                                        <textarea
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
                                    ) : cell.column.id === 'originalPrice' && editingRow === row.original._id ? (
                                        <input
                                            className='w-full border border-gray-400 pl-1'
                                            value={editedData.originalPrice}
                                            onChange={(e) => handleInputChange(e, 'originalPrice')}
                                        />
                                    ) : cell.column.id === 'reStock' && editingRow === row.original._id ? (
                                        <div ref={dropdownRef}>
                                            <div onClick={() => { setShowReStockList(!showReStockList) }} className='bg-white cursor-pointer w-full border border-gray-400 px-1 h-6'>
                                                {editedData.reStock}
                                            </div>
                                            {showReStockList &&
                                                <div className='absolute h-fit px-1 mt-0.5 bg-white border border-gray-500'>
                                                    {reStockList.map((option) => (
                                                        <div
                                                            onClick={() => {
                                                                setEditedData(prevState => ({
                                                                    ...prevState,
                                                                    reStock: option
                                                                }));
                                                            }}
                                                            className='hover:bg-gray-100 cursor-pointer h-7' key={option}>{option}</div>
                                                    ))}
                                                </div>
                                            }
                                        </div>
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
            <div className="pagination flex items-center space-x-2">
                <button
                    className="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        className="border rounded px-1 w-16"
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        style={{ width: '50px' }}
                    />
                </span>
                <select
                    className="border rounded px-1"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[13, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>

        </div>
    );
};

export default StockTable;
