import React, { useState, useEffect } from 'react';

import SideBar from '../components/SideBar';
import ContainerHeader from '../components/containers/containerHeader';
import ContainerBody from '../components/containers/containerBody';
import DropdownCheck from '../components/Dropdown/DropdownCheck';
import PieChart from '../components/charts/pieChart';
import BarChart from '../components/charts/barChart';

import { useDispatch, useSelector } from 'react-redux';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { setProducts, setStatus, setError } from '../slices/productsSlice';


import { IoSettingsOutline } from "react-icons/io5";


const Dashboard = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      dispatch(setStatus('loading'));
    } else if (error) {
      dispatch(setError(error));
      dispatch(setStatus('failed'));
    } else {
      dispatch(setProducts(products));
      dispatch(setStatus('succeeded'));
    }
  }, [isLoading, error, products, dispatch]);

  // __________________________Variáveis Dropdown Settings Header____________________________________
  const [columnsOptions, setColumnsOptions] = useState(['Todos os produtos', 'Produtos sem stock', 'Produtos com stock baixo']);
  const columnsAllOptions = ['Todos os produtos', 'Produtos sem stock', 'Produtos com stock baixo'];

  // __________________________Variáveis Dropdown Settings Body__________________________
  const [columnsOptionsBody, setColumnsOptionsBody] = useState(['Quantidade por categoria(Pie)', 'Produtos stock mais alto', 'Produtos stock mais baixo']);
  const columnsAllOptionsBody = ['Quantidade por categoria(Pie)', 'Quantidade por categoria(Barras)', 'Produtos stock mais alto', 'Produtos stock mais baixo'];



  return (
    <div className='flex flex-row w-full'>
      <SideBar />


      <div className='flex flex-col w-full '>

        {/* ----------------------------HEADER--------------------------- */}
        <div className='bg-basepurple-500 flex flex-row justify-between w-full p-3'>
          <div className='flex flex-row gap-5'>
            {columnsOptions.includes("Todos os produtos") ? (
              <ContainerHeader>
                <div className='text-lg'>Todos os produtos</div>
              </ContainerHeader>
            ) : (null)}

            {columnsOptions.includes("Produtos sem stock") ? (
              <ContainerHeader>
                <div className='text-lg'>Produtos sem stock</div>
              </ContainerHeader>
            ) : (null)}

            {columnsOptions.includes("Produtos com stock baixo") ? (
              <ContainerHeader>
                <div className='text-lg'>Produtos com stock baixo</div>
              </ContainerHeader>
            ) : (null)}

          </div>

          {/* __________________________Dropdown Settings Header_____________________________________ */}
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

        {/*____________________________ Body___________________________ */}
        <div className='flex flex-row w-full p-5 justify-between'>
          <div className='flex flex-wrap justify-start gap-5'>
            {columnsOptionsBody.includes("Quantidade por categoria(Pie)") ? (
              <ContainerBody>
                <div>PieChart <PieChart /></div>
              </ContainerBody>
            ) : (null)}

            {columnsOptionsBody.includes("Quantidade por categoria(Barras)") ? (
              <ContainerBody>
                <div>Bar Chart<BarChart /> </div>
              </ContainerBody>
            ) : (null)}

            {columnsOptionsBody.includes("Produtos stock mais alto") ? (
              <ContainerBody>
                <div>Produtos com Mais Stock</div>
              </ContainerBody>
            ) : (null)}

            {columnsOptionsBody.includes("Produtos stock mais baixo") ? (
              <ContainerBody>
                <div>Produtos com Menos Stock</div>
              </ContainerBody>
            ) : (null)}
          </div>

          {/* ____________________________Dropdown Settings Body____________________________ */}
          <div className=''>
            <DropdownCheck
              className='w-80'
              options={columnsAllOptionsBody}
              selectedOptions={columnsOptionsBody}
              onOptionSelect={setColumnsOptionsBody}
            >
              <div className=' flex text-2xl cursor-pointer p-1'>
                <IoSettingsOutline />
              </div>
            </DropdownCheck>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Dashboard;
