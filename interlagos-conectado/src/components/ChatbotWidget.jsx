import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, ChevronRight } from 'lucide-react';
import PlanCard from './PlanCard';
import { sendMessageToGenkit } from '../services/genkitService';
import { useChatContext } from '../context/ChatContext';
import { auth, db } from '../firebaseConfig';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { contextData } = useChatContext();
    const messagesEndRef = useRef(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    // Load History from Firestore
    useEffect(() => {
        if (!user || !isOpen) return;

        const q = query(
            collection(db, 'users', user.uid, 'chatHistory'),
            orderBy('timestamp', 'desc'),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const history = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).reverse();

            setMessages(history);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [user, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (text = message) => {
        if (!text.trim() || !user) return;

        setMessage('');
        setIsLoading(true);

        try {
            const response = await sendMessageToGenkit({
                message: text,
                context: contextData
            });

        } catch (error) {
            console.error("Erro ao enviar:", error);
            alert("Erro ao enviar mensagem. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white dark:bg-slate-800 w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <MessageCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Assistente Interlagos</h3>
                                <p className="text-xs text-white/80">Online agora</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                        {messages.length === 0 && (
                            <div className="text-center text-slate-400 text-sm mt-10">
                                <p>Olá! Sou seu assistente virtual.</p>
                                <p>Como posso ajudar você hoje?</p>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-600'
                                    }`}>
                                    {/* Persona Badge */}
                                    {msg.sender === 'chatbot' && msg.chatbotPersona && (
                                        <span className="text-[10px] uppercase font-bold text-blue-500 dark:text-blue-300 mb-1 block">
                                            {msg.chatbotPersona}
                                        </span>
                                    )}

                                    <p className="whitespace-pre-wrap">{msg.messageContent}</p>

                                    {/* Render Plan Card if data exists */}
                                    {msg.data && msg.data.planDetails && (
                                        <PlanCard plan={msg.data.planDetails} />
                                    )}

                                    {/* Suggested Actions */}
                                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {msg.suggestedActions.map((action, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSendMessage(action.label)}
                                                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs px-3 py-1.5 rounded-full border border-blue-200 transition-colors"
                                                >
                                                    {action.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-none p-3 shadow-sm border border-slate-100 dark:border-slate-600 flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-blue-500" />
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Digitando...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 bg-slate-100 dark:bg-slate-900 border-0 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!message.trim() || isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FAB (Floating Action Button) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-700'} text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
}
