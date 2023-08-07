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
    if (!context) {
        throw Error('GroupContext must be used inside an WorkoutsContextProvider')
    }
    const { groups, dispatch } = context
    const [deleteError, setDeleteError] = useState(null)
    const getGroups = async () => {
        const response = await fetch(`${BASE_URL}/api/groups`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            }
        })
        const json = await response.json()
        if (!response.ok) navigate('/InternalServerErr')
        dispatch({ type: 'SET_GROUPS', payload: json.groups })

    }
    const addGroup = async (group_name, group_members) => {
        const response = await fetch(`${BASE_URL}/api/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            },
            body: JSON.stringify({ group_name, group_members })
        })
        if (!response.ok) {
            if (!json.messageError) navigate('/InternalServerErr')
            else {
                setDeleteError(json.messageError)
            }
        } const json = await response.json()
        dispatch({ type: 'ADD_GROUPS', payload: json.group })
    }

    const editGroup = async (group_id, oldGroup_name, group_name) => {
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
            if (!json.errorMessage) navigate('/InternalServerErr')
            else {
                setError(json.errorMessage)
                setMessage(null)
            }
        } else {
            setError(null)
            setMessage(json.message)
            dispatch({ type: 'EDIT_GROUPS', payload: json.group })
        }
    }

    const deleteGroup = async (user_id, group_id, group_name) => {
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
            if (!json.messageError) navigate('/InternalServerErr')
            else {
                setDeleteError(json.messageError)
            }
        }
        dispatch({ type: 'DELETE_GROUPS', payload: json.group_id })


    }

    return ({ groups, addGroup, getGroups, deleteGroup, deleteError, setDeleteError, editGroup, error, message, setError, setMessage })
}

export default useGroups
