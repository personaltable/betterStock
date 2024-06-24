import React from 'react'
import SideBar from '../components/SideBar'
import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';

const SalesHistory = () => {



    const table = useReactTable({
        data: historyData,
        columns: filteredColumns,
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
                <div>SalesHistory</div>
            </div>
        </div>
    )
}

export default SalesHistory