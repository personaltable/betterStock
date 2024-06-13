import React, { useState, useRef, useEffect, useMemo } from "react";
import axios from 'axios'

import { useDispatch, useSelector } from "react-redux";
import { useCreateProductMutation } from "../slices/productsApiSlice";
import { setFormFeedback } from '../slices/productsSlice';

import { useForm } from 'react-hook-form';
import { IoClose } from "react-icons/io5";

const FormCreateProduct = ({ setViewCreate, viewCreate }) => {

    const dispatch = useDispatch();

    const { register, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            name: '',
            category: '',
            brand: '',
            information: '',
            price: null,
            originalPrice: null,
            reStock: "",
            lowStock: null,
            stock: null,
        }
    })

    //Category__________________________
    const [categoryList, setCategoryList] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [viewCategoryOptions, setViewCategoryOptions] = useState(false);

    const validateCategory = (value) => {
        if (!categoryList.includes(value)) {
            return "Categoria inválida";
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

    //Stock___________________________________
    const validateStock = (value) => {
        if (isNaN(value)) {
            return "O Stock deve ser numérico";
        }
        if (value && value.toString().length > 5) {
            return "O Stock não deve passar de 5 dígitos";
        }
    };

    //Price___________________________________
    const validatePrice = (value) => {
        if (isNaN(value)) {
            return "O Preço deve ser numérico";
        }
    };

    //Price___________________________________
    const validateOriginalPrice = (value) => {
        if (isNaN(value)) {
            return "O Preço original deve ser numérico";
        }
    };

    //LowStock___________________________________
    const validateLowStock = (value) => {
        if (isNaN(value)) {
            return "O Stock critíco deve ser numérico";
        }
        if (value && value.toString().length > 5) {
            return "O Stock critíco não deve passar de 5 dígitos";
        }
    };

    //Information___________________________________
    const validateInformation = (value) => {
        const wordCount = value.trim().split(/\s+/).length;
        if (wordCount > 30) {
            return "A informação só pode conter 30 palavras";
        }
    };


    //SUBMIT______________________________________

    const [createProduct, { isLoading }] = useCreateProductMutation();
    const { userInfo } = useSelector((state) => state.auth)

    const onSubmit = async data => {
        try {
            const res = await createProduct({
                name: data.name,
                category: data.category,
                brand: data.brand,
                information: data.information,
                price: data.price,
                originalPrice: data.originalPrice,
                createdBy: userInfo.name,
                lowStock: data.lowStock,
                stock: data.stock,
            }).unwrap();

            const sendData = { name: "Adicionar", product: data.name, user: userInfo.name }

            await axios.post(`http://localhost:5555/api/actions`, sendData)

            dispatch(setFormFeedback('Produto adicionado com sucesso'));
            setViewCreate(false);

        } catch (error) {
            console.log(error?.data?.message)
        }
    }



    return (
        <div className={`fixed inset-0 z-50 ${viewCreate ? 'flex' : 'hidden'} justify-center items-center`}>
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setViewCreate(false)}></div>
            <div className="relative flex flex-col w-fit h-fit gap-3 p-5 bg-white shadow-lg rounded-lg border border-gray-300 z-50 left-32">
                <div className="flex flex-row justify-between items-center">
                    <div className="font-bold">Adicionar Produto</div>
                    <IoClose onClick={() => { setViewCreate(false) }} className="flex self-end text-xl cursor-pointer" />
                </div>
                <form className='h-full' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col gap-10 h-full'>
                        <div className='flex flex-col h-full '>
                            <div className="flex flex-row gap-5 min-h-20">
                                <div className='flex flex-col gap-1'>
                                    <div className="flex flex-row gap-1">
                                        <label>Nome</label>
                                        <div className="text-red-500">*</div>
                                    </div>
                                    <input
                                        className='w-48 pl-1 border border-gray-500'
                                        {...register('name', {
                                            required: "O nome é obrigatório",
                                        })}
                                    />
                                    {errors.name && <div className='text-red-500 text-sm'>{errors.name.message}</div>}
                                </div>

                                <div className='flex flex-col gap-1' ref={dropdownRef}>
                                    <div className="flex flex-row gap-1">
                                        <label>Categoria</label>
                                        <div className="text-red-500">*</div>
                                    </div>
                                    <input
                                        className='relative w-48 pl-1 border border-gray-500'
                                        {...register('category', {
                                            required: "A categoria é obrigatória",
                                            validate: validateCategory
                                        })}
                                        autoComplete="off"
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
                                    {errors.category && <div className='text-red-500 text-sm'>{errors.category.message}</div>}
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <div className="flex flex-row gap-1">
                                        <label>Stock</label>
                                        <div className="text-red-500">*</div>
                                    </div>
                                    <input
                                        className='w-48 pl-1 border border-gray-500'
                                        {...register('stock', {
                                            required: "O stock é obrigatório",
                                            validate: validateStock
                                        })}
                                    />
                                    {errors.stock && <div className='text-red-500 text-sm'>{errors.stock.message}</div>}
                                </div>
                            </div>
                            <div className="flex flex-row gap-5 min-h-20">
                                <div className='flex flex-col gap-1'>
                                    <label>Preço Original</label>
                                    <input
                                        className='w-48 pl-1 border border-gray-500'
                                        {...register('originalPrice',
                                            { validate: validateOriginalPrice }
                                        )}
                                    />
                                    {errors.originalPrice && <div className='text-red-500 text-sm max-w-48'>{errors.originalPrice.message}</div>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label>Preço</label>
                                    <input
                                        className='w-48 pl-1 border border-gray-500'
                                        {...register('price',
                                            { validate: validatePrice }
                                        )}
                                    />
                                    {errors.price && <div className='text-red-500 text-sm'>{errors.price.message}</div>}
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label>Stock critíco</label>
                                    <input
                                        className='w-48 pl-1 border border-gray-500'
                                        {...register('lowStock',
                                            { validate: validateLowStock })}
                                    />
                                    {errors.lowStock && <div className='text-red-500 text-sm'>{errors.lowStock.message}</div>}
                                </div>
                            </div>

                            <div className="flex flex-row gap-5 min-h-20">
                                <div className='flex flex-col gap-1'>
                                    <label>Marca</label>
                                    <input
                                        className='w-48 pl-1 border border-gray-500'
                                        {...register('brand')}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row gap-5">
                                <div className='flex flex-col gap-1 w-full'>
                                    <label>Informações</label>
                                    <textarea
                                        className='w-full pl-1 border border-gray-500'
                                        {...register('information',
                                            { validate: validateInformation })}
                                    />
                                    {errors.information && <div className='text-red-500 text-sm'>{errors.information.message}</div>}
                                </div>
                            </div>
                        </div>
                        <button type='submit' className='flex justify-center items-center bg-black text-white w-48 p-2 py-1 rounded'>Submeter</button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default FormCreateProduct