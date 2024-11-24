import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function SideBar({ onCategorySelect }) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleCategory = (category) => {
        setSelectedCategories((prevSelected) => {
            const updatedCategories = prevSelected.includes(category)
                ? prevSelected.filter((cat) => cat !== category)
                : [...prevSelected, category];

            onCategorySelect(updatedCategories); 
            return updatedCategories;
        });
    };

    const location = useLocation();

    return (
        <div style={styles.sideBar}>
            <NavLink to="/home" style={location.pathname === '/home' ? {...styles.link, ...styles.activeLink} : styles.link}>Home</NavLink>
            
            <div style={styles.categoriesFlex} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <NavLink to="/campaign" style={location.pathname === '/campaign' ? {...styles.link, ...styles.activeLink} : styles.link}>Campaigns</NavLink>
                <img 
                    src={require('../assets/dropdown-icon-white.png')} 
                    alt="Dropdown Icon" 
                    style={styles.dropdownIcon} 
                />
            </div>

            {isDropdownOpen && (
                <div style={styles.categories}>
                    {['Health', 'Animals', 'Environment', 'Education', 'Children', 'Elderly', 'Human Rights', 'Food Security', 'Social Justice', 'Natural Disasters'].map((category) => (
                        <div key={category} style={styles.categoryItem}>
                            <label
                                htmlFor={category}
                                style={{
                                    ...styles.categoryLabel,
                                    fontWeight: selectedCategories.includes(category) ? 'bold' : 'normal',
                                }}
                            >
                                {category}
                            </label>
                            <input
                                type="checkbox"
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => toggleCategory(category)}
                                style={styles.checkBox}
                            />
                        </div>
                    ))}
                </div>
            )}

            <NavLink to="/games" style={location.pathname === '/games' ? {...styles.link, ...styles.activeLink} : styles.link}>Games</NavLink>
            <NavLink to="/#" style={location.pathname === '/promotions' ? {...styles.link, ...styles.activeLink} : styles.link}>Promotions</NavLink>
            <NavLink to="/challenges" style={location.pathname === '/challenges' ? {...styles.link, ...styles.activeLink} : styles.link}>Challenges</NavLink>
            <NavLink to="/#" style={location.pathname === '/contact' ? {...styles.link, ...styles.activeLink} : styles.link}>Contact</NavLink>
            <NavLink to="/#" style={location.pathname === '/about' ? {...styles.link, ...styles.activeLink} : styles.link}>About</NavLink>
        </div>
    );
}

const styles = {
    sideBar: {
        position: 'fixed',
        top: '9.5vh',
        left: '0',
        width: '10%',
        height: '100vh',
        backgroundColor: '#425576',
        padding: '3vh', 
        paddingLeft: '2%',
        paddingRight: '2%', 
        color: 'white',
        font: 'Inter',
        fontSize: '2.6vh', 
        fontWeight: 'regular',
        overflowY: 'auto',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        display: 'block',
        padding: '1vh 0', 
        fontWeight: 'normal',
    },
    activeLink: {
        fontWeight: 'bold', 
    },
    categoriesFlex: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    categoryTitle: {
        padding: '1vh 0', 
        textDecoration: 'none',
        color: 'white',
        flex: 1,
    },
    dropdownIcon: {
        width: '18%', 
        height: '2vh', 
        marginLeft: '10%', 
    },
    categories: {
        marginTop: '1vh', 
        paddingLeft: '5%', 
    },
    categoryItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5vh 0', 
    },
    categoryLabel: {
        color: 'white',
        fontSize: '2vh', 
        marginLeft: '1%', 
        flex: 1,
    },
    checkBox: {
        transform: 'scale(1.6)', 
    },
};

export default SideBar;
