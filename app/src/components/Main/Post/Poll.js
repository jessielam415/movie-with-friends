import React, { Component } from "react";
import './Styles/Poll.css';
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class Poll extends Component {

	constructor(props) {
	    // When the componenet is created
	    super(props);

	    this.state = {
			title: "",
			options: [],
			option: "",
			num_ops: 0,
			id: 0,
			user: props.user
		}
	}

    onInputchange = event => {
	    this.setState({
	    	[event.target.name]: event.target.value
	    });
	}

	add_cat = () => {

		if (this.state.option === "") {
			var paragraph = document.getElementById("poll-alert");
			paragraph.innerHTML = "<center>*Poll option cannot be empty.</center>"
		} else {
			var already_option = false
			for (var i = 0; i < this.state.options.length; i++) {
				if (this.state.option === this.state.options[i].option) {
					already_option = true
					break
				}
			}

			if (already_option) {
				var paragraph = document.getElementById("poll-alert");
				paragraph.innerHTML = "<center>*Poll option has already been added.</center>"
			} else {
				this.setState({
					options: this.state.options.concat({id: this.state.num_ops, option: this.state.option, voters: []})
				});
				this.setState({
					num_ops: this.state.num_ops + 1
				});
			}
		}
	}

	remove_cat = id => {
		const new_cats = this.state.options.filter((item) => item.id !== id);
		this.setState({
			options: new_cats
		});
	}

	submit_post = () => {
		// would push post content to database
		console.log(this.state.options, this.state.title);

		var result = [];
		for (var i = 0; i < this.state.options.length; i++) {
			var item = {
				name: this.state.options[i].option,
				value: 0
			}
			result = result.concat(item);
		}

		// check if user entered prompt
		if (this.state.title == "") {
			var paragraph = document.getElementById("poll-alert");
			paragraph.innerHTML = "<center>*Please fill in all input values.</center>"
		} else if (result.length < 2) { // check to see if user submitted options (if there are none, send alert)
			var paragraph = document.getElementById("poll-alert");
			paragraph.innerHTML = "<center>*Must input at least two poll options.</center>"
		} else { // at least one option submitted
			this.setState({
				id: this.state.id + 1
			});
			
			this.add_post().then(res => this.handle_request(res.status));
		}	
	}

	handle_request = (status) => {
		if (status === 200) {
			this.setState({
				options: [],
				title: "",
				option: ""
			});
	
			// close modal
			document.getElementById("modal-close").click();
		} else {
			alert("Request to make post failed. Please try again.");
		}
	}

	add_post = () => {
		// the URL for the request
	    const url = '/post/poll';

	    // The data we are going to send in our request
	    let data = {
	        title: this.state.title,
    		options: this.state.options,
		    author: this.state.user.username
	    }

	    console.log(data)

	    // Create our request constructor with all the parameters we need
	    const request = new Request(url, {
	        method: 'post', 
	        body: JSON.stringify(data),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
	    });

	    return fetch(request)
	    .then(function(res) {
	    	console.log(res)
	    	return res
	    }).catch((error) => {
	        console.log(error)
	    })
	}

	render() {

		let cats = this.state.options.map((c) => 
			<li key={c.id} id="cat-item">
				<div>
					<span id="cat-name">{c.option}</span>
					<span>
						<button id="cat-button"
						onClick={()=>this.remove_cat(c.id)}>X</button>
					</span>
				</div>
			</li>);

		return (
			<div>
				<div> 	
					<input 
						className="poll-input" 
						type="text"
						name="title"
						placeholder="Enter Poll Title (E.g. Whats your favourite dog movie?)"
						value={this.state.title}
						onChange={this.onInputchange}/>
					<div>
						<input 
							className="poll-input-cat" 
							type="text"
							name="option"
							placeholder="Enter a poll option (E.g. Cat)"
							value={this.state.option}
							onChange={this.onInputchange}/>
						<button 
							onClick={() => this.add_cat()}
							className="poll-submit-cat" 
							type="submit">
								Add Poll Option!
						</button>
					</div>
					<div>
						<ul>
							{cats}
						</ul>
					</div>
					<p id="poll-alert"></p>
					<button 
						onClick={() => this.submit_post()}
						className="poll-submit" 
						type="submit">
							Submit your post!
					</button>
				</div>
			</div>
		);
	}
}