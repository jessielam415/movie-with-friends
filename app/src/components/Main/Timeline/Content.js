import React, { Component } from "react";
import './Styles/Content.css';
import {Bar} from 'react-chartjs-2';
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class Content extends Component {

	constructor(props) {
	    // When the component is created
	    super(props);

	   this.state = {
	   		user: props.user,
	   		limit: 4,
	   		num_posts: 0,
	   		posts: [],
    		voted: [],
    		user_to_img: {}
	   };
	}

	componentDidMount() {
		this.get_posts().then(data => this.handle_request(JSON.parse(data)))
	}

	handle_update_poll_request = (status) => {
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

	update_poll = (name, id) => {
		this.update_poll_request(name, id).then(res => this.handle_update_poll_request(res.status));
		this.setState({
			voted: this.state.voted.concat(id)
		})

		for (var i = 0; i < this.state.posts[0].length; i++) {
			if (this.state.posts[0][i].__type === 'Poll') {
				if (this.state.posts[0][i]._id === id) {
					for (var j = 0; j < this.state.posts[0][i].options.length; j++) {
						if (this.state.posts[0][i].options[j].option === name) {
							this.state.posts[0][i].options[j].voters = this.state.posts[0][i].options[j].voters.concat(this.state.user.username)
							break
						}
					}
				}
			}
		}
	}

	update_poll_request = (name, id) => {
		// the URL for the request
	    const url = '/post/poll/update';

	    // The data we are going to send in our request
	    let data = {
	        name: name,
		    id: id,
		    user: this.state.user.username 
	    }

	    // Create our request constructor with all the parameters we need
	    const request = new Request(url, {
	        method: 'PATCH', 
	        body: JSON.stringify(data),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
	    });

	    return fetch(request)
	    .then(function(res) {
	    	return res
	    }).catch((error) => {
	        console.log(error)
	    })
	}

	handle_request = (data) => {
		var newones = []
		for (var i = 0; i < data["list"].length; i++) {
			newones = newones.concat(data["list"][i])
			if (data["list"][i].__type === 'Poll') {
				for (var j = 0; j < data["list"][i].options.length; j++) {
					if (data["list"][i].options[j].voters.includes(this.state.user.username)) {
						this.setState({
							voted: this.state.voted.concat(data["list"][i]._id)
						})
						break
					}
				}
			}
		}
		
        this.setState({
			posts: [newones],
			num_posts: data["length"],
			user_to_img: data["user_to_img"]
		});
	}

	get_posts = () => {
		this.setState({
			limit: this.state.limit + 4
		});
		
		const url = '/timeline/' + this.state.user.username + '/' + (this.state.limit).toString();

	    // Since this is a GET request, simply call fetch on the URL
	    return fetch(url)
		    .then((res) => res.text())
		   	.catch((error) => {
		        console.log(error)
		    })
	}

	load_more = () => {
		this.setState({
			limit: this.state.limit + 4
		});

		this.get_posts().then(data => this.handle_request(JSON.parse(data)))
	}

	render() {
		
		let all_posts = []
		if (this.state.posts.length > 0) {
			all_posts = this.state.posts[0].map((a, index) => 
				<div id="post-cont" className="shadow p-3 mb-5 bg-white" key={index}>
					{ a.__type === "List" &&
						<div className="inner-post">
							<div id="post-title">
								<span>
									<img className="timeline-icon" src={this.state.user_to_img[a.author]} />
								</span>
								<span>{a.author}</span>
							</div>
							<div>{a.title}</div>
							<ul id="list-post">
								{ a.options.map((b, index_li) => 
									<li id="items" key={index_li}>
										{index_li + 1}. {b.option}
									</li>
									)
								}
							</ul>
						</div>
					}
					{ a.__type === "WWM" && 
						<div className="inner-post">
							<div id="post-title">
								<span>
									<img className="timeline-icon" src={this.state.user_to_img[a.author]} />
								</span>
								<span>{a.author}: Watch With Me!</span>
							</div>
							<div><b>What: </b>{a.description}</div>
							<div><b>When: </b>{a.time} {a.date}</div>
							<div><b>Where: </b><a href={a.url} target="_blank">{a.movie}</a></div>
						</div>
					}
					{ a.__type === "Rating" && 
						<div className="inner-post">
							<div id="post-title">
								<span>
									<img className="timeline-icon" src={this.state.user_to_img[a.author]} />
								</span>
								<span>{a.author}</span>
							</div>
							<div><b>Movie:</b> {a.movie}</div>
							<div>{a.description}</div>
							{[...Array(parseInt(a.rating))].map((e, i) => <span className="fa fa-star checked" key={i}></span>)}
							{[...Array(parseInt(5-a.rating))].map((e, i) => <span className="fa fa-star" key={i}></span>)}
						</div>
					}
					{ a.__type === "Poll" && 
						<div className="inner-post">
							<div id="post-title">
								<span>
									<img className="timeline-icon" src={this.state.user_to_img[a.author]} />
								</span>
								<span>{a.author}</span>
							</div>
							<div>{a.title}</div>
							<Bar className="poll-bar"
					          data={{
								  	labels: a.options.map((item, index) => item.option),
								  	datasets: [
								    {
								      label: '# Users who voted',
								      backgroundColor: '#EB0000',
								      borderColor: ' #EB0000',
								      borderWidth: 1,
								      data: a.options.map((item, index) => item.voters.length)
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
					        {a.author !== this.state.user.username && !this.state.voted.includes(a._id) &&
					        	<div>
							        <div>Vote for your selection:</div>
							        { a.options.map((b, index_li) => 
										<li className="poll-vote-option" key={index_li}>
											<button className="poll-vote-button" onClick={() => this.update_poll(b.option, a._id)}>{b.option}</button>
										</li>
										)
									}
								</div>
							}
						</div>
					}
				</div>
			)
		}

		return (
			<div id="timeline-content-cont">
				{ all_posts.length === 0 &&
					<h4>There are no posts to show right now. Create a new post in the top right corner! :)</h4>
				}
				{all_posts}
				<div>
					{	this.state.limit - 4 < this.state.num_posts && 
						<button 
							onClick={() => this.load_more()}
							className="profile_cont_load_more"
							type="submit">
								Load More
						</button>
					}
				</div>
			</div>
		);
	}
}