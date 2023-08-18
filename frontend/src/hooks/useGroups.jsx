import { useContext, useState } from 'react'
import { AuthenticationContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { GroupsContext } from '../context/GroupsContext'

const useGroups = () => {
    const navigate = useNavigate()
    const { auth, BASE_URL } = useContext(AuthenticationContext)
    const context = useContext(GroupsContext)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    if (!context) {
        throw Error('GroupContext must be used inside an WorkoutsContextProvider')
    }
    const { groups, dispatch } = context
    const [deleteError, setDeleteError] = useState(null)
    const getGroups = async () => {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/api/groups`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            }
        })
        const json = await response.json()
        if (!response.ok) {
            setIsLoading(false)
            navigate('/InternalServerErr')
        }
        dispatch({ type: 'SET_GROUPS', payload: json.groups })
        setIsLoading(false)

    }
    const addGroup = async (group_name, group_members) => {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/api/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            },
            body: JSON.stringify({ group_name, group_members })
        })
        const json = await response.json()
        if (!response.ok) {
            if (!json.messageError) {
                navigate('/InternalServerErr')
                setIsLoading(false)
            }
            else {
                setDeleteError(json.messageError)
                setIsLoading(false)
            }
        } else {
            setMessage('Group added successfully')
            dispatch({ type: 'ADD_GROUPS', payload: json.group })
            setIsLoading(false)
        }
    }

    const editGroup = async (group_id, oldGroup_name, group_name) => {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/api/groups`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            },
            body: JSON.stringify({ group_id, oldGroup_name, group_name })
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            if (!json.messageError) navigate('/InternalServerErr')
            else {
                setError(json.messageError)
                setMessage(null)
            }
        } else {
            setIsLoading(false)
            setError(null)
            setMessage(json.message)
            dispatch({ type: 'EDIT_GROUPS', payload: json.group })
        }
    }
    const addUserToGroup = async (newUserId, group_id) => {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/api/groups/add_user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            },
            body: JSON.stringify({ newUserId, group_id })
        })
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            if (!json.messageError) navigate('/InternalServerErr')
            else {
                setError(json.messageError)
                setMessage(null)
            }
        } else {
            setIsLoading(false)
            setError(null)
            setMessage(json.message)
            dispatch({ type: 'EDIT_GROUPS', payload: json.group })
        }
    }

    const deleteGroup = async (user_id, group_id, group_name) => {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/api/groups`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            },
            body: JSON.stringify({ user_id, group_id, group_name })
        })
        const json = await response.json()
        if (!response.ok) {
            setIsLoading(false)
            if (!json.messageError) navigate('/InternalServerErr')
            else {
                setDeleteError(json.messageError)
            }
        }
        setMessage(json.message)
        dispatch({ type: 'DELETE_GROUPS', payload: json.group_id })
        setIsLoading(false)

    }



    return ({ addUserToGroup, groups, addGroup, getGroups, deleteGroup, deleteError, setDeleteError, editGroup, error, message, setError, setMessage, isLoading, setIsLoading })
}

export default useGroups
