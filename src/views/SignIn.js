import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBarSimple from '../components/NavBarSimple';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate(); 

    // Lidar com a mudança dos inputs do formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Lidar com o processo de login
    const handleSignIn = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', { // URL para o endpoint de login (isto e importante, no backend tem de ser sempre 5000 e no front end 3000)
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Logged in successfully!');
                localStorage.setItem('token', data.token); // Salvar o token no localStorage
                navigate('/warning'); 
            } else {
                alert(data.message); 
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Failed to log in');
        }
    };

    return (
        <>
            <NavBarSimple />
            <div style={styles.container}>
                <div style={styles.formContainer}>
                    <h2 style={styles.title}>Sign In With</h2>

                    <div style={styles.socialButtons}>
                        <button style={styles.facebookButton}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                                alt="Facebook Logo"
                                style={styles.socialIcon}
                            />
                            Facebook
                        </button>

                        <button style={styles.googleButton}>
                            <img
                                src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                                alt="Google Logo"
                                style={styles.socialIcon}
                            />
                            Google
                        </button>
                    </div>

                    <div style={styles.inputContainer}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="Email"
                        />
                    </div>

                    <div style={styles.inputContainer}>
                        <label style={styles.label}>
                            Password
                            <a href="#" style={styles.forgotPassword}> Forgot?</a>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="Password"
                        />
                    </div>

                    <button style={styles.signInButton} onClick={handleSignIn}>Sign In</button>

                    <p style={styles.footerText}>
                        Not a member? <a href="/signup" style={styles.signUpLink}>Sign Up Now</a>
                    </p>
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
        height: '70vh',
        backgroundColor: '#183059',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '2vh',
        padding: '5vh',
        width: '80%',
        maxWidth: '40%',
        boxShadow: '0 0 2vh rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    title: {
        fontSize: '3vh',
        marginBottom: '2vh',
        color: '#000',
    },
    socialButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '2vh',
    },
    facebookButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4267B2',
        color: '#fff',
        border: 'none',
        borderRadius: '1vh',
        padding: '1.5vh 3vw',
        cursor: 'pointer',
        width: '48%',
    },
    googleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        color: '#000',
        border: '0.3vh solid #ccc',
        borderRadius: '1vh',
        padding: '1.5vh 3vw',
        cursor: 'pointer',
        width: '48%',
    },
    socialIcon: {
        width: '3vh',
        height: '3vh',
        marginRight: '1vw',
    },
    inputContainer: {
        textAlign: 'left',
        marginBottom: '2vh',
    },
    label: {
        display: 'block',
        fontSize: '2vh',
        fontWeight: 'bold',
        marginBottom: '1vh',
        color: '#000',
    },
    input: {
        width: '100%',
        padding: '1.5vh',
        fontSize: '2vh',
        borderRadius: '1vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },
    forgotPassword: {
        fontSize: '1.5vh',
        color: '#009DFF',
        float: 'right',
        textDecoration: 'none',
    },
    signInButton: {
        width: '105%',
        backgroundColor: '#333333',
        color: '#ffffff',
        padding: '2vh',
        borderRadius: '1vh',
        border: 'none',
        fontSize: '2vh',
        cursor: 'pointer',
        marginTop: '3vh',
    },
    footerText: {
        fontSize: '1.5vh',
        color: '#666666',
        marginTop: '3vh',
    },
    signUpLink: {
        color: '#009DFF',
        textDecoration: 'none',
    },
};

export default SignIn;
