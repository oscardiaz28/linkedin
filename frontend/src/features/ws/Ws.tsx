import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import './init'
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface StompContextProps {
    client: Client | null;
    connected: boolean;
}

const defaultContextValue: StompContextProps = {
    client: null,
    connected: false
}

const WsContext = createContext<StompContextProps>(defaultContextValue)

export const useWebSocket = () => useContext(WsContext)

export const WebSocketContextProvider = ( {children } : {children : ReactNode} ) => {
    
    const clientRef = useRef<Client | null>(null)
    const [connected, setConnected] = useState(false)

    useEffect( () => {
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            onConnect: () => {
                console.log("Conectado al servidor STOMP")
                setConnected(true)
            },
            onDisconnect: () => {
                console.log('Desconectado del servidor STOMP');
                setConnected(false);
            }
        })
        client.activate()
        clientRef.current = client;

        return () => {
            client.deactivate()
        }
       
    }, [])

    return (
        <WsContext.Provider value={ {client: clientRef.current, connected } }>
            {children}
        </WsContext.Provider>
    )

}