import React from 'react'
import SideBar from '../components/SideBar'
import ButtonFilter from '../components/buttons/ButtonFilter'

const Stock = () => {
  return (
    <div className='flex flex-row'>
        <SideBar/>
        <div className='flex flex-col p-3'>
            <ButtonFilter>
                <div>hi</div>
            </ButtonFilter>

        </div>
    </div>
  )
}

export default Stock