import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useState} from 'react';
import ENV from './../../../config.js';
import './Styles/Post.css';
const API_HOST = ENV.api_host

function Post(props) {
    const [deleteModalShow, setDeleteModalShow] = useState(false);

    const setDeleteModalShowToTrue =()=>{
        setDeleteModalShow(true)
    }

    const setDeleteModalShowToFalse =()=>{
        setDeleteModalShow(false)
    }

    const deletePost = () => {
        setDeleteModalShowToFalse();
        props.deletePost();
    }

    const displayVoters = (postOption) => {
        if (postOption.voters.length > 0) {
            let voterString = "";
            postOption.voters
            .map(voter => {
                voterString = voterString.concat(voter, ", ")
            })
            voterString = voterString.substring(0, voterString.length - 2)
            return <span> { voterString} </span>;
        } else {
            return <span> No one has voted for this option yet </span>
        }
    }

    var username_to_img = {}

    for (var i = 0; i < props.users.length; i++) {
        username_to_img[props.users[i].username] = props.users[i].avatar
    }
   
    if (props.post.__type == "List") {
        return (
            <div className>
					<div className="inner-post">
						<div id="post-title">
							<span>
								<img className="timeline-icon" src={username_to_img[props.post.author]} />
							</span>
							<span>{props.post.author}: List Post</span>
						</div>
                    <div><b>Title:</b> {props.post.title}</div>
                    <div><b>List Items:</b></div>
                        {props.post.options.map((postOption) =>
								<div className = "listItemAdmin">
									{postOption.id}. {postOption.option}
								</div>
							)
                        }
		
                    <div><b>Time Posted:</b> {props.post.timestamp} </div>

                        <>
                        <button className="buttonAdmin" onClick={setDeleteModalShowToTrue}>Delete</button>

                        <Modal show={deleteModalShow} onHide={setDeleteModalShowToFalse} centered>
                            <Modal.Header>
                                <Modal.Title>Delete Post</Modal.Title>
                                <button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={setDeleteModalShowToFalse}></button>
                            </Modal.Header>
                            <Modal.Body>
                                Delete this post? This action cannot be undone.
                                <br></br>
                                <br></br>
                                <button className="buttonAdmin" onClick={deletePost}>Confirm</button>
                            </Modal.Body>
                        </Modal>
                    </>
					</div>
                </div>
        );
    } else if (props.post.__type == "Poll") {
        return (
            <div className>

					<div className="inner-post">
						<div id="post-title">
							<span>
								<img className="timeline-icon" src={username_to_img[props.post.author]} />
							</span>
							<span>{props.post.author}: Poll Post</span>
						</div>
                    <div><b>Title:</b> {props.post.title}</div>
                    <div><b>Options:</b></div>
                    <ol>
                        {props.post.options.map((postOption, index) =>
								<li className="listItemAdmin">
                                <div><b>{postOption.option}</b></div>
                                <div className="listItemVoters">
                                    <div className="underlineAdmin">Users who voted</div>
                                    {displayVoters(postOption)}
                                </div>
								</li>
							)
                        }
                    </ol>
                    <div><b>Time Posted:</b> {props.post.timestamp} </div>

                        <>
                            <button className="buttonAdmin" onClick={setDeleteModalShowToTrue}>Delete</button>

                            <Modal show={deleteModalShow} onHide={setDeleteModalShowToFalse} centered>
                                <Modal.Header>
                                    <Modal.Title>Delete Post</Modal.Title>
                                    <button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={setDeleteModalShowToFalse}></button>
                                </Modal.Header>
                                <Modal.Body>
                                    Delete this post? This action cannot be undone.
                                    <br></br>
                                    <br></br>
                                    <button className="buttonAdmin" onClick={deletePost}>Confirm</button>
                                </Modal.Body>
                            </Modal>
                        </>
					</div>
                </div>
        );
    } else if (props.post.__type == "Rating") {
        return (
            <div >
					<div className="inner-post">
						<div id="post-title">
							<span>
								<img className="timeline-icon" src={username_to_img[props.post.author]} />
							</span>
							<span>{props.post.author}: Rating Post</span>
						</div>
						<div><b>Movie:</b> {props.post.movie}</div>
                        <div><b>Description:</b> {props.post.description}</div>
                        <div><b>Rating:</b> {props.post.rating} star</div>
                        <div><b>Time Posted:</b> {props.post.timestamp} </div>

                        <>
                            <button className="buttonAdmin" onClick={setDeleteModalShowToTrue}>Delete</button>

                            <Modal show={deleteModalShow} onHide={setDeleteModalShowToFalse} centered>
                                <Modal.Header>
                                    <Modal.Title>Delete Post</Modal.Title>
                                    <button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={setDeleteModalShowToFalse}></button>
                                </Modal.Header>
                                <Modal.Body>
                                    Delete this post? This action cannot be undone.
                                    <br></br>
                                    <br></br>
                                    <button className="buttonAdmin" onClick={deletePost}>Confirm</button>
                                </Modal.Body>
                            </Modal>
                        </>
					</div>
            </div>
        );
    } else if (props.post.__type == "WWM") {
        return (
            <div>
                <div className="postDetailsAdmin">
					<div className="inner-post">
						<div id="post-title">
							<span>
								<img className="timeline-icon" src={username_to_img[props.post.author]} />
							</span>
							<span>{props.post.author}: WWM Post</span>
						</div>
						<div><b>What: </b>{props.post.description}</div>
						<div><b>When: </b>{props.post.time} {props.post.date}</div>
                        <div><b>Where: </b><a href={props.post.url} target="_blank">{props.post.movie}</a></div>
                        <div><b>Time Posted: </b> {props.post.timestamp} </div>

                        <>
                        <button className="buttonAdmin" onClick={setDeleteModalShowToTrue}>Delete</button>

                        <Modal show={deleteModalShow} onHide={setDeleteModalShowToFalse} centered>
                            <Modal.Header>
                                <Modal.Title>Delete Post</Modal.Title>
                                <button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={setDeleteModalShowToFalse}></button>
                            </Modal.Header>
                            <Modal.Body>
                                Delete this post? This action cannot be undone.
                                <br></br>
                                <br></br>
                                <button className="buttonAdmin" onClick={deletePost}>Confirm</button>
                            </Modal.Body>
                        </Modal>
                    </>
					</div>
                </div>
            </div>
        );
    } 
}
export default Post;