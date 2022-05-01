import React, { Component } from "react";
import './Styles/List.css';
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class List extends Component {

	constructor(props) {
	    // When the componenet is created
	    super(props);

	    this.state = {
			title: "",
			options: [],
			option: "",
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
			var paragraph = document.getElementById("list-alert");
			paragraph.innerHTML = "<center>*Option cannot be empty.</center>"
		} else {
			this.setState({
				options: this.state.options.concat({id: this.state.options.length + 1, option: this.state.option})
			});
		}
	}

	remove_cat = id => {
		const new_cats = this.state.options.filter((item) => item.id !== id);
		for (var i = 0; i < new_cats.length; i++) {
			new_cats[i].id = i + 1;
		}
		
		this.setState({
			options: new_cats
		});
	}

	submit_post = () => {
		// would push post content to database
		var result = [];
		for (var i = 0; i < this.state.options.length; i++) {
			result = result.concat(this.state.options[i].option);
		}

		// check if user entered prompt
		if (this.state.title == "") {
			var paragraph = document.getElementById("list-alert");
			paragraph.innerHTML = "<center>*Please fill in all input values.</center>"
		}

		// check to see if user submitted options (if there are none, send alert)
		else if (result.length == 0) {
			var paragraph = document.getElementById("list-alert");
			paragraph.innerHTML = "<center>*Must input at least one list value.</center>"
		}
		
		// options were given
		else {
			this.add_post().then(res => this.handle_request(res.status));
		}
	}

	handle_request = (status) => {
		if (status === 200) {
			this.setState({
				title: "",
				options: [],
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
	    const url = '/post/list';

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
			<div key={c.id} id="cat-item-list">
				<span>{c.id}. </span>
				<span id="cat-name">{c.option}</span>
				<span>
					<button id="cat-button"
					onClick={()=>this.remove_cat(c.id)}>X</button>
				</span>
			</div>);

		return (
			<div>
				<div> 	
					<input 
						className="list-input" 
						type="text"
						name="title"
						placeholder="Enter list title / prompt (E.g. My Top 3 Movies)"
						value={this.state.title}
						onChange={this.onInputchange}/>
					<div>
						<input 
							className="list-input-cat" 
							type="text"
							name="option"
							placeholder="Enter a list value option (E.g. Spider Man)"
							value={this.state.option}
							onChange={this.onInputchange}/>
						<button 
							onClick={() => this.add_cat()}
							className="list-submit-cat" 
							type="submit">
								Add List Value!
						</button>
					</div>
					<div>
						{cats}
					</div>
					<p id="list-alert"></p>
					<button 
						onClick={() => this.submit_post()}
						className="list-submit" 
						type="submit">
							Submit your post!
					</button>
				</div>
			</div>
		);
	}
}