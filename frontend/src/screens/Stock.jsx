import React, { useState, useRef, useEffect } from 'react';
import SideBar from '../components/SideBar'
import ButtonOption from '../components/buttons/ButtonOption'
import ButtonFilter from '../components/buttons/ButtonFilter';
import DropdownCheck from '../components/Dropdown/DropdownCheck';
import StockTable from '../components/StockTable';

import { useDispatch, useSelector } from 'react-redux'
import { setProducts, setStatus, setError, sortProducts } from '../slices/productsSlice';

import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoReloadCircle } from "react-icons/io5";
import { FaPrint } from "react-icons/fa";
import { FaWrench } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";


const Stock = () => {

  const dispatch = useDispatch();
  const productsState = useSelector(state => state.productsList.products)
  console.log(productsState)

//General Filters______________________________

//search
  const [searchFilter, setSearchFilter] = useState(""); 
  const handleSearchFilterChange = (e) => {
    setSearchFilter(e.target.value);
  };

//columns
  const [columnsOptions, setColumnsOptions] = useState([]);
  const columnsAllOptions = ['Option 1', 'Option 2', 'Option 3'];

//filters
  const handleSort = () => {
    dispatch(sortProducts());
  };
//print




  return (
    <div className='flex flex-row'>
      <SideBar />
      <div className='flex flex-col p-3 w-full'>
        <div className='flex flex-row justify-between items-center'>

          <div className='flex flex-row gap-2 items-center'>
            <ButtonOption className='flex flex-row justify-between items-center'>
              <div>Adicionar</div>
              <FaCirclePlus />
            </ButtonOption>
            <ButtonOption className='flex flex-row justify-between items-center'>
              <div>Remover</div>
              <FaCircleMinus />
            </ButtonOption>
          </div>

          <div className='flex flex-row gap-2 items-center'>
            <IoReloadCircle className='text-3xl text-basepurple-500 hover:text-basepurple-600 transition duration-300 ease-in-out cursor-pointer' />

            <div className='flex flex-row relative items-center'>
              <FaMagnifyingGlass className='text-gray-400 left-2 absolute'/>
              <input
                type='text'
                onChange={handleSearchFilterChange}
                value={searchFilter}
                className='w-36 h-8 pl-7 rounded-md border border-basepurple-500 focus:outline-basepurple-600'
                placeholder='Pesquisar...'
              />
            </div>

            <ButtonFilter onClick={handleSort} className='flex flex-row justify-between items-center'>
              <div>Filtros</div>
              <FaFilter/>
            </ButtonFilter>

            <DropdownCheck
              className='w-44'
              options={columnsAllOptions}
              selectedOptions={columnsOptions}
              onOptionSelect={setColumnsOptions}
            >
              <ButtonFilter className='flex flex-row justify-between items-center'>
                <div>Colunas</div>
                <FaWrench />
              </ButtonFilter>
            </DropdownCheck>

            <ButtonFilter className='flex flex-row justify-between items-center'>
              <div>Imprimir</div>
              <FaPrint />
            </ButtonFilter>
          </div>


        </div>
        <StockTable></StockTable>


      </div>
    </div>
  )
}

export default Stock