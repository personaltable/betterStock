import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import axios from 'axios'

const History = () => {

    const [historyData, setHistoryData] = useState({});

    useEffect(() => {
        const requestData = async () => {
            const res = await axios.get(`http://localhost:5555/api/actions`)
            setHistoryData(res.data)
        }
        requestData();
    }, [])
    console.log(historyData)

    return (
        <div className="flex flex-row">
            <SideBar />
            <div className="flex flex-col p-3 w-full relative">
                <div>History</div>
            </div>
        </div>
    )
}

export default History