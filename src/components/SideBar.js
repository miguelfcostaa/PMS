import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCategories } from '../contexts/CategoryContext';
import { Button } from '@mui/joy';


function SideBar() {
    const { selectedCategories, setSelectedCategories } = useCategories();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleCategory = (category) => {
        setSelectedCategories((prevSelected) => {
            const updatedCategories = prevSelected.includes(category)
                ? prevSelected.filter((cat) => cat !== category)
                : [...prevSelected, category];

            return updatedCategories;
        });
        navigate('/campaign');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleNavigation = (path) => () => {
        navigate(path);
        window.scrollTo(0, 0);
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
            <NavLink to="/challenges" style={location.pathname === '/challenges' ? {...styles.link, ...styles.activeLink} : styles.link}>Challenges</NavLink>
            <NavLink to="/contact" style={location.pathname === '/contact' ? {...styles.link, ...styles.activeLink} : styles.link}> Contact </NavLink>
            <NavLink to="/about" style={location.pathname === '/about' ? {...styles.link, ...styles.activeLink} : styles.link}> About </NavLink>
            <Button style={styles.logoutButton} onClick={handleLogout} > 
                Logout 
                <img 
                    src={require('../assets/logout-icon.png')} 
                    alt="Logout Icon" 
                    style={styles.logoutIcon} 
                />   
            </Button>
                
        </div>
    );
}

const styles = {
    sideBar: {
        position: 'fixed',
        top: '9.5vh',
        left: '0',
        width: '11%',
        height: '85vh',
        backgroundColor: '#425576',
        padding: '3vh', 
        paddingLeft: '4vh',
        paddingRight: '3vh', 
        color: 'white',
        font: 'Inter',
        fontSize: '2.6vh', 
        fontWeight: 'regular',
        overflowY: 'auto',
        display: 'flex', 
        flexDirection: 'column',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        display: 'block',
        padding: '1vh 0', 
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
        width: '4.5vh', 
        height: '2vh', 
        marginLeft: '10%', 
    },
    categories: {
        marginBottom: '0.5vh', 
        paddingLeft: '3%', 
    },
    categoryItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5vh 0', 
    },
    categoryLabel: {
        color: 'white',
        fontSize: '2.2vh', 
        marginLeft: '1%', 
        flex: 1,
    },
    checkBox: {
        transform: 'scale(1.6)', 
        cursor: 'pointer',
    },
    logoutButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        cursor: 'pointer',
        textDecoration: 'none',
        marginTop: 'auto',
        color: 'white',
        backgroundColor: 'transparent',
        padding: '1vh 0', 
        fontSize: '2.6vh', 
        font: 'Inter',
        fontWeight: '400',
    },
    logoutIcon: {
        width: '3.7vh', 
        height: '3.7vh', 
        alignSelf: 'center',
        marginLeft: '2vh',
    }
};

export default SideBar;
