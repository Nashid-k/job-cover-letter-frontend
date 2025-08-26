import React from 'react'

const Button = ({children, ...props}) => {
  return (
   <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold' {...props}>
    {children}
   </button>
  )
}

export default Button