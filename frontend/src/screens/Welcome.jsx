import React from 'react'
import SideBar from '../components/SideBar'

const Welcome = () => {
    return (
        <div className="flex flex-row">
            <SideBar />
            <div className="flex items-center justify-center p-3 w-full relative">
                <div className='text-5xl text-basepurple-500 font-bold '>Bem-vindo ao Better Stock</div>
            </div>
        </div>
    )
}

export default Welcome