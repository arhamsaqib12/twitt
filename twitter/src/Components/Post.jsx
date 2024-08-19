import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreatePostModal = ({ show, handleClose }) => {
  const [data, setData] = useState({ postText: '', media: null });
  const [error, setError] = useState('');

  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = [];
    let match;
    while ((match = hashtagRegex.exec(text)) !== null) {
      hashtags.push(match[1]);
    }
    return hashtags;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No token found");
      return;
    }

    const formData = new FormData();
    formData.append('postText', data.postText);
    if (data.media) {
      formData.append('media', data.media);
    }

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: "POST",
        headers: {
          "Authorization": `${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error while creating post: ${response.status}`);
      }

      const text = extractHashtags(data.postText);
      if (text.length > 0) {
        const hashtagResponse = await fetch('http://localhost:5000/api/hashtag/', {
          method: "POST",
          headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (!hashtagResponse.ok) {
          throw new Error(`Error while posting hashtags: ${hashtagResponse.status}`);
        }
      }

      setData({ postText: '', media: null });
      setError('');
      handleClose();
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error.message || "An error occurred");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="bg-black text-white"
      dialogClassName="modal-top"
    >
      <Modal.Header closeButton className="border-bottom border-secondary">
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="d-flex">
            <img
              src="https://github.com/mdo.png"
              alt="User"
              className="rounded-circle me-3"
              width={50}
              height={50}
            />
            <textarea
              className="form-control border-0 bg-secondary text-white"
              rows="4"
              placeholder="What's happening?"
              style={{ resize: 'none' }}
              value={data.postText}
              onChange={(e) =>
                setData({ ...data, postText: e.target.value })
              }
              required
            ></textarea>
          </div>

          {error && <p style={{ color: "white" }}>{error}</p>}
          <Modal.Footer className="d-flex justify-content-between border-top border-secondary">
            <div>
              <label htmlFor="media-upload" style={{ cursor: 'pointer', position: 'relative' }}>
                <i className="bi bi-image mx-2"></i>
                <input
                  id="media-upload"
                  type="file"
                  style={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                  onChange={(e) =>
                    setData({ ...data, media: e.target.files[0] })
                  }
                />
              </label>
              <i className="bi bi-camera mx-2" style={{ cursor: 'pointer' }}></i>
              <i className="bi bi-bar-chart mx-2" style={{ cursor: 'pointer' }}></i>
              <i className="bi bi-emoji-smile mx-2" style={{ cursor: 'pointer' }}></i>
              <i className="bi bi-calendar mx-2" style={{ cursor: 'pointer' }}></i>
            </div>
            <Button type="submit" variant="primary">
              Tweet
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default CreatePostModal;
