import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SideBar from '../components/SideBar';
import ContainerHeader from '../components/containers/containerHeader';
import { setSearchName } from '../slices/productsSlice';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchName = useSelector((state) => state.productsList.searchName);
    const [categorieList, setCategorieList] = React.useState([]);
    const [categoryColorMap, setCategoryColorMap] = React.useState({});

    // Array of colors derived from the base purple shade
    const colors = [
        '#6D28D9', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD',
        '#5B21B6', '#4C1D95', '#312E81', '#3730A3', '#4338CA',
        '#6366F1', '#818CF8'
    ];

    React.useEffect(() => {
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
                console.error('Erro ao buscar categorias:', error);
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
        <div className='flex flex-row w-full'>
            <SideBar />
            <div className='flex flex-col m-5'>
                <div className='flex flex-row relative items-center mb-5'>
                    <FaMagnifyingGlass className='text-gray-400 left-2 absolute' />
                    <input
                        type='text'
                        onChange={handleSearchFilterChange}
                        value={searchName}
                        className='w-36 h-8 pl-7 rounded-md border border-basepurple-500 focus:outline-basepurple-600'
                        placeholder='Pesquisar...'
                    />
                </div>
                <div className='flex flex-wrap gap-5 '>
                    {categorieList.map((category) => (
                        <div
                            key={category._id}
                            className="flex justify-center items-center h-28 w-64 text-center text-2xl shadow-md shadow-slate-700 rounded border border-gray-300 cursor-pointer"
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
