import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import SideBar from "../components/SideBar";
import ContainerHeader from "../components/containers/containerHeader";
import ContainerBody from "../components/containers/containerBody";
import DropdownCheck from "../components/Dropdown/DropdownCheck";
import PieChart from "../components/charts/pieChart";
import BarChart from "../components/charts/barChart";
import Tooltip from "../components/containers/ToolTip";
import { useDispatch, useSelector } from "react-redux";

import { IoSettingsOutline } from "react-icons/io5";
import { CiCircleQuestion } from "react-icons/ci";
import { setSearchReStock, setSearchStock } from "../slices/productsSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchStock = useSelector((state) => state.productsList.searchStock);

  const handleLowStockClick = () => {
    dispatch(setSearchStock({ stockChoice: "Abaixo", stockInput: 20 }));
    console.log(searchStock);
    navigate(`/Stock`);
  };

  const handleReStockClick = () => {
    dispatch(setSearchReStock("Necessária"));
    navigate(`/Stock`);
  };

  const handleProfitClick = () => {
    navigate(`/salesHistory`);
  };

  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:5555/api/products`);
      setProductsList(response.data);
    };

    fetchData();
  }, []);

  const [saleGains, setsaleGains] = useState([]);

  useEffect(() => {
    const requestData = async () => {
      try {
        const res = await axios.get(`http://localhost:5555/api/sales`);
        setsaleGains(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    requestData();
  }, []);

  const groupedData = useMemo(() => {
    const grouped = saleGains.reduce((acc, sale) => {
      const { reference } = sale;
      const profit = sale.information
        .reduce(
          (sum, info) =>
            sum +
            (info.product.price - info.product.originalPrice) * info.quantity,
          0
        )
        .toFixed(2);

       

      if (!acc[reference]) {
        acc[reference] = { reference, profit: `${profit} €` };
      } else {
        acc[reference].profit += `, ${profit} €`;
      }
      return acc;
    }, {});

    return Object.values(grouped);
  }, [saleGains]);

  const [totalProducts, setTotalProducts] = useState(0);
  useEffect(() => {
    setTotalProducts(productsList.length);
  }, [productsList]);

  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  useEffect(() => {
    setTotalProducts(productsList.length);
    const filteredProducts = productsList.filter(
      (product) => product.stock === 0
    );
    setOutOfStockProducts(filteredProducts);
  }, [productsList]);

  const [lowStockProducts, setLowStockProducts] = useState([]);
  useEffect(() => {
    setTotalProducts(productsList.length);
    const filteredOutOfStock = productsList.filter(
      (product) => product.stock === 0
    );
    setOutOfStockProducts(filteredOutOfStock);
    const filteredLowStock = productsList.filter(
      (product) => product.stock < product.lowStock
    );
    setLowStockProducts(filteredLowStock);
  }, [productsList]);

  const [columnsOptions, setColumnsOptions] = useState([
    "Todos os produtos",
    "Produtos sem stock",
    "Produtos com stock baixo",
  ]);
  const columnsAllOptions = [
    "Todos os produtos",
    "Produtos sem stock",
    "Produtos com stock baixo",
  ];

  const [columnsOptionsBody, setColumnsOptionsBody] = useState([
    "Quantidade por categoria(Pie)",
    "Produtos stock mais alto",
    "Produtos stock mais baixo",
    "Produtos com necessidade de re-stock",
    "Lucro de vendas",
  ]);
  const columnsAllOptionsBody = [
    "Quantidade por categoria(Pie)",
    "Quantidade por categoria(Barras)",
    "Produtos stock mais alto",
    "Produtos stock mais baixo",
    "Produtos com necessidade de re-stock",
    "Lucro de vendas",
  ];

  const getMostStockProducts = (products, topN) => {
    return products.sort((a, b) => b.stock - a.stock).slice(0, topN);
  };

  const getLowStockProducts = (products, topN) => {
    return products.sort((a, b) => a.stock - b.stock).slice(0, topN);
  };

  const topStockProducts = getMostStockProducts(productsList, 6);
  const lowStockProductsList = getLowStockProducts(productsList, 6);

  return (
    <div className="flex flex-row w-full">
      <SideBar />
      <div className="flex flex-col w-full">
        <div className="bg-basepurple-500 flex flex-row justify-between w-full p-3">
          <div className="flex flex-row gap-5">
            {columnsOptions.includes("Todos os produtos") ? (
              <ContainerHeader>
                <div className="text-lg">Todos os produtos</div>
                <div>{totalProducts}</div>
              </ContainerHeader>
            ) : null}

            {columnsOptions.includes("Produtos sem stock") ? (
              <ContainerHeader>
                <div className="text-lg">Produtos sem stock</div>
                <div>{outOfStockProducts.length}</div>
              </ContainerHeader>
            ) : null}

            {columnsOptions.includes("Produtos com stock baixo") ? (
              <ContainerHeader>
                <div className="text-lg">Produtos com stock baixo</div>
                <div>{lowStockProducts.length}</div>
              </ContainerHeader>
            ) : null}
          </div>

          <div className="">
            <DropdownCheck
              className="w-64"
              options={columnsAllOptions}
              selectedOptions={columnsOptions}
              onOptionSelect={setColumnsOptions}
            >
              <div className="SettingsButtonGrey text-2xl cursor-pointer">
                <IoSettingsOutline />
              </div>
            </DropdownCheck>
          </div>
        </div>

        <div className="flex flex-row w-full justify-between">
          <div className="flex flex-wrap justify-start gap-5">
            {columnsOptionsBody.includes("Quantidade por categoria(Pie)") ? (
              <ContainerBody>
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between">
                    <div className="text-base font-semibold">
                      Quantidade por categoria
                    </div>
                    <Tooltip
                      content="Grafico Circular para visualizar a distribuição da quantidade de itens por categoria de forma proporcional, facilitando a compreensão das categorias mais representativas."
                      className="z-20"
                    >
                      <CiCircleQuestion />
                    </Tooltip>
                  </div>
                  <PieChart productsList={productsList} />
                </div>
              </ContainerBody>
            ) : null}

            {columnsOptionsBody.includes("Quantidade por categoria(Barras)") ? (
              <ContainerBody>
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between">
                    <div className="text-base font-semibold">
                      Quantidade por categoria
                    </div>
                    <Tooltip
                      content="Grafico de barras que exibe a quantidade de itens por categoria de maneira comparativa, permitindo uma análise visual das diferenças quantitativas entre as categorias."
                      className="z-20"
                    >
                      <CiCircleQuestion />
                    </Tooltip>
                  </div>
                  <BarChart productsListBar={productsList} />
                </div>
              </ContainerBody>
            ) : null}

            {columnsOptionsBody.includes("Produtos stock mais alto") ? (
              <ContainerBody>
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between mb-4">
                    <div className="text-base font-semibold">
                      Produtos com stock mais alto
                    </div>
                    <Tooltip
                      content="Esta seção exibe os produtos com a maior quantidade de stock disponível, destacando os itens mais bem abastecidos do inventário."
                      className="z-20"
                    >
                      <CiCircleQuestion />
                    </Tooltip>
                  </div>
                  <div className="flex flex-col">
                    {topStockProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex flex-row justify-between border-b border-gray-300  rounded shadow-sm"
                      >
                        <span className="font-medium text-sm p-2">
                          {product.name}
                        </span>
                        <span className="border-l border-gray-300 pl-4 ml-4 text-gray-600 text-sm w-14 p-2">
                          {product.stock}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ContainerBody>
            ) : null}

            {columnsOptionsBody.includes("Produtos stock mais baixo") ? (
              <ContainerBody>
                <div
                  onClick={() => {
                    handleLowStockClick();
                  }}
                  className="flex flex-col cursor-pointer"
                >
                  <div className="flex flex-row justify-between mb-4">
                    <div className="text-base font-semibold">
                      Produtos com stock mais baixo
                    </div>
                    <Tooltip
                      content="Nesta área, você encontrará os produtos com a menor quantidade de stock disponível, ajudando a identificar itens que podem precisar de reposição imediata."
                      className="z-20"
                    >
                      <CiCircleQuestion />
                    </Tooltip>
                  </div>
                  <div className="flex flex-col ">
                    {lowStockProductsList.map((product, index) => (
                      <div
                        key={index}
                        className="flex flex-row justify-between border-b border-gray-300  rounded shadow-sm"
                      >
                        <span className="font-medium text-sm p-2">
                          {product.name}
                        </span>
                        <span className="border-l border-gray-300 pl-4 ml-4 text-gray-600 text-sm w-14 p-2">
                          {product.stock}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ContainerBody>
            ) : null}

            {columnsOptionsBody.includes(
              "Produtos com necessidade de re-stock"
            ) ? (
              <ContainerBody>
                <div
                  onClick={() => {
                    handleReStockClick();
                  }}
                  className="flex flex-col h-full w-full cursor-pointer"
                >
                  <div className="flex flex-row justify-between mb-4">
                    <div className="text-base font-semibold">
                      Produtos com necessidade de re-stock
                    </div>
                    <Tooltip
                      content="Nesta área, você encontrará os produtos com a menor quantidade de stock disponível, ajudando a identificar itens que podem precisar de reposição imediata."
                      className="z-20"
                    >
                      <CiCircleQuestion />
                    </Tooltip>
                  </div>
                  <div className="flex flex-col">
                    {productsList
                      .filter((product) => product.reStock === "Necessária") // Filtra apenas produtos com reStock necessário
                      .map((product, index) => (
                        <div
                          key={index}
                          className="flex flex-row justify-between border-b border-gray-300 rounded shadow-sm"
                        >
                          <span className="font-medium text-sm p-2">
                            {product.name}
                          </span>
                          <span className="p-2 border-l border-gray-300 pl-4 ml-4 text-gray-600 text-sm w-14">
                            {product.stock}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </ContainerBody>
            ) : null}

            {columnsOptionsBody.includes("Lucro de vendas") ? (
              <ContainerBody>
                <div
                  className="flex flex-col h-full w-full cursor-pointer"
                  onClick={() => {
                    handleProfitClick();
                  }}
                >
                  <div className="flex flex-row justify-between mb-4">
                    <div className="text-base font-semibold">
                      Lucro de vendas
                    </div>
                    <Tooltip
                      content="Esta área mostra a referência das vendas e o lucro obtido de cada venda."
                      className="z-20"
                    >
                      <CiCircleQuestion />
                    </Tooltip>
                  </div>
                  <div className="flex flex-col">
                    {groupedData.map((sale, index) => (
                      <div
                        key={index}
                        className="flex flex-row justify-between border-b border-gray-300 rounded shadow-sm"
                      >
                        <span className="font-medium text-sm p-2">
                          {sale.reference}
                        </span>
                        <span className="p-2 border-l border-gray-300 pl-4 ml-4 text-gray-600 text-sm w-14">
                          {sale.profit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ContainerBody>
            ) : null}
          </div>

          <div className="">
            <DropdownCheck
              className="w-80"
              options={columnsAllOptionsBody}
              selectedOptions={columnsOptionsBody}
              onOptionSelect={setColumnsOptionsBody}
            >
              <div className=" flex text-2xl cursor-pointer p-1 m-1">
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
