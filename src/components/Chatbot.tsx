"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Minimize, Maximize } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    from: 'user' | 'bot';
    text: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { from: 'bot', text: 'Hello! How can I assist you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowIcon(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);
    const toggleZoom = () => setIsZoomed(!isZoomed);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '' || isLoading) return;

        // --- THIS IS THE FIX ---
        // 1. Prepare the history from the CURRENT `messages` state, which does not include the new message yet.
        const historyForApi = messages
            .slice(1) // Remove the initial bot greeting
            .map(msg => ({
                role: msg.from === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }));

        // 2. Capture the user's input before clearing the input field.
        const currentUserMessage = inputValue;
        const userMessage: Message = { from: 'user', text: currentUserMessage };

        // 3. Update the UI all at once: add the user's message and an empty bot message for the stream.
        setMessages(prev => [...prev, userMessage, { from: 'bot', text: '' }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: historyForApi, // Send the history from before the new message
                    message: currentUserMessage, // Send the new message separately
                }),
            });

            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const json = line.replace('data: ', '');
                        try {
                            const data = JSON.parse(json);
                            setMessages(prev => {
                                // Create a shallow copy of the messages array
                                const newMessages = [...prev];
                                const lastMessageIndex = newMessages.length - 1;
                                const lastMessage = newMessages[lastMessageIndex];

                                if (lastMessage && lastMessage.from === 'bot') {
                                    // Create a *new* message object with the updated text
                                    const updatedLastMessage = {
                                        ...lastMessage,
                                        text: lastMessage.text + data.text
                                    };
                                    // Replace the old message with the new, updated one in the copied array
                                    newMessages[lastMessageIndex] = updatedLastMessage;
                                    // Return the new array to trigger a proper re-render
                                    return newMessages;
                                }

                                // If no update is needed, return the original state
                                return prev;
                            });
                        } catch (error) {
                            console.error('Failed to parse stream chunk:', error);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prev => {
                const updatedMessages = [...prev];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                if (lastMessage && lastMessage.from === 'bot') {
                    lastMessage.text = 'Sorry, I am having trouble connecting. Please try again.';
                }
                return updatedMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Bubble Icon */}
            <AnimatePresence>
                {showIcon && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed bottom-5 right-5 z-40"
                    >
                        <motion.button
                            onClick={toggleChat}
                            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white p-4 rounded-full shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <MessageSquare size={24} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.5 }}
                        className={`fixed ${isZoomed ? 'inset-5' : 'bottom-20 right-5 w-80 h-[28rem]'} bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl flex flex-col z-50 border border-gray-700/50 transition-all duration-300`}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-t-lg">
                            <h3 className="font-bold text-white">AlgoForge Assistant</h3>
                            <div className="flex items-center space-x-2">
                                <button onClick={toggleZoom} className="text-gray-400 hover:text-white">
                                    {isZoomed ? <Minimize size={16} /> : <Maximize size={16} />}
                                </button>
                                <button onClick={toggleChat} className="text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col space-y-3">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`prose prose-sm prose-invert max-w-[80%] p-2 rounded-lg text-sm ${msg.from === 'bot' ? 'bg-gray-700' : 'bg-cyan-600'}`}>
                                            <ReactMarkdown>
                                                {msg.text}
                                            </ReactMarkdown>
                                            {isLoading && msg.from === 'bot' && index === messages.length - 1 && !msg.text && <span className="inline-block w-2 h-4 bg-white animate-pulse ml-1" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Input Form */}
                        <div className="p-4 border-t border-gray-700/50">
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    disabled={isLoading}
                                />
                                <button type="submit" className="bg-cyan-600 p-2 rounded-md text-white hover:bg-cyan-700 disabled:bg-gray-500" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}