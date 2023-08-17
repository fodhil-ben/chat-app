import { useCallback, useContext, useEffect, useState } from 'react'
import { AuthenticationContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { UsersContext } from '../context/UsersContext'

const useUsers = () => {
    const navigate = useNavigate()
    const { auth, dispatch, BASE_URL } = useContext(AuthenticationContext)
    const { setUsers } = useContext(UsersContext)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const getUsers = useCallback(async () => {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/api/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            }
        })
        const json = await response.json()
        setUsers(json.users)
        setIsLoading(false)
    }, [BASE_URL, auth, setUsers])

    const editUsername = async (oldUsername, username) => {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/api/users/editUsername`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            },
            body: JSON.stringify({ oldUsername, username })
        })
        const json = await response.json()
        if (!response.ok) {
            setIsLoading(false)
            if (!json.errorMessage) navigate('/InternalServerErr')
            else {
                setError(json.errorMessage)
                setMessage(null)
            }
        }
        else {
            setIsLoading(false)
            dispatch({ type: 'EDIT', payload: { id: auth.user.id, email: auth.user.email, username: json.username.username, token: auth.user.token } })
            setError(null)
            setMessage(json.message)
        }
    }
    const editEmail = async (oldEmail, email) => {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/api/users/editEmail`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            },
            body: JSON.stringify({ oldEmail, email })
        })
        const json = await response.json()
        if (!response.ok) {
            setIsLoading(false)
            if (!json.errorMessage) navigate('/InternalServerErr')
            else {
                setError(json.errorMessage)
                setMessage(null)
            }
        }
        else {
            setIsLoading(false)
            dispatch({ type: 'EDIT', payload: { id: auth.user.id, email: json.email.email, username: auth.user.email, token: auth.user.token } })
            setError(null)
            setMessage(json.message)
        }
    }

    const editPassword = async (oldPassword, password) => {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/api/users/editPassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            },
            body: JSON.stringify({ oldPassword, password })
        })
        const json = await response.json()
        if (!response.ok) {
            setIsLoading(false)
            if (!json.errorMessage) navigate('/InternalServerErr')
            else {
                setError(json.errorMessage)
                setMessage(null)
            }
        }
        else {
            setIsLoading(false)
            setError(null)
            setMessage(json.message)
        }
    }


    useEffect(() => {
        getUsers()
    }, [getUsers])
    return { getUsers, editEmail, editPassword, editUsername, error, message, setError, setMessage, isLoading }
}

export default useUsers
