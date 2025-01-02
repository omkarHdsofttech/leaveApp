import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [pendingHighlight, setPendingHighlight] = useState(false);

    return (
        <AppContext.Provider value={{ pendingHighlight, setPendingHighlight }}>
            {children}
        </AppContext.Provider>
    );
};
