import { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import LogIn from './pages/LogIn'
import Home from './pages/Home'
import CreateOwnBRGR from './pages/CreateOwnBRGR'
import ExploreMenu from './pages/ExploreMenu'
import AdminHome from './pages/AdminHome'
import ProtectedRoute from './context/ProjectedRoute'
import Unautherized from './pages/Unautherized'
import ItemForm from './pages/ItemForm'
import IngredientsForm from './pages/IngredientsForm'
import Order from './pages/Order'
import PlacedOrders from './pages/PlacedOrders'
import NavBarComponent from './components/NavBarComponent'
import { fetchAllOrders } from './context/AllOrdersContext'
import Register from './pages/Register'
import { userContext } from './context/ContextProvider'

function AppWrapper() {
  const {currentUser, role} = useContext(userContext);
  const location = useLocation();

  const pathsToExcludeNav = ['/login', '/register'];

  useEffect(() => {
    fetchAllOrders(role, currentUser)
  }, [role, currentUser])

  return (
    <>
      <div className='overflow-x-hidden'>
        {!pathsToExcludeNav.includes(location.pathname) && (
          <header>
              <NavBarComponent/>
          </header>
        )}

        <Routes>
          <Route path='/login' element={<LogIn/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/unautherized' element={<Unautherized/>} />

          <Route path='/' element={<Home/>} />
          <Route path='/menu' element={<ExploreMenu/>} />

          <Route path='/create' element={
            <ProtectedRoute roles={['admin', 'user']}>
              <CreateOwnBRGR/>
            </ProtectedRoute>
          } />

          <Route path='/order' element={
            <ProtectedRoute roles={['admin', 'user']}>
              <Order />
            </ProtectedRoute>
          } />

          <Route path='/placedOrders' element={
            <ProtectedRoute roles={['admin', 'user']}>
              <PlacedOrders />
            </ProtectedRoute>
          } />

          <Route path='/adminHome' element={
            <ProtectedRoute roles={['admin']}>
              <AdminHome />
            </ProtectedRoute>
          } />

          <Route path='/itemForm/:itemId?' element={
            <ProtectedRoute roles={['admin']}>
              <ItemForm />
            </ProtectedRoute>
          } />

          <Route path='/ingredientForm' element={
            <ProtectedRoute roles={['admin']}>
              <IngredientsForm />
            </ProtectedRoute>
          } />
          
        </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  )
}

export default App
