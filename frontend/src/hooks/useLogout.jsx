import { useContext } from "react"
import { AuthenticationContext } from '../context/AuthContext'

export const useLogout = () => {

    const { dispatch } = useContext(AuthenticationContext)
    const logout = () => {
        dispatch({ type: 'LOGOUT', payload: null })
        localStorage.removeItem('user')
        localStorage.removeItem('activeGroup')
        localStorage.removeItem('members')
        localStorage.removeItem('chatIsSelected')
    }
    return { logout }
}

