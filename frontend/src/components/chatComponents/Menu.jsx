import { useState, useEffect, useContext } from 'react'
import { UsersContext } from '../../context/UsersContext'

function Menu() {
    const [search, setSearch] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const { users } = useContext(UsersContext)
    const [searchedUsers, setSearchedUsers] = useState(users)

    useEffect(() => {
        const searched = users.filter((e) => { return e.username.startsWith(search) && search.length > 0 })
        setSearchedUsers(searched)
    }, [search, users])
    return (
        <div id="Menu" className='flex flex-col flex-grow md:flex-grow-0 w-2/3 p-5 '>
            <form onSubmit={(e) => { handleSubmit(e) }} className='flex justify-between pr-9 md:pr-3 pb-2 border-b border-b-solid border-b-white'>
                <input value={search} type="text" onChange={(e) => { setSearch(e.target.value) }} placeholder='Search a person ...' className='p-4 rounded-2xl w-3/4 flex-grow outline-0' />
            </form>

            {searchedUsers.length > 0 && <div id="users" className='m-auto w-full flex flex-col gap-4 p-5 rounded-2xl overflow-scroll h-full'>
                {searchedUsers.length > 0 && searchedUsers.map((e, i) => {
                    return (<div id='searchedUsers' className='searchedUser rounded-2xl p-2 pl-3 font-bold text-lg' key={i} >{e.username}</div>)
                })}
            </div>}
        </div>
    )
}

export default Menu