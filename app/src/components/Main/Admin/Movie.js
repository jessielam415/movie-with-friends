import React from 'react';
import { useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import './Styles/Movie.css';

function Movie(props) {
    const [deleteModalShow, setDeleteModalShow] = useState(false);

    const setDeleteModalShowToTrue =()=>{
        setDeleteModalShow(true)
    }

    const setDeleteModalShowToFalse =()=>{
        setDeleteModalShow(false)
    }

    const deleteMovie = () => {
        setDeleteModalShowToFalse();
        props.deleteMovie();
    }

    return (
        <div className="movieAdmin">
            <div className="imageAdmin"><img class="movieAvatarAdmin" src={ props.movie.image}></img></div>
            <div className="movieItem">
                <h4>{props.movie.title}    <span className="movieRatingAdmin">({props.movie.ageRating})</span></h4>
                <span className="spanAttribute"><span className="spanAdmin"> Genre</span>: <span className="capitalizeAdmin">{props.movie.genre}</span></span>
                <br></br>
                <span className="spanAttribute"><span className="spanAdmin"> Release Date</span>: {props.movie.date}</span>
                <span className="spanAttribute"><span className="spanAdmin"> Runtime</span>: {props.movie.runtime} minutes</span>
                <br></br>
                <span className="spanAttribute"><span className="spanAdmin"> Synopsis</span>: {props.movie.synopsis}</span>
                <br></br>
                <>
                    <button className="buttonAdmin" onClick={setDeleteModalShowToTrue}>Delete</button>

                    <Modal show={deleteModalShow} onHide={setDeleteModalShowToFalse} centered>
                        <Modal.Header>
                            <Modal.Title>Delete Movie</Modal.Title>
                            <button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={setDeleteModalShowToFalse}></button>
                        </Modal.Header>
                        <Modal.Body>
                            Delete this movie? This action cannot be undone.
                            <br></br>
                            <br></br>
                            <button className="buttonAdmin" onClick={deleteMovie}>Confirm</button>
                        </Modal.Body>
                    </Modal>
                </>
            </div>

        </div>
    );
}

export default Movie;