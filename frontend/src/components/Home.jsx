import { AiFillHeart } from 'react-icons/ai'

function Home() {
    return (
        <>
            <div id='home' className='h-screen'>
                <div id="welcome" className='w-3/5 mx-auto mt-40 p-10 rounded-md'>
                    <h1 className='font-bold text-3xl mb-10'>Welcome to Chat App</h1>
                    <a href="https://fodhil-benhiba.vercel.app"><button className='font-bold px-5 py-3 rounded-xl'>More About Me</button></a>
                </div>
            </div>
            <footer className='pb-10 flex items-center tracking-widest w-screen justify-center m-auto'>
                <h2 className='text-2xl'>Made With </h2>
                <AiFillHeart className='text-2xl mx-1' />
                <h2 className='text-2xl'> By F0DH1L</h2>
            </footer>
        </>
    )
}

export default Home