import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthenticationContext } from './context/AuthContext'
import { useLogout } from './hooks/useLogout'

function Navbar() {
    const [profileIsSelected, setProfileIsSelected] = useState(false)
    const { auth } = useContext(AuthenticationContext)
    const { logout } = useLogout()
    const handleLogout = () => {
        logout()
    }
    return (
        <nav className='py-5 px-10 flex justify-between items-center w-full z-20'>
            <div>
                <Link to='/' className='font-bold'>Home</Link>
            </div>
            <div className='justify-end'>
                {auth.user
                    ?
                    <div className='flex gap-5'>
                        {profileIsSelected
                            ? <Link to='/chat' className='font-bold' onClick={() => setProfileIsSelected(false)}>Chat</Link>
                            : <Link to='/profile' className='font-bold' onClick={() => setProfileIsSelected(true)}>Profile</Link>}
                        <div onClick={handleLogout} className='font-bold cursor-pointer' >Logout</div>
                    </div>
                    :
                    <div className='flex gap-5'>
                        <Link to='/sign' className='font-bold' >Sign in</Link >
                        <Link to='/login' className='font-bold' >Login</Link >
                    </div>
                }
            </div>
        </nav >
    )
}

export default Navbar