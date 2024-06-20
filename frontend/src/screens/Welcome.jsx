import React from 'react'
import SideBar from '../components/SideBar'

const Welcome = () => {
    return (
        <div className="flex flex-row">
            <SideBar />
            <div className="flex flex-col items-center gap-3 mt-44 p-3 w-full relative">
                <div className='text-5xl text-basepurple-500 font-bold '>Bem-vindo ao Better Stock</div>
                <div className='flex justify-center w-2/3 text-center'>Olá e bem-vindo! A nossa aplicação foi desenvolvida para facilitar a gestão do seu stock, oferecendo ferramentas poderosas e intuitivas. Estamos aqui para ajudar a manter tudo organizado e sob controlo.</div>
                <div className='flex justify-center w-2/3 text-center'>Explore as funcionalidades e aproveite ao máximo a nossa solução. Se precisar de ajuda, o nosso suporte está à disposição.</div>
                <div className='text-basepurple-500 flex justify-center w-2/3 text-center'>Obrigado por escolher a nossa aplicação!</div>
            </div>
        </div>
    )
}

export default Welcome