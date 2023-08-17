import { useState } from 'react'
import { BiHide } from 'react-icons/bi'
import { useLogin } from '../hooks/useLogin'
import ProcessingButton from './uiComponents/ProcessingButton'
function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const { login, message, error, isLoading } = useLogin()

    const handleSubmit = (e) => {
        e.preventDefault()
        handleClick()
    }
    const handleClick = async function () {
        await login(username, password)
    }
    return (
        <div className='h-screen relative lg:p-20 pt-20 tracking-wide text-xl font-bold ' id='login'>
            <form onSubmit={(e) => { handleSubmit(e) }} className='flex flex-col gap-5 w-10/12 lg:w-2/4 mx-auto rounded-2xl p-5 lg:p-10 pb-5 items-center ' id='loginForm'>
                <label className='px-1 self-start font-bold '>Username</label>
                <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" name="username" className='px-5 py-2 rounded-2xl outline-0 w-full' />
                <div className="password flex justify-between w-full items-end">
                    <label className='px-1 self-start font-bold '>Password </label>
                    <div onClick={() => setShow(!show)} className='pr-3'><BiHide className='cursor-pointer' /></div>                    </div>
                <input type={show ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} value={password} name="password" className='px-5 py-2 rounded-2xl outline-0 w-full' />
                {!isLoading && <button type="submit" onClick={handleClick} className='my-5 tracking-wide text-center py-3 rounded-2xl outline-0 w-2/4'>Login</button>}
                {isLoading && <ProcessingButton />}

                {error && <div id='error' className='text-red w-3/4 rounded-md border-2 border-solid p-5'>{error}</div>}
                {message && <div id='message' className='text-red w-3/4 rounded-md border-2 border-solid p-5'>{message}</div>}
            </form>
        </div>
    )
}

export default Login