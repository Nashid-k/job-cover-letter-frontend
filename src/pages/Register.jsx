import React,{useState} from 'react'
import Input from "../components/Input"
import Button from "../components/Button"
import { register } from "../services/authService";
// import { useAuth } from "../features/auth/AuthContext";
import {useNavigate} from 'react-router-dom'

const Register = () => {
    const [form, setForm] = useState({name:"", email:"", password:""});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>{
        setForm({...form, [e.target.name]:e.target.value});
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const res = await register(form);
        if(res.message==="Account created successfully"){
            setSuccess("Registration successful! Please login.");
            setTimeout(()=>navigate('/login'),1500);
        }else{
            setError(res.message || "Registration failed");
            setTimeout(()=>setError(""),1500)
        }
    }


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-16 p-8 shadow-lg rounded bg-white">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        {/* <input type="text" /> */}
        <Input label="Name" name="name" type="text" value={form.name} onChange={handleChange} required/>
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required/>
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required/>
        <Button type="submit">Register</Button>
    </form>
  )
}

export default Register