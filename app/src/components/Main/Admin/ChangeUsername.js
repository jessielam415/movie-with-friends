import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal';
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

class ChangeUsername extends Component {
	constructor(props) {
		super(props)

		this.state = {
            newUsername: '',
		}
	}
	
	handleShow = () => this.setState({ show: true });


	handleUsernameChange = event => {
		this.setState({
			newUsername: event.target.value
		})
	}
	
	handleClose = () => {
		this.setState({ show: false });
	}
	

	render() {
		return (
			<>
			<button type="button" className="buttonAdmin" onClick={this.handleShow}>
				Reset Username
			</button>

			<Modal show={this.state.show} onHide={this.handleClose} centered>
				<Modal.Header>
					<Modal.Title>Reset Username</Modal.Title>
					<button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.handleClose}></button>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={this.props.changeUsername.bind(this, { username: this.props.username, newUsername: this.state.newUsername}) }>
						<div>
							<label>New Username</label>
							<br></br>
							<input className="inputAdmin"
								type="text"
								value={this.state.newUsername}
								onChange={this.handleUsernameChange}
								placeholder="Add new username..."
							/>
						</div>
						<button id="submit" className="buttonAdmin" type="submit" onClick={this.handleClose}>Confirm</button>
					</form>
				</Modal.Body>
			</Modal>
			</>
		);
	}
}

export default ChangeUsername;
