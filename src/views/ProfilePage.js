import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import CampaignBox from '../components/CampaignBox';
import axios from 'axios';
import defaultAvatar from '../assets/default-avatar.png';

const fields = ['firstName', 'lastName', 'email', 'password', 'TIN', 'passportNumber', 'IBAN', 'paymentMethod'];

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [updatedData, setUpdatedData] = useState({});
    const [coins, setCoins] = useState([]);
    const [isVerified, setIsVerified] = useState(false);
    const [myCampaigns, setMyCampaigns] = useState([])
    const [donatedCampaigns, setDonatedCampaigns] = useState([]);
    const userId = localStorage.getItem('userId');
    

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/${userId}`);
                if (response.status === 200) {
                    const data = response.data;
                    setUserData(data);
                    setCoins(data.coins || []);
                    setIsVerified(data.role === 'criador/doador');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        

        const fetchCampaigns = async () => {
            const userId = localStorage.getItem('userId'); // Obtém o ID do utilizador do localStorage
            
            try {
                const campaignsResponse = await axios.get('http://localhost:5000/api/campaign/all-campaigns');
        
                // Filtra campanhas criadas pelo utilizador
                const userCampaigns = campaignsResponse.data.filter(campaign => 
                    campaign.creator && campaign.creator._id.toString() === userId
                );
                setMyCampaigns(userCampaigns);
        
                // Filtra campanhas doadas pelo utilizador (verifica se donators existe)
                // Filtra campanhas doadas pelo utilizador (verifica se donators existe)
                const userDonatedCampaigns = campaignsResponse.data.filter(campaign =>
                    Array.isArray(campaign.donators) && 
                    campaign.donators.some(donator => donator.userId?.toString() === userId)
                );

                setDonatedCampaigns(userDonatedCampaigns);
        
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            }
        };
        
        
        

        fetchUserData();
        fetchCampaigns();
        fetchUserData();
    }, [userId, userData?.profilePicture]); 

    const handleEdit = (field) => {
        if (userData) {
            setEditingField(field);
            setUpdatedData({ ...updatedData, [field]: userData[field] || '' });
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/auth/${userId}`, 
                updatedData
            );
            if (response.status === 200) {
                setUserData({ ...userData, ...updatedData });
                setEditingField(null);
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };
    
    

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        
        if (!file) {
            console.error('No file selected');
            return;
        }
        
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        try {
            const response = await axios.put(
                `http://localhost:5000/api/auth/${userId}/profile-picture`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
    
            setUserData({
                ...userData, 
                profilePicture: response.data.profilePicture
            });
            
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };
    
    const handleEditCampaign = (campaignId) => {
        return () => {
            window.location.href = `/edit-campaign/${campaignId}`;
        };
    };


    if (!userData) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.pageContainer}>
            <NavBar />
            <div style={styles.contentContainer}>
                <SideBar />
                <div style={styles.profileContainer}>
                    {/* Cabeçalho */}
                    <div style={styles.header}>
                        <h1 style={styles.title}>Profile</h1>
                        <div
                            style={{
                                ...styles.verificationStatus,
                                backgroundColor: isVerified ? '#4CAF50' : '#FF0000',
                            }}
                        >
                            {isVerified ? 'Verified' : 'Verifying'}
                        </div>
                    </div>
                    <hr style={styles.separator} />

                    {/* Imagem de perfil e coins */}
                    <div style={styles.profileBody}>
                        <div style={styles.profileLeft}>
                            <div style={styles.profilePictureContainer}>
                                <div style={styles.profilePicture}>
                                <img
                                    src={
                                        userData?.profilePicture
                                            ? `data:image/png;base64,${userData.profilePicture}`
                                            : defaultAvatar
                                    }
                                    alt="Profile"
                                    style={styles.picture}
                                    />
                                </div>
                                <label htmlFor="profilePictureUpload" style={styles.uploadButton}>
                                    <input
                                        id="profilePictureUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <img 
                                        src={require('../assets/adicionar-imagem.png')} 
                                        alt="Add Icon" 
                                        style={styles.addIcon} 
                                    /> 
                                </label>

                            </div>

                            <h3 style={styles.coinsTitle}>Your Coins</h3>
                            <div style={styles.coinsContainer}>
                                {coins.length > 0 ? (
                                    coins.map((coin, index) => (
                                        <div key={index} style={styles.coinRow}>
                                            <img 
                                                src={require('../assets/plus-icon.png')} 
                                                alt="Add Icon" 
                                                style={styles.addCoinsIcon} 
                                                onClick={() => {
                                                    if (!coin.campaignId) {
                                                        alert('Campaign ID não encontrado para esta moeda.');
                                                        return;
                                                    }
                                                    window.location.href = `/campaign/${coin.campaignId}`;
                                                }}
                                            />
                                            <span style={styles.coinAmount}>
                                                {coin.amount}
                                            </span>
                                            <div style={styles.coinCircle}>
                                                <img
                                                    src={coin.coinImage}
                                                    alt={coin.coinName}
                                                    style={styles.coinImage}
                                                    title={coin.coinName} // Nome da moeda aparece no hover
                                                />
                                            </div>
                                            {index < coins.length - 1 && <div style={styles.coinSeparator}></div>}
                                        </div>
                                    ))
                                ) : (
                                    <p>No coins available</p>
                                )}
                            </div>

                        </div>

                        {/* Fields */}
                        <div style={styles.profileRight}>
                            {['firstName', 'lastName', 'email', 'password', 'TIN', 'PassportNumber', 'IBAN' , 'paymentMethod'].map(
                                (field) => (
                                    <div key={field} style={styles.fieldRow}>
                                        <h4 style={styles.label}>
                                            {field.replace(/([A-Z])/, ' $1').trim().toLowerCase().replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())}
                                        </h4>
                                        <div style={styles.inputContainer}>
                                            {editingField === field ? (
                                                <input
                                                type="text"
                                                value={updatedData[field]}
                                                onChange={(e) => setUpdatedData({ ...updatedData, [field]: e.target.value })}
                                                onBlur={() => handleSave()} // Salva as alterações ao perder o foco
                                                onKeyDown={(e) => e.key === 'Enter' && handleSave()} // Salva ao pressionar "Enter"
                                                style={styles.input}
                                            />
                                            
                                            ) : (
                                                <span style={styles.fieldValue}>
                                                    {userData[field] !== undefined && userData[field] !== ''
                                                        ? userData[field]
                                                        : 'Not Provided'}
                                                </span>
                                            )}
                                            <button onClick={() => handleEdit(field)} style={styles.editButton}>
                                                <img
                                                    src={require('../assets/edit-icon.png')}
                                                    style={styles.editIcon}
                                                    alt="Edit"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <hr style={styles.separator} />

                    {/* Minhas campanhas */}
                    <div style={styles.campaignsSection}>
                        <h2 style={styles.sectionTitle}>My Campaigns</h2>
                        <div style={styles.campaignsContainer}>
                            {myCampaigns.length > 0 ? (
                                myCampaigns.map(campaign => (
                                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                                        <div style={styles.campaignShadow}>
                                            <CampaignBox
                                                key={campaign._id}
                                                id={campaign._id}
                                                title={campaign.title}
                                                description={campaign.description}
                                                goal={campaign.goal}
                                                currentAmount={campaign.currentAmount}
                                                timeToCompleteGoal={campaign.timeToCompleteGoal}
                                                nameBankAccount={campaign.creator ? `${campaign.creator.firstName} ${campaign.creator.lastName}` : campaign.nameBankAccount}
                                                image={campaign.image}
                                                creatorPicture={campaign.creator?.profilePicture}
                                                creatorFirstName={campaign.creator?.firstName}
                                                creatorLastName={campaign.creator?.lastName}
                                                onClick={() => window.location.href = `/campaign/${campaign._id}`}
                                            />
                                        </div>
                                        <button style={styles.button} onClick={handleEditCampaign(campaign._id)} >
                                            <span> Edit </span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={styles.noCampaignsMessage}>You haven't created any campaigns yet.</p>
                            )}
                        </div>
                    </div>

                    <hr style={styles.separator} />

                    {/* Campanhas doadas */}
                    <div style={styles.campaignsSection}>
                        <h2 style={styles.sectionTitle}>Campaigns that I Donated</h2>
                        <div style={styles.campaignsContainer}>
                            {donatedCampaigns.length > 0 ? (
                                donatedCampaigns.map(campaign => (
                                    <>
                                        <div style={styles.campaignShadow}>
                                            <CampaignBox
                                                key={campaign._id}
                                                id={campaign._id}
                                                title={campaign.title}
                                                description={campaign.description}
                                                goal={campaign.goal}
                                                currentAmount={campaign.currentAmount}
                                                timeToCompleteGoal={campaign.timeToCompleteGoal}
                                                nameBankAccount={campaign.creator ? `${campaign.creator.firstName} ${campaign.creator.lastName}` : campaign.nameBankAccount}
                                                image={campaign.image}
                                                creatorPicture={campaign.creator?.profilePicture}
                                                creatorFirstName={campaign.creator?.firstName}
                                                creatorLastName={campaign.creator?.lastName}
                                                onClick={() => window.location.href = `/campaign/${campaign._id}`}
                                            />
                                        </div>
                                    </>
                                ))
                            ) : (
                                <p style={styles.noCampaignsMessage}>You haven't donated to any campaigns yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '14%',
        height: '100vh',
        backgroundColor: '#f8f9fa',
    },
    contentContainer: {
        display: 'flex',
        marginTop: '12vh',
        marginRight: '1vw',
    },
    profileContainer: {
        marginLeft: '3vh', 
        padding: '2vh 4vw',
        flex: 1,
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ddd',
        overflowY: 'auto', 
        maxHeight: 'calc(100vh - 17vh)', 
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '1.8 vh',
        fontWeight: 'bold',
    },
    verificationStatus: {
        padding: '0.7vh 2.3vw',
        color: '#fff',
        borderRadius: '3vh',
        fontSize: "2vh",
        fontWeight: 'bold',
        textAlign: 'center',
    },
    separator: {
        border: '0',
        height: '1px',
        background: '#A8A8A8',
        margin: '1vh 0',
    },
    profileBody: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1%',
    },
    profileLeft: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', 
        gap: '1vh',
        margin: '3vh 0',
    },
    profilePictureContainer: {
        position: 'relative',
        width: '15vw',
        height: '15vw',
    },
    profilePicture: {
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '10%', 
        overflow: 'hidden',
        border: '2px solid #ddd',
    },
    picture: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    uploadButton: {
        position: 'absolute',
        top: '-8%', 
        right: '-8%', 
        backgroundColor: '#007bff',
        color: '#fff',
        borderRadius: '50%',
        border: 'none',
        width: '2vw', 
        height: '2vw', 
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    addIcon: {
        width: '1.5vw',
        height: '1.5vw',
    },
    coinsContainer: {
        backgroundColor: '#f9f9f9',
        padding: '0.5vw 1vw 0.5vw 1vw',
        borderRadius: '1vh',
        width: '13vw',
        height: '17vw',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto', 
        overflowX: 'hidden',
    },
    coinsTitle: {
        fontSize: '2.5vh',
        color: '#333',
        fontWeight: 'bold',
        marginTop: '2vh',
    },
    profileRight: {
        flex: 3,
        display: 'flex',
        flexDirection: 'column',
        marginBottom: "5vh",
    },
    fieldRow: {
        display: 'flex',
        flexDirection: 'column',

    },
    label: {
        fontSize: "1.6vh",
        font: 'Inter',
        width: '100%',
    },
    inputContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        padding: '0.7vh',
        borderRadius: '1vh',
        boxShadow: '0.5vh 0.5vh 1vh rgba(0, 0, 0, 0.2)',
        fontSize: '1.6vh',
        outline: 'none',
    },
    input: {
        border: 'none',
        background: '#fff',
        fontSize: '1.6vh',
        padding: '1vh',
        color: '#333',
        outline: 'none',
        width: '100%',
        borderRadius: '1vh',
    },
    fieldValue: {
        color: '#333',
    },
    editButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#007bff',
        fontSize: '0.5vh',
        marginLeft: '1vw',
    },

    campaignsSection: {
        marginTop: '7vh',
    },
    sectionTitle: {
        fontSize: '3.5vh',
        fontWeight: 'bold',
        marginBottom: '4vh',
        color: '#333',
    },
    campaignsContainer: {
        display: 'flex',
        overflowX: 'auto', 
        gap: '1vw', 
    },
    campaignShadow: {
        margin: '1vw',
        boxShadow: '0px 1px 8px 1px rgba(0, 0, 0, 0.25)',
        borderRadius: 10,
    },
    noCampaignsMessage: {
        fontSize: '1.7vh',
        color: '#666',
    },
    editIcon: {
        width: '1vw',
        height: '1vw',
    },
    coinRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', 
        padding: '1.2vh 0', 
        position: 'relative', 
    },
    addCoinsIcon: {
        width: '2.5vw',
        height: '2.5vw',
        cursor: 'pointer',
    },
    coinAmount: {
        fontSize: '3.5vh',
        color: '#333',
        fontWeight: 'bold',
        maxWidth: '5vw',
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    coinSeparator: {
        position: 'absolute',
        bottom: 0,
        left: '1%',
        right: '1%',
        height: '1px',
        backgroundColor: '#A8A8A8',
        opacity: 0.5,
    },
    coinCircle: {
        width: '2.5vw',
        height: '2.5vw',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#FFAD00',
    },
    coinImage: {
        width: '80%',
        height: '80%',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '5vh',
    },

    button: {
        backgroundColor: '#393939',
        marginLeft: '2vh',
        color: '#fff',
        padding: '1vh',
        width: '15vh',
        border: 'none',
        borderRadius: '1vh',
        cursor: 'pointer',
        fontSize: '2vh',
        marginBottom: '1vh',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
    },
};

export default ProfilePage;
