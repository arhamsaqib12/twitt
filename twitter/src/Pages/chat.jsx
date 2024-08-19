import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserSearch from './UserSearch'; // Adjust the import path as necessary

const socket = io('http://localhost:5000');

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [otherUserId, setOtherUserId] = useState(null);
    const [showUserSearch, setShowUserSearch] = useState(false); // Start with the modal hidden
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    const userToken = localStorage.getItem('token');
    const userId = userToken ? parseJwt(userToken).id : null;
    const roomId = otherUserId ? generateRoomId(userId, otherUserId) : null;

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!userId) return;

        if (roomId) {
            socket.emit('joinRoom', { roomId, userId });
            socket.on('message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socket.off('message');
            };
        }
    }, [roomId, userId, otherUserId]);

    const sendMessage = () => {
        if (message.trim() === '' || !roomId) return;

        socket.emit('chatMessage', { roomId, message });
        setMessage('');
    };

    const handleUserSelect = (id) => {
        setOtherUserId(id);
        setShowUserSearch(false); // Close the modal after selecting a user
    };

    const handleShowUserSearch = () => setShowUserSearch(true);
    const handleCloseUserSearch = () => setShowUserSearch(false);

    return (
        <div className="container-fluid g-0 bg-black">
            <div className="row" >
                {/* Show User Search Modal Button */}
                <div className={`col-md-4 ${isSmallScreen && otherUserId ? 'd-none' : ''}`} style={{ height: '100vh', borderRight: '2px solid grey' }}>
                    <button className="btn btn-primary mt-3" onClick={handleShowUserSearch}>
                        Search Users
                    </button>
                    {/* UserSearch Modal */}
                    <UserSearch
                        show={showUserSearch}
                        onHide={handleCloseUserSearch}
                        onUserSelect={handleUserSelect}
                        otherUserId={otherUserId}
                    />
                </div>

                {/* Chat Section */}
                <div className={`col-md-8 ${otherUserId ? 'd-block' : 'd-none d-md-block'}`} style={{ height: '100%', borderLeft: '1px solid lightgrey' }}>
                    {otherUserId && (
                        <>
                            <h3>Chat with User</h3>
                            <div className="border rounded p-3 mb-3" style={{ height: '400px', overflowY: 'scroll' }}>
                                {messages.map((msg, index) => (
                                    <div key={index} className="mb-2">
                                        <div className="bg-light p-2 rounded">{msg}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={sendMessage}>
                                    Send
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper function to decode JWT token
function parseJwt(token) {
    if (!token) return {};
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function generateRoomId(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
}

export default Chat;
