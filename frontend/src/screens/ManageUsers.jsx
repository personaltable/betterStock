import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import axios from 'axios';

import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";

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

    return (
        <div className="flex flex-row">
            <SideBar />
            <div className="flex flex-col gap-3 p-6 w-full relative">
                <div className='text-2xl'>Utilizadores</div>
                <div>
                    {usersList.length &&
                        <div className=''>
                            {usersList.map(user => (
                                <div className='flex flex-row justify-between border-b-2 border-gray-300 py-4'>
                                    <div key={user._id} className='flex flex-col'>
                                        <div>Nome: {user.name}</div>
                                        <div>Email: {user.email}</div>
                                        <div>Cargo: {user.role}</div>
                                    </div>
                                    <div className='flex flex-row gap-7 items-center'>
                                        <div className='flex flex-row items-center justify-between h-fit w-24 rounded px-2 py-1 border border-gray-500 bg-gray-100 text-gray-500 cursor-pointer hover:shadow-inner'>
                                            <div>Editar</div>
                                            <FaPen />
                                        </div>
                                        <div className='flex flex-row items-center justify-between h-fit w-24 rounded px-2 py-1 border border-red-500 bg-red-100 text-red-500 cursor-pointer'>
                                            <div>Eliminar</div>
                                            <MdDelete />
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
