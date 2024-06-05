import React, { useState, useRef, useEffect, useMemo } from "react";
import axios from 'axios'

import { useForm } from 'react-hook-form';
import { IoClose } from "react-icons/io5";

const FormCreateProduct = ({ setViewCreate, viewCreate }) => {

    const { register, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            name: '',
            category: '',
            brand: '',
            information: '',
            price: null,
            reStock: "",
            lowStock: null,
            stock: null,
        }
    })

    const onSubmit = async data => {
        console.log(data)
    }

    //Category__________________________
    const [categoryList, setCategoryList] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);

    const [viewCategoryOptions, setViewCategoryOptions] = useState(false);


    const validateCategory = (value) => {
        if (!categoryList.contains.value) {

        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:5555/api/products/categories`);
            const categoryNames = response.data.map(category => category.name);
            setCategoryList(categoryNames);
            setFilteredOptions(categoryNames);
        }
        fetchData();
    }, [])

    const handleSearchChange = (value) => {
        setValue('category', value); // Atualiza o valor do formulário
        const filtered = categoryList.filter(option =>
            option.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredOptions(filtered);
        setViewCategoryOptions(true);
    };

    const handleOptionClick = (option) => {
        setValue('category', option);
        setViewCategoryOptions(false);
    };

    const dropdownRef = useRef(null);
    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setViewCategoryOptions(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    //___________________________________



    return (
        <div className="flex flex-col w-fit h-[500px] gap-3 p-5 bg-white shadow-lg rounded-lg border border-gray-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="flex flex-row justify-between items-center">
                <div className="font-bold">Adicionar Produto</div>
                <IoClose onClick={() => { setViewCreate(false) }} className="flex self-end text-xl cursor-pointer" />
            </div>
            <form className='h-full' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col justify-between h-full'>
                    <div className="flex flex-row gap-5">
                        <div className='flex flex-col gap-1'>
                            <label>Nome</label>
                            <input
                                className='w-48 pl-1 border border-gray-500'
                                {...register('name', {
                                    required: "O nome é obrigatório",
                                })}

                            />

                            {errors.name && <div className='text-red-500'>{errors.name.message}</div>}
                        </div>

                        <div className='flex flex-col gap-1' ref={dropdownRef}>
                            <label>Categoria</label>
                            <input
                                className='relative w-48 pl-1 border border-gray-500'
                                {...register('category', {
                                    required: "A categoria é obrigatória",
                                    validate: validateCategory
                                })}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onClick={() => setViewCategoryOptions(true)}
                            />
                            {viewCategoryOptions &&
                                <div className="absolute w-48 pl-1 top-28 bg-white border border-gray-500 z-50">
                                    {filteredOptions.map((option, index) => (
                                        <div key={index} onClick={() => handleOptionClick(option)} className="hover:bg-gray-100 cursor-pointer h-7">
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            }
                            {errors.category && <div className='text-red-500'>{errors.category.message}</div>}
                        </div>
                    </div>
                    <button type='submit' className='flex justify-center items-center bg-black text-white w-48 p-2 py-1 rounded'>Submeter</button>
                </div>
            </form>

        </div>
    )
}

export default FormCreateProduct