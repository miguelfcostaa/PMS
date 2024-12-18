import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBarSimple from '../components/NavBarSimple';

const SignUp = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        TIN: '',
        passportNumber: '',
    });
    const [termsAccepted, setTermsAccepted] = useState(false);

    const navigate = useNavigate();

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle checkbox change
    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    // Convert files to Base64 to be sent to the backend
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    // Validate the form data before submitting
    const validateForm = () => {
        for (const [key, value] of Object.entries(formData)) {
            if (!value && key !== 'TIN') {
                return `Please fill in the ${key.replace(/([A-Z])/g, ' $1')}`; // Format key to readable label
            }
        }

        if (selectedFiles.length === 0) {
            return 'Please upload at least one passport photo.';
        }

        if (!termsAccepted) {
            return 'You must accept the Terms and Conditions to proceed.';
        }

        if (formData.password !== formData.confirmPassword) {
            return 'Passwords do not match!';
        }

        return null;
    };

    // Handle account creation
    const handleSignUp = async () => {
        const error = validateForm();
        if (error) {
            alert(error);
            return;
        }

        try {
            // Converter os ficheiros para Base64
            const documentsData = await Promise.all(selectedFiles.map(async (file) => {
                const base64Content = await convertFileToBase64(file);
                return {
                    name: file.name,
                    type: file.type,
                    content: base64Content.split(',')[1], // Remove o prefixo "data:...base64,"
                };
            }));

            // Preparar os dados para envio ao backend
            const payload = {
                ...formData,
                documents: documentsData,
            };

            // Fazer a requisição ao servidor
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 201) {
                alert('User registered successfully!');
                navigate('/warning');
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to register');
            }
        } 
        catch (error) {
            console.error('Error during registration:', error);
            alert('Failed to register');
        }
    };

    // Handle file uploads
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleUploadClick = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <>
            <NavBarSimple />
            <div style={styles.container}>
                <div style={styles.formContainer}>
                    <h2 style={styles.title}>Sign Up With</h2>
                    <div style={styles.columns}>
                        <div style={styles.leftColumn}>
                            <div style={styles.row}>
                                <div style={styles.halfInputContainer}>
                                    <label style={styles.label}>First Name</label>
                                    <input 
                                        type="text" 
                                        name="firstName" 
                                        value={formData.firstName} 
                                        onChange={handleInputChange} 
                                        style={styles.input} 
                                        placeholder="First Name" 
                                    />
                                </div>
                                <div style={styles.halfInputContainer}>
                                    <label style={styles.label}>Last Name</label>
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        value={formData.lastName} 
                                        onChange={handleInputChange} 
                                        style={styles.input} 
                                        placeholder="Last Name" 
                                    />
                                </div>
                            </div>
                            
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Password</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleInputChange} 
                                    style={styles.input} 
                                    placeholder="Password" 
                                />
                            </div>
                            
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Tax Identification Number (TIN)</label>
                                <input 
                                    type="text" 
                                    name="TIN" 
                                    value={formData.TIN} 
                                    onChange={handleInputChange} 
                                    style={styles.input} 
                                    placeholder="TIN" 
                                />
                            </div>
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Upload Passport Photo</label>
                                <div
                                    style={styles.uploadBox}
                                    onClick={handleUploadClick}
                                >
                                    {selectedFiles.length > 0 ? (
                                        selectedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                style={styles.filePreview}
                                            >
                                                <img
                                                    src="https://img.icons8.com/color/48/000000/file--v1.png"
                                                    alt="File Icon"
                                                    style={styles.fileIcon}
                                                />
                                                <span>{file.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            <img
                                                src={require('../assets/upload-icon.png')}
                                                alt="Upload Icon"
                                                style={styles.uploadIcon}
                                            />
                                            <span style={styles.uploadTextPrimary}>Upload Item Image</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        id="fileInput"
                                        style={{ display: 'none' }}
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={styles.rightColumn}>
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleInputChange} 
                                    style={styles.inputRight} 
                                    placeholder="Email" 
                                />
                            </div>
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Confirm Password</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    value={formData.confirmPassword} 
                                    onChange={handleInputChange} 
                                    style={styles.inputRight} 
                                    placeholder="Confirm Password" 
                                />
                            </div>
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Passport Number</label>
                                <input 
                                    type="text" 
                                    name="passportNumber" 
                                    value={formData.passportNumber} 
                                    onChange={handleInputChange} 
                                    style={styles.inputRight} 
                                    placeholder="Passport Number" 
                                />
                            </div>
                            
                            <div style={styles.termsContainer}>
                                <input type="checkbox" id="terms" checked={termsAccepted} onChange={handleTermsChange} style={styles.checkbox} />
                                <label htmlFor="terms" style={styles.termsLabel}>
                                    I agree to the <a href="#" style={styles.termsLink}>Terms and Conditions</a>
                                </label>
                            </div>
                            <button style={styles.signUpButton} onClick={handleSignUp}>Sign Up</button>
                            <p style={styles.footerText}>
                                Already a member? <a href="/signin" style={styles.signInLink}>Sign In</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        backgroundColor: '#183059',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '2.5vh',
        padding: '4vh',
        width: '90%',
        maxWidth: '1200px',
        boxShadow: '0vh 0vh 2vh rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        margin: '2vh',
    },
    title: {
        fontSize: '2.8vh',
        marginBottom: '2vh',
        color: '#000',
    },
    columns: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '6%',
    },
    leftColumn: {
        width: '46%',
    },
    rightColumn: {
        width: '46%',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '2vh',
        gap: '6%',
    },
    halfInputContainer: {
        width: '48%',
        textAlign: 'left',
    },
    inputContainer: {
        marginBottom: '2vh',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        fontSize: '1.6vh',
        fontWeight: 'bold',
        marginBottom: '0.5vh',
        color: '#000',
    },
    input: {
        width: '100%',
        padding: '1vh',
        fontSize: '1.6vh',
        borderRadius: '0.5vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.3vh 0.3vh 0.7vh rgba(0, 0, 0, 0.2)',
    },
    inputRight: {
        width: '96.5%',
        padding: '1vh',
        fontSize: '1.6vh',
        borderRadius: '0.5vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.3vh 0.3vh 0.7vh rgba(0, 0, 0, 0.2)',
    },
    uploadBox: {
        width: '103%',
        height: '12vh',
        border: 'none',
        borderRadius: '0.5vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '1vh',
        cursor: 'pointer',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },
    uploadTextPrimary: {
        color: '#000',
        fontSize: '1.6vh',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    uploadTextSecondary: {
        color: '#aaa',
        fontSize: '1.2vh',
    },
    filePreview: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        marginBottom: '0.5vh',
    },
    fileIcon: {
        width: '2.4vh',
        height: '2.4vh',
        marginRight: '1vh',
    },
    termsContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '5vh',
        justifyContent: 'center',
    },
    checkbox: {
        marginRight: '1vh',
    },
    termsLabel: {
        fontSize: '1.5vh',
        color: '#666666',
    },
    termsLink: {
        color: '#009DFF',
        textDecoration: 'none',
    },
    signUpButton: {
        width: '99.5%',
        backgroundColor: '#333333',
        color: '#ffffff',
        padding: '1.3vh',
        borderRadius: '0.5vh',
        border: 'none',
        fontSize: '1.5vh',
        cursor: 'pointer',
        marginTop: '2vh',
    },
    footerText: {
        fontSize: '1.5vh',
        color: '#666666',

    },
    signInLink: {
        color: '#009DFF',
        textDecoration: 'none',
    },
    uploadTextPrimary: {
        fontSize: '1.8vh',
        fontWeight: 'bold',
        font: 'Inter',
        cursor: 'pointer',
    },
    uploadIcon: {
        width: 42,
        height: 42,
        cursor: 'pointer',
    },
};

export default SignUp;