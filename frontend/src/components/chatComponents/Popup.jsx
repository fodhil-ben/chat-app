import { useContext, useEffect, useState } from 'react'
import useGroups from '../../hooks/useGroups'
import { AuthenticationContext } from '../../context/AuthContext'
import { ImCancelCircle } from 'react-icons/im'
import { IconContext } from 'react-icons'
export default function Popup({ setShowPopup, users }) {
    const { auth } = useContext(AuthenticationContext)
    const [groupName, setGroupName] = useState('')
    const [members, setMembers] = useState([])
    const [member, setMember] = useState('')
    const [searchedUsers, setSearchedUsers] = useState(users)
    const [error, setError] = useState(null)
    const { addGroup } = useGroups()

    const handleSubmit = (e) => {
        e.preventDefault()
        handleAddMember()
    }
    const handleAddMember = () => {
        if (member !== '') {
            let selectedUser = users.find(user => user.username === member)
            if (!selectedUser) setError('User Does Not Exists')
            else if (members.includes(selectedUser.id)) setError('User Already Added !')
            else if (selectedUser.id === auth.user.id) setError('You are already added')
            else {
                setMembers([...members, selectedUser.id])
                setMember('')
            }
        }
    }

    const handleCancel = (e) => {
        e.stopPropagation()
        setShowPopup(false)
    }

    const handleAddGroup = () => {
        addGroup(groupName, [...members, auth.user.id])
        setGroupName('')
        setMembers([])
        setShowPopup(false)

    }
    useEffect(() => {
        const searched = users.filter((e) => { return e.username.startsWith(member) && member.length > 0 })
        setSearchedUsers(searched)
    }, [member, users])


    return (
        <div id="PopupParent" className='absolute z-50 w-full h-full p-0 right-0 top-0 opacity-90'>
            <div id="popup" className='relative w-3/4 top-1/4 m-auto flex flex-col gap-2'>
                <form onSubmit={(e) => { handleSubmit(e) }} id='addForm' className='flex flex-col gap-4 p-5 pb-7 rounded-2xl'>

                    <div className='flex justify-between items-center pr-3'>
                        <label className='rounded-2xl font-bold pl-2 text-xl'>Group Info</label>
                        <IconContext.Provider value={{ className: 'text-2xl font-bolder cursor-pointer' }}>
                            <ImCancelCircle onClick={(e) => { handleCancel(e) }} />
                        </IconContext.Provider>
                    </div>
                    <input className='rounded-2xl p-2' value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                    <input className='rounded-2xl p-2' value={member} onChange={(e) => { setMember(e.target.value), setError(null) }} />
                    <button onClick={handleAddMember} className='rounded-2xl p-1 w-fit px-10 m-auto font-bold text-lg'>Add Member</button>
                </form>
                <button onClick={handleAddGroup} className='rounded-2xl p-2 w-fit px-10 m-auto font-bold text-lg'>Add Group</button>
            </div>
            {error && <div id='popupError' className='relative m-auto text-red w-3/4 rounded-md  text-red-600 border-2 border-solid border-red-600 p-5'>{error}</div>}
            {searchedUsers.length > 0 && <div id="users_list" className='relative m-auto w-3/4  flex flex-col gap-4 p-5 rounded-2xl overflow-scroll h-1/2'>
                {searchedUsers.length > 0 && searchedUsers.map((e, i) => {
                    return (<div className='searchedUser rounded-2xl p-2 flex justify-between font-bold text-lg' key={i}>
                        {e.username}
                        {members.includes(e.username) && <div>Already Added</div>}
                    </div>)
                })}
            </div>}
        </div>
    )
}
