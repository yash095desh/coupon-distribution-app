import { useEffect, useState } from 'react'
import AuthProvider, { useAuth } from './context/AuthContext'
import { BrowserRouter as Router, Routes , Route , useNavigate, Navigate} from "react-router-dom"
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import AdminPanel from './pages/AdminPanel'



const AutoRedirects = () =>{
  const {user} = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(()=>{
    if( token && user){
      navigate("/admin");
    }
  },[user,token,navigate])
  return null;
}

function PrivateRoute({children}){
  const {user} = useAuth();
  return user ? children : <Navigate to={"/login"} />
}

function RedirectIfAuthenticated({children}){
  const {user} = useAuth()
  return user ? <Navigate to={"/admin"}/> : children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AutoRedirects/>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/login' element={<RedirectIfAuthenticated><Login/></RedirectIfAuthenticated>}/>
          <Route path='/admin' element={<PrivateRoute><AdminPanel/></PrivateRoute>}/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
