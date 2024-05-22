import React, { useState, useRef, useEffect } from 'react';
import SideBar from '../components/SideBar'
import ContainerHeader from '../components/containers/containerHeader'
import ContainerBody from '../components/containers/containerBody'
import DropdownCheck from '../components/Dropdown/DropdownCheck';

import { useDispatch, useSelector } from 'react-redux'
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { setProducts, setStatus, setError } from '../slices/productsSlice';

import BarChart from '../components/charts/barChart';
import { IoSettingsOutline } from "react-icons/io5";

const Dashboard = () => {
  const { data: products, error, isLoading } = useGetProductsQuery()
  const dispatch = useDispatch()

  useEffect(() => {
    if (isLoading) {
      dispatch(setStatus('loading'))
    } else if (error) {
      dispatch(setError(error))
      dispatch(setStatus('failed'))
    } else {
      dispatch(setProducts(products))
      dispatch(setStatus('succeeded'))
    }
  }, [isLoading, error, products, dispatch])

  {/* -----------------------VARIAVEIS DROPDOWN SETTINGS HEADER--------------------- */ }
  const [columnsOptions, setColumnsOptions] = useState([]);
  const columnsAllOptions = ['Todos os produtos', 'Produtos sem stock', 'Produtos com stock baixo'];

  {/* -----------------------VARIAVEIS DROPDOWN SETTINGS BODY--------------------- */ }
  const [columnsOptionsBody, setColumnsOptionsBody] = useState([]);
  const columnsAllOptionsBody = ['Quantidade por categoria(Pie)', 'Quantidade por categoria(Barras)', 'Produtos stock mais alto', 'Produtos stock mais baixo'];

  return (
    <div className='flex flex-row '>
      <SideBar />

      {/* ----------------------------HEADER---------------------------------- */}

      <div className='flex flex-col w-full'>

        <div className='bg-basepurple-500 flex flex-row justify-between w-full'>
          <div className='  flex flex-row p-3 gap-5 '>
            <ContainerHeader>
              <div>hi</div>
            </ContainerHeader>

            <ContainerHeader>
              <div>hi</div>
            </ContainerHeader>

            <ContainerHeader>
              <div>hi</div>
            </ContainerHeader>
          </div>

          {/* -----------------------DROPDOWN SETTINGS HEADER--------------------- */}
          <div className='m-2'>
            <DropdownCheck
              options={columnsAllOptions}
              selectedOptions={columnsOptions}
              onOptionSelect={setColumnsOptions}
            >
              <div className='SettingsButtonGrey text-2xl cursor-pointer'><IoSettingsOutline /></div>
            </DropdownCheck>
          </div>

        </div>

        {/* -------------------------------BODY---------------------------- */}
        <div className='flex flex-row justify-between w-full'>
          <ContainerBody>
            <div><BarChart /> </div>
          </ContainerBody>

          {/* -----------------------DROPDOWN SETTINGS BODY--------------------- */}
          <div className='m-4'>
            <DropdownCheck
              options={columnsAllOptionsBody}
              selectedOptions={columnsOptionsBody}
              onOptionSelect={setColumnsOptionsBody}
            >
              <div className='SettingsButtonGrey text-2xl cursor-pointer'><IoSettingsOutline /></div>
            </DropdownCheck>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard