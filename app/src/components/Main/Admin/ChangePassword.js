import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

class ChangePassword extends Component {
	constructor(props) {
		super(props)

		this.state = {
            newPassword: '',
		}
	}
	
	handleShow = () => this.setState({ show: true });


	handlePasswordChange = event => {
		this.setState({
			newPassword: event.target.value
		})
	}
	
	handleClose = () => {
		this.setState({ show: false });
	}
	

	render() {
		return (
			<>
			<button className="buttonAdmin" type="button" onClick={this.handleShow}>
				Reset Password
			</button>

			<Modal show={this.state.show} onHide={this.handleClose} centered>
				<Modal.Header>
					<Modal.Title>Reset Password</Modal.Title>
					<button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.handleClose}></button>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={this.props.changePassword.bind(this, { username: this.props.username, newPassword: this.state.newPassword}) }>
						<div>
							<label>New Password</label>
							<br></br>
							<input className="inputAdmin"
								type="text"
								value={this.state.newPassword}
								onChange={this.handlePasswordChange}
								placeholder="Add new password..."
							/>
						</div>
						<button className="buttonAdmin" id="submit" type="submit" onClick={this.handleClose}>Confirm</button>
					</form>
				</Modal.Body>
			</Modal>
			</>
		);
	}
}

export default ChangePassword;
