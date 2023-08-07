import { useCallback, useContext, useEffect, useRef } from "react"
import { AuthenticationContext } from "../context/AuthContext"
import { GroupsContext } from "../context/GroupsContext"
import { useNavigate } from "react-router-dom"
import { MessagesContext } from "../context/MessagesContext"
import { io } from "socket.io-client"

const useMessages = () => {
    const socketRef = useRef(null);
    const navigate = useNavigate()
    const { auth, BASE_URL } = useContext(AuthenticationContext)
    const { activeGroup } = useContext(GroupsContext)
    const { setMessages } = useContext(MessagesContext)



    const getMessages = useCallback(async (id) => {
        const response = await fetch(`${BASE_URL}/api/messages/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user.token}`
            }
        })
        if (!response.ok) navigate('/InternalServerErr')
        const json = await response.json()
        setMessages(json.messages);

    }, [BASE_URL, auth, navigate, setMessages])

    const createMessage = useCallback(async (sender_id, group_id, message) => {
        if (message === '') return
        const response = await fetch(`${BASE_URL}/api/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.user.token}`
            },
            body: JSON.stringify({ sender_id, group_id, message })
        })
        if (!response.ok) navigate('/InternalServerErr')
        const json = await response.json()
        socketRef.current.emit('new message', json.message)
        setMessages((messages) => [...messages, json.message]);
    }, [BASE_URL, auth, navigate, setMessages])


    useEffect(() => {
        // socketRef.current = io(BASE_URL)
        socketRef.current = io("https://chat-app-nkac.onrender.com/")
        if (auth.user.id) socketRef.current.emit('setup', auth.user.id)
        return () => {
            socketRef.current.disconnect();
        };

    }, [activeGroup, BASE_URL, auth]);

    useEffect(() => {
        const handleReceivedMessage = (messageData) => {
            if (activeGroup === messageData.group_id) {
                setMessages((messages) => [...messages, messageData]);
            }
        };
        socketRef.current.on('message received', handleReceivedMessage)
    }, [activeGroup, setMessages, getMessages])

    useEffect(() => {

        if (activeGroup !== null) {
            getMessages(activeGroup)
            socketRef.current.emit('join room', activeGroup)
        }
    }, [activeGroup, getMessages])
    return ({ createMessage })

}

export default useMessages