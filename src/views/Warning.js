import React from 'react';
import NavBarSimple from '../components/NavBarSimple';

const Warning = () => {
    return (
        <>
            <NavBarSimple />
            <div style={styles.container}>
                <div style={styles.formContainer}>
                    <h2 style={styles.title}>Sign Up Almost Completed!</h2>
                    <p style={styles.message}>
                        Thank you for registering! Your information is currently being <strong>reviewed</strong> by our <strong>administration team</strong>. Once <strong>validated</strong>, you'll have <strong>full access</strong> to the platform. In the meantime, feel free to explore our features and <strong>start planning</strong> details for your future campaign.
                    </p>
                    <button style={styles.continueButton} onClick={() => window.location.href = '/'}>I understand, continue</button>
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
        width: '80%',
        maxWidth: '600px',
        boxShadow: '0vh 0vh 2vh rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        margin: '2vh',
    },
    title: {
        fontSize: '3vh',
        marginBottom: '2vh',
        color: '#000',
    },
    message: {
        fontSize: '2vh',
        lineHeight: '1.5',
        color: '#000',
        marginBottom: '4vh',
    },
    continueButton: {
        width: '80%',
        backgroundColor: '#333333',
        color: '#ffffff',
        padding: '2vh',
        borderRadius: '1vh',
        border: 'none',
        fontSize: '2vh',
        cursor: 'pointer',
    },
};

export default Warning;
