import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
    const navigate = useNavigate();
    const [categorieList, setCategorieList] = useState([]);
    const [categoryColorMap, setCategoryColorMap] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

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
        setSearchTerm(e.target.value);
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/Products/${categoryId}`);
    };

    const filteredCategories = categorieList.filter((category) => {
        return category.name.toLowerCase().startsWith(searchTerm.toLowerCase());
    });

    return (
        <div className='flex flex-row w-full h-full'>
            <SideBar />
            <div className='flex flex-col m-5'>
                <div className='flex flex-row relative items-center mb-5'>
                    <FaSearch className='text-gray-600 left-2 absolute' />
                    <input
                        type='text'
                        onChange={handleSearchFilterChange}
                        value={searchTerm}
                        className='w-48 h-10 pl-7 pr-4 rounded-full border border-gray-400 focus:outline-none focus:border-blue-500'
                        placeholder='Pesquisar...'
                    />
                </div>
                <div className='flex flex-wrap gap-5'>
                    {filteredCategories.map((category) => (
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
