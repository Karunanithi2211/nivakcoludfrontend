import React, { useState } from 'react'
import './header.css'
import api from '../../../../api/axiosConfig'
import { FaBars, FaFolderOpen, FaImages, FaVideo } from 'react-icons/fa6';
import { FaFileAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Header = ({isActive, setisActive}) => {

    const navigate = useNavigate()

    /*----------> TOGGLE MENU <----------*/
    const [Toggle, setToggle] = useState(false)


    const onLogout = async () => {
        await api.get('/api/logout')
        .then(result =>{
            toast.success('Log out successfully');
            localStorage.removeItem('token');
            navigate('/');
        })
        .catch(error =>{
            console.log(error);
        })
    }
    
  return (
    <header className="header">
        <nav className="nav">
            <a href="/" className="nav_logo"><img src='https://res.cloudinary.com/dzxh08cyi/image/upload/Portfolio/logo/Nivak_wwfjpc.png' alt="Nivak" width='100px'/></a>

            <div className={Toggle ? "nav_menu show-menu":"nav_menu"}>
                <ul className="nav_list grid">
                    <li className="nav_item" onClick={() => setToggle(false)}>
                        <div className={isActive === "dashboard" ? "nav_link active-link" : "nav_link"} onClick={() => setisActive("dashboard")}>
                            <FaFolderOpen className="nav_icon"/> Dashboard
                        </div>
                    </li>

                    <li className="nav_item" onClick={() => setToggle(false)}>
                        <div className={isActive === "image" ? "nav_link active-link" : "nav_link"} onClick={() => setisActive("image")}>
                            <FaImages className="nav_icon"/> Images
                        </div>
                    </li>

                    <li className="nav_item" onClick={() => setToggle(true)}>
                        <div className={isActive === "video" ? "nav_link active-link" : "nav_link"} onClick={() => {setisActive("video")}} >
                            <FaVideo className="nav_icon"/> Videos
                        </div>
                    </li>

                    <li className="nav_item" onClick={() => setToggle(false)}>
                        <div className={isActive === "raw" ? "nav_link active-link" : "nav_link"} onClick={() => setisActive("raw")}>
                            <FaFileAlt className="nav_icon"/> Documents
                        </div>
                    </li>

                    <li className="nav_item" onClick={() => setToggle(false)}>
                        <div className={isActive === "profile" ? "nav_link active-link" : "nav_link"} onClick={() => setisActive("profile")}>
                            <FaUserCircle className="nav_icon"/> Profile
                        </div>
                    </li>

                    <li className="nav_item" onClick={() => setToggle(false)}>
                        <div className="nav_link" onClick={onLogout}>
                            <FaSignOutAlt className="nav_icon"/> Logout
                        </div>
                    </li>
                </ul>

                <i className="uil uil-times nav_close" onClick={()=>setToggle(!Toggle)}></i>
            </div>

            <div className="nav_toggle" onClick={()=>setToggle(!Toggle)}>
                <FaBars/>
            </div>
        </nav>
    </header>
  )
}

export default Header