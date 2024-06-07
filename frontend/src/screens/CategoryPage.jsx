import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SideBar from '../components/SideBar';
import { setSearchName } from '../slices/productsSlice';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchName = useSelector(state => state.productsList.searchName);
    const [categorieList, setCategorieList] = useState([]);
    const [categoryColorMap, setCategoryColorMap] = useState({});

    // Array of colors derived from a professional palette
    const colors = [
        '#264653', '#2a9d8f', '#0077b6', '#00b4d8',
        '#1d3557', '#686d76', '#457b9d'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5555/api/products/categories');
                const categories = response.data;

                const colorMap = {};
                categories.forEach((category, index) => {
                    colorMap[category._id] = colors[index % colors.length];
                });

                setCategorieList(categories);
                setCategoryColorMap(colorMap);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearchFilterChange = (e) => {
        dispatch(setSearchName(e.target.value));
    };

    const handleCategoryClick = (categoryId) => {
        console.log("Categoria clicada:", categoryId);
        navigate(`/Products/${categoryId}`);
    };

    return (
        <div className='flex flex-row w-full h-full'>
            <SideBar />
            <div className='flex flex-col m-5'>
                <div className='flex flex-row relative items-center mb-5'>
                    <FaSearch className='text-gray-600 left-2 absolute' />
                    <input
                        type='text'
                        onChange={handleSearchFilterChange}
                        value={searchName}
                        className='w-48 h-10 pl-7 pr-4 rounded-full border border-gray-400 focus:outline-none focus:border-blue-500'
                        placeholder='Pesquisar...'
                    />
                </div>
                <div className='flex flex-wrap gap-5'>
                    {categorieList.map((category) => (
                        <div
                            key={category._id}
                            className="flex justify-center items-center h-28 w-64 text-lg font-medium text-white rounded-lg cursor-pointer shadow-md transition-shadow duration-200 hover:shadow-lg hover:shadow-black/50"
                            style={{ backgroundColor: categoryColorMap[category._id] }}
                            onClick={() => handleCategoryClick(category._id)}
                        >
                            {category.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
