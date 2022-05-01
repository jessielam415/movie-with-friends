import React, { Component } from "react";
import Timeline from './Timeline.js';
import Phase1timeline from './Phase1timeline.js';
import MyProfile from './MyProfile.js'
import FindFriends from './FindFriends.js'
import SearchMovie from './SearchMovie.js'
import Admin from './Admin.js'
import './Styles/Main.css'

import titanic from "./images/titanic.jpg";
import shining from "./images/shining.jpg";
import avengers from "./images/avengers.jpg";

import Appbanner from './../Appbanner.js';
import Appfooter from './../Appfooter.js';

import { logout } from './../../actions/user.js';
import ENV from './../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class Main extends Component {

	constructor(props) {
	    // When the componenet is created
	    super(props);
	    this.props.history.push("/main");

	    // would pull user data from database and set in state
	    this.state = {
	    	comp: 1,
			isLoading: true,
	    	// would get movie data from external data source
	    	movies: [],
			user: props.user
	    };
	}

	state = {
        message: { type: "", body: "" }
    }

 	componentDidMount = () => {
		fetch(`${API_HOST}/movie`)
        .then(response => {return response.json()})
        .then(json => {
            const movies = json;
            this.setState({
				movies: movies,
				isLoading: false
			})
        })
	}

	switch_timeline = () => {
		window.scrollTo(0, 0);
		this.setState({
	      	comp: 1
	    });
	}

	switch_my_profile = () => {
		window.scrollTo(0, 0);
		this.setState({
	      	comp: 2
	    });
	}


	switch_find_friends = () => {
		window.scrollTo(0, 0);
		this.setState({
	      	comp: 3
	    });
	}

	switch_search_movie = () => {
		window.scrollTo(0, 0);
		this.setState({
			comp: 4
		});
	}

	switch_admin = () => {
		window.scrollTo(0, 0);
		this.setState({
			comp: 5
		});
	}

	logout = (app) => {
		this.props.history.push("/login");
        logout(app);
	}

	render() {
		const { history, app } = this.props;

		const loading = this.state.isLoading;
		let content;
		if (loading) {
			content = <h3>Loading</h3>
		}
		else {
			content = (
				<div>
					<Appbanner />
					<div id="main-cont" className="container">
						<div className="row">
							<div className="col-xs-12 col-md-3" >
								<div id="left-menu-cont" className="card">
								  <img src="movie.jpg" className="card-img-top" alt="..." />
								  <ul className="list-group list-group-flush">
									
									<button 
										className='menu-button'
										onClick={() => this.switch_timeline()}>
										<li className={ this.state.comp === 1 ? 'active-button list-group-item':'list-group-item'}>
										Timeline
										</li>
									</button>
									<button className="menu-button" onClick={() => this.switch_my_profile()}>
										<li className={ this.state.comp === 2 ? 'active-button list-group-item':'list-group-item'}>
										My Profile
										</li>
									</button>
									<button className="menu-button" onClick={() => this.switch_find_friends()}>
										<li className={ this.state.comp === 3 ? 'active-button list-group-item':'list-group-item'}>
										Find Friends
										</li>
									</button>
									<button className="menu-button" onClick={() => this.switch_search_movie()}>
										<li className={ this.state.comp === 4 ? 'active-button list-group-item':'list-group-item'}>
										Search Movie
										</li>
									</button>
									{this.state.user.is_admin === true && 
										<button className="menu-button" onClick={() => this.switch_admin()}>
											<li className={ this.state.comp === 5 ? 'active-button list-group-item':'list-group-item'}>
											Admin
											</li>
										</button>
									}
									<button className="menu-button" onClick={() => this.logout(app)}>
										<li className='list-group-item'>
											Logout
										</li>
									</button>
								  </ul>
								</div>
							</div>
							<div className="col-xs-12 col-md-9" id="right-cont-main">
								{this.state.comp == 1 && <Timeline movies={this.state.movies} user={this.state.user}/>}
								{this.state.comp == 2 && <MyProfile user={this.state.user} password={this.state.user.password}/>}
								{this.state.comp == 3 && <FindFriends user={this.state.user}/>}
								{this.state.comp == 4 && <SearchMovie movies={this.state.movies}/>}
								{this.state.comp == 5 && <Admin/>}
							</div>
						</div>
					</div>
					<Appfooter />
				</div>
			)
		}

		return (
			content
		);
	}
}
