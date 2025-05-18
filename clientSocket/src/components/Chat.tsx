import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

// Usar import.meta.env en lugar de process.env
const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

interface Message {
    autor: string;
    message: string;
    ip?: string;
}

interface HostInfo {
    ip: string;
    hostname: string;
}

export const Chat: React.FC = () => {
    const [nickName, setNickName] = useState<string>("");
    const [connected, setConnected] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [hostInfo, setHostInfo] = useState<HostInfo | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [tempNickName, setTempNickName] = useState<string>('');
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll al final de los mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!nickName) return;
        
        socketRef.current = io(SOCKET_SERVER_URL);
        
        socketRef.current.on('connect', () => {
            setConnected(true);
        });

        socketRef.current.on('host_info', (data: HostInfo) => {
            setHostInfo(data);
        });
        
        socketRef.current.on('receive_message', (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [nickName]);

    const handleNickName = () => {
        const nick = tempNickName.trim();
        if (!nick) return;
        setNickName(nick);
        setTempNickName('');
    };

    const sendMessage = () => {
    if (!message.trim() || !connected) return;
    
    const msg = {
        autor: nickName,
        message: message.trim(),
        ip: hostInfo?.ip || 'IP desconocida' 
    };
    
    socketRef.current?.emit('send_message', msg);
    setMessage(''); 
    };

    return (
        <div className="app p-d-flex p-jc-center p-ai-center p-min-vh-100 p-p-3">
            <div className="p-grid p-dir-col" style={{ width: '100%', maxWidth: '800px' }}>
                {!nickName ? (
                    <div className="p-col-12">
                        <Card title="Bienvenido al Chat" className="p-shadow-8">
                            <div className="p-fluid">
                                <div className="p-field p-mb-3">
                                    <label htmlFor="txtNickName" className="p-d-block p-mb-2">
                                        Ingrese su nickname
                                    </label>
                                    <InputText
                                        id="txtNickName"
                                        value={tempNickName}
                                        onChange={(e) => setTempNickName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleNickName()}
                                        className="p-mb-3"
                                        placeholder="Tu nickname"
                                        autoFocus
                                    />
                                </div>
                                <Button 
                                    label="Ingresar" 
                                    onClick={handleNickName}
                                    className="p-button-raised p-button-primary"
                                    disabled={!tempNickName.trim()}
                                />
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="p-col-12">
                        <Card title={`Chat - ${nickName}`} className="p-shadow-8">
                            <div className="chat-container p-d-flex p-flex-column" style={{ height: '500px' }}>
                               <div className="messages-container p-flex-grow-1 p-mb-3 p-overflow-auto">
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`p-mb-2 ${msg.autor === nickName ? 'p-text-right' : ''}`}>
                                            <div className={`p-p-2 p-border-round ${msg.autor === nickName ? 'p-bg-primary' : 'p-bg-secondary'}`}
                                                style={{ display: 'inline-block' }}>
                                                <div>
                                                    <strong>{msg.autor}</strong>
                                                    <small className="p-ml-2" style={{ opacity: 0.7 }}>({msg.ip || 'IP desconocida'})</small>
                                                </div>
                                                <div>{msg.message}</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="message-input p-d-flex p-ai-center">
                                    <InputText
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        placeholder="Escribe tu mensaje..."
                                        className="p-mr-2 p-flex-grow-1"
                                        autoFocus
                                    />
                                    <Button 
                                        label="Enviar" 
                                        onClick={sendMessage}
                                        className="p-button-raised p-button-success"
                                        disabled={!message.trim()}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};