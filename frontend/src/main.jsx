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
import Welcome from './screens/Welcome.jsx'
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Login />} />
      <Route index={true} path="/register" element={<Register />} />
      <Route index={true} path="/ForgotPassword" element={<ForgotPassword />} />

      <Route path="" element={<PrivateRoute />}>
        <Route index={true} path="/welcome" element={<Welcome />} />

        <Route path="/dashboard" element={<RoleProtectedRoute allowedRoles={['data analyst', 'admin']} />}>
          <Route index={true} element={<Dashboard />} />
        </Route>

        <Route path="/stock" element={<RoleProtectedRoute allowedRoles={['stock manager', 'admin']} />}>
          <Route index={true} element={<Stock />} />
        </Route>

        <Route path="/history" element={<RoleProtectedRoute allowedRoles={['stock manager', 'admin']} />}>
          <Route index={true} element={<History />} />
        </Route>

        <Route path="/CategoryPage" element={<RoleProtectedRoute allowedRoles={['employee', 'admin']} />}>
          <Route index={true} element={<CategoryPage />} />
        </Route>

        <Route path="/Products/:categoryId" element={<RoleProtectedRoute allowedRoles={['employee', 'admin']} />}>
          <Route index={true} element={<Products />} />
        </Route>
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
