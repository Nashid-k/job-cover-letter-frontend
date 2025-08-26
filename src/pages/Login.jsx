import React, { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import { login } from '../services/authService'
import { useAuth } from '../features/auth/AuthContext'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [form, setForm] = useState({email:"", password:""});
    const [error, setError] = useState("");
    const {loginUser} = useAuth()
    const navigate = useNavigate()


    const handleChange = (e) =>{
        setForm({...form, [e.target.name]:e.target.value})
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const res = await login(form);
        if(res.token){
            loginUser(res.user, res.token);
            navigate('/dashboard')
        }else{
            setError(res.message || "Login failed")
        }
    }



  return (
    <form onSubmit={handleSubmit} className='max-w-md mx-auto mt-16 p-8 shadow-lg rounded bg-white'>
        <h2 className='text-2xl font-bold mb-6'>Login</h2>
        {error && <p className='text-red-500'>{error}</p>}
        <Input label='Email' name='email' type='email'  value={form.email} onChange={handleChange} required/>
        <Input label='Password' name='password' type='password' value={form.password} onChange={handleChange} required/>
        <Button type='submit'>Login</Button>
    </form>
  )
}

export default Login