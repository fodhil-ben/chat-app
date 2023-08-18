import { useContext, useEffect, useState } from 'react'
import useGroups from '../../hooks/useGroups'
import { ImCancelCircle } from 'react-icons/im'
import { IconContext } from 'react-icons'
import { GroupsContext } from '../../context/GroupsContext'
import { UsersContext } from '../../context/UsersContext'
import ProcessingButton from '../uiComponents/ProcessingButton'

function AddUser({ setAddUser }) {
    const { users } = useContext(UsersContext)
    const [newUser, setNewUser] = useState('')
    const [searchedUsers, setSearchedUsers] = useState(users)
    const { addUserToGroup, isLoading, setIsLoading, error, message } = useGroups()
    const { activeGroup } = useContext(GroupsContext)

    const handleSubmit = (e) => {
        e.preventDefault()
        handleAddMember()
    }

    const handleCancel = (e) => {
        e.stopPropagation()
        setAddUser(false)
    }


    const handleAddMember = () => {
        const newUserId = users.filter(e => e.username === newUser)[0]
        addUserToGroup(newUserId.id, activeGroup)
        if (!isLoading) {
            if (!error) {
                setNewUser('')
            } else {
                setIsLoading(true)
            }
        }
    }
    useEffect(() => {
        const searched = users.filter((e) => { return e.username.startsWith(newUser) && newUser.length > 0 })
        setSearchedUsers(searched)
    }, [newUser, users])
    return (


        <div id="PopupParent" className='absolute z-50 w-full h-full p-0 right-0 top-0 opacity-90'>
            <div id="popup" className='relative w-3/4 top-1/4 m-auto flex flex-col gap-2 '>
                <form onSubmit={(e) => { handleSubmit(e) }} id='addForm' className='flex flex-col gap-4 p-5 pb-7 rounded-2xl'>
                    <div className='flex justify-between items-center pr-3'>
                        <label className='rounded-2xl font-bold pl-2 text-xl'>Group Info</label>
                        <IconContext.Provider value={{ className: 'text-2xl font-bolder cursor-pointer' }}>
                            <ImCancelCircle onClick={(e) => { handleCancel(e) }} />
                        </IconContext.Provider>
                    </div>
                    <input className='rounded-2xl p-2' value={newUser} onChange={(e) => setNewUser(e.target.value)} />
                </form>
                {!isLoading && <button onClick={handleAddMember} className='rounded-2xl p-2 w-fit px-10 m-auto font-bold text-lg'>Add User</button>}
                {isLoading && <ProcessingButton />}

            </div>
            {error && <div id='popupError' className='relative m-auto text-red w-3/4 rounded-md mt-20 border-2 border-solid  p-5'>{error}</div>}
            {message && <div id='message' className='addUserMessage relative m-auto text-red w-3/4 rounded-md mt-20 border-2 border-solid  p-5 top-1/4'>{message}</div>}
            {searchedUsers.length > 0 && <div id="users_list" className='relative m-auto w-3/4 top-1/4 flex flex-col gap-4 p-5 rounded-2xl overflow-scroll h-1/2'>
                {searchedUsers.length > 0 && searchedUsers.map((e, i) => {
                    return (<div className='searchedUser rounded-2xl p-2 flex justify-between font-bold text-lg' key={i}>
                        {e.username}
                    </div>)
                })}
            </div>}
        </div>
    )
}



export default AddUser