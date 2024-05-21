import React, { useState, useRef, useEffect } from 'react';
import SideBar from '../components/SideBar'
import ButtonOption from '../components/buttons/ButtonOption'
import ButtonFilter from '../components/buttons/ButtonFilter';
import DropdownCheck from '../components/Dropdown/DropdownCheck';

import { IoReloadCircle } from "react-icons/io5";
import { FaPrint } from "react-icons/fa";
import { FaWrench } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";


const Stock = () => {

  const [columnsOptions, setColumnsOptions] = useState([]);
  const columnsAllOptions = ['Option 1', 'Option 2', 'Option 3'];


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
            <ButtonFilter className='flex flex-row justify-between items-center'>
              <div>Filtros</div>
              <FaFilter />
            </ButtonFilter>
            <DropdownCheck
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




      </div>
    </div>
  )
}

export default Stock