import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";



export default function PieChart({ productsList }) {

    let categoryCounts = productsList.reduce((counts, product) => {
        const categoryName = product.category.name;
        if (counts[categoryName]) {
            counts[categoryName]++;
        } else {
            counts[categoryName] = 1;
        }
        return counts;
    }, {});

    // Criar a lista final com as cores
    let colorsList = ["#0D5DE9", "#E90D17", "#E90DC4", "#0DE93F", "#DFE90D"];

    let dataList = Object.keys(categoryCounts).map((category, index) => {
        let color = colorsList[index % colorsList.length];
        return { categoryName: category, count: categoryCounts[category], color };
    });

    let PieCategoryName = dataList.map((data) => { return `${data.categoryName} - ${data.count}` })
    let PieCategoryCount = dataList.map((data) => { return data.count })
    let PieCategoryColors = dataList.map((data) => { return data.color })


    const chartConfig = {
        type: "pie",
        width: 200,
        height: 200,
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
            colors: PieCategoryColors,
            legend: {
                show: false,
            },
        },
    };

    const colors = chartConfig.options.colors;
    const labels = PieCategoryName;

    return (
        <div className='flex flex-row'>
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
                <CardBody className="flex flex-row mt-4 place-items-center px-2 shadow-md shadow-white">
                    <Chart {...chartConfig} />
                    <div className="flex flex-col items-start">
                        {colors.map((color, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <div className="w-3 h-3 mr-2" style={{ backgroundColor: color }}></div>
                                <Typography variant="small" color="gray">{labels[index]}</Typography>
                            </div>
                        ))}
                    </div>
                </CardBody>

            </Card>
        </div>
    );
}
