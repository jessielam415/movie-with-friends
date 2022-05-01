import React, { Component } from "react";
import SelectSearch from "react-select-search";
import fuzzySearch from "./fuzzySearch.js"
import "./Styles/FindFriends.css";
import ENV from './../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class FindFriends extends Component {
	constructor(props){
		super(props);
		this.state = {
			username: props.user.username,
			user: props.user,
			users: []
		}

		fetch(`${API_HOST}/findUser/` + this.state.username)
        .then(response => {return response.json()})
        .then(json => {
            const user = json;
            this.setState({
				user: user
			})
        })
	}

	follow = (user) => {
		fetch(`${API_HOST}/user/${this.state.user.username}/${user.username}`, {
			method: "POST",
		}).then((response) => {
			return response.json();
		}).then((json) => {
			const user = json["user"];
			const allUsers = json["allUsers"];
			this.setState({
				user: user,
				users: allUsers
			})
		})
	}

	unfollow = (user) => {
		fetch(`${API_HOST}/user/${this.state.user.username}/${user.username}`, {
			method: "DELETE",
		}).then((response) => {
			return response.json();
		}).then((json) => {
			const user = json["user"];
			const allUsers = json["allUsers"];
			this.setState({
				user: user,
				users: allUsers
			})
		})
	}

	getOptions = () =>{
		const allUsers = this.state.users;
		let options = allUsers.filter(user => {
			return (!this.state.user.following.includes(user.username) && user.username !== this.state.user.username);
		})
		return options;
	}

	searchOptions = (options) => {
		let sOptions = options.map((user) => {
			const item = {};
			item.name = user.username;
			item.value = user.username;
			item.username = user.username;
			item._id = user._id;
			item.firstName = user.firstName;
			item.followers = user.followers;
			item.avatar = user.avatar;
			return item
		})
		return sOptions
	}

	getFollowers = () =>{
		let followers = this.state.users.filter(user =>{
			return this.state.user.followers.includes(user.username)
		})
		return followers;
	}

	getFollowing = () => {
		let following = this.state.users.filter(user => {
			return this.state.user.following.includes(user.username)
		})
		return following;
	}

	renderOption = (props, option, snapshot, className) => {
		let button;
		if (this.state.user.following.includes(option.username)) {
			button = <button className="search-unfollow" onClick={() => this.unfollow(option)}>Unfollow</button> 
		}
		else {button = <button className="search-follow" onClick={() => this.follow(option)}>Follow</button>}
		let renderedOption = 
		<div id={option.name} className="search-user-option">
			<img className="search-user-avatar" src={option.avatar}/>
			<p className="search-user-first-name">{option.firstName} </p>
			<p className="search-user-info">{option.followers.length + " followers"}</p>
			{button}
		</div>
		return renderedOption;
	}
	getUsers = () => {
		fetch(`${API_HOST}/user`, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then((response) => {
			return response.json()
		})
		.then((json) => {
			const users = json;
			this.setState({
				users: users
			})
			return json;
		})
	}

	componentDidMount = () => {
		this.getUsers();
	}
	
	render() {
		let followers = this.getFollowers();
		let following = this.getFollowing();
		let recommended = this.getOptions().filter(user => {
			return user.following.some(friend => (this.state.user.following.includes(friend) && this.state.user.username !== friend.username))
		})
		
		return (
			<div>
				<h1>Find new friends</h1>
				<SelectSearch class="find-friend-search" options={this.searchOptions(this.getOptions())} placeholder="Search username..." search filterOptions={fuzzySearch} renderOption={this.renderOption} />
				<br/>
				<h1>Recommended Friends</h1>
				<div id="userList">
				{recommended.map((user) =>
					<div id={user.username} className="rec-user" key={user.username}>
						<img className="rec-user-avatar" src={user.avatar}/>
						<p className="user-first-name">{user.firstName}</p> 
						<p className="user-info">{user.followers.length + " followers"}</p>
						<button className="follow" onClick={() => this.follow(user)}>Follow</button>
					</div>
				)}
				{ recommended.length === 0 &&
					<div id="find-friends-no-recom">
						No Recommended friends to be shown right now. 
					</div>
				}
				</div>
				<br/>
				<h1> Followers </h1>
				<SelectSearch class="find-friend-search" options={this.searchOptions(followers)} placeholder="Search username..." search filterOptions={fuzzySearch} renderOption={this.renderOption} />
				<br/>
				<div id="userList">
				{followers.map((user) =>
					<div id={user.username} className="rec-user" key={user._id}>
						<img className="rec-user-avatar" src={user.avatar}/>
						<p className="user-first-name">{user.firstName}</p> 
						<p className="user-info">{user.followers.length + " followers"}</p>
						<button className={this.state.user.following.includes(user.username) ? "unfollow" : "follow"} onClick={() => (this.state.user.following.includes(user.username)? this.unfollow(user) : this.follow(user))}>{this.state.user.following.includes(user.username) ? "Unfollow" : "Follow"}</button>
					</div>
				)}
				</div>
				<br/>
				<h1> Following </h1>
				<SelectSearch class="find-friend-search" options={this.searchOptions(following)} placeholder="Search username..." search filterOptions={fuzzySearch} renderOption={this.renderOption} />
				<br/>
				<div id="userList">
				{following.map((user) =>
					<div id={user.username} className="rec-user" key={user._id}>
						<img className="rec-user-avatar" src={user.avatar}/>
						<p className="user-first-name">{user.firstName}</p> 
						<p className="user-info">{user.followers.length + " followers"}</p>
						<button className="unfollow" onClick={() => this.unfollow(user)}>UnFollow</button>
					</div>
				)}
				</div>
			</div>
		);
	}
}