import { useState } from 'react'
import useUsers from '../../hooks/useUsers'
import { GiCancel, GiConfirmed } from 'react-icons/gi'
import validator from 'validator'

export default function EditProfile({ type, setEdit }) {
    const { editEmail, editPassword, editUsername, error, message, setError, setMessage } = useUsers()
    const [oldValue, setOldValue] = useState('')
    const [newValue, setNewValue] = useState('')
    const handleEdit = () => {
        setError(null)
        setMessage(null)
        if (oldValue !== newValue) {
            switch (type) {
                case 'Username':
                    return editUsername(oldValue, newValue)
                case 'Email': {
                    if (validator.isEmail(newValue)) {
                        return editEmail(oldValue, newValue)
                    } else return setError('Enter a Valid Email !!')
                }
                case 'Password':
                    return editPassword(oldValue, newValue)
                default:
                    return null
            }
        }

    }

    const cancelEdit = () => {
        setEdit(false)
    }

    return (
        <div id="EditPopup" className='absolute z-50 w-screen h-screen p-0 right-0 top-0 opacity-95' >
            <div id="editCard" className='p-5 rounded-2xl relative w-3/4 top-1/4 m-auto flex flex-col gap-5'>
                <div id="old" className='flex flex-col gap-2 font-bold text-2xl'>
                    Old {type}
                    <input type={type === 'Email' ? 'email' : ''} value={oldValue} onChange={(e) => { setOldValue(e.target.value) }} className='rounded-lg p-2' />
                </div>
                <div id="new" className='flex flex-col gap-2 font-bold text-2xl'>
                    New {type}
                    <input type={type === 'email' ? 'email' : ''} value={newValue} onChange={(e) => { setNewValue(e.target.value) }} className='rounded-lg p-2' />
                </div>
                <div className='flex flex-col justify-center gap-5'>
                    <button onClick={handleEdit} className='flex items-center gap-10 rounded-2xl py-2 w-fit px-5 m-auto font-bold text-2xl'>
                        Confirm
                        <GiConfirmed></GiConfirmed>
                    </button>
                    <button onClick={cancelEdit} className='flex items-center gap-10 rounded-2xl py-2 w-fit px-5 m-auto font-bold text-2xl'>
                        Cancel
                        <GiCancel></GiCancel>
                    </button>
                </div>
            </div>
            {error && <div id='error' className='relative top-1/4 m-auto mt-10 text-red w-3/4 rounded-md border-2 font-bold p-5'>{error}</div>}
            {message && <div id='message' className='relative top-1/4 m-auto mt-10 text-red w-3/4 rounded-md border-2 font-bold p-5'>{message}</div>}
        </div>
    )
}
