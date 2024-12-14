import React, { useState }from 'react';
import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';

const Contact = () => {
    const [ sent, setSent ] = useState(false);

    const handleContact = () => {
        if (document.querySelector('input[type="text"]').value === '' || document.querySelector('input[type="email"]').value === '' || document.querySelector('textarea').value === '') {
            alert('Please fill in all fields.');
            return;
        }
        setSent(true);
    }

    return (
        <>                    
            <NavBar  />
            <SideBar />

            <div style={styles.mainContent}>

                <div style={styles.formContainer}>
                    <h1> Contact Us </h1>
                    <p style={{fontSize: 22, textAlign: 'justify'}}> If you have any questions or suggestions, please contact us. </p>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '2vh', width: '80%', justifyContent: 'center'}}>
                        <input type="text" placeholder="Full Name" style={styles.input}/>
                        <input type="email" placeholder="Email" style={styles.input}/>
                        <textarea placeholder="Message" style={styles.textArea}/>
                        { sent ? (
                            <button style={{...styles.button, marginBottom: 0}} onClick={handleContact}> Send </button>
                        ) : (
                            <button style={{...styles.button, marginBottom: 70}} onClick={handleContact}> Send </button>
                        )} 
                    </form>
                    { sent ? (
                        <div style={{ marginBottom: 20, fontSize: 18, color: '#183059', textAlign: 'center'}}> Thank you for contacting us! We will get back to you as soon as possible. </div>
                    ) : ( null )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30}}>
                    <div style={{ display: 'flex', flexDirection: 'row'}}>
                        <img src={require('../assets/address_icon.png')} alt="Address Icon" style={{width: '3.5vh', height: '3.5vh', backgroundColor: '#183059', padding: '1.5vh', borderRadius: 100}}/>
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '2vh'}}>
                            <div style={styles.title}> Address </div>
                            <div style={styles.text}> Campus Universitário da Penteada, 9020-105 </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row'}}>
                        <img src={require('../assets/phone_icon.png')} alt="Phone Icon" style={{width: '3.5vh', height: '3.5vh', backgroundColor: '#183059', padding: '1.5vh', borderRadius: 100}}/>
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '2vh'}}>
                            <div style={styles.title}> Phone </div>
                            <div style={styles.text}> (+351) 291 705 000 </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row'}}>
                        <img src={require('../assets/mail_icon.png')} alt="Email Icon" style={{width: '4vh', height: '4vh', backgroundColor: '#183059', padding: '1.5vh', borderRadius: 100}}/>
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '2vh'}}>
                            <div style={styles.title}> Email </div>
                            <div style={styles.text}> contact@worthmore.pt </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    );
};

const styles = {
    mainContent: {
        marginTop: 140,
        marginLeft: '16%',
        paddingLeft: '2vh',
        font: 'Inter',
        display: 'flex',
        gap: '10vh',
    },
    title: {    
        fontSize: 22,
        fontWeight: 'bold',
        color: '#183059',
    },
    text: {
        marginBottom: '4vh',
        fontSize: 22,
        textAlign: 'justify',
    },
    formContainer: {
        width: '50%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap : '3vh',
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    input: {
        width: '90%',
        padding: '1.5vh',
        fontSize: '2vh',
        marginTop: 20,
        borderRadius: '1vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        alignSelf: 'center',
        fontFamily: 'Inter',
    },
    textArea: {
        fontFamily: 'Inter',
        width: '90%',
        height: '100px',
        resize: 'none',
        marginTop: 20,
        padding: '1.5vh',
        fontSize: '2vh',
        borderRadius: '1vh',
        border: 'none',
        backgroundColor: '#EFEFEF',
        outline: 'none',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        alignSelf: 'center',
    },
    button: {
        width: '95%',
        padding: '1.5vh',
        fontSize: '2vh',
        borderRadius: '1vh',
        border: 'none',
        backgroundColor: '#183059',
        color: '#fff',
        outline: 'none',
        cursor: 'pointer',
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
};

export default Contact;