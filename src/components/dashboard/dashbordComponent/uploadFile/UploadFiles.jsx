import React, { useState } from 'react'
import './uploadFile.css'
import { IoMdClose } from 'react-icons/io'
import { FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const UploadFiles = ({setisUploadFileModalOpen, currentPath, allFoldersAndFiles, getAllFolderAndFiles}) => {

    const [dragging, setDragging] = useState(false);
    const [filePreviews, setFilePreviews] = useState([]);
    const [files, setfiles] = useState([])

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            setfiles(files);
            console.log(files);
            setFilePreviews(files.map(file => ({
                url: URL.createObjectURL(file),
                type: file.type,
                name: file.name
            })));
            e.dataTransfer.clearData();
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setfiles(files);
            setFilePreviews(files.map(file => ({
              url: URL.createObjectURL(file),
              type: file.type,
              name: file.name
            })));
        }
    };

    const renderPreview = (preview, index) => {
        if (preview.type.startsWith('image/')) {
          return <img key={index} src={preview.url} alt={`file preview ${index}`} className="preview-image" />;
        } 
        else if (preview.type.startsWith('video/')) {
          return (
            <video key={index} className="preview-video" controls autoPlay={true} muted={true}>
              <source src={preview.url} type={preview.type} />
              Your browser does not support the video tag.
            </video>
          );
        } 
        else {
          return (
            <div key={index} className="preview-file">
              <span className="file-icon"><FaFileAlt/></span>
              <span className="file-name">{preview.name}</span>
            </div>
          );
        }
    };

    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    };

    const onFileDrop = async () => {
        console.log('Files dropped:', files);

        const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME

        console.log(uploadPreset +" " +cloudName);
    
        for (let file of files) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);
          formData.append('folder', currentPath);
          formData.append('public_id', file.name);
            console.log("folder: ",currentPath);
          try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload response:', response.data);
            getAllFolderAndFiles(currentPath);
            setisUploadFileModalOpen(false);
            toast.success("File uploaded successfully")
          } catch (error) {
            console.error('Error uploading file:', error);
            toast.error("File upload unsuccessful, Try again")
          }
        }
        setDragging(false);
        setFilePreviews([]);
        setfiles([])
      };

  return (
    <div className='ufiles'>
        <div className="ufiles_container">
            <div className="ufiles_title">
                <h4>Upload Files</h4>
                <button className="ufiles_title-button" onClick={() => {setisUploadFileModalOpen(false); setDragging(false); setFilePreviews([])}}>
                    <IoMdClose/>
                </button>
            </div>
            <hr />
            <div className="ufiles_input">
                <form className='ufiles_form'>
                    <div
                        className={`dropzone ${dragging ? 'dragging' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        >
                        <input
                            type="file"
                            id="fileInput"
                            className="file-input"
                            onChange={handleChange}
                            multiple
                        />
                        {filePreviews.length > 0 ? (
                            <div className="previews">
                                {filePreviews.map((preview, index) => renderPreview(preview, index))}
                            </div>
                        ) : (
                            <div className="placeholder">
                            <p>Drag and drop your files here</p>
                            <button type="button" className="browse-button" onClick={triggerFileInput}>
                                Browse
                            </button>
                            </div>
                        )}
                    </div>
                    { filePreviews.length > 0 &&
                        <button type="button" className="ufile_form-button" onClick={onFileDrop}>
                            Upload File
                        </button>
                    }
                </form>
            </div>
        </div>
    </div>
  )
}

export default UploadFiles
