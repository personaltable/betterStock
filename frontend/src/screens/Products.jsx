import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../components/SideBar';
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Import the close icon

const Products = () => {
    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCategoryName = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/products/categories/${categoryId}`);
                setCategoryName(response.data.name);
            } catch (error) {
                console.error('Erro ao buscar o nome da categoria:', error);
                setCategoryName('Categoria não encontrada');
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/products?category=${categoryId}`);
                setProducts(response.data);
                setFilteredProducts(response.data); // Inicialmente, mostrar todos os produtos
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchCategoryName();
        fetchProducts();
    }, [categoryId]);

    useEffect(() => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const handleMoreInfoClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        setQuantity(0);
        setError('');
        setSuccessMessage('');
    };

    const handleAddToCart = async (product) => {
        if (quantity > 0) {
            if (quantity > product.stock) {
                setError('Quantidade desejada excede o stock disponível.');
                setTimeout(() => {
                    setError('');
                }, 5000); // Limpar mensagem de erro após 5 segundos
                return;
            }

            try {
                const updatedStock = product.stock - quantity;
                const productId = product._id;

                const response = await axios.put(`http://localhost:5555/api/products/store/${productId}`, { stock: updatedStock });

                if (response.status === 200) {
                    setQuantity(0);
                    setError('');
                    setSuccessMessage('Produto adicionado ao carrinho com sucesso.');
                    setTimeout(() => {
                        setSuccessMessage('');
                    }, 5000); // Limpar mensagem de sucesso após 5 segundos

                    const updatedProducts = products.map((p) => {
                        if (p._id === productId) {
                            return { ...p, stock: updatedStock };
                        }
                        return p;
                    });

                    setProducts(updatedProducts);
                    setFilteredProducts(updatedProducts);
                    setSelectedProduct({ ...product, stock: updatedStock });
                } else {
                    console.error(`Erro ao adicionar ao carrinho: Status ${response.status}`);
                }
            } catch (error) {
                console.error('Erro ao adicionar ao carrinho:', error);
            }
        } else {
            setError('Quantidade deve ser maior que 0');
            setTimeout(() => {
                setError('');
            }, 5000); // Limpar mensagem de erro após 5 segundos
        }
    };

    return (
        <div className="flex">
            <SideBar />
            <div className="ml-5 flex-1">
                <h1 className="text-2xl font-bold mb-5 text-center mt-2"> {categoryName}</h1>
                <div className="flex flex-row relative items-center mb-5">
                    <FaSearch className='text-gray-600 left-2 absolute' />
                    <input
                        type='text'
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        className='w-48 h-10 pl-7 pr-4 rounded-full border border-gray-400 focus:outline-none focus:border-blue-500'
                        placeholder='Pesquisar...'
                    />
                </div>
                <div className="flex flex-wrap gap-5">
                    {filteredProducts.map((product) => {
                        if (product.category && product.category._id === categoryId) {
                            const isLowStock = product.stock <= product.lowStock;
                            return (
                                <div
                                    key={product._id}
                                    className="bg-white p-4 w-48 h-36 text-center shadow-md rounded-lg border border-gray-300 cursor-pointer hover:shadow-2xl transition-shadow duration-200"
                                    onClick={() => handleMoreInfoClick(product)}
                                >
                                    <h2 className={`text-xl font-semibold mb-1 ${isLowStock ? 'text-red-500' : ''}`}>{product.name}</h2>
                                    <p className="text-sm font-semibold">{product.brand}</p>
                                    <p className="text-sm mb-2">{product.description}</p>
                                    <div className="text-base font-bold mb-2">
                                        {product.price ? `€${product.price}` : 'Sem valor definido'}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                <div className="mt-5">
                    <Link to="/CategoryPage" className="flex items-center w-20 text-blue-500">
                        <FaArrowLeft className="mr-2" />
                        Voltar
                    </Link>
                </div>
            </div>

            {selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-5 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 relative  border-gray-400 border-2">
                        <IoClose
                            onClick={handleCloseModal}
                            className="text-2xl cursor-pointer absolute top-2 right-2"
                        />
                        <h2 className={`text-2xl font-bold mb-3 ${selectedProduct.stock <= selectedProduct.lowStock ? 'text-red-500' : ''}`}>{selectedProduct.name}</h2>
                        <p className="mb-3">{selectedProduct.description}</p>
                        <div className="mb-3">
                            <strong>Preço:</strong> {selectedProduct.price ? `€${selectedProduct.price}` : 'Sem valor definido'}
                        </div>
                        <div className="mb-3">
                            <strong>Stock:</strong> <span className={selectedProduct.stock <= selectedProduct.lowStock ? 'text-red-500' : ''}>{selectedProduct.stock}</span>
                        </div>
                        <div className="mb-3"><strong>Informação:</strong> {selectedProduct.information ? selectedProduct.information : "Sem informação"}</div>
                        {successMessage && (
                            <div className="text-green-500 mb-3">
                                {successMessage}
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-5">
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-12 text-center border border-gray-400 rounded"
                                    min="0"
                                />
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                                    onClick={() => handleAddToCart(selectedProduct)}
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="mt-3 text-red-500 text-center">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
