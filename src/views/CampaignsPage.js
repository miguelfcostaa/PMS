import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import CampaignBox from '../components/CampaignBox';
import { useNavigate } from 'react-router-dom';

function CampaignsPage() {
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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

    const handleCategorySelect = (categories) => {
        setSelectedCategories(categories);
        setShowSearchResults(categories.length > 0);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setShowSearchResults(true);

        // Filtra as campanhas com base no termo de pesquisa
        const filteredResults = campaigns.filter((campaign) =>
            (campaign.title.toLowerCase().includes(term.toLowerCase()) ||
                campaign.description.toLowerCase().includes(term.toLowerCase())) &&
            (selectedCategories.length === 0 || selectedCategories.includes(campaign.category))
        );

        setSearchResults(filteredResults);
    };

    const navigate = useNavigate();
    const handleCampaignClick = (id) => {
        navigate(`/campaign/${id}`); // Redireciona para a página da campanha com o ID
    };

    return (
        <>
            <NavBar onSearch={handleSearch} />
            <SideBar onCategorySelect={handleCategorySelect} />
            <div style={styles.mainContent}>

                {showSearchResults && (searchTerm || selectedCategories.length > 0) && (
                    <>
                        <h1 id="search-results-title">Resultados da Pesquisa</h1>

                        <div style={styles.selectedCategories}>
                            {selectedCategories.map((category, index) => (
                                <span key={index} style={styles.categorieSelected}>{category}</span>
                            ))}
                        </div>

                        <div style={styles.line}></div>
                    </>
                )}
                <div style={styles.campaignDisplay} >
                    {(searchResults.length > 0 ? searchResults : campaigns).map((campaign) => (
                        <div onClick={() => handleCampaignClick(campaign._id)}>
                            <CampaignBox
                                key={campaign._id}
                                title={campaign.title}
                                description={campaign.description}
                                goal={campaign.goal}
                                timeToCompleteGoal={campaign.timeToCompleteGoal}
                                currentAmount={campaign.currentAmount}
                                nameBankAccount={campaign.nameBankAccount}
                                
                            />
                        </div>
                    ))}
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
    },
    categorieSelected: {
        width: 'fit-content',
        height: 43,
        backgroundColor: '#4A4A4A',
        color: 'white',
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        margin: 10,
    },
    campaignDisplay: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginRight: 30,
        marginBottom: 30,
    },
};

export default CampaignsPage;
