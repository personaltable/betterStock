import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import axios from 'axios'

export default function BarChart({ productsListBar }) {

    let categoryCounts = productsListBar.reduce((counts, product) => {
        const categoryName = product.category.name;
        if (counts[categoryName]) {
            counts[categoryName]++;
        } else {
            counts[categoryName] = 1;
        }
        return counts;
    }, {});

    let dataList = Object.keys(categoryCounts).map((category, index) => {
        return { categoryName: category, count: categoryCounts[category] };
    });

    let PieCategoryName = dataList.map((data) => { return `${data.categoryName} - ${data.count}` })
    let PieCategoryCount = dataList.map((data) => { return data.count })


    const [productsList, setProductsList] = useState([]);
    console.log(productsList);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:5555/api/products`);
            setProductsList(response.data)
        }

        fetchData();
    }, [])



    const stockValues = productsList.map(product => product.stock);
    const stockName = productsList.map(product => product.name);
    console.log(`produtos stock ${stockName}`);

    const chartConfig = {
        type: "bar",
        height: 190,
        width: 430,
        series: PieCategoryCount,
        options: {
            chart: {
                toolbar: {
                    show: false,
                },
            },
            title: {
                show: "",
            },
            dataLabels: {
                enabled: false,
            },
            colors: ["#020617"],
            plotOptions: {
                bar: {
                    columnWidth: "40%",
                    borderRadius: 3,
                },
            },
            xaxis: {
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: "#616161",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
                categories: stockName,
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#616161",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
            },
            grid: {
                show: true,
                borderColor: "#dddddd",
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 0,
                    right: 20,
                },
            },
            fill: {
                opacity: 0.8,
            },
            tooltip: {
                theme: "dark",
            },
        },
    };

    const labels = PieCategoryName;

    return (
        <Card>
            <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
            >
                <div>
                    <Typography variant="h6" color="blue-gray">

                    </Typography>
                    <Typography
                        variant="small"
                        color="gray"
                        className="max-w-sm font-normal"
                    >
                    </Typography>
                </div>
            </CardHeader>
            <CardBody className="px-2 pb-0 shadow-md shadow-white">
                <Chart {...chartConfig} />
            </CardBody>
        </Card>
    );
}
