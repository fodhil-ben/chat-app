import React from 'react'
import { FaSpinner } from 'react-icons/fa'

function ProcessingButton() {
    return (
        <button type="button" id='processingBtn' disabled className='w-36 rounded-xl flex p-2 gap-2 items-center mt-auto'>
            <div><FaSpinner className="animate-spin h-5 w-5"></FaSpinner></div>
            Processing...
        </button>
    )
}

export default ProcessingButton