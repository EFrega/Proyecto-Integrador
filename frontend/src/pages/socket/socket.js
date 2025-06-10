import { io } from 'socket.io-client';

const API = process.env.REACT_APP_API_URL;

const socket = io(`${API}`, {
    autoConnect: true
});

export default socket;