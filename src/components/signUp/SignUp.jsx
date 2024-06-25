import React, { useState } from 'react'
import './signUp.css'
import api from '../../api/axiosConfig'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const SignUp = () => {

  const navigate = useNavigate()

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

        const cfolder = await api.post('/api/cloud/createfolder', {
            folderName: userId
        })

        console.log(signUp)

        if(signUp.data.success === true){
            navigate('/')
            setregData(initRegData);
            toast.success("Sign up sccessfully, please Login")
        }
        
    } catch (error) {
        console.log(error)
        toast.error(error.response.data.error);
    }
  }

const switchToLogin = () => {
    navigate('/')
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
    <div className='signup_container'>
      <div className="col align_center signup_col">

        <h1 className='signup_h1'>Register</h1>

        <form className='col align_center signup_form'>

            <div className="signup_form_div align_center">
                <label className="signup_form_div-tag">Name</label>
                <input type="text" name="reg_name" className="signup_form_div-input" placeholder='Enter your Name' value={regData.reg_name} onChange={handleRegChange}/>
            </div>

            <div className="signup_form_div align_center">
                <label className="signup_form_div-tag">User Id</label>
                <input type="text" name="reg_userid" className="signup_form_div-input" placeholder='Enter your UserId ' value={regData.reg_userid} onChange={handleRegChange}/>
            </div>

            <div className="signup_form_div align_center">
                <label className="signup_form_div-tag">Email Id</label>
                <input type="email" name="reg_email" className="signup_form_div-input" placeholder='Enter your email id' value={regData.reg_email} onChange={handleRegChange}/>
            </div>

            <div className="signup_form_div align_center">
                <label className="signup_form_div-tag">password</label>
                <input type="password" name="reg_password" className="signup_form_div-input" placeholder='Enter your password' value={regData.reg_password} onChange={handleRegChange}/>
            </div>

            <button type="submit" className='signup_form-button' onClick={registerAction}>Register</button>
        </form>

        <p className='signup_form-p'>Already have an account? <button className='switch' onClick={() => switchToLogin()}>Login</button></p>
        </div>
    </div>
  )
}

export default SignUp