import React, { Component } from "react";
import ProfileContent from './MyProfile/ProfileContent.js';
import "./Styles/MyProfile.css";
import ENV from './../../config.js';
const API_HOST = ENV.api_host

// This will be the base component for the login and signup page
export default class MyProfile extends Component {

	state = {
		firstName: "",
		last_name: "",
		newpass: "",
		newpass_conf: "",
		new_avatar: "",
		curpass: "",
		avatar: ""
    };
	
	constructor(props) {
	    // When the componenet is created
	    super(props);

	    // would pull user data from database and set in state
	    this.state = {
	    	activate_post: 1,
	    	movies: props.movies,
			posts: props.posts,
			original_avatar: props.user.avatar,
			user: props.user
	    };

	}

	componentDidMount() {
		this.setState({
			password: this.state.user.password,
			firstName: this.state.user.firstName,
			lastName: this.state.user.lastName,
			avatar: this.state.user.avatar
		});
	}

	onInputchange = event => {
	    this.setState({
	    	[event.target.name]: event.target.value
	    });
	}

	get_user = (username) => {
		console.log(this.state.user)
		fetch('findUser/' + username)
		.then((res) => {
			
			if (res.status === 200) { 
				
				fetch(`${API_HOST}/findUser/` + username)
			        .then(response => {return response.json()})
			        .then(json => {
			            const user = json;
			            this.setState({
							user: user
						})
			        })
			    console.log(this.state.user)
			}

		}).catch((error) => {
			console.log(error)
		})

		console.log(this.state.user)
	}

