import React, { Component } from "react";
import './Styles/ProfileContent.css';
import {Bar} from 'react-chartjs-2';
import ENV from './../../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class ProfileContent extends Component {

	constructor(props) {
	    // When the component is created
	    super(props);

	   	this.state = {
	   		user: props.user,
	   		posts: [],
	   		limit: 2,
	   		num_posts: 0
	   	};
	}

	componentDidMount() {
		this.get_posts().then(data => this.handle_request(JSON.parse(data)))
	}

	handle_request = (data) => {
		var newones = []
		for (var i = 0; i < data["list"].length; i++) {
			newones = newones.concat(data["list"][i])
		}
		
        this.setState({
			posts: [newones],
			num_posts: data["length"]
		});
	}

	get_posts = () => {
		this.setState({
			limit: this.state.limit + 2
		});
		
		const url = '/post/' + this.state.user.username + '/' + (this.state.limit).toString();

	    // Since this is a GET request, simply call fetch on the URL
	    return fetch(url)
		    .then((res) => res.text())
		   	.catch((error) => {
		        console.log(error)
		    })
	}

	load_more = () => {
		this.setState({
			limit: this.state.limit + 2
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
									<img className="timeline-icon" src={this.state.user.avatar} />
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
									<img className="timeline-icon" src={this.state.user.avatar} />
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
									<img className="timeline-icon" src={this.state.user.avatar} />
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
									<img className="timeline-icon" src={this.state.user.avatar} />
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
						</div>
					}
				</div>
			)
		}

		return (
			<div id="timeline-content-cont">
				{ all_posts.length === 0 &&
					<h4>There are no posts to show right now. Travel to the Timeline page to create one! :)</h4>
				}
				{all_posts}
				<div>
					{	this.state.limit - 2 < this.state.num_posts && 
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