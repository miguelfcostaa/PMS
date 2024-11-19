import React from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function Challenges() {
    const rectangles = [
        {
          id: 1,
          squares: [
            { id: 1, content: "Square 1 - Content 1" },
            { id: 2, content: "Square 1 - Content 2" },
            { id: 3, content: "Square 1 - Content 3" }
          ]
        },
        {
          id: 2,
          squares: [
            { id: 1, content: "Square 2 - Content 1" },
            { id: 2, content: "Square 2 - Content 2" },
            { id: 3, content: "Square 2 - Content 3" }
          ]
        },
        {
          id: 3,
          squares: [
            { id: 1, content: "Square 3 - Content 1" },
            { id: 2, content: "Square 3 - Content 2" },
            { id: 3, content: "Square 3 - Content 3" }
          ]
        }
      ];
      return (
        <>
          <NavBar />
          <SideBar />
          <div style={styles.mainContent}>
            <div style={styles.container}>
                {rectangles.map((rectangle) => (
                <div style={styles.rectangle} key={rectangle.id}>
                    {rectangle.squares.map((square) => (
                    <div style={styles.square} key={square.id}>
                        <p style={styles.squareContent}>{square.content}</p>
                    </div>
                    ))}
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
    container: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "column",
        padding: "20px",
        marginTop: "10px",
        gap: "20px"
      },
      rectangle: {
        display: "flex",
        flexDirection: "row", 
        justifyContent: "flex-start",
        alignItems: "center",
        width: "1400px", 
        height: "375px",
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
      },
      square: {
        marginLeft: "20px",
        height: "250px",
        width: "250px",
        textAlign: "center",
        backgroundColor: "#ddd",
        borderRadius: "5px",
        padding: "50px"
      },
      squareContent: {
        fontSize: "14px",
        color: "#333"
      }
};

export default Challenges;