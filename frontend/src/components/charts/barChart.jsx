import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import axios from 'axios';

export default function BarChart({ productsListBar }) {
    const categoryCounts = productsListBar.reduce((counts, product) => {
        const categoryName = product.category.name;
        if (counts[categoryName]) {
            counts[categoryName]++;
        } else {
            counts[categoryName] = 1;
        }
        return counts;
    }, {});

    const dataList = Object.keys(categoryCounts).map((category) => {
        return { categoryName: category, count: categoryCounts[category] };
    });

    const BarCategoryName = dataList.map((data) => `${data.categoryName} - ${data.count}`);
    const BarCategoryCount = dataList.map((data) => data.count);

    const chartConfig = {
        series: [
            {
                name: 'Count',
                data: BarCategoryCount,
            },
        ],
        options: {
            chart: {
                type: 'bar',
                height: 190,
                width: 430,
                toolbar: {
                    show: false,
                },
            },
            title: {
                text: '',
                align: 'center',
            },
            dataLabels: {
                enabled: false,
            },
            colors: ['#020617'],
            plotOptions: {
                bar: {
                    columnWidth: '40%',
                    borderRadius: 3,
                },
            },
            xaxis: {
                categories: BarCategoryName,
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: '#616161',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                        fontWeight: 400,
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#616161',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                        fontWeight: 400,
                    },
                },
            },
            grid: {
                show: true,
                borderColor: '#dddddd',
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
                theme: 'dark',
            },
        },
    };

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
                <Chart options={chartConfig.options} series={chartConfig.series} type="bar" height={190} />
            </CardBody>
        </Card>
    );
}
