import React from 'react'
import SideBar from '../components/SideBar'

const History = () => {
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