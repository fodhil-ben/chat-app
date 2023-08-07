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
                        <MobileSlide users={users} name={'Groups'} chatSelected={chatSelected} setChatSelected={setChatSelected} />
                        <Sidebar users={users} name={'Groups'} chatSelected={chatSelected} setChatSelected={setChatSelected} />
                        <Menu users={users} />

                    </>
                }

                {chatSelected === true &&
                    <>
                        <MobileSlide name={'Members'} chatSelected={chatSelected} setChatSelected={setChatSelected} />
                        <Sidebar name={'Members'} chatSelected={chatSelected} setChatSelected={setChatSelected} />
                        <Conversation />
                    </>
                }
            </div>
            {/* <ProfileSidebar /> */}
        </>
    )
}

