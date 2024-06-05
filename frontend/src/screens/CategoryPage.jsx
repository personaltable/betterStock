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

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5555/api/products/categories'
                );
                setCategorieList(response.data);
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
        console.log("Categoria clicada:", categoryId); // Adicione este console.log
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
                <div className='flex flex-row gap-5'>
                    {categorieList.map((category) => (
                        <div
                            key={category.id} // Adicione a propriedade key com um valor único, como o id do category
                            className="border border-gray-300 p-4 rounded-md cursor-pointer"
                            onClick={() => handleCategoryClick(category.id)}
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
