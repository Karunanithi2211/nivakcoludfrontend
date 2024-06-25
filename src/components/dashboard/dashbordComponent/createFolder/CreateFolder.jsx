import React, { useState } from 'react'
import './createFolder.css'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify';
import api from "../../../../api/axiosConfig";

const CreateFolder = ({setisCreateFolderModalOpen, currentPath, allFoldersAndFiles, getAllFolderAndFiles}) => {

    const [folderName, setFolderName] = useState("");

    const handleInputChange = (e) => {
        const valueWithoutSpaces = e.target.value.replace(/\s+/g, '');
        setFolderName(valueWithoutSpaces);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(folderName) {
            if(folderName.length > 3) {
                try {
                    if (!allFoldersAndFiles.folders.some(folder => folder.name === folderName)) {
                        await api.post('/api/cloud/createfolder', {
                            folderName : currentPath+"/"+folderName
                        })
                        getAllFolderAndFiles(currentPath)
                        setisCreateFolderModalOpen(false)
                        toast.success(folderName + " folder created")
                    }
                    else{
                        toast.warning(folderName + " folder is already present")
                    }
                } catch (error) {
                    console.log(error);
                    toast.error("Server error, Try again later")
                }
            }
            else {
                toast.warning("Folder name must be at least 3 characters")
            }
        }
        else{
            toast.warning("Folder name cannot be empty")
        }

    }

  return (
    <div className='cfolder'>
        <div className="cfolder_container">
            <div className="cfolder_title">
                <h4>Create Folder</h4>
                <button className="cfolder_title-button" onClick={() => setisCreateFolderModalOpen(false)}>
                    <IoMdClose/>
                </button>
            </div>
            <hr />
            <div className="cfolder_input">
                <form className='cfolder_form'>
                    <input type="text" id='folderName' placeholder='Folder Name' value={folderName} onChange={handleInputChange}/>
                    <button type='submit' className="cfolder_form-button" onClick={handleSubmit}>Create Folder</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default CreateFolder
