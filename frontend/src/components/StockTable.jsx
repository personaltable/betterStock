import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'

const StockTable = () => {

    const [data, setData] = useState([]);
    console.log(data);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:5555/api/products`);
            setData(response.data)
        }

        fetchData();
    }, [])



    return (
        <div>
            {data.map((produto, index) => (
                <div key={index}>{produto.name}</div>
            ))}
        </div>
    )
}

export default StockTable