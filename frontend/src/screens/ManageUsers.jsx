import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import axios from 'axios';

import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const ManageUsers = () => {
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        const fetchUsersList = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/users`);
                setUsersList(response.data.users);
                console.log(response.data.users)
            } catch (error) {
                console.error('Erro ao buscar a lista de utilizadores:', error);
            }
        };

        fetchUsersList();
    }, []);

    const [viewUpdate, setViewUpdate] = useState(false)
    const [userUpdateInfo, setUserUpdateInfo] = useState({})

    const handleUpdateForm = (id, name) => {
        setViewUpdate(true);
        setUserUpdateInfo({ id, name })
    }

    const [viewDelete, setViewDelete] = useState(false)
    const [userDeleteInfo, setUserDeleteInfo] = useState({})

    const handleDeleteConfirmation = (id, name) => {
        setUserDeleteInfo({ id, name });
        setViewDelete(true);
    }

    const handleDeleteUser = async (id) => {
        console.log(id);
        try {
            await axios.delete(`http://localhost:5555/api/users/${id}`);
            setUsersList(usersList.filter(user => user._id !== id));
            console.log('Utilizador eliminado com sucesso');
            setViewDelete(false);
        } catch (error) {
            console.error('Erro ao eliminar utilizador:', error);
        }
    };

    return (
        <div className="flex flex-row">
            <SideBar />
            <div className="flex flex-col gap-3 p-6 w-full relative">
                <div className='text-2xl'>Utilizadores</div>
                <div>
                    {usersList.length &&
                        <div className=''>
                            {usersList.map(user => (
                                <div key={user._id} className='flex flex-row justify-between border-b-2 border-gray-300 py-4'>
                                    <div className='flex flex-col'>
                                        <div>Nome: {user.name}</div>
                                        <div>Email: {user.email}</div>
                                        <div>Cargo: {user.role}</div>
                                    </div>
                                    <div className='flex flex-row gap-7 items-center'>
                                        <div onClick={() => { handleUpdateForm(user._id, user.name) }} className='flex flex-row items-center justify-between h-fit w-24 rounded px-2 py-1 border border-gray-500 bg-gray-100 text-gray-500 cursor-pointer hover:shadow-inner'>
                                            <div>Editar</div>
                                            <FaPen />
                                        </div>
                                        <div onClick={() => { handleDeleteConfirmation(user._id, user.name) }} className='flex flex-row items-center justify-between h-fit w-24 rounded px-2 py-1 border border-red-500 bg-red-100 text-red-500 cursor-pointer'>
                                            <div>Eliminar</div>
                                            <MdDelete />
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>
                    }

                    <div className={`fixed inset-0 z-50 ${viewUpdate ? 'flex' : 'hidden'} justify-center items-center`}>
                        <div className="fixed inset-0 bg-black opacity-50" onClick={() => setViewUpdate(false)}></div>
                        <div className="relative flex flex-col justify-between w-[657px] min-h-[388px] gap-3 p-5 bg-white shadow-lg rounded-lg border border-gray-300 z-50 left-32">
                            <div>
                                <div className="flex flex-row justify-between items-center mb-4">
                                    <div className="text-xl">Editar utilizador {userUpdateInfo.name}</div>
                                    <IoClose onClick={() => { setViewUpdate(false) }} className="flex self-end text-xl cursor-pointer" />
                                </div>


                                <div>Formulário</div>



                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setViewUpdate(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                                <button onClick={() => handleDeleteUser(userDeleteInfo.id)} className="px-4 py-2 bg-green-600 text-white rounded">Submeter</button>
                            </div>
                        </div>
                    </div>

                    <div className={`fixed inset-0 z-50 ${viewDelete ? 'flex' : 'hidden'} justify-center items-center`}>
                        <div className="fixed inset-0 bg-black opacity-50" onClick={() => setViewDelete(false)}></div>
                        <div className="relative flex flex-col justify-between w-[657px] min-h-[388px] gap-3 p-5 bg-white shadow-lg rounded-lg border border-gray-300 z-50 left-32">
                            <div>
                                <div className="flex flex-row justify-between items-center mb-4">
                                    <div className="text-xl">Confirmar Eliminação</div>
                                    <IoClose onClick={() => { setViewDelete(false) }} className="flex self-end text-xl cursor-pointer" />
                                </div>
                                <div>Tem a certeza que deseja eliminar {userDeleteInfo.name}?</div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setViewDelete(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                                <button onClick={() => handleDeleteUser(userDeleteInfo.id)} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ManageUsers;
