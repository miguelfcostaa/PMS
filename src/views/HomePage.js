import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function HomePage() {
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchResults, setSearchResults] = useState([]); // Estado para armazenar os resultados da pesquisa
    const [searchTerm, setSearchTerm] = useState(''); // Estado para armazenar o termo da pesquisa

    const handleCategorySelect = (categories) => {
        setSelectedCategories(categories);
        setShowSearchResults(categories.length > 0);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setShowSearchResults(true);
        // Aqui você pode fazer a lógica para buscar os resultados (exemplo: filtrar por categoria ou termo de pesquisa)
        const filteredResults = selectedCategories.filter((category) =>
            category.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    return (
        <>
            <NavBar onSearch={handleSearch} />
            <SideBar onCategorySelect={handleCategorySelect} />
            <div style={styles.mainContent}>

                {showSearchResults && selectedCategories.length > 0 && (
                    <>
                        <h1 id="search-results-title">Search Results</h1>

                        <div style={styles.selectedCategories}>
                            {selectedCategories.map((category, index) => (
                                <span key={index} style={styles.categorieSelected}>{category}</span>
                            ))}
                        </div>

                        <div style={styles.line}></div>
                    </>
                )}
                <p>Conteúdo principal da página...</p>
            </div>
        </>
    );
}

const styles = {
    mainContent: {
        marginLeft: '20%', 
        paddingLeft: '20px',
        font: 'Inter',
    },
    line: {
        borderBottom: '2px solid #D0D0D0',
        marginBottom: '20px',
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
       color:'white',
       paddingLeft: 30,
       paddingRight: 30,
       paddingTop: 10,
       paddingBottom: 10,
       borderRadius: 20,
       margin: 10,
    },
};

export default HomePage;