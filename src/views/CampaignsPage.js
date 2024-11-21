import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import CampaignBox from '../components/CampaignBox';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext';

function CampaignsPage() {
    const showSearchResults = true;
    const [selectedCategories, setSelectedCategories] = useState([]);
    const { searchTerm } = useSearch(); // Termo de pesquisa global
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

    return (
        <>
            <NavBar />
            <SideBar onCategorySelect={setSelectedCategories} />
            <div style={styles.mainContent}>
                {showSearchResults && (searchTerm || selectedCategories.length > 0) && (
                    <>
                        <h1 id="search-results-title">Resultados da Pesquisa</h1>

                        <div style={styles.selectedCategories}>
                            {searchTerm && (
                                <span style={styles.categorieSelected}>
                                    <img src={require('../assets/search-icon.png')}  alt="Search Icon" style={styles.searchIcon} />
                                    {searchTerm}
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
        marginTop: 102,
        marginLeft: '20%',
        paddingLeft: '20px',
        font: 'Inter',
    },
    line: {
        borderBottom: '2px solid #D0D0D0',
        marginBottom: '10px',
        marginTop: '20px',
    },
    selectedCategories: {
        marginTop: '20px',
        padding: '10px 0',
        flexDirection: 'row',
        display: 'flex',
    },
    categorieSelected: {
        width: 'fit-content',
        height: 43,
        backgroundColor: '#4A4A4A',
        color: 'white',
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 20,
        marginRight: 10,
        fontSize: 18,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    campaignDisplay: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginRight: 30,
        marginBottom: 30,
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
};

export default CampaignsPage;
