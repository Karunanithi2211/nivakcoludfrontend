import api from "../../api/axiosConfig"
import React, { useEffect, useState } from 'react'
const Profile = () => {
  const [profile, setProfile] = useState("");

  useEffect(()=>{
    fetch('/api/getme', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      return res.json();
    }).then(result => {
      console.log(result);
      if (result.success) {
        setProfile(result.user);
      } else {
        console.log(result.error);
      }
    }).catch(error => {
      console.log(error);
    });
  }, []);
    
  return (
    <div>
    </div>
  )
}

export default Profile
