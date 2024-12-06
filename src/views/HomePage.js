import React, { useState, useEffect }  from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import CampaignBox from '../components/CampaignBox';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/campaign/all-campaigns');
                if (response.ok) {
                    const data = await response.json();
                    setCampaigns(data);  
                } else {
                    throw new Error('Erro ao buscar campanhas');
                }
            } catch (err) {
                console.error('Erro na conexão', err);
            }
        };
        fetchCampaigns();
    }, []);

    const navigate = useNavigate();

    const handleCampaignClick = (id) => {
        navigate(`/campaign/${id}`); // Redireciona para a página da campanha com o ID
    };

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
                        <a href='/create-campaign'> <button style={styles.button1}>Start Creating Campaign </button></a>
                        <p style={{fontSize: '32px', marginTop:'10%'}}>Start creating and <br/> organizing a campaign <br/><span style={{fontWeight: '350'}}><b>free of charge!</b></span></p>
                    </div>     

                    <div style={styles.rightsection}>
                        <p style={{fontSize: '32px', marginTop:'10%'}}>Play games and <span style={{fontWeight: '350'}}><b>help</b></span> a <br/> campaign of <span style={{fontWeight: '350'}}><b>your choice!</b></span></p>
                        <a href='/games'><button style={styles.button2}>Start Playing</button></a>
                        <p style={styles.rightsection1}>Your chance to <br/><span style={{fontSize: '128px', fontWeight: '350'}}><b>HELP!</b></span></p>
                    </div>   
                <div style={styles.botcontainer}>
                    <p style={{fontSize: '64px', textAlign: 'center',}}><b>POPULAR CAMPAIGNS</b></p>
                    <div style={styles.campaignDisplay} >
                            <div onClick={() => handleCampaignClick(campaigns._id)} style={{display:'flex', gap:'3%', width:'100%',   justifyContent: 'center'}}>
                                <CampaignBox style={styles.campanha}
                                    key="123"
                                    title="123"
                                    description="123"
                                    goal="123"
                                    timeToCompleteGoal="123"
                                    currentAmount="123"
                                    nameBankAccount="123"
                                />      
                                <CampaignBox style={styles.campanha}
                                    key= '123'
                                    title="123"
                                    description="123"
                                    goal="123"
                                    timeToCompleteGoal="123"
                                    currentAmount="123"
                                    nameBankAccount="123"
                                />   
                                <CampaignBox style={styles.campanha}
                                    key="123"
                                    title="123"
                                    description="123"
                                    goal="123"
                                    timeToCompleteGoal="123"
                                    currentAmount="123"
                                    nameBankAccount="123"
                                />   
                            </div>
                    </div>
                </div>     
                </div>

                
            </div>
            <NavBar  />
            <SideBar  />
        </>
    );
}

const styles = {
    
    campanha:{
        flex:'auto',
        marginLeft: '5%',
        height: '100%',
        background: '#FFFFFF',
        borderRadius: '10px'
    },

    campaignDisplay: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginRight: 30,
        marginBottom: 30,
        background: "#D9D9D9",
        width:'100%'
    },

    mainContent: {
        marginTop: 82,
        marginLeft: '15%',
        paddingLeft: '0px',
        font: 'Inter',
    },
    
    botcontainer: {
        marginTop:"47%",
        marginLeft:"-1.7%",
        width: "80%",
        height: "100%",
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 40,        
        position:'absolute',
        background: "#D9D9D9",
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
        height: "70%",
        width: "30%",
        borderRadius: "100%",
        background: "#C7D5E5",
        marginLeft:"15%",
        marginTop:"-2%",
        position:'absolute',
        zindex:30
    },

    circulo2: {
        height: "80%",
        width: "50%",
        borderRadius: "100%",
        background: "#425576",
        marginLeft:"17.3%",
        marginTop:"29.48%",
        position:'absolute',
        zindex:30
    },

    quadrado1: {
        marginLeft: "-1.5%",
        marginTop: 14,
        height: "99%",
        width: "36.3%",
        borderRadius: "0%",
        background: "#C7D5E5",
        position:'absolute',
    },

    quadrado2: {
        marginTop: 14,
        height: "99%",
        width: "45%", //1009
        borderRadius: "0%",
        background: "#425576",
        marginLeft:"33.3%",
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
        textAlign: 'right',
        fontStyle: 'normal',
        fontSize: "64px",
        fontWeight: "200",
        position:"absolute",
        color: '#C7D5E5',
        marginLeft: '57%',
        marginTop:'2.5%',
    },

    rightsection1:{
        width:"150%",
        textAlign: 'right',
        fontStyle: 'normal',
        fontSize: "64px",
        fontWeight: "200",
        position:"absolute",
        color: '#C7D5E5',
        marginTop:'50%',
        marginLeft: '-50%'
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

    button2:{
        padding: '10px 20px',
        width: "398px",
        height: "77px",
        border: 'none',
        background: '#C7D5E5',
        boxshadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderradius: '5px',
        cursor: 'pointer',
        fontSize: '32px',
        borderRadius: "20px",
        color:"white",
        marginLeft:"-100%",
        marginTop:"40%",
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
    },
};

export default HomePage;