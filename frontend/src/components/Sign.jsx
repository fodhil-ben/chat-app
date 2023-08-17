import { useState } from 'react'
import { BiHide } from 'react-icons/bi'
import { useSign } from '../hooks/useSign'
import ProcessingButton from './uiComponents/ProcessingButton'

function Sign() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const { sign, error, message, isLoading } = useSign()

    const handleSubmit = (e) => {
        e.preventDefault()
    }
    const handleClick = async () => {
        await sign(username, email, password)
    }
    return (
        <div className='h-screen relative lg:p-20 pt-20 tracking-wide text-xl font-bold' id='sign'>
            <form onSubmit={(e) => { handleSubmit(e) }} className='flex flex-col gap-5 w-10/12 lg:w-2/4 mx-auto rounded-2xl p-5 lg:p-10 pb-5 items-center ' id='signForm'>
                <label className='px-1 self-start font-bold '>Username</label>
                <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" name="username" className='border-2   px-5 py-2 rounded-2xl outline-0 w-full' />
                <label className='px-1 self-start font-bold '>Email</label>
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" name="email" className='border-2 px-5 py-2 rounded-2xl outline-0 w-full' />
                <div className="flex justify-between w-full">
                    <label className='px-1 self-start font-bold '>Password</label>
                    <div onClick={() => setShow(!show)} className='pr-3'><BiHide id='hidePass' className='cursor-pointer' /></div>
                </div>
                <input type={show ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} value={password} name="password" className='border-2  px-5 py-2 rounded-2xl outline-0 w-full' />
                {!isLoading && <button onClick={handleClick} className='my-5 tracking-wide text-center py-3 rounded-2xl outline-0 w-2/4'>Sign in</button>}
                {isLoading && <ProcessingButton />}

                {error && <div className='text-red w-3/4 rounded-2xl error text-red-600 border-2 border-solid border-red-600 p-5'>{error}</div>}
                {message && <div className='text-red w-3/4 rounded-2xl message text-green-100 border-2 border-solid border-green-600 p-5'>{message}</div>}
            </form>
        </div>
    )
}

export default Sign