import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../components/SideBar';

import { FaArrowLeft } from "react-icons/fa6";


const Products = () => {
    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/products?category=${categoryId}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchProducts();
    }, [categoryId]);

    return (
        <div className="flex">
            <SideBar />
            <div className="ml-5">
                <h1 className="text-xl font-bold mb-3">Categoria: {categoryId}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => {
                        if (product.category && product.category._id === categoryId) {
                            return (
                                <div key={product._id} className="bg-white p-4 mb-4 shadow-md rounded-md max-w-md">
                                    <h2 className="text-lg font-semibold">{product.name}</h2>
                                    <p className="text-sm">{product.description}</p>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                <div className="mb-4">
                    <Link to="/CategoryPage" className="flex items-center">
                        <FaArrowLeft className="mr-2" />
                        Voltar
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Products;
