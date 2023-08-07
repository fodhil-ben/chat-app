import { useReducer, createContext, useEffect } from "react";

export const AuthenticationContext = createContext()

export const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload }
        case "LOGOUT":
            return { user: null }
        case "EDIT":
            return { user: action.payload }
        default:
            return state
    }
}

export default function AuthContextProvider({ children }) {
    const BASE_URL = 'http://localhost:3001'
    const [auth, dispatch] = useReducer(AuthReducer, { user: null })
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            dispatch({ type: 'LOGIN', payload: user })
        }
    }, [])
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(auth.user))
    }, [auth.user])
    return (
        <AuthenticationContext.Provider value={{ auth, dispatch, BASE_URL }} >
            {children}
        </AuthenticationContext.Provider >
    )
}

