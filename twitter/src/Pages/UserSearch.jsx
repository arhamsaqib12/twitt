import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const UserSearch = ({ show, onHide, onUserSelect, otherUserId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const userToken = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async (query = '') => {
            try {
                const response = await fetch(`http://localhost:5000/api/posts/searchuser?q=${query}`, {
                    headers: { 'Authorization': ` ${localStorage.getItem("token")}` }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error('Unexpected data format:', data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers(searchQuery);
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleBack = () => {
        onHide(); // Close the modal when back button is clicked
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Search Users</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search users"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <ul className="list-group">
                    {Array.isArray(users) && users.map((user) => (
                        <li
                            key={user.id}
                            className="list-group-item d-flex justify-content-between align-items-center cursor-pointer"
                            onClick={() => onUserSelect(user.id)}
                        >
                            <img
                                src={`http://localhost:5000/public/${user.profilePic}`}
                                alt={`${user.name}'s profile`}
                                className="rounded-circle me-2"
                                style={{ width: '40px', height: '40px' }}
                            />
                            {user.name}
                        </li>
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                {otherUserId && (
                    <Button variant="secondary" onClick={handleBack}>
                        Back to Search
                    </Button>
                )}
                <Button variant="primary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserSearch;
