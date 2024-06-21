import React, { useEffect, useState, useRef } from 'react';
import SideBar from '../components/SideBar';
import axios from 'axios';

import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";


const ManageUsers = () => {
    const [usersList, setUsersList] = useState([]);

    //SEARCH

    const [searchValue, setSearchValue] = useState('');


    //UPDATE

    const [viewUpdate, setViewUpdate] = useState(false)
    const [userUpdateInfo, setUserUpdateInfo] = useState({})
    const [viewUserRoles, setViewUserRoles] = useState(false)

    const roleList = ['admin', 'data analyst', 'stock manager', 'employee']


    const handleUpdateForm = (user) => {
        setUserUpdateInfo(user)
        setViewUpdate(true);
    }

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUserUpdateInfo({ ...userUpdateInfo, [name]: value });
    };

    const handleUpdateSubmit = async (id) => {
        try {
            await axios.put(`http://localhost:5555/api/users/${id}`, userUpdateInfo);
            setViewUpdate(false);
        } catch (error) {
            console.error('Erro ao atualizar utilizador:', error);
        }

    }

    const handleRoleChange = (role) => {
        setUserUpdateInfo({ ...userUpdateInfo, role });
        setViewUserRoles(false);
    }

    //__ __ __

    const dropdownRef = useRef(null);
    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setViewUserRoles(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    //DELETE

    const [viewDelete, setViewDelete] = useState(false)
    const [userDeleteInfo, setUserDeleteInfo] = useState({})

    const handleDeleteConfirmation = (user) => {
        setUserDeleteInfo(user);
        setViewDelete(true);
    }

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5555/api/users/${id}`);
            setViewDelete(false);
        } catch (error) {
            console.error('Erro ao eliminar utilizador:', error);
        }
    };

    useEffect(() => {
        const fetchUsersList = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/users`);
                if (searchValue) {
                    setUsersList(response.data.users.filter(user =>
                        user.name.toLowerCase().startsWith(searchValue.toLowerCase())
                    ));
                } else { setUsersList(response.data.users); }

            } catch (error) {
                console.error('Erro ao buscar a lista de utilizadores:', error);
            }
        };

        fetchUsersList();
    }, [viewUpdate, viewDelete, searchValue]);



    return (
        <div className="flex flex-row">
            <SideBar />
            <div className="flex flex-col gap-3 p-6 w-full relative">
                <div className='flex flex-row gap-10'>
                    <div className='text-2xl'>Utilizadores</div>
                    <div className='flex flex-row items-center relative '>
                        <input
                            className='border border-gray-500 px-2 pr-7 h-7'
                            type='text'
                            value={searchValue}
                            onChange={(e) => { setSearchValue(e.target.value) }}
                            name='search'
                        />
                        <FaMagnifyingGlass className='right-2 absolute' />
                    </div>

                </div>
                <div>
                    {usersList.length > 0 ? (
                        <div>
                            {usersList.map(user => (
                                <div key={user._id} className='flex flex-row justify-between border-b-2 border-gray-300 py-4'>
                                    <div className='flex flex-col'>
                                        <div>Nome: {user.name}</div>
                                        <div>Email: {user.email}</div>
                                        <div>Cargo: {user.role}</div>
                                    </div>
                                    <div className='flex flex-row gap-7 items-center'>
                                        <div onClick={() => { handleUpdateForm(user) }} className='flex flex-row items-center justify-between h-fit w-24 rounded px-2 py-1 border border-gray-500 bg-gray-100 text-gray-500 cursor-pointer hover:shadow-inner'>
                                            <div>Editar</div>
                                            <FaPen />
                                        </div>
                                        <div onClick={() => { handleDeleteConfirmation(user) }} className='flex flex-row items-center justify-between h-fit w-24 rounded px-2 py-1 border border-red-500 bg-red-100 text-red-500 cursor-pointer hover:shadow-inner'>
                                            <div>Eliminar</div>
                                            <MdDelete />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='mt-4 text-gray-500'>Nenhum utilizador encontrado.</div>
                    )}

                    {viewUpdate && <div className="flex fixed inset-0 z-50  justify-center items-center">
                        <div className="fixed inset-0 bg-black opacity-50" onClick={() => setViewUpdate(false)}></div>
                        <div className="relative flex flex-col justify-between w-[657px] min-h-[388px] gap-3 p-5 bg-white shadow-lg rounded-lg border border-gray-300 z-50 left-32">
                            <div>
                                <div className="flex flex-row justify-between items-center mb-4">
                                    <div className="text-xl">Editar utilizador {userUpdateInfo.name}</div>
                                    <IoClose onClick={() => { setViewUpdate(false) }} className="flex self-end text-xl cursor-pointer" />
                                </div>

                                <form className='flex flex-col gap-2'>
                                    <div className='flex flex-row'>
                                        <div className='w-20'>Nome: </div>
                                        <input
                                            className='relative w-64 pl-1 border border-gray-400' type="text"
                                            name='name'
                                            value={userUpdateInfo.name}
                                            onChange={handleUpdateChange}
                                        />
                                    </div>
                                    <div className='flex flex-row'>
                                        <div className='w-20'>Email: </div>
                                        <input
                                            className='relative w-64 pl-1 border border-gray-400' type="text"
                                            name='email'
                                            value={userUpdateInfo.email}
                                            onChange={handleUpdateChange}
                                        />
                                    </div>
                                    <div ref={dropdownRef} className='flex flex-row'>
                                        <div className='w-20'>Cargo: </div>
                                        <div onClick={() => { setViewUserRoles(!viewUserRoles) }} className='flex flex-row justify-between items-center bg-white cursor-pointer w-64 border border-gray-400 px-1'>
                                            {userUpdateInfo.role}
                                            <IoIosArrowDown />
                                        </div>
                                        {viewUserRoles &&
                                            <div className='absolute z-10 mt-7 ml-20 bg-white border border-gray-400 rounded shadow-lg w-64'>
                                                {roleList.map((option) => (
                                                    <div
                                                        key={option}
                                                        className='px-2 py-1 cursor-pointer hover:bg-gray-100'
                                                        onClick={() => handleRoleChange(option)}
                                                    >
                                                        {option}
                                                    </div>
                                                ))}
                                            </div>
                                        }

                                    </div>
                                </form>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setViewUpdate(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                                <button onClick={() => handleUpdateSubmit(userUpdateInfo._id)} className="px-4 py-2 bg-green-600 text-white rounded">Submeter</button>
                            </div>
                        </div>
                    </div>}

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
                                <button onClick={() => handleDeleteUser(userDeleteInfo._id)} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ManageUsers;
