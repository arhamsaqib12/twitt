import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const token = localStorage.getItem('token');

      try {
        // Fetch user details
        const userResponse = await fetch(`http://localhost:5000/api/posts/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user details');
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch user's posts
        const postsResponse = await fetch(`http://localhost:5000/api/posts/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts');
        }

        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserAndPosts();
  }, [userId]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <Container className="mt-4">
      {user && (
        <Row>
          <Col md={12}>
            <Card className="border border-secondary bg-black text-white ">
              <Card.Img
                src={`http://localhost:5000/public/${user.headerPic}`}
                alt="Header"
                className="w-100"
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <Card.Body className="position-relative">
                <div
                  className="position-absolute"
                  style={{
                    top: '-50px',
                    left: '20px',
                    width: '100px',
                    height: '100px',
                    overflow: 'hidden',
                    borderRadius: '50%',
                    border: '2px solid white',
                  }}
                >
                  <img
                    src={`http://localhost:5000/public/${user.profilePic}`}
                    alt="Profile"
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <Card.Title className="mt-5">{user.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-secondary">
                  @{user.email}
                </Card.Subtitle>
                <Card.Subtitle className=" text-white fs-5 my-3">
                  {user.bio}
                </Card.Subtitle>
                <Button variant="primary " className="me-2">Follow</Button>
                <Link className="btn btn-secondary" to={`/edit/${userId}`}>
                  Edit Profile
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={12} className="mt-5"> 
            {posts.length > 0 ? (
              <ul className="p-0 w-100">
                {posts.map((post) => (
                  <li key={post.id} className="w-100 border border-secondary bg-black text-white list-unstyled ">
                    <Card className="bg-black text-white">
                      <Card.Body>
                        <h5 className="">
                          {user.name} <small className="text-secondary">@{user.email}</small>
                          <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                        </h5>
                        <p className="fw-light fs-5">{post.postText}</p>
                        {post.media && (
                          <img
                            src={`http://localhost:5000/public/${post.media}`}
                            className="ps-5 pe-5 rounded"
                            alt="Post Media"
                            style={{ width: '100%' }}
                          />
                        )}
                      </Card.Body>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No posts found.</p>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Profile;
