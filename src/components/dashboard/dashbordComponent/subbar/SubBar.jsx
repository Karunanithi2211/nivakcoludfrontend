import React, { useCallback, useEffect, useState } from 'react'
import './subBar.css'
import { TbFileUpload } from 'react-icons/tb'
import axios from 'axios'
import _ from 'lodash'
import { FaFileArrowUp, FaFolderPlus } from 'react-icons/fa6'

const SubBar = ({setisCreateFolderModalOpen, setisUploadFileModalOpen, currentPath, getAllFolderAndFiles}) => {
  const [paths, setpaths] = useState([])

  const changePaths = (index) =>{
    var path = ""
    if(index !== 0){
      for (let i = 0; i <= index; i++) {
        path += i === index ? paths[i] : paths[i] + "/";
      }
    }
    else{
      path = paths[0]
    }
    debouncedGetAllFolderAndFiles(path);
  }

  const debouncedGetAllFolderAndFiles = useCallback(
    _.debounce((path) => {
      getAllFolderAndFiles(path);
    }, 300), // Adjust the delay as needed
    []
  );

  const present_key = "q6qxe0fb"
  const cloud_name = "dzxh08cyi"

  const [file, setfile] = useState()

  const handleFile = (event) =>{
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', present_key)
    formData.append('folder', 'cloudProject')

    let resource_type = 'auto';
    if (file.type.startsWith('image/')) {
      resource_type = 'image';
    } else if (file.type.startsWith('video/')) {
      resource_type = 'video';
    } else if (file.type.startsWith('audio/')) {
      resource_type = 'audio';
    } else {
      resource_type = 'raw';
    }

    axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/${resource_type}/upload`, formData).then(res => console.log(res.data.secure_url)).catch(err => console.log(err))

  }

  useEffect(() => {
     setpaths(currentPath?.split("/"));
  }, [currentPath])
  

  return (
    <div className='subbar'>
        <p><span onClick={()=>changePaths(0)}>Root </span> 
            {paths?.map((path, index) => (
              <span key={index}>
              {
                index > 0 && 
                <>
                  / <span className='subbar_path' onClick={() => changePaths(index)}>{path} </span>
                </>
              }
              </span>
            ))}
        </p>

        <ul className='subbar_list'>
          <li className='subbar_item'>
            <button className='subbar_button' onClick={() => setisUploadFileModalOpen(true)}><FaFileArrowUp/> <span className='subbar_button-text'> Upload File</span></button>
          </li>
          <li className='subbar_item'>
            <button className='subbar_button' onClick={() => setisCreateFolderModalOpen(true)}><FaFolderPlus/> <span className='subbar_button-text'>Create Folder</span></button>
          </li>
        </ul>
    
    </div>
  )
}

export default SubBar
