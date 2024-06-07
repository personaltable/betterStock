import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteProductMutation } from "../slices/productsApiSlice";
import { setDeleteList, setDeleteConfirmation, setFormFeedback } from '../slices/productsSlice';

import { IoClose } from "react-icons/io5";

const FormDeleteProduct = ({ setViewDelete, viewDelete }) => {

    const dispatch = useDispatch();

    //Delete
    const deleteList = useSelector((state) => state.productsList.deleteList);
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();

    const handleDeleteProduct = async () => {
        try {
            const res = await deleteProduct({ deleteList });

            dispatch(setFormFeedback('Produto(s) eliminado(s) com sucesso'));
            dispatch(setDeleteConfirmation(true));


            if (res.error) {
                throw new Error(res.error.data?.message);
            }

            setViewDelete(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (

        <div className={`fixed inset-0 z-50 ${viewDelete ? 'flex' : 'hidden'} justify-center items-center`}>
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setViewDelete(false)}></div>
            <div className="relative flex flex-col justify-between w-[657px] min-h-[388px] gap-3 p-5 bg-white shadow-lg rounded-lg border border-gray-300 z-50 left-32">
                <div className='flex flex-col'>
                    <div className="flex flex-row justify-between items-center mb-3">
                        <div className="font-bold">Eliminar Produto</div>
                        <IoClose onClick={() => { setViewDelete(false) }} className="flex self-end text-xl cursor-pointer" />
                    </div>


                    {deleteList.length != 0 ?
                        (
                            <div className="flex flex-col gap-2">
                                <div className='mb-2'>Pretende eliminar {deleteList.length !== 1 ? 'estes produtos' : 'este produto'}:</div>
                                <div className='flex flex-col gap-1 h-52 overflow-y-auto'>
                                    {deleteList.map((option) => (
                                        <div key={option._id}>- {option.name}</div>
                                    ))}
                                </div>
                            </div>
                        )
                        :
                        (
                            <div className="flex flex-col gap-2">
                                <div className='mb-2 text-red-500'>AVISO: Não selecionou nenhum produto para eliminar</div>
                            </div>
                        )}


                </div>
                <button onClick={() => { handleDeleteProduct() }} className='flex justify-center items-center bg-black text-white w-48 p-2 py-1 rounded'>Eliminar</button>
            </div>
        </div>
    )
}

export default FormDeleteProduct