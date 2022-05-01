import React, { Component } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

class AddNewMovie extends Component {
	constructor(props) {
		super(props)

		this.state = {
			title: '', date: '',
			genre: '', runtime: '',
			ageRating: 'G', image: '',
			synopsis: '',
			show: false,

		}
	}
	handleShow = () => this.setState({ show: true });

	handleClose = () => {
		this.setState({ show: false });
	}
	
	handleTitleChange = event => {
		this.setState({
			title: event.target.value
		})
	}

	handleDateChange = event => {
		this.setState({
			date: event.target.value
		})
	}

    handleGenreChange = event => {
		this.setState({
			genre: event.target.value
		})
	}

    handleRuntimeChange = event => {
		this.setState({
			runtime: event.target.value
		})
    }

    handleAgeRatingChange = event => {
		this.setState({
			ageRating: event.target.value
		})
    }
    
    handleImageChange = event => {
		this.setState({
			image: event.target.value
		})
    }

    handleSynopsisChange = event => {
		this.setState({
			synopsis: event.target.value
		})
    }

	render() {
		return (
			<>
			<Button variant="warning" onClick={this.handleShow}>
				+ Add new movie
			</Button>

			<Modal show={this.state.show} onHide={this.handleClose}>
				<Modal.Header>
					<Modal.Title>Add New Movie</Modal.Title>
					<button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.handleClose}></button>		
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={this.props.addMovie.bind(this,
						{title: this.state.title, date: this.state.date, genre: this.state.genre, runtime: this.state.runtime,
						ageRating: this.state.ageRating, image: this.state.image, synopsis: this.state.synopsis})}>
						<div>
							<label>Title </label>
							<br></br>
							<input className="inputAdmin"
								type="text"
								value={this.state.title}
								onChange={this.handleTitleChange}
								placeholder="Enter Title..."
							/>
						</div>
						<div>
							<label>Date Released </label>
							<br></br>

							<input className="inputAdmin"
								type="date"
								value={this.state.date}
								onChange={this.handleDateChange}
								placeholder="MM/DD/YYYY"/>
						</div>
						<div>
							<label>Genre </label>
							<br></br>
							<input className="inputAdmin"
								value={this.state.genre}
								onChange={this.handleGenreChange}
								placeholder="Enter Genre..."
							/>
						</div>
						<div>
							<label>Runtime </label>
							<br></br>
							<input className="inputAdmin"
								value={this.state.runtime}
								onChange={this.handleRuntimeChange}
								placeholder="Runtime in minutes"
							/>
						</div>
						<div>
							<label>Age Rating</label>
							<br></br>

							<select className="selectAdmin" value={this.state.ageRating} onChange={this.handleAgeRatingChange}>
								<option value={'G'}>G</option>
								<option value={'PG'}>PG</option>
								<option value={'PG-13'}>PG-13</option>
								<option value={'14A'}>14A</option>
								<option value={'NC-17'}>NC-17</option>
								<option value={'R'}>R</option>
							</select>
						</div>
						<div>
							<label>Image </label>
							<br></br>
							<input className="inputAdmin"
								value={this.state.image}
								onChange={this.handleImageChange}
								placeholder="Enter Image Url..."
							/>
						</div>
						<div>
							<label>Synopsis </label>
							<br></br>
							<textarea className="textareaAdmin"
								value={this.state.synopsis}
								onChange={this.handleSynopsisChange}
								placeholder="Enter movie synopsis..."
							/>
						</div>

						<button className="buttonAdmin" type="submit">Add to Database</button>
					</form>
				</Modal.Body>
			</Modal>
			</>
		);
	}
}

export default AddNewMovie;
