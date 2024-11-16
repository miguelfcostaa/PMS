import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import CampaignBox from '../components/CampaignBox';

function CampaignsPage() {
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);  // Controle de carregamento
    const [error, setError] = useState(null); // Controle de erro

    useEffect(() => {
        // Buscar as campanhas da API
        const fetchCampaigns = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/campaign/all-campaigns');
                if (response.ok) {
                    const data = await response.json();
                    setCampaigns(data);  // Supondo que a resposta da API seja uma lista de campanhas
                    setLoading(false);
                } else {
                    throw new Error('Erro ao buscar campanhas');
                }
            } catch (err) {
                console.error('Erro na conexão', err);
                setLoading(false);
                setError('Erro ao carregar campanhas');
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
            (campaign.name.toLowerCase().includes(term.toLowerCase()) ||
                campaign.description.toLowerCase().includes(term.toLowerCase())) &&
            (selectedCategories.length === 0 || selectedCategories.includes(campaign.category))
        );

        setSearchResults(filteredResults);
    };

    if (loading) {
        return <div>Carregando campanhas...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
                <div style={styles.campaignDisplay}>
                    {(searchResults.length > 0 ? searchResults : campaigns).map((campaign) => (
                        <CampaignBox
                            key={campaign.id}
                            id={campaign.id}
                            name={campaign.name}
                            description={campaign.description}
                            goal={campaign.goal}
                            timeToCompleteGoal={campaign.timeToCompleteGoal}
                            currentAmount={campaign.currentAmount}
                        />
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
