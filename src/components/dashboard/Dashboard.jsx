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
      console.log("fetching.......");
      const response = await api.post('/api/cloud/allfolderfiles', { folderPath: path });
      console.log("fetched: "+response.data);
      setallFoldersAndFiles(response.data.paths);
      setcurrentPath(path);
      setisLoading(false)
    } catch (error) {
      console.log(error);
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

  useEffect(()=>{
    const auth = JSON.parse(localStorage.getItem('token'));
    if (auth){
        if (auth.token){
          console.log("Token has recived");
        }
        else{
          console.log("There is no token");
          navigate('/')
        }
    }
    else{
      console.log("User is not Authenticated");
      navigate('/')
    }
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      navigate("/");
      return;
    }
    console.log("sending ", token);
    axios.post('https://nivakcloud.netlify.app/.netlify/functions/api/getme')
    .then(response => {
      console.log("get me response: ", response.data);
    })
    .catch(error => {
      console.error('Get me Error:', error);
    });
  }, [])
  

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
        {/*<UserProfile/>*/}
      </div>
    </div>
  )
}

export default Dashboard
