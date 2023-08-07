import { useContext, useState } from "react"
import { AuthenticationContext } from "../context/AuthContext"

export const useSign = () => {
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { BASE_URL } = useContext(AuthenticationContext)
    const sign = async (username, email, password) => {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${BASE_URL}/api/sign`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        const json = await response.json()
        if (!response.ok) {
            setIsLoading(false)
            setError(json.message)
        }
        else {
            setMessage(json.message)
            setIsLoading(false)
        }

    }
    return { sign, error, isLoading, message }
}

