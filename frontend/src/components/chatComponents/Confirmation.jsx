import { useContext, useState } from 'react'
import { GiCancel, GiConfirmed } from 'react-icons/gi'
import { AuthenticationContext } from '../../context/AuthContext'
import useGroups from '../../hooks/useGroups'
import ProcessingButton from '../uiComponents/ProcessingButton'


export default function Confirmation({ setConfirmation, deletedGroup }) {


    const { auth } = useContext(AuthenticationContext)
    const { deleteGroup, isLoading, deleteError, message } = useGroups()
    const handleDelete = () => {
        deleteGroup(auth.user.id, deletedGroup.group_id, deletedGroup.group_name)
        if (isLoading) {
            setConfirmation(false)
        }

    }
    const handleCancel = () => {
        setConfirmation(false)
    }
    return (
        <div id="EditPopup" className='absolute z-50 w-screen h-screen p-0 right-0 top-0 opacity-95' >
            <div id="editCard" className='p-5 rounded-2xl relative w-3/4 top-1/4 m-auto flex flex-col gap-5'>
                <h1 className='font-bold text-2xl'>Do you confirm deleting this Group, by deleting the group all the messages of this group will be deleted</h1>
                <div className='flex justify-center gap-5'>
                    {!isLoading && !message && !deleteError && <button onClick={handleDelete} className='flex items-center rounded-2xl py-2 w-fit px-5 m-auto font-bold text-2xl'>
                        Confirm
                        <GiConfirmed></GiConfirmed>
                    </button>}
                    {!isLoading && <button onClick={handleCancel} className='flex items-center rounded-2xl py-2 w-fit px-5 m-auto font-bold text-2xl'>
                        Cancel
                        <GiCancel></GiCancel>
                    </button>}
                    {isLoading && <ProcessingButton />}
                </div>
            </div>
            {message && <div id='message' className='relative top-1/4 m-auto mt-10 text-red w-3/4 rounded-md border-2 font-bold p-5'>{message}</div>}
            {deleteError && <div id='error' className='relative top-1/4 m-auto mt-10 text-red w-3/4 rounded-md border-2 font-bold p-5'>{deleteError}</div>}
        </div>
    )
}
