import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';

import { AiFillDashboard } from "react-icons/ai";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { AiOutlineProduct } from "react-icons/ai";

function SideBar() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.log(err)
    }
  }

  const { userInfo } = useSelector((state) => state.auth)

  console.log(userInfo)

  return (
    <div className='flex flex-col sticky top-0 bg-zinc-900 min-w-64 max-w-64 h-screen text-xl p-6 gap-28 text-gray-300'>

      <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-row items-center gap-3'>
          <FaUserCircle className='w-6 h-6' />
          <div className={`${userInfo.name.length <= 18 ? 'text-lg max-w-32' : 'text-sm'}`}>
            {userInfo ? userInfo.name : null}
          </div>
        </div>
        <IoIosLogOut
          onClick={logoutHandler}
          className='cursor-pointer w-6 h-6' />
      </div>


      <div className='flex flex-col gap-3'>
        {userInfo && (userInfo.role === 'admin' || userInfo.role === 'data analyst') && (
          <div className='flex flex-row items-center gap-2'><AiFillDashboard /><Link to="/dashboard">DashBoard</Link></div>
        )}
        {userInfo && (userInfo.role === 'admin' || userInfo.role === 'stock manager') && (
          <>
            <div className='flex flex-row items-center gap-2'><GiCardboardBoxClosed /><Link to="/stock">Stock</Link></div>
            <div className='flex flex-row items-center gap-2'><FaUserCircle /><Link to="/history">Histórico</Link></div>
          </>
        )}
        {userInfo && (userInfo.role === 'admin' || userInfo.role === 'employee') && (
          <>
            <div className='flex flex-row items-center gap-2'><AiOutlineProduct /><Link to="/CategoryPage">Produtos</Link></div>
          </>
        )}
      </div>

    </div>
  )
}

export default SideBar