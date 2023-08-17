import { useState, useEffect, useContext } from 'react'
import useGroups from '../..//hooks/useGroups'
import Confirmation from "./Confirmation";
import EditGroup from "./EditGroup";
import { AiFillDelete } from "react-icons/ai"
import { RiEdit2Fill } from "react-icons/ri"
import { VscAdd } from "react-icons/vsc"
import { GroupsContext } from '../../context/GroupsContext';
import { IconContext } from "react-icons";
import Popup from './Popup';
import { UsersContext } from '../../context/UsersContext';
import ProcessingButton from '../uiComponents/ProcessingButton';

function Menu({ chatSelected, setChatSelected }) {

    const [showPopup, setShowPopup] = useState(false)

    const [confirmation, setConfirmation] = useState(false)
    const [deletedGroup, setDeletedGroup] = useState(null)
    const [editedGroup, setEditedGroup] = useState(null)
    const [edit, setEdit] = useState(false)
    const { setActiveGroup, activeGroup } = useContext(GroupsContext)
    const { users } = useContext(UsersContext)


    const { groups, getGroups, deleteError, setDeleteError } = useGroups()
    useEffect(() => {
        localStorage.setItem('chatIsSelected', chatSelected)
        localStorage.setItem('activeGroup', JSON.stringify(activeGroup))
    }, [chatSelected, activeGroup])


    useEffect(() => {
        getGroups()
    }, [groups, activeGroup])

    const handleEditIcon = (e, g) => {
        e.stopPropagation()
        setEdit(true)
        setEditedGroup(g)
    }

    const handleDeleteIcon = (e, g) => {
        e.stopPropagation()
        setConfirmation(true)
        setDeletedGroup(g)
    }

    const handleGroup = (g) => {
        setChatSelected(!chatSelected)
        setActiveGroup(g.group_id)
    }



    return (
        <div id="Menu" className='flex flex-col flex-grow md:flex-grow-0 w-2/3 p-5 '>
            <header className='flex justify-between items-center p-3 pt-0  border-b border-b-solid border-b-white'>
                <h1 className='font-bold text-2xl pb-5'>Groups</h1>
                <IconContext.Provider value={{ className: "Icon text-2xl text-white  tracking-wide cursor-pointer" }}>
                    <div className='flex justify-end pb-2'>
                        <VscAdd onClick={() => setShowPopup(true)} />
                    </div>
                </IconContext.Provider>
            </header>
            <div id="groups" className='pt-5 flex flex-col gap-5'>
                {groups.map((g, i) => {
                    return (<div key={i} onClick={() => handleGroup(g)} className='cursor-pointer slideElements w-full z-10 text-left text-xl tracking-wide rounded-2xl font-bold shadow-md p-3 w-max-full'>
                        <div className="break-words inline"> {g.group_name} </div>
                        <div id="make_changes" className="flex gap-3 m-auto justify-end ">
                            <RiEdit2Fill onClick={(e) => { handleEditIcon(e, g) }} className="cursor-pointer z-20" />
                            <AiFillDelete onClick={(e) => { handleDeleteIcon(e, g) }} className="cursor-pointer z-20" />
                        </div>
                    </div>)
                })}
            </div>
            {deleteError &&
                <div id='deleteError' className="font-bold text-2xl flex items-center cursor-pointer">
                    {deleteError}
                    <IconContext.Provider value={{ id: 'cancelIcon', className: 'font-bold text-4xl' }}>
                        <GiCancel onClick={() => setDeleteError(null)} />
                    </IconContext.Provider>
                </div>}

            {confirmation && <Confirmation setConfirmation={setConfirmation} deletedGroup={deletedGroup} />}
            {edit && <EditGroup setEdit={setEdit} setEditedGroup={setEditedGroup} editedGroup={editedGroup} />}
            {showPopup && (
                <Popup setShowPopup={setShowPopup} users={users} />
            )}
        </div>
    )
}

export default Menu