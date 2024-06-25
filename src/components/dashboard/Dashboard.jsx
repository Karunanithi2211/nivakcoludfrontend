import React, { useEffect, useState } from 'react'
import './dashboard.css'
import Header from './dashbordComponent/header/Header'
import SubBar from './dashbordComponent/subbar/SubBar'
import CreateFolder from './dashbordComponent/createFolder/CreateFolder'
import api from '../../api/axiosConfig'
import ShowItems from './dashbordComponent/showItems/ShowItems'
import UploadFiles from './dashbordComponent/uploadFile/UploadFiles'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import UserProfile from './dashbordComponent/userProfile/UserProfile'
import axios from 'axios'

const Dashboard = () => {

  const navigate = useNavigate()

  const [isLoading, setisLoading] = useState(false)
  
  const [isCreateFolderModalOpen, setisCreateFolderModalOpen] = useState(false)
  const [isUploadFileModalOpen, setisUploadFileModalOpen] = useState(false)
  const [allFoldersAndFiles, setallFoldersAndFiles] = useState({ folders: [] , files: []})

  const [currentPath, setcurrentPath] = useState()
  const [isActive, setisActive] = useState('dashboard')
  const [userId, setuserId] = useState()

  const getAllFolderAndFiles = async (path) => {

    try {
      setisLoading(true)
      const response = await api.post('/api/cloud/allfolderfiles/', { folderPath: path });
      setallFoldersAndFiles(response.data.paths);
      setcurrentPath(path);
      setisLoading(false)
    } catch (error) {
      toast.error("Error in fetching data, SignIn again")
      navigate('/')
    }
  }

  useEffect(()=>{
    const myMain = document.getElementById("main")
    const myProfile = document.getElementById('profile')

    if(isActive !== 'profile'){
      myMain.style.display = "block"
      myProfile.style.display = "none"
    }
    else{
      myMain.style.display = "none"
      myProfile.style.display = "flex"
    }
  },[isActive])

  useEffect(async ()=>{
    const auth = JSON.parse(localStorage.getItem('token'));
    if (auth){
        if (auth.token){
        }
        else{
          toast.warning("SignIn first")
          navigate('/')
        }
    }
    else{
      toast.warning("SignIn first")
      navigate('/')
    }

    const response = await axios.get('https://nivakcloudbackend.netlify.app/api/getme', { withCredentials: true });
    console.log(response.data);
    /*await axios.get('https://nivakcloudbackend.netlify.app/api/getme', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      return res.json();
    }).then(result => {
      if (result.success) {
        getAllFolderAndFiles(result.user.userId);
        setuserId(result.user.userId)
      } else {
        toast.warning("Signin again")
        navigate("/")
      }
    }).catch(error => {
      toast.warning("Signin again")
      navigate("/")
    });*/
  }, []);
  

  return (
    <div className='dashboard'>

      {
        isCreateFolderModalOpen && (
          <CreateFolder setisCreateFolderModalOpen={setisCreateFolderModalOpen} currentPath={currentPath} allFoldersAndFiles={allFoldersAndFiles} getAllFolderAndFiles={getAllFolderAndFiles}/>
        )
      }

      {
        isUploadFileModalOpen && (
          <UploadFiles setisUploadFileModalOpen={setisUploadFileModalOpen} currentPath={currentPath} allFoldersAndFiles={allFoldersAndFiles} getAllFolderAndFiles={getAllFolderAndFiles}/>
        )
      }

      <Header isActive={isActive} setisActive={setisActive}/>
      <div id='main'>
        <SubBar setisCreateFolderModalOpen={setisCreateFolderModalOpen} setisUploadFileModalOpen={setisUploadFileModalOpen} currentPath={currentPath} getAllFolderAndFiles={getAllFolderAndFiles}/>
        <ShowItems currentPath={currentPath} allFoldersAndFiles={allFoldersAndFiles} isActive={isActive} getAllFolderAndFiles={getAllFolderAndFiles} isLoading={isLoading} userId={userId}/>
      </div>
      <div id="profile">
        {/* <UserProfile/> */}
      </div>
    </div>
  )
}

export default Dashboard
