import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    console.log("ChatContextProvider rendering");
    const [contextData, setContextData] = useState({
        pageName: 'Home',
        pageUrl: window.location.pathname, // Usando window.location
        actionInProgress: null,
        selectedItemId: null
    });

    // Se estiver usando react-router, podemos ouvir mudanças de rota
    // Como o projeto atual parece não ter react-router configurado explicitamente no App.jsx visto anteriormente (era SPA simples),
    // vamos manter um método manual para atualizar o contexto.

    const updateContext = (newContext) => {
        setContextData(prev => ({ ...prev, ...newContext }));
    };

    return (
        <ChatContext.Provider value={{ contextData, updateContext }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext deve ser usado dentro de um ChatContextProvider');
    }
    return context;
};
