import React, { useState } from 'react'
import api from '../../api/axiosConfig'
import './signIn.css'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {

  const navigate = useNavigate()

  const initLoginData = {
    login_email:'',
    login_password:''
  }

  const [loginData, setloginData] = useState(initLoginData)

  const handleLoginChange = (e) =>{
    const{name,value}=e.target;
    setloginData({
        ...loginData,
        [name]:value
    })
  }

  const loginAction = async (event) => {
    event.preventDefault();

    try {
        const email = loginData.login_email
        const password = loginData.login_password

        const signIn = await api.post('/api/signin', {
            email,
            password
        })

        console.log(signIn)

        if(signIn.data.success === true){
            setloginData(initLoginData);
            console.log("Storage token is ", JSON.stringify(signIn.data));
            localStorage.setItem("token", JSON.stringify(signIn.data))
            toast.success("Sign In sccessfully")
            navigate('/dashboard')
        }
        
    } catch (error) {
        console.log(error)
        toast.error(error.response.data.error);
    }
  }

  const switchToRegister = () => {
    navigate('/signup')
  }

  return (
    <div className="signin_container">
      <div className="col align_center signin_col">
            
        <h1 className='login_h1'>Login</h1>
    
        <form className='col align_center signin_form'>
  
            <div className="signin_form_div align_center">
                <label className="signin_form_div-tag">Email Id</label>
                <input type="email" name="login_email" className="signin_form_div-input" placeholder='Enter your email id' value={loginData.login_email} onChange={handleLoginChange}/>
            </div>
  
            <div className="signin_form_div align_center">
                <label className="signin_form_div-tag">password</label>
                <input type="password" name="login_password" className="signin_form_div-input" placeholder='Enter your password' value={loginData.login_password} onChange={handleLoginChange}/>
            </div>
            
            <a href='/fogetpassword' className='signin_form-a'>Forget Password?</a>
  
            <button type="submit" className='signin_form-button' onClick={loginAction}>SignIn</button>
  
        </form>
  
        <p className='signin_form-p'>Don't have an account? <button className='switch' onClick={() => switchToRegister()}>Register</button></p>
  
      </div>
    </div>
  )
}

export default SignIn
