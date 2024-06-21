import React, { useState, useEffect } from 'react';
import axios from 'axios';

import SideBar from '../components/SideBar';
import ContainerHeader from '../components/containers/containerHeader';
import ContainerBody from '../components/containers/containerBody';
import DropdownCheck from '../components/Dropdown/DropdownCheck';
import PieChart from '../components/charts/pieChart';
import BarChart from '../components/charts/barChart';
import Tooltip from '../components/containers/ToolTip';

import { IoSettingsOutline } from "react-icons/io5";
import { CiCircleQuestion } from "react-icons/ci";

const Dashboard = () => {
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:5555/api/products`);
      setProductsList(response.data);
    };

    fetchData();
  }, []);

  const [totalProducts, setTotalProducts] = useState(0);
  useEffect(() => {
    setTotalProducts(productsList.length);
  }, [productsList]);

  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  useEffect(() => {
    setTotalProducts(productsList.length);
    const filteredProducts = productsList.filter(product => product.stock === 0);
    setOutOfStockProducts(filteredProducts);
  }, [productsList]);

  const [lowStockProducts, setLowStockProducts] = useState([]);
  useEffect(() => {
    setTotalProducts(productsList.length);
    const filteredOutOfStock = productsList.filter(product => product.stock === 0);
    setOutOfStockProducts(filteredOutOfStock);
    const filteredLowStock = productsList.filter(product => product.stock < product.lowStock);
    setLowStockProducts(filteredLowStock);
  }, [productsList]);

  const [columnsOptions, setColumnsOptions] = useState(['Todos os produtos', 'Produtos sem stock', 'Produtos com stock baixo']);
  const columnsAllOptions = ['Todos os produtos', 'Produtos sem stock', 'Produtos com stock baixo'];

  const [columnsOptionsBody, setColumnsOptionsBody] = useState(['Quantidade por categoria(Pie)', 'Produtos stock mais alto', 'Produtos stock mais baixo']);
  const columnsAllOptionsBody = ['Quantidade por categoria(Pie)', 'Quantidade por categoria(Barras)', 'Produtos stock mais alto', 'Produtos stock mais baixo'];

  const getMostStockProducts = (products, topN) => {
    return products
      .sort((a, b) => b.stock - a.stock)
      .slice(0, topN);
  };

  const getLowStockProducts = (products, topN) => {
    return products
      .sort((a, b) => a.stock - b.stock)
      .slice(0, topN);
  };

  const topStockProducts = getMostStockProducts(productsList, 5);
  const lowStockProductsList = getLowStockProducts(productsList, 5);

  return (
    <div className='flex flex-row w-full'>
      <SideBar />
      <div className='flex flex-col w-full'>
        <div className='bg-basepurple-500 flex flex-row justify-between w-full p-3'>
          <div className='flex flex-row gap-5'>
            {columnsOptions.includes("Todos os produtos") ? (
              <ContainerHeader>
                <div className='text-lg'>Todos os produtos</div>
                <div>{totalProducts}</div>
              </ContainerHeader>
            ) : null}

            {columnsOptions.includes("Produtos sem stock") ? (
              <ContainerHeader>
                <div className='text-lg'>Produtos sem stock</div>
                <div>{outOfStockProducts.length}</div>
              </ContainerHeader>
            ) : null}

            {columnsOptions.includes("Produtos com stock baixo") ? (
              <ContainerHeader>
                <div className='text-lg'>Produtos com stock baixo</div>
                <div>{lowStockProducts.length}</div>
              </ContainerHeader>
            ) : null}
          </div>

          <div className=''>
            <DropdownCheck
              className='w-64'
              options={columnsAllOptions}
              selectedOptions={columnsOptions}
              onOptionSelect={setColumnsOptions}
            >
              <div className='SettingsButtonGrey text-2xl cursor-pointer'>
                <IoSettingsOutline />
              </div>
            </DropdownCheck>
          </div>
        </div>

        <div className='flex flex-row w-full justify-between'>
          <div className='flex flex-wrap justify-start gap-5'>
            {columnsOptionsBody.includes("Quantidade por categoria(Pie)") ? (
              <ContainerBody>
                <div className='flex flex-col'>
                  <div className='flex flex-row justify-between'>
                    <div>Quantidade por categoria</div>
                    <Tooltip content="Grafico Circular para visualizar a distribuição da quantidade de itens por categoria de forma proporcional, facilitando a compreensão das categorias mais representativas." className='z-20'><CiCircleQuestion /></Tooltip>
                  </div>
                  <PieChart productsList={productsList} />
                </div>
              </ContainerBody>
            ) : null}

            {columnsOptionsBody.includes("Quantidade por categoria(Barras)") ? (
              <ContainerBody>
                <div className='flex flex-col'>
                  <div className='flex flex-row justify-between'>
                    <div>Quantidade por categoria</div>
                    <Tooltip content="Grafico de barras que exibe a quantidade de itens por categoria de maneira comparativa, permitindo uma análise visual das diferenças quantitativas entre as categorias." className='z-20'><CiCircleQuestion /></Tooltip>
                  </div>
                  <BarChart productsListBar={productsList} />
                </div>
              </ContainerBody>
            ) : null}

            {columnsOptionsBody.includes("Produtos stock mais alto") ? (
              <ContainerBody>
                <div className='flex flex-col'>
                  <div className='flex flex-row justify-between mb-4'>
                    <div className='text-base font-semibold'>Produtos com stock mais alto</div>
                    <Tooltip content="Esta seção exibe os produtos com a maior quantidade de stock disponível, destacando os itens mais bem abastecidos do inventário." className='z-20'><CiCircleQuestion /></Tooltip>
                  </div>
                  <div className='flex flex-col space-y-2'>
                    {topStockProducts.map((product, index) => (
                      <div key={index} className='flex flex-row justify-between border-b border-gray-300 pb-2 px-4 py-2 rounded shadow-sm'>
                        <span className='font-medium text-sm'>{product.name}</span>
                        <span className='border-l border-gray-300 pl-4 ml-4 text-gray-600 text-sm w-14'>{product.stock}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ContainerBody>
            ) : null}

            {columnsOptionsBody.includes("Produtos stock mais baixo") ? (
              <ContainerBody>
                <div className='flex flex-col'>
                  <div className='flex flex-row justify-between mb-4'>
                    <div className='text-base font-semibold'>Produtos com stock mais baixo</div>
                    <Tooltip content="Nesta área, você encontrará os produtos com a menor quantidade de stock disponível, ajudando a identificar itens que podem precisar de reposição imediata." className='z-20'><CiCircleQuestion /></Tooltip>
                  </div>
                  <div className='flex flex-col space-y-2'>
                    {lowStockProductsList.map((product, index) => (
                      <div key={index} className='flex flex-row justify-between border-b border-gray-300 pb-2 px-4 py-2 rounded shadow-sm'>
                        <span className='font-medium text-sm'>{product.name}</span>
                        <span className='border-l border-gray-300 pl-4 ml-4 text-gray-600 text-sm w-14'>{product.stock}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ContainerBody>
            ) : null}
          </div>

          <div className=''>
            <DropdownCheck
              className='w-80'
              options={columnsAllOptionsBody}
              selectedOptions={columnsOptionsBody}
              onOptionSelect={setColumnsOptionsBody}
            >
              <div className=' flex text-2xl cursor-pointer p-1 m-1'>
                <IoSettingsOutline />
              </div>
            </DropdownCheck>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
