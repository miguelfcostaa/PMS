import React, { createContext, useState, useContext } from 'react';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const toggleCategory = (category) => {
        setSelectedCategories((prevSelected) => {
            const updatedCategories = prevSelected.includes(category)
                ? prevSelected.filter((cat) => cat !== category)
                : [...prevSelected];
            return updatedCategories;
        });
    };

    return (
        <CategoryContext.Provider value={{ selectedCategories, setSelectedCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => useContext(CategoryContext);