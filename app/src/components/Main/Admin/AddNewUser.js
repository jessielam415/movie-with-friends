import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Styles/AddNewUser.css';
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

class AddNewUser extends Component {
	constructor(props) {
		super(props)

		this.state = {
			username: '',
			password: '',
			first_name: '',
			last_name: '',
			is_admin: false,
			gender: 'Male',
			age: '',
			show: false,
		}
	}
	
	handleShow = () => this.setState({ show: true });

	handleUsernameChange = event => {
		this.setState({
			username: event.target.value
		})
	}

	handlePasswordChange = event => {
		this.setState({
			password: event.target.value
		})
	}
	handleFirstNameChange = event => {
		this.setState({
			first_name: event.target.value
		})
	}

	handleLastNameChange = event => {
		this.setState({
			last_name: event.target.value
		})
	}

	handleIsAdminChange = event => {
		this.setState({
			is_admin: event.target.value
		})
	}
	handleAgeChange = event => {
		if (event.target.value < 0 ) {
			this.setState({
				age: 0
			})
		} else if (event.target.value > 100) {
			this.setState({
				age: 100
			})
		} else {
			this.setState({
				age: event.target.value
			})
		}
	}
	
	handleGenderChange = event => {
		this.setState({
			gender: event.target.value
		})
	}

	handleClose = () => {
		this.setState({ show: false });
	}

	render() {
		return (
			<>
			<Button variant="warning" onClick={this.handleShow}>
				+ Add new user
			</Button>

			<Modal show={this.state.show} onHide={this.handleClose}>
				<Modal.Header>
					<Modal.Title>Add New User</Modal.Title>
					<button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.handleClose}></button>		
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={this.props.addUser.bind(this, { username: this.state.username, password: this.state.password, first_name: this.state.first_name, last_name: this.state.last_name, is_admin: this.state.is_admin, gender: this.state.gender, age: this.state.age}) }>
						<div>
							<label>Username </label>
							<br></br>
							<input className="inputAdmin"
								type="text"
								value={this.state.username}
								onChange={this.handleUsernameChange}
								placeholder="Add new username..."
							/>
						</div>
						<div>
							<label>Password</label>
							<br></br>
							<input className="inputAdmin"
								value={this.state.password}
								onChange={this.handlePasswordChange}
								placeholder="Add new password..."
							/>
						</div>
						<div>
							<label>First Name</label>
							<br></br>
							<input className="inputAdmin"
								value={this.state.first_name}
								onChange={this.handleFirstNameChange}
								placeholder="Add new first name..."
							/>
						</div>
						<div>
							<label>Last Name</label>
							<br></br>

							<input className="inputAdmin"
								value={this.state.last_name}
								onChange={this.handleLastNameChange}
								placeholder="Add new last name..."
							/>
						</div>
						<div>
							<label>Age</label>
							<br></br>

							<input className="inputAdmin"
								value={this.state.age}
								onChange={this.handleAgeChange}
								placeholder="Age"
							/>
						</div>
						<div>
							<label>Gender</label>
							<br></br>


							<select className="selectAdmin" value={this.state.gender} onChange={this.handleGenderChange}>
								<option value={"Male"}>Male</option>
								<option value={"Female"}>Female</option>
								<option value={"Other"}>Other</option>
							</select>
						</div>
						<div id ="isAdmin">
							<label> Is Admin</label>
							<br></br>

							<select className="selectAdmin" value={this.state.is_admin} onChange={this.handleIsAdminChange}>
								<option value={false}>No</option>
								<option value={true }>Yes</option>
							</select>
						</div>
						<button className="buttonAdmin" id="submit" type="submit" onClick={this.handleClose}>Add to Database</button>
					</form>
				</Modal.Body>
			</Modal>
			</>
		);
	}
}

export default AddNewUser;
