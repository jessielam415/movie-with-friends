import React, { Component } from "react";
import WWM from './Post/WWM.js';
import Poll from './Post/Poll.js';
import List from './Post/List.js';
import Rating from './Post/Rating.js';
import ENV from './../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class Createpost extends Component {

	
	constructor(props) {
	    // When the componenet is created
	    super(props);

	    // would pull user data from database and set in state
	    this.state = {
	    	activate_post: 1,
	    	movies: props.movies,
	    	user: props.user
	    };
	}

	switch_wwm = () => {
		this.setState({
	      	activate_post: 1
	    });
	}

	switch_poll = () => {
		this.setState({
	      	activate_post: 2
	    });
	}
	
	switch_list = () => {
		this.setState({
	      	activate_post: 3
	    });
	}

	switch_rating = () => {
		this.setState({
	      	activate_post: 4
	    });
	}

	// reset static alerts
	reset_vals = () => {
		// reset rating alerts
		var paragraph = document.getElementById("rating-alert");
		paragraph.innerHTML = ""

		// reset poll alerts
		var paragraph = document.getElementById("poll-alert");
		paragraph.innerHTML = ""

		// reset wwm alerts
		var paragraph = document.getElementById("wwm-alert");
		paragraph.innerHTML = ""

		// reset list alerts
		var paragraph = document.getElementById("list-alert");
		paragraph.innerHTML = ""
	}
	
	render() {

		return (
			<div>
				<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
				  <div className="modal-dialog">
				    <div className="modal-content">
				      <div className="modal-header">
				        <h5 className="modal-title" id="exampleModalLabel">Create A Post</h5>
				        <button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => this.reset_vals()}></button>
				      </div>
				      <div className="modal-body">
				      	<div id="create-post">
							<ul id="timeline-post-tabs" className="nav nav-tabs">
							  <li className="nav-item">
							    <button 
							    	onClick={() => this.switch_wwm()} 
							    	className={ this.state.activate_post === 1 ? 'nav-link active':'nav-link'}
							    	data-toggle="tab" 
							    	role="tab" 
							    	aria-controls="home" 
							    	>Watch With Me</button>
							  </li>
							  <li className="nav-item">
							    <button 
							    	onClick={() => this.switch_poll()}
							    	className={ this.state.activate_post === 2 ? 'nav-link active':'nav-link'} 
							    	data-toggle="tab" 
							    	role="tab" 
							    	aria-controls="profile" 
							    	>Poll</button>
							  </li>
							  <li className="nav-item">
							    <button 
							    	onClick={() => this.switch_list()}
							    	className={ this.state.activate_post === 3 ? 'nav-link active':'nav-link'} 
							    	data-toggle="tab" 
							    	role="tab" 
							    	aria-controls="contact" 
							    	>List</button>
							  </li>
							  <li className="nav-item">
							    <button 
							    	onClick={() => this.switch_rating()}
							    	className={ this.state.activate_post === 4 ? 'nav-link active':'nav-link'} 
							    	data-toggle="tab" 
							    	role="tab" 
							    	aria-controls="contact" 
							    	>Rating</button>
							  </li>
							</ul>
							<div className="tab-content" id='create-post-content'>
							  <div className={ this.state.activate_post === 1 ? 'tab-pane fade show active':'tab-pane fade'} role="tabpanel"><WWM user={this.state.user} movies={this.state.movies}/></div>
							  <div className={ this.state.activate_post === 2 ? 'tab-pane fade show active':'tab-pane fade'} role="tabpanel" ><Poll user={this.state.user} /></div>
							  <div className={ this.state.activate_post === 3 ? 'tab-pane fade show active':'tab-pane fade'} role="tabpanel" ><List user={this.state.user} /></div>
							  <div className={ this.state.activate_post === 4 ? 'tab-pane fade show active':'tab-pane fade'} role="tabpanel" ><Rating user={this.state.user} movies={this.state.movies}/></div>
							</div>
						</div>
				      </div>
				    </div>
				  </div>
				</div>
			</div>
		);
	}
}