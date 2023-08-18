import { useEffect, useState, useRef, useContext } from 'react'
import { AiOutlineSend } from 'react-icons/ai'
import useMessages from '../../hooks/useMessages'
import { AuthenticationContext } from '../../context/AuthContext'
import { GroupsContext } from '../../context/GroupsContext'
import { MessagesContext } from '../../context/MessagesContext'
import { formatRelative, subDays } from 'date-fns'
import { IconContext } from 'react-icons'
import { RxExit } from 'react-icons/rx'
import useGroups from '../../hooks/useGroups'

function Conversation({ chatSelected, setChatSelected }) {
    const targeRef = useRef(null)
    const { auth } = useContext(AuthenticationContext)
    const { activeGroup, setActiveGroup } = useContext(GroupsContext)
    const { groups, getGroups } = useGroups()
    const [selectedGroup, setSelectedGroup] = useState('')
    const { messages } = useContext(MessagesContext)
    const [message, setMessage] = useState('')
    const { createMessage } = useMessages()
    const handleSubmit = (e) => {
        e.preventDefault()
        handleSendMsg()
    }


    const handleExit = () => {
        setChatSelected(!chatSelected)
        setActiveGroup(null)
    }


    const handleSendMsg = () => {
        createMessage(auth.user.id, activeGroup, message)
        setMessage('')
    }
    useEffect(() => {
        if (targeRef.current) {
            targeRef.current.scrollTop = targeRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        getGroups()
        groups.map(e => {
            if (e.group_id === activeGroup) setSelectedGroup(e.group_name)
        })
    }, [activeGroup, groups])

    return (
        <div id="Conversation" className='flex flex-col flex-grow md:flex-grow-0  w-2/3 p-5 '>
            <div id="chatInfo" className='flex flex-col p-3 pt-0 justify-between border-b border-b-solid border-b-white'>
                <div id="friendInfo" className='font-bold text-3xl flex  justify-between items-center p-2'>
                    <p>{selectedGroup}</p>
                    <IconContext.Provider value={{ className: "Icon text-3xl text-white  tracking-wide cursor-pointer" }}>
                        <div className='flex justify-end'>
                            <RxExit onClick={handleExit} />
                        </div>
                    </IconContext.Provider>
                </div>
            </div>
            <div id="convo" ref={targeRef} className='flex flex-grow flex-col gap-5 py-5 px-2 overflow-y-scroll'>
                {messages && messages.map((e, i) => {
                    return (<div key={i} className={`${auth.user.id === e.sender_id ? "msgLeft p-3 rounded-2xl gap-2 break-words" : "msgRight p-3 rounded-2xl break-words gap-2"}`}>
                        <div className=' border-b'>{e.message}</div>
                        <span className='text-red text-xs self-end mt-5'>{formatRelative(subDays(new Date(e.created_at), 0), new Date())}</span>
                    </div>)
                })}
            </div>
            <form onSubmit={(e) => { handleSubmit(e) }} className='flex justify-between gap-1'>
                <input value={message} type="text" maxLength={255} onChange={(e) => { setMessage(e.target.value) }} placeholder='Type a message...' className='p-4 rounded-2xl w-3/4 flex-grow outline-0' />
                <button className='text-2xl' onClick={handleSendMsg}>
                    <IconContext.Provider value={{ className: 'text-5xl' }}>
                        <AiOutlineSend />
                    </IconContext.Provider>
                </button>
            </form>
        </div >
    )
}

export default Conversation