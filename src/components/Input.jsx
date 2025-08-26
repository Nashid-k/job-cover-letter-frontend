import React from 'react'

const Input = ({label, ...props}) => {
  return (
    <div>
        <label className='block text-sm font-medium mb-1'>{label}</label>
        <input className='w-full px-3 py-2 border rounded focus:outline-none focus:ring' {...props}/>
    </div>
  )
}

export default Input