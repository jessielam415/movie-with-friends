import React from 'react';
import ChangeUsername from './ChangeUsername';
import ChangePassword from './ChangePassword';
import { useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import './Styles/User.css';

function User(props) {
    const [deleteModalShow, setDeleteModalShow] = useState(false);

    const setDeleteModalShowToTrue =()=>{
        setDeleteModalShow(true)
    }

    const setDeleteModalShowToFalse =()=>{
        setDeleteModalShow(false)
    }

    const deleteUser = () => {
        setDeleteModalShowToFalse();
        props.deleteUser();
    }
    const [changeAdminModalShow, setChangeAdminModalShow] = useState(false);

    const setChangeAdminModalShowToTrue =()=>{
        setChangeAdminModalShow(true)
    }

    const setChangeAdminModalShowToFalse =()=>{
        setChangeAdminModalShow(false)
    }

    const confirmAddAsAdmin = () => {
        setChangeAdminModalShowToFalse();
        props.changeToAdmin();
    }

    const showAdminStatus = () => {
        if (props.user.is_admin) {
            return <span>Admin</span>
        } else {
            return <span>Regular</span>
        }
    }

    const showFollowing = () => {
        if (props.user.following.length > 0) {
            let followingString = "";
            props.user.following
            .map(following => {
                followingString = followingString.concat(following, ", ")
            })
            followingString = followingString.substring(0, followingString.length - 2)
            return followingString;
        } else {
            return "No followings";
        }
    }

    const showFollowers = () => {
        if (props.user.followers.length > 0) {
            let followerString = "";
            props.user.followers
            .map(follower => {
                followerString = followerString.concat(follower, ", ")
            })
            followerString = followerString.substring(0, followerString.length - 2)
            return followerString;
        } else {
            return "No followers";
        }

    }

    if (!props.user.is_admin) {
        return (
            <div className="userAdmin">
                <img class="userAvatarAdmin" src={ props.user.avatar }></img>
                <div className="userDetailsAdmin">
                    <h4> {props.user.username} </h4>
                    <span className="spanAttribute"><span className="spanAdmin"> First name: </span>{props.user.firstName}</span>
                    <span className="spanAttribute"><span className="spanAdmin"> Last name: </span>{props.user.lastName}</span>
                    <br></br>
                    <span className="spanAttribute"><span className="spanAdmin"> Gender: </span>{props.user.gender}</span>
                    <span className="spanAttribute"><span className="spanAdmin"> Age: </span>{props.user.age}</span>
                    <br></br>
                    <span className="spanAttribute"><span className="spanAdmin"> Password: </span>{props.user.password}</span>
                    <br></br>
                    <span className="spanAttribute"><span className="spanAdmin"> User Type: </span>{showAdminStatus()}</span>
                    <br></br>
                    <span className="spanAttribute"><span className="spanAdmin"> Followers: </span>{showFollowers()}</span>
                    <br></br>
                    <span className="spanAttribute"><span className="spanAdmin"> Following: </span>{showFollowing()}</span>
                    <br />
                    <ChangeUsername changeUsername={props.changeUsername} username={props.user.username} />
                    <ChangePassword changePassword={props.changePassword} username={props.user.username} />
                    <>
                        <button className="buttonAdmin" onClick={setChangeAdminModalShowToTrue}>Add as Admin</button>
                        <Modal show={changeAdminModalShow} onHide={setChangeAdminModalShowToFalse} centered>
                            <Modal.Header>
                                <Modal.Title>Add As Admin</Modal.Title>
                                <button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={setChangeAdminModalShowToFalse}></button>
                            </Modal.Header>
                            <Modal.Body>
                                Add this user as admin? This action cannot be easily undone.
                                <br></br>
                                <br></br>
                                <button className="buttonAdmin" onClick={confirmAddAsAdmin}>Confirm</button>
                            </Modal.Body>
                        </Modal>
                    </>
                    <>
                        <button className="buttonAdmin" onClick={setDeleteModalShowToTrue}>Delete</button>

                        <Modal show={deleteModalShow} onHide={setDeleteModalShowToFalse} centered>
                            <Modal.Header>
                                <Modal.Title>Delete User</Modal.Title>
                                <button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={setDeleteModalShowToFalse}></button>
                            </Modal.Header>
                            <Modal.Body>
                                Delete this user? This action cannot be undone.
                                <br></br>
                                <br></br>
                                <button className="buttonAdmin" onClick={deleteUser}>Confirm</button>
                            </Modal.Body>
                        </Modal>
                    </>
                </div>
            </div>
        );
    } else {
        return (
            <div className="userAdmin">
                <img class="userAvatarAdmin" src={ props.user.avatar }></img>
                <div className="userDetailsAdmin" >
                    <h4> {props.user.username} </h4>
                    <span className="spanAttribute"><span className="spanAdmin"> First name: </span>{props.user.firstName}</span>
                    <span className="spanAttribute"><span className="spanAdmin"> Last name: </span>{props.user.lastName}</span>
                    <br></br>
                    <span className="spanAttribute"><span className="spanAdmin"> Gender: </span>{props.user.gender}</span>
                    <span className="spanAttribute"><span className="spanAdmin"> Age: </span>{props.user.age}</span>
                    <br></br>
                    <span className="spanAttribute"><span className="spanAdmin"> Password: </span>{props.user.password}</span>
                    <br></br>
                    <span className="spanAttribute"><span className="spanAdmin"> User Type: </span>{showAdminStatus()}</span>
                    <br></br>
                    <span className="spanAttribute"><span className="spanAdmin"> Followers: </span>{showFollowers()}</span>
                    <br></br>
                    <span className="spanAttribute"><span className="spanAdmin"> Following: </span>{showFollowing()}</span>
                    <br />
                    <ChangeUsername changeUsername={props.changeUsername} username={props.user.username} />
                    <ChangePassword changePassword={props.changePassword} username={props.user.username} />
                </div>
            </div>
        );
    }

}

export default User;