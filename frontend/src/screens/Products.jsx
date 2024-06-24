import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../components/SideBar';
import DropdownSearch from '../components/Dropdown/DropdownSearch';
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Import the close icon
import { CiShoppingCart } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";

import { useSelector } from "react-redux";

import PDF from '../components/pdf/Pdf';

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
    const [cartQuantity, setCartQuantity] = useState(0); // Add this state
    const [cartItems, setCartItems] = useState([]); // State for cart items
    const [isCartModalOpen, setIsCartModalOpen] = useState(false); // State for cart modal visibility
    const [checkoutMessage, setCheckoutMessage] = useState(''); // State for checkout message
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false); // State for invoice modal visibility
    const [invoiceName, setInvoiceName] = useState(''); // State for invoice name
    const [invoiceNIF, setInvoiceNIF] = useState(''); // State for invoice NIF
    const [invoicePhone, setInvoicePhone] = useState(''); // State for invoice Phone
    const [invoiceError, setInvoiceError] = useState(''); // State for invoice error message
    const [isClientModalOpen, setIsClientModalOpen] = useState(false); // State for client modal visibility
    const [users, setUsers] = useState([]); // State for user list
    const [clients, setClients] = useState([]); // State for clients list
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Adicionar estado para controlar modal de adicionar cliente

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

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/users`);
                setUsers(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        const fetchClients = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/clients`);
                setClients(response.data);
                setSuccessMessage(true);

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage(false);
                }, 3000);
            } catch (error) {
                console.error('Erro ao buscar os clientes:', error);
            }
        };



        fetchCategoryName();
        fetchProducts();
        fetchUsers();
        fetchClients();
    }, [categoryId]);

    const clearClientInfo = () => {
        setInvoiceName("");
        setInvoiceNIF("");
        setInvoicePhone("");
    }
    const [formData, setFormData] = useState({
        name: '',
        surName: '',
        phone: '',
        email: '',
        nif: '',
        address: '',
        postCode: '',
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const validate = () => {
        let errors = {};

        if (!formData.name) errors.name = 'Name is required';
        if (!formData.surName) errors.surName = 'Surname is required';
        if (!formData.phone) {
            errors.phone = 'Phone is required';
        } else if (!/^\d{9}$/.test(formData.phone)) {
            errors.phone = 'Phone must be 9 digits';
        }
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/^[A-Za-z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.pt)$/.test(formData.email)) {
            errors.email = 'Email must be a valid Gmail, Hotmail, or Outlook address';
        }
        if (!formData.nif) {
            errors.nif = 'NIF is required';
        } else if (!/^\d{9}$/.test(formData.nif)) {
            errors.nif = 'NIF must be 9 digits';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const fetchCreateClient = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            console.log('trying to send')
            const response = await axios.post('http://localhost:5555/api/clients', formData);
            console.log('Client created successfully:', response.data);
        } catch (error) {
            console.error('Error creating client:', error);
        }
    };

    const [errors, setErrors] = useState({});


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

    const handleModalContainerClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    const handleClientModalOpen = () => {
        setIsClientModalOpen(true);
    };

    const handleClientModalClose = () => {
        setIsClientModalOpen(false);
    };

    // Função para abrir modal de adicionar cliente
    const handleAddModalOpen = () => {
        setIsAddModalOpen(true);
    };

    // Função para fechar modal de adicionar cliente
    const handleAddModalClose = () => {
        setIsAddModalOpen(false);
    };

    const handleAddToCart = (product) => {
        if (quantity > 0) {
            if (quantity > product.stock) {
                setError('Quantidade desejada excede o stock disponível.');
                setTimeout(() => {
                    setError('');
                }, 5000); // Limpar mensagem de erro após 5 segundos
                return;
            }

            setQuantity(0);
            setError('');
            setSuccessMessage('Produto adicionado ao carrinho com sucesso.');
            setCartQuantity(prev => prev + quantity); // Update cart quantity
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000); // Limpar mensagem de sucesso após 5 segundos

            // Update cart items
            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item._id === product._id);
                if (existingItem) {
                    return prevItems.map(item =>
                        item._id === product._id ? { ...item, quantity: item.quantity + quantity, category: categoryName } : item
                    );
                } else {
                    return [...prevItems, { ...product, quantity, category: categoryName }];
                }
            });
        } else {

        }
    };

    const handleCartIconClick = () => {
        setIsCartModalOpen(true);
    };

    const handleCloseCartModal = () => {
        setIsCartModalOpen(false);
    };

    const handleCartModalContainerClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseCartModal();
        }
    };

    const handleCheckout = () => {
        setIsInvoiceModalOpen(true);
    };

    const handleInvoiceModalContainerClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsInvoiceModalOpen(false);
        }
    };

    const createRandomRef = () => {
        let resultRef = Math.floor(Math.random() * 900000000) + 100000000;
        return resultRef;
    };

    const { userInfo } = useSelector((state) => state.auth)

    const createPDF = async (nifConfirmation) => {
        const productInfo = cartItems;
        const clientInfo = { name: invoiceName, nif: invoiceNIF };
        const staffInfo = userInfo.name;
        const randomRef = createRandomRef();

        PDF(nifConfirmation, productInfo, staffInfo, clientInfo, randomRef)
    }

    const handleInvoiceChoice = async (choice) => {

        if (choice && (!invoiceName || !invoiceNIF)) {
            setInvoiceError("Preencha com as suas credenciais");
            setTimeout(() => {
                setInvoiceError('');
            }, 3000); // Limpar mensagem de erro após 3 segundos
            return;
        }

        console.log('Iniciando checkout...');
        try {
            const updatedProducts = [...products];
            for (const item of cartItems) {
                const productId = item._id;
                const updatedStock = item.stock - item.quantity;
                console.log(cartItems)

                const response = await axios.put(`http://localhost:5555/api/products/store/${productId}`, { stock: updatedStock });

                clearClientInfo();
                if (response.status === 200) {
                    // Update local state
                    const index = updatedProducts.findIndex(p => p._id === productId);
                    if (index !== -1

                    ) {
                        updatedProducts[index].stock = updatedStock;
                    }
                } else {
                    console.error(`Erro ao atualizar o stock: Status ${response.status}`);
                }
            }
            createPDF(choice);

            setProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
            setCartItems([]);
            setCartQuantity(0);
            setIsCartModalOpen(false);
            setIsInvoiceModalOpen(false);
            setCheckoutMessage(`Checkout realizado com sucesso!${choice ? ' Factura emitida.' : ''}`);
            setTimeout(() => {
                setCheckoutMessage('');
            }, 5000); // Clear checkout message after 5 seconds
            setIsInvoiceModalOpen(false);
            setIsCartModalOpen(false);
        } catch (error) {
            console.error('Erro ao processar o checkout:', error);
        }
    };

    const calculateTotalPrice = () => {
        let total = 0;
        for (const item of cartItems) {
            if (!item.price) {
                return 'Preço indefinido';
            }
            total += item.price * item.quantity;
        }
        return `€${total.toFixed(2)}`;
    };


    const handleAddClient = () => {
        console.log('send')
    }


    return (
        <div className="flex">
            <SideBar />
            <div className="ml-5 flex-1">
                <h1 className="text-2xl font-bold mb-5 text-center mt-2">{categoryName}</h1>
                <div className="flex items-center gap-5 mb-5">
                    <div className="relative flex items-center">
                        <FaSearch className='text-gray-600 absolute left-3' />
                        <input
                            type='text'
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            className='w-48 h-10 pl-10 pr-4 rounded-full border border-gray-400 focus:outline-none focus:border-blue-500'
                            placeholder='Pesquisar...'
                        />
                    </div>
                    <div className="relative flex items-center cursor-pointer" onClick={handleCartIconClick}>
                        <CiShoppingCart className="text-3xl" />
                        {cartQuantity > 0 && (
                            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                {cartQuantity}
                            </span>
                        )}
                    </div>
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
                                    <div className="mt-2">
                                        <strong>Preço:</strong> {product.price ? `€${product.price}` : 'Sem valor definido'}
                                    </div>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>
                <div className="mt-5">
                    <Link to="/CategoryPage" className="text-blue-500 flex items-center gap-2">
                        <FaArrowLeft />
                        Voltar para Categorias
                    </Link>
                </div>
            </div>

            {selectedProduct && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={handleModalContainerClick}
                >
                    <div className="bg-white p-5 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 relative border-gray-400 border-2">
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
                            <strong>Stock:</strong> <span className={selectedProduct.stock <= selectedProduct.lowStock ?
                                'text-red-500' : ''}>{selectedProduct.stock}</span>
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

            {isCartModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleCartModalContainerClick}>
                    <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 relative border border-gray-300 shadow-lg">
                        <button onClick={handleCloseCartModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none">
                            <IoClose className="text-2xl" />
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Carrinho de Compras</h2>
                        {cartItems.length === 0 ? (
                            <p>O carrinho está vazio.</p>
                        ) : (
                            <div>
                                {cartItems.map((item, index) => (
                                    <div key={index} className="mb-4 border-b border-gray-300 pb-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                                                <div className="flex items-center mb-1">
                                                    <p className="text-sm">Quantidade:</p>
                                                    <form onSubmit={(e) => e.preventDefault()}>
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                if (!isNaN(value) && value > 0) {
                                                                    const updatedCartItems = [...cartItems];
                                                                    updatedCartItems[index].quantity = value;
                                                                    setCartItems(updatedCartItems);
                                                                    setCartQuantity(cartQuantity + value - item.quantity);
                                                                }
                                                            }}
                                                            className="w-9 text-center border border-gray-400 rounded ml-1"
                                                            min="1"
                                                        />
                                                    </form>
                                                </div>
                                                <p className="text-sm">Preço: {item.price ? `€${item.price}` : 'Sem valor definido'}</p>
                                            </div>
                                            <button
                                                className="text-lg text-red-500 hover:text-red-700 focus:outline-none"
                                                onClick={() => {
                                                    setCartItems(cartItems.filter((_, i) => i !== index));
                                                    setCartQuantity(cartQuantity - item.quantity);
                                                }}
                                            >
                                                <FaRegTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4">
                                    <p className="text-lg font-bold">Total: {calculateTotalPrice()}</p>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded mt-3 mr-3 hover:bg-blue-600 focus:outline-none"
                                        onClick={() => {
                                            // Verifica se algum item no carrinho excede o estoque disponível
                                            const stockExceeded = cartItems.some(item => item.quantity > item.stock);
                                            if (stockExceeded) {
                                                // Exibe mensagem de erro caso algum item exceda o estoque
                                                setCheckoutMessage('Excede o stock disponível. Verifique a quantidade dos produtos no carrinho.');
                                            } else {
                                                // Caso contrário, abre o próximo modal para a fatura
                                                setIsInvoiceModalOpen(true);
                                            }
                                        }}
                                    >
                                        Finalizar Compra
                                    </button>
                                    {checkoutMessage && (
                                        <div className="text-red-500 mt-3 text-center">{checkoutMessage}</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}



            {isInvoiceModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleInvoiceModalContainerClick}>
                    <div className="bg-white p-5 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 relative border-gray-400 border-2">
                        <IoClose
                            onClick={() => setIsInvoiceModalOpen(false)}
                            className="text-2xl cursor-pointer absolute top-2 right-2"
                        />
                        <h2 className="text-2xl font-bold mb-3">Deseja Fatura com contribuinte?</h2>
                        {isClientModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClientModalClose}>
                                <div className="bg-white p-5 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 relative border-gray-400 border-2">
                                    <h2 className="text-2xl font-bold mb-3">Clientes</h2>
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded mt-3 hover:bg-green-600 focus:outline-none"
                                        onClick={handleAddModalOpen}
                                    >
                                        Adicionar Cliente
                                    </button>
                                    <ul className="divide-y divide-gray-200">
                                        {clients.map(client => (
                                            <li key={client._id} className="py-4 flex justify-between items-center">
                                                <div className="flex items-center">
                                                    {/* Exiba os detalhes do usuário, como nome, e-mail, etc. */}
                                                    <span className="font-semibold">{client.name}</span>
                                                    <span className="ml-2 text-gray-500">{client.email}</span>
                                                    <span className="ml-2 text-gray-500">{client.phone}</span>
                                                </div>
                                                {/* Adicione um botão ou outra ação para interagir com o usuário, se necessário */}
                                                <button onClick={() => { setInvoiceName(client.name), setInvoiceNIF(client.nif), setInvoicePhone(client.phone) }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">Selecionar</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        )}



                        {isAddModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-white p-5 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 relative border-gray-400 border-2">
                                    <h2 className="text-2xl font-bold mb-5">Add Client</h2>
                                    <p className="mb-4 text-red-600">* Required fields</p>
                                    {successMessage && (
                                        <div className="mb-4 text-green-600 font-bold">
                                            Client added successfully!
                                        </div>
                                    )}
                                    <form onSubmit={fetchCreateClient}>
                                        <div className="flex flex-wrap">
                                            <div className="w-full md:w-1/2 pr-2 mb-4">
                                                <label className="block text-gray-700">
                                                    Name <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="w-full px-3 py-2 border rounded"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                                {errors.name && <div className="text-red-600">{errors.name}</div>}
                                            </div>
                                            <div className="w-full md:w-1/2 pl-2 mb-4">
                                                <label className="block text-gray-700">
                                                    Surname <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="surName"
                                                    className="w-full px-3 py-2 border rounded"
                                                    required
                                                    value={formData.surName}
                                                    onChange={handleChange}
                                                />
                                                {errors.surName && <div className="text-red-600">{errors.surName}</div>}
                                            </div>
                                            <div className="w-full md:w-1/2 pr-2 mb-4">
                                                <label className="block text-gray-700">
                                                    Phone <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className="w-full px-3 py-2 border rounded"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                                {errors.phone && <div className="text-red-600">{errors.phone}</div>}
                                            </div>
                                            <div className="w-full md:w-1/2 pl-2 mb-4">
                                                <label className="block text-gray-700">
                                                    Email <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="w-full px-3 py-2 border rounded"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                                {errors.email && <div className="text-red-600">{errors.email}</div>}
                                            </div>
                                            <div className="w-full md:w-1/2 pr-2 mb-4">
                                                <label className="block text-gray-700">
                                                    NIF <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nif"
                                                    className="w-full px-3 py-2 border rounded"
                                                    required
                                                    value={formData.nif}
                                                    onChange={handleChange}
                                                />
                                                {errors.nif && <div className="text-red-600">{errors.nif}</div>}
                                            </div>
                                            <div className="w-full md:w-1/2 pl-2 mb-4">
                                                <label className="block text-gray-700">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    className="w-full px-3 py-2 border rounded"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="w-full md:w-1/2 pr-2 mb-4">
                                                <label className="block text-gray-700">
                                                    Post Code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="postCode"
                                                    className="w-full px-3 py-2 border rounded"
                                                    value={formData.postCode}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none mr-2" onClick={handleAddModalClose}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-3 mr-3 hover:bg-blue-600 focus:outline-none"
                            onClick={handleClientModalOpen}
                        >
                            Clientes
                        </button>
                        <div className="flex flex-col gap-3 mt-3">
                            <input
                                type="text"
                                placeholder="Nome"
                                value={invoiceName}
                                onChange={(e) => setInvoiceName(e.target.value)}
                                className="border border-gray-400 p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                value={invoicePhone}
                                onChange={(e) => setInvoicePhone(e.target.value)}
                                className="border border-gray-400 p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="NIF"
                                value={invoiceNIF}
                                onChange={(e) => setInvoiceNIF(e.target.value)}
                                className="border border-gray-400 p-2 rounded"
                            />
                            {invoiceNIF && !/^\d{9}$/.test(invoiceNIF) && (
                                <div className="text-red-500 text-sm">NIF inválido. O NIF deve ter 9 dígitos numéricos.</div>
                            )}
                        </div>
                        {invoiceError && (
                            <div className="text-red-500 mt-3 text-center">
                                {invoiceError}
                            </div>
                        )}
                        <div className="flex justify-around mt-5">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => handleInvoiceChoice(true)}
                            >
                                Sim
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => handleInvoiceChoice(false)}
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Products;