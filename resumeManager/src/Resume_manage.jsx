import { useState } from 'react';
import axios from 'axios';

function App() {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [validatedResumes, setValidatedResumes] = useState([]);
    const [selectedResumes, setSelectedResumes] = useState([]);
    const [selectedForCommunication, setSelectedForCommunication] = useState([]);

    const handleCheckboxChange = (id) => {
        setSelectedResumes(prevSelectedResumes => {
            if (prevSelectedResumes.includes(id)) {
                return prevSelectedResumes.filter(item => item !== id);
            } else {
                return [...prevSelectedResumes, id];
            }
        });
    };

    const validateResumes = async () => {
        try {
            const response = await axios.post('http://localhost:3001/validate', { ids: selectedResumes });
            setResumes(response.data.resumes);
            setValidatedResumes(response.data.validatedResumes);
            setSelectedResumes([]);
        } catch (error) {
            console.error('Error validating resumes:', error);
        }
    };

    const handleCommunicationCheckboxChange = (id) => {
        setSelectedForCommunication(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const communicateWithResumes = async () => {
        try {
            const response = await axios.post('http://localhost:3001/communicate', { ids: selectedForCommunication });
            setValidatedResumes(response.data.validatedResumes);
            setSelectedForCommunication([]);
        } catch (error) {
            console.error('Error communicating with resumes:', error);
        }
    };

    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("Drag & drop any file here");
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFiles(event.target.files[0]);
            setFile(file);
            setUploadMessage(`Ready to upload: ${file.name}`);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            setFile(file);
            setUploadMessage(`Ready to upload: ${file.name}`);
        }
    };

    const uploadResume = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }
        const formData = new FormData();
        formData.append('resume', selectedFiles);

        try {
            const response = await axios.post('http://localhost:3001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResumes(response.data.resumes);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
        // Mock upload function: you should implement actual file upload logic here
        console.log("Uploading", file.name);
        // Reset after "upload"
        setFile(null);
        setUploadMessage("Drag & drop any file here");
    };
    return (
        <>
            <h1 className='d-flex justify-content-center align-item-center mt-3'>Resume Management</h1>
            <div className="d-flex justify-content-center align-item-center mt-4">
                <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet" />
                <form className="form-container" encType="multipart/form-data">
                    <div className="upload-files-container">
                        <div className="drag-file-area"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{ backgroundColor: isDragging ? '#e0e0e0' : '' }}>
                            <span className="material-icons-outlined upload-icon">file_upload</span>
                            <h3 className="dynamic-message">{uploadMessage}</h3>
                            <label className="label">
                                or <input type="file" className="default-file-input" onChange={handleFileSelect} style={{ display: 'none' }} />
                                <span className="browse-files-text" onClick={() => document.querySelector('.default-file-input').click()}>browse file</span>
                                <span>from device</span>
                            </label>
                        </div>
                        {file && (
                            <div className="file-block">
                                <div className="file-info">
                                    <span className="material-icons-outlined file-icon">description</span>
                                    <span className="file-name">{file.name}</span> |
                                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                                <span className="material-icons remove-file-icon" onClick={() => setFile(null)}>delete</span>
                            </div>
                        )}
                        <button type="button" onClick={uploadResume} className="btn btn-sm btn-primary polaroid upload-button">Upload Resume</button>
                    </div>
                </form>

            </div>
            <div className='d-flex justify-content-center align-item-center mt-5 container' >
                <div className='mx-2 polaroid'>
                    <h5>Uploaded Resumes</h5>
                    <button className='upload-button mb-2' onClick={validateResumes}>Validate</button>
                    <table className="table border rounded mt-2">
                        <thead>
                            <tr>
                                <th scope="col">Check</th>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Handle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                resumes.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        onChange={() => handleCheckboxChange(item.id)}
                                                        type="checkbox"
                                                        value={item.id}
                                                        checked={selectedResumes.includes(item.id)}
                                                        id={`flexCheckDefault-${item.id}`}
                                                    />
                                                </div>
                                            </td>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td><button className='upload-button' onClick={validateResumes}>Validate</button>
                                            </td>
                                        </tr>

                                    )
                                })
                            }


                        </tbody>
                    </table></div>
                <div className='mx-2 polaroid'>
                    <h5>Validated Resumes</h5>
                    <button onClick={communicateWithResumes} className='upload-button mb-2'>
                        Communicate
                    </button>
                    <table className="table border rounded mt-2">
                        <thead>
                            <tr>
                                <th scope="col">Check</th>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Handle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {validatedResumes.map((resume, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                onChange={() => handleCommunicationCheckboxChange(resume.id)}
                                                type="checkbox"
                                                checked={selectedForCommunication.includes(resume.id)}
                                                id={`communicationCheck-${resume.id}`}
                                            />
                                        </div>
                                    </td>
                                    <td>{resume.id}</td>
                                    <td>{resume.name}</td>
                                    <td><button className='upload-button btn-sm' onClick={communicateWithResumes}>Communicate</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
            </div>

        </>
    );
}

export default App;
