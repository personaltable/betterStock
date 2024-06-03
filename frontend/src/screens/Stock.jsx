import React, { useState, useRef, useEffect, useMemo } from "react";
import SideBar from "../components/SideBar";
import ButtonOption from "../components/buttons/ButtonOption";
import ButtonFilter from "../components/buttons/ButtonFilter";
import Dropdown from "../components/Dropdown/Dropdown";
import DropdownCheck from "../components/Dropdown/DropdownCheck";
import DropdownSearch from "../components/Dropdown/DropdownSearch";
import StockTable from "../components/StockTable";

import { useDispatch, useSelector } from "react-redux";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import {
  setProducts,
  setStatus,
  setError,
  resetFilters,
  setColumns,
  setSearchName,
  setSearchCategory,
} from "../slices/productsSlice";

import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoReloadCircle } from "react-icons/io5";
import { FaPrint } from "react-icons/fa";
import { FaWrench } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";

const Stock = () => {
  const dispatch = useDispatch();
  const { data: products, error, isLoading } = useGetProductsQuery();

  useEffect(() => {
    if (isLoading) {
      dispatch(setStatus("loading"));
    } else if (error) {
      dispatch(setError(error));
      dispatch(setStatus("failed"));
    } else if (products) {
      dispatch(setProducts(products));
      dispatch(setStatus("succeeded"));
    }
  }, [isLoading, error, products, dispatch]);

  //General Filters______________________________

  //Reset Filters
  const handleResetFilterChange = () => {
    dispatch(resetFilters(true));
  };

  //Search
  const searchName = useSelector((state) => state.productsList.searchName);
  const handleSearchFilterChange = (e) => {
    dispatch(setSearchName(e.target.value));
  };

  //Category
  const searchCategory = useSelector((state) => state.productsList.searchCategory);
  const [searchCategoryValue, setSearchCategoryValue] = useState(searchCategory);

  useEffect(() => {
    dispatch(setSearchCategory(searchCategoryValue));
  }), [searchCategoryValue]


  //columns
  const columnsList = useSelector((state) => state.productsList.columns);
  const columnsAllOptions = [
    "Nome",
    "Categoria",
    "Marca",
    "Informação",
    "Preço",
    "Data / Hora",
    "Criador",
    "Reposição",
    "Stock Baixo",
    "Stock",
  ];
  const handleColumnSelect = (options) => {
    dispatch(setColumns(options));
  };


  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex flex-col p-3 w-full">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <ButtonOption className="flex flex-row justify-between items-center">
              <div>Adicionar</div>
              <FaCirclePlus />
            </ButtonOption>
            <ButtonOption className="flex flex-row justify-between items-center">
              <div>Remover</div>
              <FaCircleMinus />
            </ButtonOption>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <IoReloadCircle
              onClick={handleResetFilterChange}
              className="text-3xl text-basepurple-500 hover:text-basepurple-600 transition duration-300 ease-in-out cursor-pointer"
            />

            <div className="flex flex-row relative items-center">
              <FaMagnifyingGlass className="text-gray-400 left-2 absolute" />
              <input
                type="text"
                onChange={handleSearchFilterChange}
                value={searchName}
                className="w-36 h-8 pl-7 rounded-md border border-basepurple-500 focus:outline-basepurple-600"
                placeholder="Pesquisar..."
              />
            </div>

            <Dropdown
              trigger={
                <ButtonFilter className="flex flex-row justify-between items-center">
                  <div>Filtros</div>
                  <FaFilter />
                </ButtonFilter>}
              classNameContainer="w-80 flex flex-col gap-2"
            >

              <DropdownSearch
                label={"Categoria:"}
                options={["Informática", "Escritório"]}
                searchValue={searchCategoryValue}
                setSearchValue={setSearchCategoryValue}
                className={'z-40'}
              ></DropdownSearch>

              <DropdownSearch
                label={"Utilizador:"}
                options={["Informática", "Escritório"]}
                searchValue={searchCategoryValue}
                setSearchValue={setSearchCategoryValue}
              ></DropdownSearch>
              <div>hi</div>

            </Dropdown>

            <DropdownCheck
              className="w-44"
              options={columnsAllOptions}
              selectedOptions={columnsList}
              onOptionSelect={handleColumnSelect}
            >
              <ButtonFilter className="flex flex-row justify-between items-center">
                <div>Colunas</div>
                <FaWrench />
              </ButtonFilter>
            </DropdownCheck>

            <ButtonFilter className="flex flex-row justify-between items-center">
              <div>Imprimir</div>
              <FaPrint />
            </ButtonFilter>
          </div>
        </div>
        <StockTable></StockTable>
      </div>
    </div>
  );
};

export default Stock;
