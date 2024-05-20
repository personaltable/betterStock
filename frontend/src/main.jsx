import React from 'react'
import ReactDOM from 'react-dom/client'
import store from './store.js'
import { Provider } from 'react-redux'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Login from './screens/Login.jsx'
import Register from './screens/Register.jsx'
import Dashboard from './screens/Dashboard.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Login />} />
      <Route index={true} path="/register" element={<Register />} />
      <Route index={true} path="/dashboard" element={<Dashboard />} />
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
