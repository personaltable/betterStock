import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

const chartConfig = {
    type: "pie",
    width: 200,
    height: 200,
    series: [44, 55, 13, 43, 22],
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
        colors: ["#020617", "#ff8f00", "#00897b", "#1e88e5", "#d81b60"],
        legend: {
            show: false,
        },
    },
};

export default function PieChart() {
    const colors = chartConfig.options.colors;
    const labels = ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'];

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
