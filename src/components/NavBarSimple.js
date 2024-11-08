import React from 'react';

function NavBarSimple() {
    return (
        <>
            <nav style={style.container}>
                <img 
                    src={require('../assets/logo.png')} 
                    style={style.logo}
                />
                <div style={style.linksContainer}>
                    <span href="#" style={style.link}> Home </span>
                    <span href="#" style={style.link}> About </span>
                    <span href="#" style={style.link}> Contact </span>
                </div>
            </nav>
        </>
    );
}

const style = {
    container: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#183059',
        padding: '10px',
    },
    logo: {
        width: 275,
        height: 110,
        marginLeft: '150px',
    },
    linksContainer: {
        marginLeft: 'auto',
        marginRight: '150px',
        display: 'flex',
        gap: '100px',
    },
    link: {
        fontSize: 30,
        font: 'Inter',
        fontWeight: 'regular',
        color: '#fff',
        textDecoration: 'none',
    },
}

export default NavBarSimple;