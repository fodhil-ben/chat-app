import { useContext } from "react"
import { AuthenticationContext } from '../context/AuthContext'

export const useLogout = () => {

    const { dispatch } = useContext(AuthenticationContext)
    const logout = () => {
        dispatch({ type: 'LOGOUT', payload: null })
        localStorage.removeItem('user')
    }
    return { logout }
}

