import React from 'react'
import ReactDOM from 'react-dom/client'
import store from './store.js'
import { Provider } from 'react-redux'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute.jsx'
import Login from './screens/Login.jsx'
import Register from './screens/Register.jsx'
import Dashboard from './screens/Dashboard.jsx'
import Stock from './screens/Stock.jsx'
import ForgotPassword from './screens/ForgotPassword.jsx'
import CategoryPage from './screens/CategoryPage.jsx'
import Products from './screens/Products.jsx'
import History from './screens/History.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Login />} />
      <Route index={true} path="/register" element={<Register />} />
      <Route index={true} path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path='' element={<PrivateRoute />}>
        <Route index={true} path="/dashboard" element={<Dashboard />} />
        <Route index={true} path="/stock" element={<Stock />} />
        <Route index={true} path="/history" element={<History />} />
        <Route index={true} path="/CategoryPage" element={<CategoryPage />} />
        <Route index={true} path="/Products/:categoryId" element={<Products />} />

      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
)
