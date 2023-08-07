import { useContext, useState } from "react"
import { AuthenticationContext } from '../context/AuthContext'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch, BASE_URL } = useContext(AuthenticationContext)

    const login = async (username, password) => {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        const json = await response.json()
        if (!response.ok) {
            setIsLoading(false)
            setError(json.message)
        }
        else {
            dispatch({ type: "LOGIN", payload: json.message })
            setMessage(json.message)
            setIsLoading(false)
            localStorage.setItem('user', JSON.stringify(json.message))
        }


    }
    return { login, error, isLoading, message }
}

