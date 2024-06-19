import React, { useEffect, useState, useMemo, useRef } from 'react';
import SideBar from '../components/SideBar';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import ButtonFilter from '../components/buttons/ButtonFilter';
import Dropdown from '../components/Dropdown/Dropdown';
import DropdownSearch from '../components/Dropdown/DropdownSearch';
import DropdownCheck from '../components/Dropdown/DropdownCheck';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactToPrint from 'react-to-print'


import { FaMagnifyingGlass, FaArrowDownShortWide, FaArrowUpWideShort, FaFilter, FaPrint, FaWrench } from 'react-icons/fa6';
import { IoClose, IoReloadCircle } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

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
                filterFn: 'customFilterFunction',
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
                filterFn: 'customFilterUser',
            },
            {
                id: 'date',
                header: 'Data / Hora',
                accessorKey: 'date',
                cell: (info) =>
                    DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATETIME_MED),
                filterFn: 'customFilterDate',
            },
        ],
        []
    );


    //Columns
    const [columnsList, setColumnsList] = useState([
        "Ação",
        "Produto",
        "Alterações",
        "Utilizador",
        "Data / Hora",
    ]);

    const columnsAllOptions = [
        "Ação",
        "Produto",
        "Alterações",
        "Utilizador",
        "Data / Hora",
    ];

    const handleColumnSelect = (options) => {
        setColumnsList(options);
    };

    const filteredColumns = useMemo(
        () => allColumns.filter((column) => columnsList.includes(column.header) || column.id === 'select' || column.id === 'edit' || column.id === 'expand'),
        [allColumns, columnsList]
    );

    //Sort Columns
    const initialSorting = [{ id: 'date', desc: true }];
    const [sorting, setSorting] = useState(initialSorting);


    //Filters

    //Reset Filters
    const handleResetFilterChange = () => {
        setSearchUser('');
        setSearchAction('')
        setSearchName('')
        setStartDate(null);
        setEndDate(null);
    };

    //Filter By Name
    const [searchName, setSearchName] = useState('')

    const customFilterFunction = (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId);
        return cellValue.toLowerCase().startsWith(filterValue.toLowerCase());
    };

    //Filter By Action
    const [searchAction, setSearchAction] = useState('');
    const actionsList = ['editar', 'adicionar', 'eliminar'];

    //Filter By User
    const [searchUser, setSearchUser] = useState('');

    const [userList, setUserList] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:5555/api/users`);
            const usersNames = response.data.users.map(user => user.name);
            setUserList(usersNames);
        }
        fetchData();
    }, [])

    const customFilterUser = (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId);
        if (!filterValue) {
            return true;
        }
        return cellValue.toLowerCase() === filterValue.toLowerCase();
    };

    //Filter By Data

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const customFilterDate = (row, columnId, filterValue) => {
        const cellValue = DateTime.fromISO(row.getValue(columnId));
        const [start, end] = filterValue;
        if (start && end) {
            return cellValue >= DateTime.fromJSDate(start) && cellValue <= DateTime.fromJSDate(end);
        } else if (start) {
            return cellValue >= DateTime.fromJSDate(start);
        } else if (end) {
            return cellValue <= DateTime.fromJSDate(end);
        }
        return true;
    }




    //Table_________________________

    const table = useReactTable({
        data: historyData,
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
            columnFilters: useMemo(
                () => [
                    { id: 'name', value: searchAction },
                    { id: 'product', value: searchName },
                    { id: 'user', value: searchUser },
                    { id: 'date', value: [startDate, endDate] }
                ],
                [searchAction, searchName, searchUser, startDate, endDate]
            )
        },
        onSortingChange: setSorting,
        filterFns: {
            customFilterFunction,
            customFilterUser,
            customFilterDate
        }
    });

    const componentRef = useRef();

    return (
        <div className="flex flex-row">
            <SideBar />
            <div className="flex flex-col justify-between p-3 w-full relative">
                <div>
                    <div className='flex flex-row gap-2 items-center justify-end'>

                        <IoReloadCircle
                            onClick={handleResetFilterChange}
                            className="text-3xl text-basepurple-500 hover:text-basepurple-600 transition duration-300 ease-in-out cursor-pointer"
                        />

                        <div className="flex flex-row relative items-center">
                            <FaMagnifyingGlass className="text-gray-400 left-2 absolute" />
                            <input
                                type="text"
                                onChange={(e) => { setSearchName(e.target.value) }}
                                value={searchName}
                                className="w-36 h-8 pl-7 rounded-md border border-basepurple-500 focus:outline-basepurple-600"
                                placeholder="Pesquisar..."
                            />
                        </div>

                        <Dropdown
                            trigger={
                                <ButtonFilter>
                                    <div>Filtros</div>
                                    <FaFilter />
                                </ButtonFilter>}
                            classNameContainer="w-fit flex flex-col gap-2 p-2 mt-2"
                        >


                            <div className="flex flex-row items-center justify-between" >
                                <div className="flex flex-row ">
                                    <div className="w-20">Ação:</div>
                                    <Dropdown
                                        trigger={
                                            <div className="flex cursor-pointer w-52 h-[25px] flex-row gap-1 px-1 justify-between items-center border border-gray-500">
                                                <div className="">{searchAction}</div>
                                                <IoIosArrowDown className="text-xs" />
                                            </div>
                                        }
                                        classNameContainer='w-52 mt-1'
                                    >
                                        {actionsList.map((option) => (
                                            <div onClick={() => { setSearchAction(option) }} className=" flex flex-col justify-center w-52 p-1 px-2 h-[30px] hover:bg-gray-100 cursor-pointer" key={option}>{option}</div>
                                        ))}
                                    </Dropdown>

                                </div>
                                <IoClose onClick={() => { [setSearchAction('')] }} className="text-xl cursor-pointer ml-2" />
                            </div>

                            <DropdownSearch
                                label={"Utilizador:"}
                                options={userList}
                                searchValue={searchUser}
                                setSearchValue={setSearchUser}
                                className={'z-30'}
                                placeholder={'Pesquisar...'}
                                more={<IoClose onClick={() => { setSearchUser('') }} className="text-xl cursor-pointer" />}
                            ></DropdownSearch>

                            <div className="flex flex-row items-start">
                                <label className="w-20">Data:</label>
                                <div className="flex flex-row items-center">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        placeholderText="Data inicial"
                                        className="border border-gray-500 rounded pl-1 w-24"
                                    />
                                    <span className="mx-1">-</span>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        placeholderText="Data final"
                                        className="border border-gray-500 rounded pl-1 w-24"
                                    />
                                    <IoClose onClick={() => { setStartDate(null); setEndDate(null); }} className="text-xl cursor-pointer ml-2" />
                                </div>
                            </div>
                        </Dropdown>

                        <DropdownCheck
                            className="w-44"
                            options={columnsAllOptions}
                            selectedOptions={columnsList}
                            onOptionSelect={handleColumnSelect}
                        >
                            <ButtonFilter>
                                <div>Colunas</div>
                                <FaWrench />
                            </ButtonFilter>
                        </DropdownCheck>
                        <ReactToPrint
                            trigger={() =>
                                <ButtonFilter>
                                    <div>Imprimir</div>
                                    <FaPrint />
                                </ButtonFilter>
                            }
                            content={() => componentRef.current}
                            documentTitle='new document'
                            pageStyle='print'
                        />
                    </div>


                    <div ref={componentRef} className="flex flex-col">
                        <table >
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
                    {viewChanges &&
                        <div className={`fixed inset-0 z-50 ${viewChanges ? 'flex' : 'hidden'} justify-center items-center`}>
                            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setViewChanges(false)}></div>
                            <div className='relative flex flex-col w-[657px] min-h-[388px] gap-3 p-5 bg-white shadow-lg rounded-lg border border-gray-300 z-50 left-32'>
                                <div className="flex flex-row justify-between items-center">
                                    <div className="font-bold">Alterações</div>
                                    <IoClose onClick={() => { setViewChanges(false) }} className="flex self-end text-xl cursor-pointer" />
                                </div>
                                <ul className='flex flex-col gap-2'>
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
        </div>
    );
};

export default History;
