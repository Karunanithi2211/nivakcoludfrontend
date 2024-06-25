import React, { useState } from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import api from "../../api/axiosConfig";

const Login = () => {

    const [isLogin, setisLogin] = useState(true)
    const navigate = useNavigate();

    // LOGIN FUNCTIONS

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

            if(signIn?.data.success === true){
                setloginData(initLoginData);
                toast.success("Sign In sccessfully")
                navigate('/user/profile')
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.error);
        }
    }

    const switchToRegister = () => {
        setisLogin(false)
    }

    // REGISTERATION FUNCTIONS

    const initRegData = {
        reg_name:'',
        reg_userid:'',
        reg_email: '',
        reg_password: ''
    }

    const [regData, setregData] = useState(initRegData)

    const handleRegChange = (e) => {
        const{name,value}=e.target;
        let updatedValue = value;

        if (name === 'reg_userid') {
            updatedValue = value.replace(/[^a-z0-9_]/g, ''); // Allow only lowercase letters
        }

        setregData({
            ...regData,
            [name]: updatedValue
        });
    }

    const registerAction = async (event) => {
        event.preventDefault();

        try {
            const name = regData.reg_name
            const userId = regData.reg_userid
            const email = regData.reg_email
            const password = regData.reg_password
            const verificationNumber = generateOtp(5)


            const signUp = await api.post('/api/signup', {
                name,
                userId,
                email,
                password,
                verificationNumber
            })

            await api.get('/api/cloud/createfolder/'+userId)

            console.log(signUp)

            if(signUp.data.success === true){
                navigate('/dashboard')
                setregData(initRegData);
                toast.success("Sign up sccessfully, please Login")
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.error);
        }
    }

    const switchToLogin = () => {
        setisLogin(true)
    }

    const generateOtp = (length) => {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    };

  return (
    <>
    <div className="container align_center">
        <div className="row login_row">
            {
                isLogin ? 
                
                <div className="col align_center empty_logo region_left">
                    <div className="logo_container align_center">
                        <img src='https://res.cloudinary.com/dzxh08cyi/image/upload/Portfolio/logo/Nivak_wwfjpc.png' alt="logo"/>
                    </div>
                </div>
                :
                <div className="col align_center login_col region_left">

                    <h1 className='reg_h1'>Register</h1>
                
                    <form className='col align_center reg_form'>

                        <div className="reg_form_div align_center">
                            <label className="reg_form_div-tag">Name</label>
                            <input type="text" name="reg_name" className="reg_form_div-input" placeholder='Enter your Name' value={regData.reg_name} onChange={handleRegChange}/>
                        </div>

                        <div className="reg_form_div align_center">
                            <label className="reg_form_div-tag">User Id</label>
                            <input type="text" name="reg_userid" className="reg_form_div-input" placeholder='Enter your UserId ' value={regData.reg_userid} onChange={handleRegChange}/>
                        </div>

                        <div className="reg_form_div align_center">
                            <label className="reg_form_div-tag">Email Id</label>
                            <input type="email" name="reg_email" className="reg_form_div-input" placeholder='Enter your email id' value={regData.reg_email} onChange={handleRegChange}/>
                        </div>

                        <div className="reg_form_div align_center">
                            <label className="reg_form_div-tag">password</label>
                            <input type="password" name="reg_password" className="reg_form_div-input" placeholder='Enter your password' value={regData.reg_password} onChange={handleRegChange}/>
                        </div>

                        <button type="submit" className='reg_form-button' onClick={registerAction}>Register</button>
                    </form>

                    <p className='reg_form-p'>Already have an account? <button className='switch reg_switch' onClick={() => switchToLogin()}>Login</button></p>
                </div>
            }
            {
                isLogin ? 
                <div className="col align_center login_col region_right">
            
                    <h1 className='login_h1'>Login</h1>
                
                    <form className='col align_center login_form'>

                        <div className="login_form_div align_center">
                            <label className="login_form_div-tag">Email Id</label>
                            <input type="email" name="login_email" className="login_form_div-input" placeholder='Enter your email id' value={loginData.login_email} onChange={handleLoginChange}/>
                        </div>

                        <div className="login_form_div align_center">
                            <label className="login_form_div-tag">password</label>
                            <input type="password" name="login_password" className="login_form_div-input" placeholder='Enter your password' value={loginData.login_password} onChange={handleLoginChange}/>
                        </div>
                        
                        <a href='/fogetpassword' className='login_form-a'>Forget Password?</a>

                        <button type="submit" className='login_form-button' onClick={loginAction}>Login</button>

                    </form>

                    <p className='login_form-p'>Don't have an account? <button className='switch' onClick={() => switchToRegister()}>Register</button></p>

                </div>

                :

                <div className="col align_center empty_logo region_right">
                    <div className="logo_container align_center reg_logocontainer">
                        <img src='https://res.cloudinary.com/dzxh08cyi/image/upload/Portfolio/logo/Nivak_wwfjpc.png' alt="logo"/>
                    </div>
                </div>

            }


        </div>
    </div>
    </>
  )
}

export default Login