	// updates first name of user in database
	submit_new_firstname() {

		// url for request
		const url = '/user/firstname/' + this.state.user._id

		// The data we are going to send in our request
		let data = {
			firstName: this.state.firstName,
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

		// Send the request with fetch()
		fetch(request)
		.then((res) => {
			console.log(res)
		
			if (res.status === 200) {
				var old = this.state.user;
				old.firstName = this.state.firstName;
				this.setState({
					user: old
				});
					
			} else {
				console.log('Firstname not changed')
					
			}
		}).catch((error) => {
			console.log(error)
		})
	}

	// reset necessary values on modal close
	reset_vals() {
		this.setState({
			curpass: "",
			newpass: "",
			newpass_conf: ""
		})

		// var old = this.state.user;
		// old.avatar = this.state.original_avatar;
		// this.setState({
		// 	user: old
		// });

		var paragraph = document.getElementById("password-update");
		paragraph.innerHTML = ""
	}

	// updates lastname of user in database
	submit_new_lastname() {
		// url for request
		const url = '/user/lastname/' + this.state.user._id

		// The data we are going to send in our request
		let data = {
			lastName: this.state.lastName,
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

		// Send the request with fetch()
		fetch(request)
		.then((res) => {
			console.log(res)
		
			if (res.status === 200) {
				var old = this.state.user;
				old.lastName = this.state.lastName;
				this.setState({
					user: old
				});
					
			} else {
				console.log('Lastname not changed')
					
			}
		}).catch((error) => {
			console.log(error)
		})
	}

	set_new_image() {
		var ele = document.getElementsByName('new-profile-image');
		for(var i = 0; i < ele.length; i++) {
			if(ele[i].checked) {
				var image = "";
				if (i == 0) {
					image = "image1.png"
				} else if (i == 1) {
					image = "image10.jpg"
				} else if (i == 2) {
					image = "image3.jpg"
				} else if (i == 3) {
					image = "image4.jfif"
				} else if (i == 4) {
					image = "image5.jpg"
				} else if (i == 5) {
					image = "image6.jpg"
				} else if (i == 6) {
					image = "image7.png"
				} else if (i == 7) {
					image = "image8.jfif"
				}

				this.state.avatar = image
			}
		}
		// update profile picture url in database

		// url for request
		const url = '/user/avatar/' + this.state.user._id
	
		// The data we are going to send in our request
		let data = {
			avatar: this.state.avatar,
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

		// Send the request with fetch()
		fetch(request)
		.then((res) => {
			console.log(res)
		
			if (res.status === 200) {
				
				var old = this.state.user;
				old.avatar = this.state.avatar;
				this.setState({
					user: old
				});
				alert('Picture Change Confirmed')
			} else {
					
			}
		}).catch((error) => {
			console.log(error)
		})

		this.get_user(this.state.user.username)
	}

	// would update password of user in database
	change_password() {

		if (this.state.newpass != this.state.newpass_conf) {
			var paragraph = document.getElementById("password-update");
			paragraph.innerHTML = ""
			var paragraph = document.getElementById("password-alert");
			paragraph.innerHTML = "* New passwords are not equivalent."
		}

		else if (this.state.newpass == "") {
			var paragraph = document.getElementById("password-update");
			paragraph.innerHTML = ""
			var paragraph = document.getElementById("password-alert");
			paragraph.innerHTML = "* New password cannot be the empty string."
		}

		else if (this.state.newpass == this.state.curpass) {
			var paragraph = document.getElementById("password-update");
			paragraph.innerHTML = ""
			var paragraph = document.getElementById("password-alert");
			paragraph.innerHTML = "* New password cannot be the same as your current password."
		}
		
		else {
			// url for request (updating password in db)
			const url = '/user/password/' + this.state.user.username

			// The data we are going to send in our request
			let data = {
				curPassword: this.state.curpass,
				newPassword: this.state.newpass
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

			// Send the request with fetch()
			fetch(request)
			.then((res) => {
				console.log(res)
			
				if (res.status === 200) {

					var paragraph = document.getElementById("password-alert");
					paragraph.innerHTML = ""
					var paragraph = document.getElementById("password-update");
					paragraph.innerHTML = "<strong> Success! </strong> Password changed."
						
				} else {
					//alert('Current password is incorrect')
					var paragraph = document.getElementById("password-update");
					paragraph.innerHTML = ""
					var paragraph = document.getElementById("password-alert");
					paragraph.innerHTML = "* You current password is incorrect."
						
				}
			}).catch((error) => {
				console.log(error)
			})
		}
	}

	set_radio = (src) => {
		var old = this.state.user;
		old.avatar = src;
		this.setState({
			user: old
		});
	}

	render() {

		this.num_following = this.state.user.following.length
		this.num_followers = this.state.user.followers.length
		
		return (
			<div>
				<div className="profile-header">
				<div>
					<span id="profile-intro">{this.state.user.firstName} {this.state.user.lastName} </span>
				</div>
				<div>
					<span id="profile-following">{this.num_followers} Followers | {this.num_following} Following</span>
					<img id="user-avatar" src={this.state.user.avatar}/>
				</div>
				<div>
					<input type="image" src="settings.png" name="setting-form" className="btTxt submit" id="setting-form"  data-bs-toggle="modal" data-bs-target="#exampleModal2"/>
				</div>
				</div>
				<br></br>
				<hr id="separator"></hr>
				<div id="recent-activity">
					<span id="activity-intro">Recent Activity</span>
					<div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
					<div className="modal-dialog">
						<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Profile Settings</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => this.reset_vals()}></button>
						</div>
						<div className="modal-body">
							<div className="profile-div">
								<img id="user-avatar2" src={this.state.user.avatar}/>
								<span id="setting-intro">{this.state.user.firstName} {this.state.user.lastName} </span>
							</div>
							<div className="prof-section">
								<h6 className="setting-title">Profile Image</h6>
								<div id="new-image-div">
										<div id="picture-div">
											<input type="radio" id="image1" name="new-profile-image" value="img1" checked={this.state.user.avatar === "image1.png"} onClick={() => this.set_radio('image1.png')}></input>
											<label for="image1" onClick={() => this.set_radio('image1.png')}><img className="new-image" src="image1.png"/></label><br></br>
											<input type="radio" id="image2" name="new-profile-image" value="img2" checked={this.state.user.avatar === "image10.jpg"} onClick={() => this.set_radio('image10.jpg')}></input>
											<label for="image2" onClick={() => this.set_radio('image10.jpg')}><img className="new-image" src="image10.jpg"/></label><br></br>
										</div>
										<div id="picture-div">
											<input type="radio" id="image3" name="new-profile-image" value="img3" checked={this.state.user.avatar === "image3.jpg"} onClick={() => this.set_radio('image3.jpg')}></input>
											<label for="image3" onClick={() => this.set_radio('image3.jpg')}><img className="new-image" src="image3.jpg"/></label><br></br>
											<input type="radio" id="image4" name="new-profile-image" value="img4" checked={this.state.user.avatar === "image4.jfif"} onClick={() => this.set_radio('image4.jfif')}></input>
											<label for="image4" onClick={() => this.set_radio('image4.jfif')}><img className="new-image" src="image4.jfif"/></label><br></br>
										</div>
										<div id="picture-div">
											<input type="radio" id="image5" name="new-profile-image" value="img5" checked={this.state.user.avatar === "image5.jpg"} onClick={() => this.set_radio('image5.jpg')}></input>
											<label for="image5" onClick={() => this.set_radio('image5.jpg')}><img className="new-image" src="image5.jpg"/></label><br></br>
											<input type="radio" id="image6" name="new-profile-image" value="img6" checked={this.state.user.avatar === "image6.jpg"} onClick={() => this.set_radio('image6.jpg')}></input>
											<label for="image6" onClick={() => this.set_radio('image6.jpg')}><img className="new-image" src="image6.jpg"/></label><br></br>
										</div>
										<div id="picture-div">
											<input type="radio" id="image7" name="new-profile-image" value="img7" checked={this.state.user.avatar === "image7.png"} onClick={() => this.set_radio('image7.png')}></input>
											<label for="image7" onClick={() => this.set_radio('image7.png')}><img className="new-image" src="image7.png"/></label><br></br>
											<input type="radio" id="image8" name="new-profile-image" value="img8" checked={this.state.user.avatar === "image8.jfif"} onClick={() => this.set_radio('image8.jfif')}></input>
											<label for="image8" onClick={() => this.set_radio('image8.jfif')}><img className="new-image" src="image8.jfif"/></label><br></br>
										</div>
									</div>
									<button 
									id="img-button"
									onClick={() => this.set_new_image()}
									className="setting-button"
									type="submit">
										Update Image	
								</button>
								</div>
							<div className="prof-section">
								<h6 className="setting-title">First Name</h6>
								<div>
								<input 
									className="new-firstname"
									type="text"
									name="firstName" 
									value={this.state.firstName}
									onChange={this.onInputchange}/>
								<button 
									onClick={() => this.submit_new_firstname()}
									className="setting-button"
									type="submit">
										Submit Change	
								</button>
								</div>
							</div>
							<div className="prof-section">
								<h6 className="setting-title">Last Name </h6>
								<div>
								<input 
									className="new-lastname"
									type="text"
									name="lastName"
									value={this.state.lastName}
									onChange={this.onInputchange}/>
								<button 
									onClick={() => this.submit_new_lastname()}
									className="setting-button" 
									type="submit">
										Submit Change
								</button>
								</div>
							</div>
							<div className="prof-section">
								<h6 className="setting-title">Change Password </h6>
								<div className="pass-div">
									<input 
										className="cur-password"
										type="password"
										name="curpass"
										placeholder="Enter current password"
										value={this.state.curpass}
										onChange={this.onInputchange}/>
									<p id="password-alert"></p>
								</div>
								<div className="pass-div">
									<input 
										className="new-password"
										type="password"
										name="newpass"
										placeholder="Enter new password"
										value={this.state.newpass}
										onChange={this.onInputchange}/>
									<input 
										className="new-password2"
										type="password"
										name="newpass_conf"
										placeholder="Re-enter new password"
										value={this.state.newpass_conf}
										onChange={this.onInputchange}/>
									<button 
										onClick={() => this.change_password()}
										className="setting-button"
										type="submit">
											Change Password
									</button>
									<p id="password-update"></p>
								</div>
								<div>
							</div>
							</div>
						</div>
						</div>
					</div>
					</div>
				</div>
				<ProfileContent user={this.state.user} />
			</div>
			
		);
	}
}