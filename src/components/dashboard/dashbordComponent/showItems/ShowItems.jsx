import React, { useEffect, useState } from 'react'
import './showItems.css'
import { FaEllipsis, FaFileImage, FaFileVideo, FaFolder } from 'react-icons/fa6';
import { FaFileAlt } from 'react-icons/fa';
import api from '../../../../api/axiosConfig'
import { toast } from 'react-toastify';
import { Hourglass } from 'react-loader-spinner';
import Swal from 'sweetalert2';

const ShowItems = ({currentPath, allFoldersAndFiles, isActive, getAllFolderAndFiles, isLoading, userId}) => {

  const [allFiles, setallFiles] = useState({files: []})
  const [filteredFiles, setfilteredFiles] = useState([])

  var length = 0;

  const changePaths = (path) =>{
    getAllFolderAndFiles(path)
  }

  const getAllFiles = async () => {

    try {
      const response = await api.post('/api/cloud/allfiles/', { userId: userId });
      setallFiles(response.data.paths);
      console.log(response.data.paths);
    } catch (error) {
      console.log(error);
    }
  }

  const openOption = (index) => {
      console.log(index);
      const myElement = document.getElementById(`${index}-item_options-option`);
      myElement.style.display = "flex"
  };

  const closeOption = (index) => {
      const myElement = document.getElementById(`${index}-item_options-option`);
      myElement.style.display = "none"
  }

  const view = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadFiles = (url, filename) => {
    fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
    });
  }

  
  const deleteFolder = (folderPath, folderName) => {
    console.log(folderName);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success m-1",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: `Files inside the ${folderName} folder is also deleted`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      width: "80%"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const fileDelete = await api.post('/api/cloud/deletefolder', {
            folderPath: folderPath
          })
          if (fileDelete.data.success) {
            getAllFolderAndFiles(currentPath)
            toast.success("Folder Deleted Successfully")
          }
        }
        catch (error) {
          
        }
      }
    });
  }

  const deleteFile = async (fileName) => {
    console.log(fileName);
    try {
      const fileDelete = await api.post('/api/cloud/deletefile', {
        fileName: fileName
      })
      if (fileDelete.data.success) {
        getAllFolderAndFiles(currentPath)
        toast.success("File Deleted Successfully")
      }
    } catch (error) {
      toast.error("Cannot delete file, try again later")
    }
  }


  useEffect(() => {
    getAllFiles()
    setfilteredFiles(allFiles?.files?.filter(file => file.resource_type === isActive));
  }, [isActive])
  

  return (
    <div className='showitems'>
        <div className="showitems_container">
          {
            isLoading && 
            <div className='loading_screen'>
                <p> 
                  <Hourglass
                    visible={true}
                    height="30"
                    width="30"
                    ariaLabel="hourglass-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    colors={['#343C3E', '#0EBE68']}
                    />
                    <span>Loading...</span>
                    </p>
            </div>
          }
          {isActive === 'dashboard' ? 
            <>
              { allFoldersAndFiles?.folders.length > 0 || allFoldersAndFiles?.files.length > 0 ?
                <>
                  {allFoldersAndFiles?.folders?.map((folder, index) => {
                    length++
                    return(
                    <p className="showitems_item" key={index} onDoubleClick={() => {changePaths(folder.path)}} onMouseLeave={() => closeOption(index)}>
                        <FaEllipsis className='item_options' onClick={() => openOption(index)}/>
                        <FaFolder className='item_icon'/>
                        <span className='item_name'>{folder.name}</span>
                        <span className='item_options-option-folder' id={`${index}-item_options-option`}>
                          <button onClick={()=>deleteFolder(folder.path, folder.name)}>• Delete</button>
                        </span>
                    </p>
                    )
                  })}

                  {allFoldersAndFiles?.files?.map((file, index) => {
                    index += length
                    return (
                  
                    <p className="showitems_item" key={index} onMouseLeave={() => closeOption(index)} onDoubleClick={() => {view(file.url); closeOption(index)}}>
                        {file.resource_type === 'image' && 
                          <>
                            <FaEllipsis className='item_options' onClick={() => openOption(index)}/>
                            <FaFileImage className='item_icon'/>
                            <span className='item_name'>{file.filename}</span>
                            <span className='item_options-option-file' id={`${index}-item_options-option`}>
                              <button onClick={() => deleteFile(file.public_id)}>• Delete</button>
                              <button onClick={() => downloadFiles(file.url, file.filename)}>• Download</button>
                            </span>
                          </>
                        }
                        {file.resource_type === 'video' && 
                          <>
                            <FaEllipsis className='item_options' onClick={() => openOption(index)}/>
                            <FaFileVideo className='item_icon'/>
                            <span className='item_name'>{file.filename}</span>
                            <span className='item_options-option-file' id={`${index}-item_options-option`}>
                              <button onClick={() => deleteFile(file.public_id)}>• Delete</button>
                              <button onClick={() => downloadFiles(file.url, file.filename)}>• Download</button>
                            </span>
                          </>
                        }
                        {file.resource_type === 'raw' && 
                          <>
                            <FaEllipsis className='item_options' onClick={() => openOption(index)}/>
                            <FaFileAlt className='item_icon'/>
                            <span className='item_name'>{file.filename}</span>
                            <span className='item_options-option-file' id={`${index}-item_options-option`}>
                              <button onClick={() => deleteFile(file.public_id)}>• Delete</button>
                              <button onClick={() => downloadFiles(file.url, file.filename)}>• Download</button>
                            </span>
                          </>
                        }
                    </p>
                    )
                  })}
                </>
              :
              <span>Empty Folder</span>
              }
            </> 
            :
            <>
              { filteredFiles.length > 0 ?
                <>
                  {filteredFiles.map((file, index) => {
                    return (
                    <p className="showitems_item" key={index} onMouseLeave={() => closeOption(index)} onDoubleClick={() => {view(file.url); closeOption(index)}}>
                        {file.resource_type === 'image' && (
                            <>  
                                <FaEllipsis className='item_options' onClick={() => openOption(index)}/>
                                <FaFileImage className='item_icon' />
                                <span className='item_name'>{file.filename}</span>
                                <span className='item_options-option-file' id={`${index}-item_options-option`}>
                                  <button onClick={() => deleteFile(file.public_id)}>• Delete</button>
                                  <button onClick={() => downloadFiles(file.url, file.filename)}>• Download</button>
                                </span>
                            </>
                        )}
                        {file.resource_type === 'video' && (
                            <>  
                                <FaEllipsis className='item_options' onClick={() => openOption(index)}/>
                                <FaFileVideo className='item_icon' />
                                <span className='item_name'>{file.filename}</span>
                                <span className='item_options-option-file' id={`${index}-item_options-option`}>
                                  <button onClick={() => deleteFile(file.public_id)}>• Delete</button>
                                  <button onClick={() => downloadFiles(file.url, file.filename)}>• Download</button>
                                </span>
                            </>
                        )}
                        {file.resource_type === 'raw' && (
                            <>  
                                <FaEllipsis className='item_options' onClick={() => openOption(index)}/>
                                <FaFileAlt className='item_icon' />
                                <span className='item_name'>{file.filename}</span>
                                <span className='item_options-option-file' id={`${index}-item_options-option`}>
                                  <button onClick={() => deleteFile(file.public_id)}>• Delete</button>
                                  <button onClick={() => downloadFiles(file.url, file.filename)}>• Download</button>
                                </span>
                            </>
                        )}
                    </p>
                    )
                  })}
                </>
              :
              <span>
                {isActive === "image" && 
                  <>No Images</>
                }
                {isActive === "video" && 
                  <>No Videos</>
                }
                {isActive === "raw" && 
                  <>No Documents</>
                }
              </span>
              }
            </>  
          }


        </div>
    </div>
  )
}

export default ShowItems
