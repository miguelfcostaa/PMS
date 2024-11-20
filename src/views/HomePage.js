import React from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function HomePage() {

    return (
        <>   
            <div style={styles.mainContent}>
                <div style={styles.container}>
                    <div style={styles.quadrado2}> </div>                    
                    <div style={styles.circulo1}></div>
                    <div style={styles.quadrado1}></div>
                    <div style={styles.circulo2}></div>

                    <div style={styles.leftsection}>
                        <p style={styles.leftsection}>Your place to do <span style={{fontSize: '128px', fontWeight: '350'}}><b>GOOD!</b></span></p>
                        <button style={styles.button1}>Start Creating Campaign </button>
                        <p style={{fontSize: '32px', marginTop:'10%'}}>Start creating and <br/> organizing a campaign <br/><span style={{fontWeight: '350'}}><b>free of charge!</b></span></p>
                    </div>     

                    <div style={styles.rightsection}>
                        <button style={styles.button}>Start Playing</button>
                        <p>Play games and <span style={styles.highlight}>help</span> a campaign of <strong>your choice!</strong></p>
                        <h2>Your chance to <span style={styles.highlight}>HELP!</span></h2>
                    </div> 

                                 
                </div>
            </div>
            <NavBar  />
            <SideBar  />
        </>
    );
}

const styles = {
    
    mainContent: {
        marginTop: 82,
        marginLeft: '20%',
        marginRight: 0,
        paddingLeft: '0px',
        font: 'Inter',

    },
    
    container: {
        paddingLeft: '20px',
        width: "100%",
        height: "100%",
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 40,        
        position:'absolute'
    },

    circulo1: {
        height: "817px",
        width: "997px",
        borderRadius: "100%",
        background: "#C7D5E5",
        marginLeft:"-1%",
        position:'absolute',
        zindex:30
    },

    circulo2: {
        height: "677px",
        width: "1061px",
        borderRadius: "100%",
        background: "#425576",
        marginLeft:"220px",
        marginTop:"791px",
        position:'absolute',
        zindex:30
    },

    quadrado1: {
        marginLeft: -30,
        marginTop: 14,
        height: "1011px",
        width: "637px",
        borderRadius: "0%",
        background: "#C7D5E5",
        position:'absolute',
    },

    quadrado2: {
        marginTop: 14,
        height: "1011px",
        width: "1009px",
        borderRadius: "0%",
        background: "#425576",
        marginLeft:"607px",
        position:'absolute',
    },

    leftsection:{
        width: '48%',
        textalign: 'left',
        fontStyle: 'normal',
        fontSize: "64px",
        fontWeight: "200",
        position:"absolute",
        color:"#425576"
    },
    
    rightsection:{
       /**  display: 'flex',
        flexdirection: 'column',
        justifycontent: 'center',
        alignitems: 'center',
        backgroundcolor: '#3c4a63',
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontSize: "64px",
        position:"absolute"*/
    },
    
    h2:{
        margin: '0 0 20px',
    },

    h1:{
        margin: '0 0 20px',
    },
    
    highlight:{
        color: '#3c4a63', /* Dark text for contrast on light background */
        fontweight: 'bold',
    },

    button1:{
        padding: '10px 20px',
        width: "511px",
        height: "77px",
        border: 'none',
        background: '#425576',
        boxshadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderradius: '5px',
        cursor: 'pointer',
        fontSize: '32px',
        borderRadius: "20px",
        color:"white",
        marginTop:"40%",
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },
    
    primary:{
        backgroundcolor: '#526cb8', /* Button color */
        color: 'white',
    },
    
    secondary:{
        backgroundcolor: '#d0d8ed', /* Light blue button */
        color: '#3c4a63',
    },
};

export default HomePage;