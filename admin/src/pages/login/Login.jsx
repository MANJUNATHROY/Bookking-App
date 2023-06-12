import React, { useContext } from 'react'
import './login.scss'
import { AuthContext } from '../../context/AuthContext'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Login = () => {

    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined
    })
    const navigate=useNavigate()
    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }
    const { user,loading, error, dispatch } = useContext(AuthContext)
    const handleClick=async(e)=>{
        e.preventDefault()
        dispatch({type:"LOGIN_START"})
        try{
            const res=await axios.post("https://bookking-app-manjunathroy.onrender.com/server/auth/login",credentials)
            if(res.data.isAdmin){
                dispatch({type:"LOGIN_SUCCESS",payload:res.data})
                navigate("/")
            }else{
                dispatch({type:"LOGIN_FAILURE",payload:{message:"you are not allowed"},})

            }
           

        }catch(err){
            dispatch({type:"LOGIN_FAILURE",payload:err.response.data})
        }
    }
    return (
        <div className="login">
            <div className="lContainer">
                <input type="text" placeholder="username" id="username" onChange={handleChange} className="lInput" />
                <input type="password" placeholder="passsword" id="password" onChange={handleChange} className="lInput" />
                <button disabled={loading} className="lButton" onClick={handleClick}>login</button>
                {error && <span>{error.message}</span>}
            </div>
        </div>
    )
}

export default Login;