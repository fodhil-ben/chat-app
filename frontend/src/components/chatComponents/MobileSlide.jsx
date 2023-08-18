import { AiOutlineMenu } from "react-icons/ai"
import { VscAdd } from "react-icons/vsc"
import { IconContext } from "react-icons";
import { useState, useEffect, useContext } from "react"
import Popup from "./Popup"
import { AuthenticationContext } from "../../context/AuthContext";
import { GroupsContext } from "../../context/GroupsContext";
import { UsersContext } from "../../context/UsersContext";
import { GiCancel } from "react-icons/gi";

import AddUser from "./AddUser";


function MobileSlide({ name, chatSelected }) {
    const [showPopup, setShowPopup] = useState(false)
    const [addUser, setAddUser] = useState(false)
    const { auth } = useContext(AuthenticationContext)
    const { groups, activeGroup } = useContext(GroupsContext)
    const { users } = useContext(UsersContext)
    const [members, setMembers] = useState([])
    const [ShowSidebar, setShowSidebar] = useState(false)
    const [searchedUsers, setSearchedUsers] = useState(users)
    const [search, setSearch] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
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

    useEffect(() => {
        const searched = users.filter((e) => { return e.username.startsWith(search) && search.length > 0 })
        setSearchedUsers(searched)
    }, [search, users])

    return (
        <>
            <button onClick={() => setShowSidebar(!ShowSidebar)} className="absolute left- top-5 z-50 font-bold text-5xl pr-2 md:hidden"><AiOutlineMenu></AiOutlineMenu></button>
            <div id="mobileSlide" className={ShowSidebar ? 'flex md:hidden pt-3 flex-col flex-grow border-r px-2 border-r-white z-40 w-full absolute left-0' : ' md:hidden hidden flex-col flex-grow border-r px-2 pt-3 border-r-white z-40 w-11/12 absolute left-0'}>
                <header className='border-b border-b-white border-b-solid justify-between p-2 px-5 pb-1 flex items-center gap-5'>
                    {!chatSelected
                        ?
                        <form onSubmit={(e) => { handleSubmit(e) }} className='flex justify-between md:pr-3 flex-grow pb-2  '>
                            <input value={search} type="text" onChange={(e) => { setSearch(e.target.value) }} placeholder='Search a person ...' className='p-4 rounded-2xl w-3/4 flex-grow outline-0' />
                        </form>

                        : <h1 className='flex w-full justify-between items-center font-bold text-2xl pb-3 px-5 tracking-wide'>
                            {name}</h1>}
                    <div className="flex flex-col gap-2">
                        <IconContext.Provider value={{ className: "Icon text-2xl text-white  tracking-wide cursor-pointer" }}>
                            <VscAdd onClick={() => setAddUser(true)} />
                        </IconContext.Provider>
                        <GiCancel className="text-2xl" onClick={() => setShowSidebar(false)} />
                    </div>



                </header>
                <div id='elementsList' className='flex flex-grow flex-col gap-5 p-5 overflow-y-scroll'>
                    {name === 'members' && <div className='w-full cursor-pointer slideElements z-10 text-left text-xl tracking-wide rounded-2xl font-bold shadow-md p-3 w-max-full'>
                        <div className="break-words inline"> You </div>
                        <div id="make_changes" className="flex gap-3 m-auto justify-end ">
                        </div>
                    </div>}

                    {!chatSelected && searchedUsers.length > 0 && <div id="users" className='m-auto w-full flex flex-col gap-4 p-5 rounded-2xl overflow-scroll h-full'>
                        {searchedUsers.length > 0 && searchedUsers.map((e, i) => {
                            return (<div id='searchedUsers' className='searchedUser rounded-2xl p-2 pl-3 font-bold text-lg' key={i} >{e.username}</div>)
                        })}
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
                {addUser && <AddUser setAddUser={setAddUser} />}
            </div >
        </>
    )
}

export default MobileSlide