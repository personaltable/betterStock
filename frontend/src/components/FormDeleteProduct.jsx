import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteProductMutation } from "../slices/productsApiSlice";
import { setDeleteList, setDeleteConfirmation, setFormFeedback } from '../slices/productsSlice';
import axios from "axios";

import { IoClose } from "react-icons/io5";

const FormDeleteProduct = ({ setViewDelete, viewDelete }) => {

    const dispatch = useDispatch();

    //Delete
    const deleteList = useSelector((state) => state.productsList.deleteList);
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();

    console.log(deleteList)

    const handleDeleteProduct = async () => {
        try {
            const res = await deleteProduct({ deleteList });

            if (res.error) {
                throw new Error(res.error.data?.message);
            }

            const deleteActions = deleteList.map(async (option) => {
                const sendData = {
                    name: "Eliminar",
                    product: option.name,
                    user: option.createdBy.name
                };
                console.log('sendData:', sendData);

                try {
                    const response = await axios.post(`http://localhost:5555/api/actions`, sendData);
                    console.log('Response:', response.data);
                } catch (error) {
                    console.error('Error in POST request:', error.response?.data || error.message);
                    throw error;
                }
            });

            dispatch(setFormFeedback('Produto(s) eliminado(s) com sucesso'));
            dispatch(setDeleteConfirmation(true));
            setViewDelete(false);

            await Promise.all(deleteActions);


        } catch (error) {
            console.log('Error in handleDeleteProduct:', error.message);
        }
    };

    return (

        <div className={`fixed inset-0 z-50 ${viewDelete ? 'flex' : 'hidden'} justify-center items-center`}>
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setViewDelete(false)}></div>
            <div className="relative flex flex-col justify-between w-[657px] min-h-[388px] gap-3 p-5 bg-white shadow-lg rounded-lg border border-gray-300 z-50 left-32">
                <div className='flex flex-col'>
                    <div className="flex flex-row justify-between items-center mb-3">
                        <div className="text-xl">Confirmar Eliminação</div>
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
                <div className="flex justify-end gap-3">
                    <button onClick={() => setViewDelete(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                    <button onClick={() => { handleDeleteProduct() }} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
                </div>
            </div>
        </div>
    )
}

export default FormDeleteProduct