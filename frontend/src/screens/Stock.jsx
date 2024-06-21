import React, { useState, useRef, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios'
import SideBar from "../components/SideBar";
import ButtonOption from "../components/buttons/ButtonOption";
import ButtonFilter from "../components/buttons/ButtonFilter";
import Dropdown from "../components/Dropdown/Dropdown";
import DropdownCheck from "../components/Dropdown/DropdownCheck";
import DropdownSearch from "../components/Dropdown/DropdownSearch";
import StockTable from "../components/StockTable";
import FormCreateProduct from "../components/FormCreateProduct";
import FormDeleteProduct from "../components/FormDeleteProduct";
import ReactToPrint from 'react-to-print'


import { useDispatch, useSelector } from "react-redux";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { setProducts, setStatus, setError, resetFilters, setColumns, setSearchName, setSearchStock, setSearchCategory, setSearchUser, setSearchPrice, setSearchDate, setSearchReStock, setFormFeedback, setPrintStockTable } from "../slices/productsSlice";

import { FaMagnifyingGlass, FaWrench, FaFilter, FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import { IoReloadCircle, IoClose } from "react-icons/io5";
import { FaPrint } from "react-icons/fa";
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
    setSearchReStock("");
    setStockInput("");
    setStockSecondInput("");
    setStartDate(null);
    setEndDate(null);
    setPriceInput("");
    setReStockValue("");
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

  //Price

  const [priceChoice, setPriceChoice] = useState('Exato');
  const [priceInput, setPriceInput] = useState('');
  const [priceSecondInput, setPriceSecondInput] = useState('');

  useEffect(() => {
    dispatch(setSearchPrice({ priceChoice, priceInput, priceSecondInput }));
  }, [priceChoice, priceInput, priceSecondInput])

  //Date

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    dispatch(setSearchDate({
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    }));
  }, [startDate, endDate, dispatch]);

  //ReStock 

  const searchReStock = useSelector((state) => state.productsList.searchReStock);
  const [reStockValue, setReStockValue] = useState(searchReStock);
  const reStockList = ["", "Necessária", "Não necessária", "Em progresso"]

  useEffect(() => {
    dispatch(setSearchReStock(reStockValue));
  }), [reStockValue, dispatch]

  //columns
  const columnsList = useSelector((state) => state.productsList.columns);
  const columnsAllOptions = [
    "Nome",
    "Categoria",
    "Marca",
    "Informação",
    "Preço",
    "Preço Original",
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

  const [viewCreate, setViewCreate] = useState(false)
  const [viewDelete, setViewDelete] = useState(false)

  const formFeedback = useSelector((state) => state.productsList.formFeedback);

  useEffect(() => {
    let timer;
    if (formFeedback) {
      timer = setTimeout(() => {
        dispatch(setFormFeedback(''));
      }, 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };

  }, [formFeedback, dispatch])


  //Print

  const componentRef = useRef();

  const handlePrintTable = () => {
    dispatch(setPrintStockTable(true));
  };

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
            <ButtonOption onClick={() => { setViewDelete(!viewDelete) }} className="flex flex-row justify-between items-center">
              <div>Remover</div>
              <FaCircleMinus />
            </ButtonOption>
          </div>

          {/* Filtros _______________________________________________________________ */}

          <div className="flex flex-row gap-3 items-center">
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
                <ButtonFilter >
                  <div>Filtros</div>
                  <FaFilter />
                </ButtonFilter>}
              classNameContainer="w-fit flex flex-col gap-3.5 p-2 mt-2"
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


              <div className="flex flex-row items-center justify-between" >
                <div className="flex flex-row ">
                  <div className="w-20">Reposição:</div>
                  <Dropdown
                    trigger={
                      <div className="flex cursor-pointer w-52 h-[25px] flex-row gap-1 px-1 justify-between items-center border border-gray-500">
                        <div className="">{reStockValue}</div>
                        <IoIosArrowDown className="text-xs" />
                      </div>
                    }
                    classNameContainer='w-52 mt-1'
                  >
                    {reStockList.map((option) => (
                      <div onClick={() => { setReStockValue(option) }} className=" flex flex-col justify-center p-1 px-2 h-[30px] hover:bg-gray-100 cursor-pointer" key={option}>{option}</div>
                    ))}
                  </Dropdown>

                </div>
                <IoClose onClick={() => { [setReStockValue('')] }} className="text-xl cursor-pointer" />
              </div>



              <DropdownSearch
                label={"Categoria:"}
                options={categoryList}
                searchValue={searchCategoryValue}
                setSearchValue={setSearchCategoryValue}
                className={'z-40'}
                placeholder={'Pesquisar...'}
                more={<IoClose onClick={() => { setSearchCategoryValue('') }} className="text-xl cursor-pointer" />}
              ></DropdownSearch>

              <DropdownSearch
                label={"Utilizador:"}
                options={userList}
                searchValue={searchUserValue}
                setSearchValue={setSearchUserValue}
                className={'z-30'}
                placeholder={'Pesquisar...'}
                more={<IoClose onClick={() => { setSearchUserValue('') }} className="text-xl cursor-pointer" />}
              ></DropdownSearch>

              <div className="flex flex-row items-center justify-between" >
                <div className="flex flex-row ">
                  <div className="w-20">Preço:</div>
                  <Dropdown
                    trigger={
                      <div className="flex cursor-pointer w-[80px] flex-row gap-1 px-1 justify-between items-center border border-gray-500 rounded mr-1">
                        <div className="">{priceChoice}</div>
                        <IoIosArrowDown className="text-xs" />
                      </div>
                    }
                    classNameContainer='w-[80px] mr-1 mt-1'
                  >
                    {stockFilterList.map((option) => (
                      <div onClick={() => { setPriceChoice(option) }} className="p-1 px-2 hover:bg-gray-100 cursor-pointer" key={option}>{option}</div>
                    ))}
                  </Dropdown>

                  <input
                    type="text"
                    onChange={(e) => { setPriceInput(e.target.value) }}
                    value={priceInput}
                    className="pl-1 w-14 border border-gray-500"
                  />

                  {priceChoice === "Entre" ? (
                    <div className="flex flex-row">
                      <div className="mx-0.5"> - </div>
                      <input
                        type="text"
                        onChange={(e) => { setPriceSecondInput(e.target.value) }}
                        value={priceSecondInput}
                        className="pl-1 w-14 border border-gray-500"
                      />
                    </div>
                  ) : (<div></div>)}

                </div>
                <IoClose onClick={() => { [setPriceInput(''), setPriceSecondInput('')] }} className="text-xl cursor-pointer" />
              </div>

              <div className="flex flex-row items-start">
                <label className="w-20">Data:</label>
                <div className="flex flex-row items-center">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Data inicial"
                    className="border border-gray-500 rounded pl-1 w-24"
                  />
                  <span className="mx-1">-</span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Data final"
                    className="border border-gray-500 rounded pl-1 w-24"
                  />
                  <IoClose onClick={() => { setStartDate(null); setEndDate(null); }} className="text-xl cursor-pointer ml-2" />
                </div>
              </div>

            </Dropdown>

            <DropdownCheck
              className="w-44"
              options={columnsAllOptions}
              selectedOptions={columnsList}
              onOptionSelect={handleColumnSelect}
            >
              <ButtonFilter>
                <div>Colunas</div>
                <FaWrench />
              </ButtonFilter>
            </DropdownCheck>

            <div onClick={handlePrintTable}>
              <ReactToPrint
                trigger={() =>

                  <ButtonFilter>
                    <div>Imprimir</div>
                    <FaPrint />
                  </ButtonFilter>

                }
                content={() => componentRef.current}
                documentTitle='new document'
                pageStyle='print'
              />
            </div>
          </div>
        </div>
        {viewCreate && <FormCreateProduct viewCreate={viewCreate} setViewCreate={setViewCreate} />}
        {viewDelete && <FormDeleteProduct viewDelete={viewDelete} setViewDelete={setViewDelete} />}

        <div ref={componentRef} className="flex flex-col">
          <StockTable />
        </div>

        {formFeedback &&
          <div className="flex flex-row justify-between items-center sticky bg-[#1d3557] py-2 px-3 w-96 text-white bottom-10 left-3 rounded-r-3xl">
            <div>{formFeedback}</div>
            <IoClose className="cursor-pointer text-lg" onClick={() => { dispatch(setFormFeedback('')) }} />
          </div>}

      </div>
    </div>
  );
};

export default Stock;
