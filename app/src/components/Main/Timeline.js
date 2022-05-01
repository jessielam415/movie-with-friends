import React, { Component } from "react";
import './Styles/Timeline.css';
import Createpost from './Createpost.js';
import Content from './Timeline/Content.js';

import Popup from "reactjs-popup";

import ENV from './../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class Timeline extends Component {

	constructor(props) {
	    // When the componenet is created
	    super(props);

	    // would pull user data from database and set in state
	    this.state = {
	    	movies: props.movies,
	    	user: props.user
	    };
	}

	componentDidMount() {
		// get all posts
	}

	get_curr_date = () => {
	    var today = new Date();
	    var hour = today.getHours();
	    if (hour >= 0 && hour < 12) {
	    	return "Morning";
	    } else if (hour >= 12 && hour < 18) {
	    	return "Afternoon";
	    } else {
	    	return "Evening";
	    }
	}

	render() {

		this.phrase = this.get_curr_date();

		return (
			<div>
				<div>
					<span id="timeline-intro">Good {this.phrase} {this.state.user.first_name}</span>
					<span id="timeline-modal-button">
						<button type="button" id="timeline-modal-trigger" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
						  + Create A Post
						</button>
						<Createpost movies={this.state.movies} user={this.state.user} />
					</span>
				</div>
				<hr></hr>
				<Content user={this.state.user} />
			</div>
		);
	}
}