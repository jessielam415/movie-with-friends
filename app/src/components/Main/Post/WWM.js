import React, { Component } from "react";
import SelectSearch from "react-select-search";
import './Styles/WWM.css';
import fuzzySearch from "../fuzzySearch.js"
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class WWM extends Component {

	constructor(props) {
	    // When the componenet is created
	    super(props);

	    this.state = {
	    	movies: props.movies,
	    	currentMovie: null,
	    	time: "",
			date: "",
			url: "",
			description: "",
			user: props.user
	    };
	}

	 selectMovie(e) {
        this.setState({
            currentMovie: e
        })
    }

    onInputchange = event => {
	    this.setState({
	    	[event.target.name]: event.target.value
	    });
	}

	submit_post = () => {	
		if ((this.state.currentMovie == null) || (this.state.time == "") || (this.state.date == "") || (this.state.description == "")) {
			var paragraph = document.getElementById("wwm-alert");
			paragraph.innerHTML = "<center>*Please fill in all input values.</center>"
		} else {
			var url_check = this.validate_url(this.state.url)
			if (url_check) {
				var d = new Date();

			    var our_date = new Date(this.state.date)
			    var our_year = our_date.getFullYear();
			    var our_month = our_date.getMonth();
			    var our_day = our_date.getDate();
			    var our_c = new Date(our_year, our_month, our_day + 1);

				if (our_c < d) {
					var paragraph = document.getElementById("wwm-alert");
					paragraph.innerHTML = "<center>*Invalid date. Must be from tomorrow to the future.</center>"
				} else {
					this.add_post().then(res => this.handle_request(res.status));
				}
			} else {
				if (this.state.time == null || this.state.date == null) {
					var paragraph = document.getElementById("wwm-alert");
					paragraph.innerHTML = "<center>*Date & Time fields required. Invalid Url.</center>"
				} else {
					var paragraph = document.getElementById("wwm-alert");
					paragraph.innerHTML = "<center>*Invalid Url. Make sure to include https/http in your url.</center>"
				}
			}
		}
	}

	handle_request = (status) => {
		if (status === 200) {
			this.setState({
				movie: null,
				time: "",
				date: "",
				url: "",
				description: "",
				currentMovie: null
			});

			// close modal
			document.getElementById("modal-close").click();
		} else {
			alert("Request to make post failed. Please try again.");
		}
	}

	add_post = () => {
		// the URL for the request
	    const url = '/post/wwm';

	    // The data we are going to send in our request
	    let data = {
	        movie: this.state.currentMovie,
			time: this.state.time,
			date: this.state.date,
			url: this.state.url,
			description: this.state.description,
		    author: this.state.user.username,
	    }

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

	validate_url(url) {
		if (url == null) {
			return false
		} else if (url.includes("https") || url.includes("http") || url.includes("www.")) {
			return true;
		} else if (url.includes(".") || url.includes("/")) {
			return true;
		} else {
			return false;
		}
	}
	
	render() {
		let options = this.state.movies.map(movie => {
            const item = {}
            item['name'] = movie.title;
            item['value'] = movie.title;
            return item;
        });
       
		return (
			<div>
				<div>
					<SelectSearch id="wwm-movie-search" onChange={e => this.selectMovie(e)} value={this.state.currentMovie} options={options} search filterOptions={fuzzySearch} placeholder="Choose a movie"/>
				</div>
				<div> 	
					<input 
						className="wwm-input" 
						type="time"
						name="time"
						placeholder="Enter Time"
						value={this.state.time}
						onChange={this.onInputchange}/>
					<input 
						className="wwm-input" 
						type="date" 
						name="date"
						placeholder="Enter Date"
						value={this.state.date}
						onChange={this.onInputchange}/>
					<input 
						className="wwm-input" 
						type="text"
						name="url"
						placeholder="Enter Url"
						value={this.state.url}
						onChange={this.onInputchange}/>
					<input 
						className="wwm-input" 
						type="text" 
						name="description"
						placeholder="Enter Description"
						value={this.state.description}
						onChange={this.onInputchange}/>
					<p id="wwm-alert"></p>
					<button 
						onClick={() => this.submit_post()}
						className="wwm-submit" 
						type="submit">
							Submit your post!
					</button>
				</div>
			</div>
		);
	}
}