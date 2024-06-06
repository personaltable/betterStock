import React, { useState, useRef, useEffect, useMemo } from "react";
import SideBar from "../components/SideBar";
import ButtonOption from "../components/buttons/ButtonOption";
import ButtonFilter from "../components/buttons/ButtonFilter";
import Dropdown from "../components/Dropdown/Dropdown";
import DropdownCheck from "../components/Dropdown/DropdownCheck";
import DropdownSearch from "../components/Dropdown/DropdownSearch";
import StockTable from "../components/StockTable";
import FormCreateProduct from "../components/FormCreateProduct";
import axios from 'axios'

import { useDispatch, useSelector } from "react-redux";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import {
  setProducts,
  setStatus,
  setError,
  resetFilters,
  setColumns,
  setSearchName,
  setSearchStock,
  setSearchCategory,
  setSearchUser,
} from "../slices/productsSlice";

import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoReloadCircle } from "react-icons/io5";
import { FaPrint } from "react-icons/fa";
import { FaWrench } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";



const Stock = () => {

  //Fetching stock data
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
    setSearchCategoryValue("");
    setSearchUserValue("");
    dispatch(resetFilters(true));

  };

  //Search
  const searchName = useSelector((state) => state.productsList.searchName);
  const handleSearchFilterChange = (e) => {
    dispatch(setSearchName(e.target.value));
  };

  //Stock
  const stockFilterList = ["Exato", "Entre", "Acima", "Abaixo"];
  const [stockChoice, setStockChoice] = useState('Exato');
  const [stockInput, setStockInput] = useState('');
  const [stockSecondInput, setStockSecondInput] = useState('');

  useEffect(() => {
    dispatch(setSearchStock({ stockChoice, stockInput, stockSecondInput }));
  }, [stockChoice, stockInput, stockSecondInput])



  //Category
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:5555/api/products/categories`);
      const categoryNames = response.data.map(category => category.name);
      setCategoryList(categoryNames);
    }
    fetchData();
  }, [])

  const searchCategory = useSelector((state) => state.productsList.searchCategory);
  const [searchCategoryValue, setSearchCategoryValue] = useState(searchCategory);

  useEffect(() => {
    dispatch(setSearchCategory(searchCategoryValue));
  }), [searchCategoryValue]

  //User
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:5555/api/users`);
      const usersNames = response.data.users.map(user => user.name);
      setUserList(usersNames);
    }
    fetchData();
  }, [])

  const searchUser = useSelector((state) => state.productsList.searchUser);
  const [searchUserValue, setSearchUserValue] = useState(searchUser);

  useEffect(() => {
    dispatch(setSearchUser(searchUserValue));
  }), [searchUserValue]

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

  //_________________________________________

  //Delete
  const deleteList = useSelector((state) => state.productsList.deleteList);
  console.log(deleteList)

  const [viewCreate, setViewCreate] = useState(false)

  return (
    <div className="flex flex-row">
      <SideBar />
      <div className="flex flex-col p-3 w-full relative">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center">
            <ButtonOption onClick={() => { setViewCreate(!viewCreate) }} className="flex flex-row justify-between items-center">
              <div>Adicionar</div>
              <FaCirclePlus />
            </ButtonOption>
            <ButtonOption className="flex flex-row justify-between items-center">
              <div>Remover</div>
              <FaCircleMinus />
            </ButtonOption>
          </div>

          {/* Filtros _______________________________________________________________ */}

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
              classNameContainer="w-fit flex flex-col gap-2 p-2 mt-2"
            >

              <div className="flex flex-row items-center justify-between" >
                <div className="flex flex-row ">
                  <div className="w-20">Stock:</div>
                  <Dropdown
                    trigger={
                      <div className="flex cursor-pointer w-[80px] flex-row gap-1 px-1 justify-between items-center border border-gray-500 rounded mr-1">
                        <div className="">{stockChoice}</div>
                        <IoIosArrowDown className="text-xs" />
                      </div>
                    }
                    classNameContainer='w-[80px] mr-1 mt-1'
                  >
                    {stockFilterList.map((option) => (
                      <div onClick={() => { setStockChoice(option) }} className="p-1 px-2 hover:bg-gray-100 cursor-pointer" key={option}>{option}</div>
                    ))}
                  </Dropdown>

                  <input
                    type="text"
                    onChange={(e) => { setStockInput(e.target.value) }}
                    value={stockInput}
                    className="pl-1 w-14 border border-gray-500"
                  />

                  {stockChoice === "Entre" ? (
                    <div className="flex flex-row">
                      <div className="mx-0.5"> - </div>
                      <input
                        type="text"
                        onChange={(e) => { setStockSecondInput(e.target.value) }}
                        value={stockSecondInput}
                        className="pl-1 w-14 border border-gray-500"
                      />
                    </div>
                  ) : (<div></div>)}

                </div>
                <IoClose onClick={() => { [setStockInput(''), setStockSecondInput('')] }} className="text-xl cursor-pointer" />
              </div>

              <DropdownSearch
                label={"Categoria:"}
                options={categoryList}
                searchValue={searchCategoryValue}
                setSearchValue={setSearchCategoryValue}
                className={'z-40'}
                more={<IoClose onClick={() => { setSearchCategoryValue('') }} className="text-xl cursor-pointer" />}
              ></DropdownSearch>

              <DropdownSearch
                label={"Utilizador:"}
                options={userList}
                searchValue={searchUserValue}
                setSearchValue={setSearchUserValue}
                more={<IoClose onClick={() => { setSearchUserValue('') }} className="text-xl cursor-pointer" />}
              ></DropdownSearch>

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
        {viewCreate && <FormCreateProduct viewCreate={viewCreate} setViewCreate={setViewCreate} />}
        <StockTable></StockTable>
      </div>
    </div>
  );
};

export default Stock;
