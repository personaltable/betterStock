import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { setProducts, setStatus, setError} from '../slices/productsSlice';

const StockTable = () => {

    const dispatch = useDispatch()
    const { data: products, error, isLoading } = useGetProductsQuery()

    useEffect(() => {
        if (isLoading) {
            dispatch(setStatus('loading'))
        } else if (error) {
            dispatch(setError(error))
            dispatch(setStatus('failed'))
        } else {
            dispatch(setProducts(products))
            dispatch(setStatus('succeeded'))
        }
    }, [isLoading, error, products, dispatch])

    const productsState = useSelector(state => state.productsList.products)
    console.log(productsState)



    // const [data, setData] = useState([]);
    // console.log(data);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await axios.get(`http://localhost:5555/api/products`);
    //         setData(response.data)
    //     }

    //     fetchData();
    // }, [])



    return (
        <div>
            {productsState.map((produto, index) => (
                <div key={index}>{produto.name}</div>
            ))}
            {/* {data.map((produto, index) => (
                <div key={index}>{produto.name}</div>
            ))} */}
        </div>
    )
}

export default StockTable