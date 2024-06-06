import React from 'react'
import { useSelector } from 'react-redux'
import { useDeleteProductMutation } from "../slices/productsApiSlice";

import { useForm } from 'react-hook-form';
import { IoClose } from "react-icons/io5";

const FormDeleteProduct = ({ setViewDelete, viewDelete }) => {

    //Delete
    const deleteList = useSelector((state) => state.productsList.deleteList);
    console.log(deleteList)

    return (

        <div className={`fixed inset-0 z-50 ${viewDelete ? 'flex' : 'hidden'} justify-center items-center`}>
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setViewDelete(false)}></div>
            <div className="relative flex flex-col justify-between w-[657px] h-[388px] gap-3 p-5 bg-white shadow-lg rounded-lg border border-gray-300 z-50 left-32">
                <div className='flex flex-col'>
                    <div className="flex flex-row justify-between items-center mb-3">
                        <div className="font-bold">Eliminar Produto</div>
                        <IoClose onClick={() => { setViewDelete(false) }} className="flex self-end text-xl cursor-pointer" />
                    </div>
                    <div className="flex flex-col gap-2">

                        <div className='mb-2'>Pretende eliminar {deleteList.length !== 1 ? 'estes produtos' : 'este produto'}:</div>
                        <div className='flex flex-col gap-1'>
                            {deleteList.map((option) => (
                                <div>{option.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
                <button className='flex justify-center items-center bg-black text-white w-48 p-2 py-1 rounded'>Eliminar</button>
            </div>
        </div>
    )
}

export default FormDeleteProduct