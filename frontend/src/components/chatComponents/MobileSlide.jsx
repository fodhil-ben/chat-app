import { AiFillDelete, AiOutlineMenu } from "react-icons/ai"
import { RiEdit2Fill } from "react-icons/ri"
import { VscAdd } from "react-icons/vsc"
import { RxExit } from "react-icons/rx"
import { IconContext } from "react-icons";
import { useState, useEffect, useContext } from "react"
import Popup from "./Popup"
import useGroups from '../..//hooks/useGroups'
import { AuthenticationContext } from "../../context/AuthContext";
import { GroupsContext } from "../../context/GroupsContext";
import { UsersContext } from "../../context/UsersContext";
import { GiCancel } from "react-icons/gi";
import Confirmation from "./Confirmation";
import EditGroup from "./EditGroup";


function MobileSlide({ name, chatSelected, setChatSelected }) {
    const [showPopup, setShowPopup] = useState(false)
    const { deleteError, setDeleteError } = useGroups()
    const { auth } = useContext(AuthenticationContext)
    const { groups, setActiveGroup, activeGroup } = useContext(GroupsContext)
    const { users } = useContext(UsersContext)
    const [members, setMembers] = useState([])
    const [confirmation, setConfirmation] = useState(false)
    const [deletedGroup, setDeletedGroup] = useState(null)
    const [editedGroup, setEditedGroup] = useState(null)
    const [edit, setEdit] = useState(false)
    const [ShowSidebar, setShowSidebar] = useState(false)

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
    const handleExit = () => {
        setChatSelected(!chatSelected)
        setActiveGroup(null)
    }

    const handleGroup = (g) => {
        setChatSelected(!chatSelected)
        setActiveGroup(g.group_id)

    }
    useEffect(() => {
        localStorage.setItem('chatIsSelected', chatSelected)
        localStorage.setItem('activeGroup', activeGroup)
    }, [chatSelected, activeGroup])

    useEffect(() => {
        var realMembers = []
        groups.map(e => {
            if (e.group_id === activeGroup) {
                realMembers = e.group_members.filter(mem => mem !== auth.user.id)
            }
        })
        var membersNames = []
        users.map(e => {
            realMembers.includes(e.id) && membersNames.push(e.username)
        })
        setMembers(membersNames)
        localStorage.setItem('members', JSON.stringify(membersNames));

    }, [activeGroup, users, auth, groups])

    useEffect(() => {
        const storedMembers = JSON.parse(localStorage.getItem('members')) || [];
        setMembers(storedMembers);
    }, []);

    return (
        <>
            <button onClick={() => setShowSidebar(!ShowSidebar)} className="absolute right-2 top-28 font-bold text-5xl pr-2 md:hidden"><AiOutlineMenu></AiOutlineMenu></button>
            <div id="mobileSlide" className={ShowSidebar ? 'flex md:hidden  flex-col flex-grow border-r pr-3  border-r-white z-40 w-full absolute left-0' : ' md:hidden hidden flex-col flex-grow border-r pr-3 border-r-white z-40 w-11/12 absolute left-0'}>
                <header className='border-b border-b-white border-b-solid pr-2 pb-1'>
                    <h1 className='flex justify-between items-center font-bold text-2xl pt-3 pb-1 pl-5 tracking-wide'>
                        {name}
                        <GiCancel className="text-2xl" onClick={() => setShowSidebar(false)} />
                    </h1>
                    {name === "Members"
                        ? <IconContext.Provider value={{ className: "Icon text-2xl text-white  tracking-wide cursor-pointer" }}>
                            <div className='flex justify-end pb-2'>
                                <RxExit onClick={handleExit} />
                            </div>
                        </IconContext.Provider>
                        : <IconContext.Provider value={{ className: "Icon text-2xl text-white  tracking-wide cursor-pointer" }}>
                            <div className='flex justify-end pb-2'>
                                <VscAdd onClick={() => setShowPopup(true)} />
                            </div>
                        </IconContext.Provider>
                    }

                </header>
                <div id='elementsList' className='flex flex-grow flex-col gap-5 p-5 overflow-y-scroll'>
                    {(groups && name === 'Groups') && groups.map((g, i) => {
                        return (<div key={i} onClick={() => handleGroup(g)} className='w-full cursor-pointer slideElements z-10 text-left text-xl tracking-wide rounded-2xl font-bold shadow-md p-3 w-max-full'>
                            <div className="break-words inline"> {g.group_name} </div>
                            <div id="make_changes" className="flex gap-3 m-auto justify-end ">
                                <RiEdit2Fill onClick={(e) => { handleEditIcon(e, g) }} className="cursor-pointer z-20" />
                                <AiFillDelete onClick={(e) => { handleDeleteIcon(e, g) }} className="cursor-pointer z-20" />
                            </div>
                        </div>)
                    })}
                    {deleteError &&
                        <div id='deleteError' className="font-bold text-2xl flex items-center cursor-pointer">
                            {deleteError}
                            <IconContext.Provider value={{ id: 'cancelIcon', className: 'font-bold text-4xl' }}>
                                <GiCancel onClick={() => setDeleteError(null)} />
                            </IconContext.Provider>
                        </div>}
                    {name === 'Members' && members.map((e, i) => {
                        return (<div key={i} className='w-full cursor-pointer slideElements z-10 text-left text-xl tracking-wide rounded-2xl font-bold shadow-md p-3 w-max-full'>
                            <div className="break-words inline"> {e} </div>
                            <div id="make_changes" className="flex gap-3 m-auto justify-end ">
                            </div>
                        </div>)
                    })}
                </div>
                {showPopup && (
                    <Popup setShowPopup={setShowPopup} users={users} />
                )}
                {confirmation && <Confirmation setConfirmation={setConfirmation} deletedGroup={deletedGroup} />}
                {edit && <EditGroup setEdit={setEdit} setEditedGroup={setEditedGroup} editedGroup={editedGroup} />}
            </div >
        </>
    )
}

export default MobileSlide