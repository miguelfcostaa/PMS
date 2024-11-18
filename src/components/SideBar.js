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
            <NavLink to="/#" style={location.pathname === '/challenges' ? {...styles.link, ...styles.activeLink} : styles.link}>Challenges</NavLink>
            <NavLink to="/#" style={location.pathname === '/contact' ? {...styles.link, ...styles.activeLink} : styles.link}>Contact</NavLink>
            <NavLink to="/#" style={location.pathname === '/about' ? {...styles.link, ...styles.activeLink} : styles.link}>About</NavLink>
        </div>
    );
}

const styles = {
    sideBar: {
        position: 'fixed',
        top: 95,
        left: 0,
        width: '15%',
        height: '100%',
        backgroundColor: '#425576',
        padding: '20px',
        paddingLeft: '60px',
        paddingRight: 30,
        color: 'white',
        font: 'Inter',
        fontSize: 26,
        fontWeight: 'regular',
        overflowY: 'auto',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        display: 'block',
        padding: '10px 0',
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
        padding: '10px 0',
        textDecoration: 'none',
        color: 'white',
        flex: 1,
    },
    dropdownIcon: {
        width: 45,
        height: 20,
        marginLeft: 20,
    },
    categories: {
        marginTop: 10,
        paddingLeft: 20,
    },
    categoryItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '5px 0',
    },
    categoryLabel: {
        color: 'white',
        fontSize: 20,
        marginLeft: '10px',
        flex: 1,
    },
    checkBox: {
        transform: 'scale(1.6)', 
    },
};

export default SideBar;
