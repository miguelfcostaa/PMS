import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import CampaignBox from '../components/CampaignBox';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext';
import { useCategories } from '../contexts/CategoryContext';

function CampaignsPage() {
    
    const showSearchResults = true;
    const { selectedCategories } = useCategories(); 
    const { searchTerm, setSearchTerm } = useSearch(); // Termo de pesquisa global
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/campaign/all-campaigns');
                if (response.ok) {
                    const data = await response.json();
                    setCampaigns(data);
                } else {
                    console.error('Erro ao buscar campanhas.');
                }
            } catch (err) {
                console.error('Erro de conexão:', err);
            }
        };
        fetchCampaigns();
    }, []);

    useEffect(() => {
        const results = campaigns.filter((campaign) => {
            const matchesSearchTerm = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(campaign.category);
            return matchesSearchTerm && matchesCategory;
        });
        setFilteredCampaigns(results);
    }, [selectedCategories, searchTerm, campaigns]);

    const navigate = useNavigate();

    const handleCampaignClick = (id) => {
        navigate(`/campaign/${id}`);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };


    return (
        <>
            <NavBar />
            <SideBar />
            <div style={styles.mainContent}>
                {showSearchResults && (searchTerm || selectedCategories.length > 0) && (
                    <>
                        <h1 id="search-results-title" style={{ paddingTop: '1vh'}}>Search Results</h1>

                        <div style={styles.selectedCategories}>
                            {searchTerm && (
                                <span style={styles.categorieSelected}>
                                    {searchTerm}
                                    <img src={require('../assets/close-icon.png')}  alt="Close Icon" style={styles.searchIcon} onClick={() => handleClearSearch()}/>
                                </span>
                            )}
                            {selectedCategories.map((category, index) => (
                                <span key={index} style={styles.categorieSelected}> 
                                    {category} 
                                </span>
                            ))}
                        </div>

                        <div style={styles.line}></div>
                    </>
                )}
                <div style={styles.campaignDisplay}>
                    {filteredCampaigns.length > 0 ? (
                        filteredCampaigns.map((campaign) => (
                            <div onClick={() => handleCampaignClick(campaign._id)} key={campaign._id} >
                                <CampaignBox
                                    title={campaign.title}
                                    description={campaign.description}
                                    goal={campaign.goal}
                                    timeToCompleteGoal={campaign.timeToCompleteGoal}
                                    currentAmount={campaign.currentAmount}
                                    nameBankAccount={campaign.nameBankAccount}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No campaigns available for the selected category(ies).</p>
                    )}
                </div>
            </div>
        </>
    );
}

const styles = {
    mainContent: {
        marginTop: 105,
        marginLeft: '15%',
        paddingLeft: '2vh',
        font: 'Inter',
    },
    line: {
        borderBottom: '0.2vh solid #D0D0D0',
        marginBottom: '1vh',
        marginTop: '2vh',
    },
    selectedCategories: {
        marginTop: '2vh',
        padding: '1vh 0',
        flexDirection: 'row',
        display: 'flex',
    },
    categorieSelected: {
        width: 'fit-content',
        height: '4.3vh',
        backgroundColor: '#4A4A4A',
        color: 'white',
        paddingLeft: '3vh',
        paddingRight: '3vh',
        borderRadius: '2vh',
        marginRight: '1vh',
        fontSize: '1.8vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    campaignDisplay: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: '8vh',
    },
    searchIcon: {
        width: '2.2vh',
        height: '2.2vh',
        marginLeft: '1vh',
        cursor: 'pointer',
    },
};

export default CampaignsPage;
