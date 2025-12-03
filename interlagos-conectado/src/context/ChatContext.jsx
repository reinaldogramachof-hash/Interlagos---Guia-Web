import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Assuming react-router is used, or we'll use window.location

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const [contextData, setContextData] = useState({
        pageName: 'Home',
        pageUrl: '/',
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
