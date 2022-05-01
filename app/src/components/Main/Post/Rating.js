import React, { Component } from "react";
import SelectSearch from "react-select-search";
import './Styles/Rating.css';
import fuzzySearch from "../fuzzySearch.js"
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class Rating extends Component {

	constructor(props) {
	    // When the componenet is created
	    super(props);

	    this.state = {
	    	movies: props.movies,
	    	currentMovie: null,
	    	rating: "",
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

		// would push post content to database
		console.log(this.state.rating, this.state.description, this.state.currentMovie)

		if ((this.state.currentMovie == null) || (this.state.rating == "") || (this.state.description == "")) {
			var paragraph = document.getElementById("rating-alert");
			paragraph.innerHTML = "<center>*Please fill in all input values and make sure the rating is an integer.</center>"
		} else if (!((parseInt(this.state.rating) >= 1) && (parseInt(this.state.rating) <= 5))) {
			var paragraph = document.getElementById("rating-alert");
			paragraph.innerHTML = "<center>*Please input an integer rating between 1 and 5 only.</center>"
			alert("Please input an integer rating between 1 and 5 only");
		} else {
			this.add_post().then(res => this.handle_request(res.status));
		}
	}

	handle_request = (status) => {
		if (status === 200) {
			this.setState({
				description: "",
				currentMovie: null,
				rating: ""
			});
	
			// close modal
			document.getElementById("modal-close").click();
		} else {
			alert("Request to make post failed. Please try again.");
		}
	}

	add_post = () => {
		// the URL for the request
	    const url = '/post/rating';

	    // The data we are going to send in our request
	    let data = {
	        movie: this.state.currentMovie,
			rating: this.state.rating,
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

	handle_star_one = () => {
		this.setState({
			rating: "1"
		});
	}

	handle_star_two = () => {
		this.setState({
			rating: "2"
		});
	}

	handle_star_three = () => {
		this.setState({
			rating: "3"
		});
	}

	handle_star_four = () => {
		this.setState({
			rating: "4"
		});
	}

	handle_star_five = () => {
		this.setState({
			rating: "5"
		});
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
				<div id="rating-movie-sel-cont">
					<SelectSearch id="rating-movie-search" onChange={e => this.selectMovie(e)} value={this.state.currentMovie} options={options} search filterOptions={fuzzySearch} placeholder="Choose a movie"/>
					<div id="movie"></div>
				</div>
				<div id="rating-star-cont">
					<span><b>Press on a star to select a rating: </b></span>
					<span className={ parseInt(this.state.rating) >= 1 ? 'fa fa-star checked':'fa fa-star'} 
						onClick={() => this.handle_star_one()}></span>
					<span className={ parseInt(this.state.rating) >= 2 ? 'fa fa-star checked':'fa fa-star'}
						onClick={() => this.handle_star_two()}></span>
					<span className={ parseInt(this.state.rating) >= 3 ? 'fa fa-star checked':'fa fa-star'}
						onClick={() => this.handle_star_three()}></span>
					<span className={ parseInt(this.state.rating) >= 4 ? 'fa fa-star checked':'fa fa-star'}
						onClick={() => this.handle_star_four()}></span>
					<span className={ parseInt(this.state.rating) >= 5 ? 'fa fa-star checked':'fa fa-star'}
						onClick={() => this.handle_star_five()}></span>
				</div>
				<div> 
					<input 
						className="rating-input" 
						type="text" 
						name="description"
						placeholder="Leave a description for this post (E.g. this movie wasn't my favourite!)"
						value={this.state.description}
						onChange={this.onInputchange}/>
					<p id="rating-alert"></p>
					<button 
						onClick={() => this.submit_post()}
						className="rating-submit" 
						type="submit">
							Submit your post!
					</button>
				</div>
			</div>
		);
	}
}