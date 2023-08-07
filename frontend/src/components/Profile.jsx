import { useContext, useState } from 'react'
import { AuthenticationContext } from '../context/AuthContext'
import { RiEdit2Fill } from 'react-icons/ri'
import EditProfile from './profileComponents/EditProfile'

function Profile() {
    const { auth } = useContext(AuthenticationContext)
    const [edit, setEdit] = useState(false)
    const [type, setType] = useState(null)
    const handleEdit = (type) => {
        setEdit(true)
        setType(type)
    }
    return (
        <div>
            <h1 className='font-bold text-5xl pt-10 text-center'>Profile</h1>
            <div id="card" className='w-3/4 m-auto mt-12 text-2xl p-5 font-bold rounded-lg flex flex-col gap-5'>
                <p className='flex gap-5 items-center justify-between '>
                    <label > Username:</label>
                    <RiEdit2Fill className="cursor-pointer z-20" onClick={() => handleEdit('Username')} />
                </p>
                <input className='p-2 pr-0 rounded-2xl' readOnly value={auth.user.username} />
                <p className='flex gap-5 items-center justify-between '>
                    <label >Email:</label>
                    <RiEdit2Fill className="cursor-pointer z-20" onClick={() => handleEdit('Email')} />
                </p>
                <input className='p-2 pr-0 rounded-2xl' type='email' readOnly value={auth.user.email} />
                <p className='flex gap-5 items-center justify-between '>
                    <label >Password:</label>
                    <RiEdit2Fill className="cursor-pointer z-20" onClick={() => handleEdit('Password')} />
                </p>
                <input className='p-2 pr-0 rounded-2xl' readOnly value={'*********'} />
            </div>
            {edit && <EditProfile type={type} setEdit={setEdit} />}
        </div >
    )
}

export default Profile