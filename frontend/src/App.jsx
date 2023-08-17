import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from './components/Chat'
import Login from './components/Login'
import Sign from './components/Sign'
import './App.css'
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "./context/AuthContext";
import Navbar from "./Navbar";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import InternalError from "./components/InternalError";
import Profile from "./components/Profile";

function App() {
  const { auth } = useContext(AuthenticationContext)
  const [showNavbar, setshowNavBar] = useState(true)

  useEffect(() => {
    const show = ['/login', '/sign', '/', '/profile', '/chat'].includes(location.pathname)
    setshowNavBar(show)

  }, [])
  return (

    //add redirections

    <BrowserRouter>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path='login' element={auth.user ? <Navigate to='/chat' /> : <Login />} />
        <Route path='sign' element={auth.user ? <Navigate to='/chat' /> : <Sign />} />
        <Route path='chat' element={auth.user ? <Chat /> : <Navigate to='/login' />} />
        {/* <Route path='chat' element={!auth.user ? <Chat /> : <Navigate to='/login' />} /> */}
        <Route path='profile' element={auth.user ? <Profile /> : <Navigate to='/login' />} />
        <Route path='/' element={<Home />} />
        <Route path='/InternalServerErr' element={<InternalError />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}



export default App
