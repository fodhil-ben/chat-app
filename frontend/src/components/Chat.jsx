import Sidebar from './chatComponents/Sidebar'
import Conversation from './chatComponents/Conversation'
import { useState } from 'react'
import Menu from './chatComponents/Menu'
import useUsers from '../hooks/useUsers'
import MobileSlide from './chatComponents/MobileSlide'


export default function Chat() {

    const [chatSelected, setChatSelected] = useState(JSON.parse(localStorage.getItem('chatIsSelected')) || false)
    const { users } = useUsers()

    return (
        <>
            <div id="chat" className='flex flex-grow w-full p-3'>

                {!chatSelected === true &&
                    <>
                        <MobileSlide users={users} chatSelected={chatSelected} setChatSelected={setChatSelected} />
                        <Sidebar users={users} chatSelected={chatSelected} setChatSelected={setChatSelected} />
                        <Menu users={users} chatSelected={chatSelected} setChatSelected={setChatSelected} />

                    </>
                }

                {chatSelected === true &&
                    <>
                        <MobileSlide name={'Members'} chatSelected={chatSelected} setChatSelected={setChatSelected} />
                        <Sidebar name={'Members'} chatSelected={chatSelected} setChatSelected={setChatSelected} />
                        <Conversation chatSelected={chatSelected} setChatSelected={setChatSelected} />
                    </>
                }
            </div>
            {/* <ProfileSidebar /> */}
        </>
    )
}

