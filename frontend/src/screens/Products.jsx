import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../components/SideBar';
import { FaArrowLeft } from "react-icons/fa6";
import { IoClose } from "react-icons/io5"; // Import the close icon

const Products = () => {
    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(0);

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

    const handleMoreInfoClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        setQuantity(0);
    };

    const handleAddToCart = async (product) => {
        if (quantity > 0) {
            try {
                // Verifica se o ID do produto está presente
                if (!product._id) {
                    console.error('ID do produto não encontrado');
                    return;
                }

                // Verifica se o produto está sem estoque
                if (product.stock === 0) {
                    alert('Este produto está sem Stock.');
                    return;
                }

                const updatedProduct = { ...product, stock: product.stock - quantity };
                const productId = product._id;
                const url = `http://localhost:5555/api/products/${productId}`;

                console.log(`Atualizando produto com ID: ${productId}`);
                console.log(`URL: ${url}`);
                console.log('Dados do produto:', updatedProduct);

                const response = await axios.put(url, updatedProduct);

                if (response.status === 200) {
                    setQuantity(0); // Reset quantity after adding to cart
                    // Atualizar o estado dos produtos para refletir o novo estoque
                    setProducts((prevProducts) =>
                        prevProducts.map((p) => (p._id === product._id ? { ...p, stock: updatedProduct.stock } : p))
                    );
                } else {
                    console.error(`Erro ao adicionar ao carrinho: Status ${response.status}`);
                }
            } catch (error) {
                console.error('Erro ao adicionar ao carrinho:', error);
            }
        } else {
            console.error('Quantidade deve ser maior que 0');
        }
    };

    return (
        <div className="flex">
            <SideBar />
            <div className="ml-5 flex-1">
                <h1 className="text-2xl font-bold mb-5">Categoria: {categoryId}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        if (product.category && product.category._id === categoryId) {
                            const isLowStock = product.stock <= product.lowStock;
                            return (
                                <div key={product._id} className="bg-white p-4 shadow-md rounded-lg">
                                    <h2 className={`text-lg font-semibold ${isLowStock ? 'text-red-500' : ''}`}>{product.name}</h2>
                                    <p className="text-sm mb-2">{product.description}</p>
                                    <div className="text-xl font-bold mb-2">
                                        {product.price ? `€${product.price}` : 'Sem valor definido'}
                                    </div>
                                    <div className="flex mt-2">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < product.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                {/* SVG Path here */}
                                            </svg>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-center">
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                            onClick={() => handleMoreInfoClick(product)}
                                        >
                                            Mais informações
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                <div className="mt-5">
                    <Link to="/CategoryPage" className="flex items-center text-blue-500">
                        <FaArrowLeft className="mr-2" />
                        Voltar
                    </Link>
                </div>
            </div>

            {/* Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-5 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
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
                        <div className="flex mt-2">
                            {Array.from({ length: 5 }, (_, i) => (
                                <svg
                                    key={i}
                                    className={`w-5 h-5 ${i < selectedProduct.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    {/* SVG Path here */}
                                </svg>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-5">
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-12 text-center"
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
