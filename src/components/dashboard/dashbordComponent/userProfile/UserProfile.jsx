import React, { useCallback, useEffect, useState } from 'react'
import './userProfile.css'
import api from "../../../../api/axiosConfig";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

const UserProfile = () => {
  const navigate = useNavigate()
  const [profile, setprofile] = useState()
  const [email, setemail] = useState()


  const onDrop = useCallback(async acceptedFiles => {
    // Handle the file upload logic here
    console.log(acceptedFiles);

    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('upload_preset', uploadPreset);
    formData.append('public_id', profile?.userId);
    try {
      if(profile.profileURL){
        const profilepaths = profile?.profileURL.split('/')
        const profilepathslink = profilepaths[profilepaths.length - 1]
        const fileName = profilepathslink.split(".")[0]
        console.log("FileName: ", fileName);
        try {
          const fileDelete = await api.post('/api/cloud/deletefile', {
            fileName: fileName
          })
          if (fileDelete.data.success) {
            toast.success("Deleted previous image")
          }
        } catch (error) {
          toast.error("Cannot delete file, try again later")
        }
      }
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      console.log('Upload response:', response.data.secure_url);
      console.log("Email: ", email);
      const profileUpdated = await api.post('/api/updateprofile', {
        email: email,
        profileURL: response.data.secure_url
      })
      getProfileData()
      toast.success("Profile Image uploaded successfully")
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Profile Image upload unsuccessful, Try again")
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const getProfileData = () => {
    fetch('/api/getme', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      return res.json();
    }).then(result => {
      if (result.success) {
        setprofile(result.user)
        setemail(result.user.email)
        console.log("Set Email: ", result.user.email);
      } else {
        toast.warning("Signin again")
        navigate("/")
      }
    }).catch(error => {
      toast.warning("Signin again")
      navigate("/")
    });
  }

  useEffect(() => {
    getProfileData()
    console.log(profile?.profileURL);
  }, [])
  
  
  return (
    <div className='profile_container-outer'>
        <div className="profile_container-inner">
            <div className="profile">
              <div className="profile_avatar">
                  <div {...getRootProps()} className="profile_dropzone">
                    <img src={profile?.profileURL ? profile?.profileURL : "https://res.cloudinary.com/dzxh08cyi/image/upload/v1719313124/profile_kzwila.png"} className='profile_image' alt="profile" />
                    <input {...getInputProps()} />
                  </div>
              </div>
              <div className='profile_details'>
                  <table>
                    <tbody>
                      <tr>
                        <td>User Name: </td>
                        <td>{profile?.name}</td>
                      </tr>
                      <tr>
                        <td>User Id: </td>
                        <td>{profile?.name}</td>
                      </tr>
                      <tr>
                        <td>Email Id: </td>
                        <td>{profile?.email}</td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>
        </div>
    </div>
  )
}

export default UserProfile