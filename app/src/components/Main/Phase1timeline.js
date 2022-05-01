import React, { Component } from "react";
import './Styles/Phase1timeline.css';

import {Bar} from 'react-chartjs-2';
import Popup from "reactjs-popup";

import SelectSearch from "react-select-search";
import fuzzySearch from "./fuzzySearch.js"

import ENV from './../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class Phase1timeline extends Component {

	constructor(props) {
	    // When the componenet is created
	    super(props);

	    // would pull user data from database and set in state
	    this.state = {
	    	movies: props.movies,
	    	user: props.user,
	    	posts: [],
	    	options: [],
	    	poll_options: [],
	    	activate_post: 1,
	    	poll_id: 1,
	    	num_ops: 0,
	    	voted: {1: false},
	    	title: "",
			option: "",
			poll_title: "",
			poll_option: "",
			wwm_time: "",
			wwm_date: "",
			wwm_url: "",
			wwm_description: "",
			currentMovie: null,
			rating: "",
			rating_description: "",
			rating_currentMovie: null,
	    };

	    this.setState({
	   		user: props.user
	   });
	}

	componentDidMount() {
		this.get_posts();
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

	get_posts = () => {
		//pull all of a users friends posts and order by timestamp
		// render them in the UI based on timestamp
		var var_post_li = {
			type: "list",
			user: "Billy",
			description: "My top 3 disney movies have got to be:",
			list: ["Mulan", "Up", "The Lion King"]
		}

		var var_post_wwm = {
			type: "wwm",
			user: "Bobby",
			movie: "The Avengers",
			time: "08:00 PM",
			date: "2021/03/05",
			url: "https://www.netflix.com/ca/title/70217913?tctx=0%2C1%2C89b93d7b7e50fd008010b63d9e1b77ce955b56f6%3Afef1ec167f96a91422f66be1b0fcc428d96b5442%2C89b93d7b7e50fd008010b63d9e1b77ce955b56f6%3Afef1ec167f96a91422f66be1b0fcc428d96b5442%2Cunknown%2C&trackId=13752289",
			description: "Join me to celebrate my quarentine birthday and have a movie night!"
		}

		var var_post_rating = {
			type: "rating",
			user: "Joey",
			movie: "The Shining",
			rating: 4,
			description: "The Shining was a great Movie!"
		}

		var var_post_poll = {
			type: "poll",
			id: this.state.poll_id,
			user: "Ryan",
			title: "Whats your favourite Christopher Nolan Movie?",
			res: [{name: 'Interstellar', value: 22}, {name: 'Tenet', value: 14}, {name: 'Inception', value: 29}]
		}

		this.setState({
			posts: [...this.state.posts, var_post_li, var_post_wwm, var_post_rating, var_post_poll],
			poll_id: this.state.poll_id + 1
		});
	}

	update_poll = (name, id) => {

		// would update poll count in database
		for (var i = 0; i < this.state.posts.length; i++) {
			if (this.state.posts[i].type === "poll") {
				if (this.state.posts[i].id === id) {
					let res_old = this.state.posts[i].res;

					// update new one
					for (var j = 0; j < res_old.length; j++) {
						if (res_old[j].name === name) {
							var res_new = res_old
							res_new[j].value = res_new[j].value + 1;
							res_old = res_new;
						}
					}

					var voted = this.state.voted;
					voted[id] = true;

					this.state.posts[i].res = res_old;
					this.setState({
						posts: this.state.posts,
						voted: voted
					});

				}
			}
		}
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

	onInputchange = event => {
	    this.setState({
	    	[event.target.name]: event.target.value
	    });
	}

	add_cat = () => {
		this.setState({
			options: this.state.options.concat({id: this.state.options.length + 1, option: this.state.option})
		});
		
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

	// for lists only
	submit_post = () => {
		// would push post content to database
		var result = [];
		for (var i = 0; i < this.state.options.length; i++) {
			result = result.concat(this.state.options[i].option);
		}

		// check if user entered prompt
		if (this.state.title == "") {
			alert("Please fill in all input values");
		}

		// check to see if user submitted options (if there are none, send alert)
		else if (result.length == 0) {
			alert("Must input at least one list value");
		}
		
		// options were given
		else {
			var var_post_li = {
				type: "list",
				user: this.state.user.first_name,
				description: this.state.title,
				list: result
			}
	
			// creating new posts array (so that new posts appear at the top of the timeline)
			var new_posts = [];
			new_posts = new_posts.concat(var_post_li);
			new_posts = new_posts.concat(this.state.posts);
		
			this.setState({
				posts: new_posts,
				title: "",
				options: [],
				option: ""
			});

			// close modal
			document.getElementById("modal-close").click();
		}
	}

	poll_add_cat = () => {
		this.setState({
			poll_options: this.state.poll_options.concat({id: this.state.num_ops, option: this.state.poll_option})
		});
		this.setState({
			num_ops: this.state.num_ops + 1
		});
		console.log(this.state.poll_options, typeof(this.state.poll_options));
	}

	poll_remove_cat = id => {
		const new_cats = this.state.poll_options.filter((item) => item.id !== id);
		this.setState({
			poll_options: new_cats
		});
	}

	poll_submit_post = () => {
		// would push post content to database
		var result = [];
		for (var i = 0; i < this.state.poll_options.length; i++) {
			var item = {
				name: this.state.poll_options[i].option,
				value: 0
			}
			result = result.concat(item);
		}

		// check if user entered prompt
		if (this.state.poll_title == "") {
			alert("Please fill in all input values");
		}

		// check to see if user submitted options (if there are none, send alert)
		else if (result.length < 2) {
			alert("Must input at least two poll options");
		}

		// at least one option submitted
		else {
			this.setState({
				poll_id: this.state.poll_id + 1
			});
	
			var var_post_poll = {
				type: "poll",
				id: this.state.poll_id,
				user: this.state.user.first_name,
				title: this.state.poll_title,
				res: result
			}
	
			// creating new posts array (so that new posts appear at the top of the timeline)
			var new_posts = [];
			new_posts = new_posts.concat(var_post_poll);
			new_posts = new_posts.concat(this.state.posts);
	
			var voted = this.state.voted;
			voted[this.state.poll_id] = false;
			this.setState({
				posts: new_posts,
				voted: voted,
				poll_options: [],
				poll_title: "",
				poll_option: ""
			});
	
			console.log(this.state.poll_id, this.state.voted, this.state.posts);

			// close modal
			document.getElementById("modal-close").click();
		}	
	}

	selectMovie(e) {
        this.setState({
            currentMovie: e
        })
    }

    wwm_submit_post = () => {
		console.log(this.state.wwm_time, this.state.wwm_date, this.state.wwm_url, this.state.wwm_description)
		
		if ((this.state.currentMovie == null) || (this.state.wwm_time == "") || (this.state.wwm_date == "") || (this.state.wwm_description == "")) {
			alert("Please fill in all input values");
		}

		else {
			var url_check = this.validate_url(this.state.wwm_url)
			if (url_check) {
				// would push post content to database
				console.log(this.state.wwm_time, this.state.wwm_date, this.state.wwm_url, this.state.wwm_description)

				var var_post_wwm = {
					type: "wwm",
					user: this.state.user.first_name,
					movie: this.state.currentMovie,
					time: this.state.wwm_time,
					date: this.state.wwm_date,
					url: this.state.wwm_url,
					description: this.state.wwm_description
				}

				// creating new posts array (so that new posts appear at the top of the timeline)
				var new_posts = [];
				new_posts = new_posts.concat(var_post_wwm);
				new_posts = new_posts.concat(this.state.posts);

				this.setState({
					posts: new_posts,
					movie: null,
					wwm_time: "",
					wwm_date: "",
					wwm_url: "",
					wwm_description: "",
					currentMovie: null
				});

				// close modal
				document.getElementById("modal-close").click();
			} else {
				if (this.state.wwm_time == null || this.state.wwm_date == null) {
					alert("Date & Time fields required. Invalid Url");
				} else {
					alert("Invalid Url. Make sure to include https/http in your url.");
				}
			}
		}
		
	}

	validate_url(url) {
		if (url == null) {
			return false;
		} else if (!(url.includes("https") || url.includes("http"))) {
			return false;
		} else if (url.includes("https") || url.includes("http") || url.includes("www.")) {
			return true;
		} else if (url.includes(".") || url.includes("/")) {
			return true;
		} else {
			return false;
		}
	}

	rating_selectMovie(e) {
        this.setState({
            rating_currentMovie: e
        })
    }

    rating_submit_post = () => {
		// would push post content to database
		console.log(this.state.rating, this.state.description)

		if ((this.state.rating_currentMovie == null) || (this.state.rating == "") || (this.state.rating_description == "")) {
			alert("Please fill in all input values and make sure the rating is an integer value");
		}

		else if (!((parseInt(this.state.rating) >= 1) && (parseInt(this.state.rating) <= 5))) {
			alert("Please input an integer rating between 1 and 5 only");
		}

		else {
			var var_post_rating = {
				type: "rating",
				user: this.state.user.first_name,
				movie: this.state.rating_currentMovie,
				rating: parseInt(this.state.rating),
				description: this.state.rating_description
			}
	
			// creating new posts array (so that new posts appear at the top of the timeline)
			var new_posts = [];
			new_posts = new_posts.concat(var_post_rating);
			new_posts = new_posts.concat(this.state.posts);
			
			this.setState({
				posts: new_posts,
				rating_description: "",
				rating_currentMovie: null,
				rating: ""
			});
	
			// close modal
			document.getElementById("modal-close").click();
		}
		
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
		this.phrase = this.get_curr_date();

		let post = this.state.posts.map((a, index) => 
			<div id="post-cont" className="shadow p-3 mb-5 bg-white" key={index}>
				{ a.type === "list" && 
					<div className="inner-post">
						<div id="post-title">
							<span>
								<img className="timeline-icon" src="https://randomuser.me/api/portraits/lego/1.jpg" />
							</span>
							<span>{a.user}</span>
						</div>
						<div>{a.description}</div>
						<ul id="list-post">
							{ a.list.map((b, index_li) => 
								<li id="items" key={index_li}>
									{index_li + 1}. {b}
								</li>
								)
							}
						</ul>
					</div>
				}
				{ a.type === "wwm" && 
					<div className="inner-post">
						<div id="post-title">
							<span>
								<img className="timeline-icon" src="https://randomuser.me/api/portraits/lego/1.jpg" />
							</span>
							<span>{a.user}: Watch With Me!</span>
						</div>
						<div><b>What: </b>{a.description}</div>
						<div><b>When: </b>{a.time} {a.date}</div>
						<div><b>Where: </b><a href={a.url} target="_blank">{a.movie}</a></div>
					</div>
				}
				{ a.type === "rating" && 
					<div className="inner-post">
						<div id="post-title">
							<span>
								<img className="timeline-icon" src="https://randomuser.me/api/portraits/lego/1.jpg" />
							</span>
							<span>{a.user}</span>
						</div>
						<div><b>Movie:</b> {a.movie}</div>
						<div>{a.description}</div>
						{[...Array(a.rating)].map((e, i) => <span className="fa fa-star checked"></span>)}
						{[...Array(5-a.rating)].map((e, i) => <span className="fa fa-star"></span>)}
					</div>
				}
				{ a.type === "poll" && 
					<div className="inner-post">
						<div id="post-title">
							<span>
								<img className="timeline-icon" src="https://randomuser.me/api/portraits/lego/1.jpg" />
							</span>
							<span>{a.user}</span>
						</div>
						<div>{a.title}</div>
						<Bar className="poll-bar"
				          data={{
							  	labels: a.res.map((item, index) => item.name),
							  	datasets: [
							    {
							      label: '# Users who voted',
							      backgroundColor: '#EB0000',
							      borderColor: ' #EB0000',
							      borderWidth: 1,
							      data: a.res.map((item, index) => item.value)
							    }
							  ]
							}}
				          options={{
				            legend:{
				              display:true,
				              position:'right'
				            },
				            scales: {
							    yAxes: [{
							      ticks: {
							        beginAtZero: true
							      }
							    }]
							  }
				          }}
				        />
				        {this.state.voted[a.id] === false && 
				        	<div>
						        <div>Vote for your selection:</div>
						        { a.res.map((b, index_li) => 
									<li className="poll-vote-option" key={index_li}>
										<button className="poll-vote-button" onClick={() => this.update_poll(b.name, a.id)}>{b.name}</button>
									</li>
									)
								}
							</div>
						}
					</div>
				}
			</div>
		)

		let cats = this.state.options.map((c) => 
			<div key={c.id} id="cat-item-list">
				<span>{c.id}. </span>
				<span id="cat-name">{c.option}</span>
				<span>
					<button id="cat-button"
					onClick={()=>this.remove_cat(c.id)}>X</button>
				</span>
			</div>);

		let poll_cats = this.state.poll_options.map((c) => 
			<li key={c.id} id="cat-item">
				<div>
					<span id="cat-name">{c.option}</span>
					<span>
						<button id="cat-button"
						onClick={()=>this.poll_remove_cat(c.id)}>X</button>
					</span>
				</div>
			</li>);

		let wwm_options = this.state.movies.map(movie => {
            const item = {}
            item['name'] = movie.title;
            item['value'] = movie.title;
            return item;
        });
        
        let rating_options = this.state.movies.map(movie => {
            const item = {}
            item['name'] = movie.title;
            item['value'] = movie.title;
            return item;
        });

		return (
			<div className="timeline-cont">
				<div>
					<span id="timeline-intro">Good {this.phrase} {this.state.user.first_name}</span>
					<span id="timeline-modal-button">
						<button type="button" id="timeline-modal-trigger" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
						  + Create A Post
						</button>
						<div>
							<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
							  <div className="modal-dialog">
							    <div className="modal-content">
							      <div className="modal-header">
							        <h5 className="modal-title" id="exampleModalLabel">Create A Post</h5>
							        <button id="modal-close" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
										  <div className={ this.state.activate_post === 1 ? 'tab-pane fade show active':'tab-pane fade'} role="tabpanel">
										  		<div>
													<div>
														<SelectSearch id="wwm-movie-search" onChange={e => this.selectMovie(e)} options={wwm_options} search filterOptions={fuzzySearch} placeholder="Choose a movie"/>
														<div id="movie">{this.state.currentMovie}</div>
													</div>
													<div> 	
														<input 
															className="wwm-input" 
															type="time"
															name="wwm_time"
															placeholder="Enter Time"
															value={this.state.wwm_time}
															onChange={this.onInputchange}/>
														<input 
															className="wwm-input" 
															type="date" 
															name="wwm_date"
															placeholder="Enter Date"
															value={this.state.wwm_date}
															onChange={this.onInputchange}/>
														<input 
															className="wwm-input" 
															type="text"
															name="wwm_url"
															placeholder="Enter Url"
															value={this.state.wwm_url}
															onChange={this.onInputchange}/>
														<input 
															className="wwm-input" 
															type="text" 
															name="wwm_description"
															placeholder="Enter Description"
															value={this.state.wwm_description}
															onChange={this.onInputchange}/>
														<button 
															onClick={() => this.wwm_submit_post()}
															className="wwm-submit" 
															type="submit">
															
																Submit your post!
														</button>
													</div>
												</div>
										  </div>
										  <div className={ this.state.activate_post === 2 ? 'tab-pane fade show active':'tab-pane fade'} role="tabpanel" >
										  		<div>
													<div> 	
														<input 
															className="poll-input" 
															type="text"
															name="poll_title"
															placeholder="Enter Poll Title (E.g. Whats your favourite dog movie?)"
															value={this.state.poll_title}
															onChange={this.onInputchange}/>
														<div>
															<input 
																className="poll-input-cat" 
																type="text"
																name="poll_option"
																placeholder="Enter a poll option (E.g. Cat)"
																value={this.state.poll_option}
																onChange={this.onInputchange}/>
															<button 
																onClick={() => this.poll_add_cat()}
																className="poll-submit-cat" 
																type="submit">
																	Add Poll Option!
															</button>
														</div>
														<div>
															<ul>
																{poll_cats}
															</ul>
														</div>
														<button 
															onClick={() => this.poll_submit_post()}
															className="poll-submit" 
															type="submit">
																Submit your post!
														</button>
													</div>
												</div>
										  </div>
										  <div className={ this.state.activate_post === 3 ? 'tab-pane fade show active':'tab-pane fade'} role="tabpanel" >
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
														<button 
															onClick={() => this.submit_post()}
															className="list-submit" 
															type="submit">
																Submit your post!
														</button>
													</div>
												</div>
										  </div>
										  <div className={ this.state.activate_post === 4 ? 'tab-pane fade show active':'tab-pane fade'} role="tabpanel" >
										  		<div>
													<div id="rating-movie-sel-cont">
														<SelectSearch id="rating-movie-search" onChange={e => this.rating_selectMovie(e)} options={rating_options} search filterOptions={fuzzySearch} placeholder="Choose a movie"/>
														<div id="movie">{this.state.rating_currentMovie}</div>
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
															name="rating_description"
															placeholder="Leave a description for this post (E.g. this movie wasn't my favourite!)"
															value={this.state.rating_description}
															onChange={this.onInputchange}/>
														<button 
															onClick={() => this.rating_submit_post()}
															className="rating-submit" 
															type="submit">
																Submit your post!
														</button>
													</div>
												</div>
										  </div>
										</div>
									</div>
							      </div>
							    </div>
							  </div>
							</div>
						</div>
					</span>
				</div>
				<hr></hr>
				<div id="timeline-content-cont">
					{post}
				</div>
			</div>
		);
	}
}