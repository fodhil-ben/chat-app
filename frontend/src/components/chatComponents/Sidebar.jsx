
import { IconContext } from "react-icons";
import { useState, useEffect, useContext } from "react"
import { AuthenticationContext } from "../../context/AuthContext";
import { GroupsContext } from "../../context/GroupsContext";
import { UsersContext } from "../../context/UsersContext";
import useGroups from "../../hooks/useGroups";
import { VscAdd } from "react-icons/vsc"
import AddUser from "./AddUser";




function Sidebar({ name }) {
    const { auth } = useContext(AuthenticationContext)
    const { users } = useContext(UsersContext)
    const [members, setMembers] = useState([])
    const [addUser, setAddUser] = useState(false)
    const { activeGroup } = useContext(GroupsContext)

    const [searchedUsers, setSearchedUsers] = useState(users)
    const { groups, } = useGroups()
    const [search, setSearch] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault()
    }
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

    }, [activeGroup, groups, users, auth])

    useEffect(() => {
        const storedMembers = JSON.parse(localStorage.getItem('members')) || [];
        setMembers(storedMembers);
    }, []);

    useEffect(() => {
        const searched = users.filter((e) => { return e.username.startsWith(search) && search.length > 0 })
        setSearchedUsers(searched)
    }, [search, users])

    return (
        <div id="sidebar" className='hidden md:flex flex-col flex-grow border-r p-3 border-r-white' >
            <header className='border-b border-b-white border-b-solid p-2'>
                {name === 'Members' && <div className="pb-3 pt-2 flex justify-between items-center">
                    <h1 className="text-3xl font-bold ">{name}</h1>
                    <IconContext.Provider value={{ className: "Icon text-3xl text-white  tracking-wide cursor-pointer" }}>
                        <VscAdd onClick={() => setAddUser(true)} />
                    </IconContext.Provider></div>}
                {name !== "Members" &&
                    <form onSubmit={(e) => { handleSubmit(e) }} className='flex justify-between pr-9 md:pr-3'>
                        <input value={search} type="text" onChange={(e) => { setSearch(e.target.value) }} placeholder='Search a person ...' className='p-4 rounded-2xl w-3/4 flex-grow outline-0' />
                    </form>

                }
            </header>

            <div id='elementsList' className='flex flex-grow flex-col gap-5 py-5 pr-3 pl-2 overflow-y-scroll'>
                {name === 'Members' && < div className='w-full cursor-pointer elements z-10 text-left text-xl tracking-wide rounded-2xl font-bold shadow-md p-3 w-max-full'>
                    <div className="break-words inline"> You </div>
                    <div id="make_changes" className="flex gap-3 m-auto justify-end ">
                    </div>
                </div>}
                {searchedUsers.length > 0 && <div id="users" className='m-auto w-full flex flex-col gap-4 py-3 rounded-2xl overflow-scroll h-full'>
                    {searchedUsers.length > 0 && searchedUsers.map((e, i) => {
                        return (<div id='searchedUsers' className='searchedUser rounded-2xl p-2 pl-3 font-bold text-lg' key={i} >{e.username}</div>)
                    })}
                </div>}


                {name === 'Members' && members.map((e, i) => {
                    return (<div key={i} className='cursor-pointer elements z-10 text-left text-xl tracking-wide rounded-2xl font-bold shadow-md p-3 w-max-full'>
                        <div className="break-words inline"> {e} </div>
                        <div id="make_changes" className="flex gap-3 m-auto justify-end ">
                        </div>
                    </div>)
                })}
            </div>
            {addUser && <AddUser setAddUser={setAddUser} />}

        </div >
    )
}

export default Sidebar