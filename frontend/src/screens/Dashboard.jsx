import React from 'react'
import SideBar from '../components/SideBar'
import ContainerHeader from '../components/containers/containerHeader'
import ContainerBody from '../components/containers/containerBody'

const Dashboard = () => {
  return (
    <div className='flex flex-row '>
      <SideBar />

      {/* ----------------------------HEADER---------------------------------- */}

      <div className='flex flex-col w-full'>
        <div className='bg-gray-500'>
          <div className='  flex flex-row p-3 gap-5'>
            <ContainerHeader>
              <div>hi</div>
            </ContainerHeader>

            <ContainerHeader>
              <div>hi</div>
            </ContainerHeader>

            <ContainerHeader>
              <div>hi</div>
            </ContainerHeader>
          </div>
        </div>

        {/* -------------------------------BODY---------------------------- */}
        <div className='m-5'>
          <ContainerBody>
            <div>dvged</div>
          </ContainerBody>
        </div>

      </div>
    </div>
  )
}

export default Dashboard