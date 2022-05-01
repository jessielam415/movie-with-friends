import React, { Component } from "react";
import './Styles/Signup.css';
import SelectSearch from "react-select-search";
import Appbanner from '../Appbanner.js';
import fuzzySearch from "../Main/fuzzySearch.js";
import Appfooter from '../Appfooter.js';

// This will be the base component for the login and signup page
export default class Signup extends Component {


	state = {
		username: "",
		password: "",
		confpassword: "",
		first: "",
		last: "",
		age: "",
		genders: [{'value': 'Female'}, {'value': 'Male'}, {'value': 'Other'}]
	}

	onInputchange = event => {
	    this.setState({
	    	[event.target.name]: event.target.value
	    });
	}
	
	// check if username is not already taken and then if it isnt, add the user to the db
	validateUsername = () => {
		const url = '/findUser/' + this.state.username

		fetch(url)
		.then((res) => {
			console.log(res)
			if (res.status === 200) { // user with this username is found
				var paragraph = document.getElementById("signup-alert");
				paragraph.innerHTML = "* This username already exists."
				//alert('Username already exists')
				
			   
			} else {
				console.log('User with the same username not found')
				// add the user to the database
				this.addUser()
			}

		}).catch((error) => {
			console.log(error)
		})
	}

	addUser = () => {
		// make sure there are no empty fields
		if ((this.state.first == "") || (this.state.last == "") || (this.state.age == "") || (this.state.gender == "") || 
		(this.state.username == "") || (this.state.password == "") || (this.state.confpassword == "")) {
			var paragraph = document.getElementById("signup-alert");
			paragraph.innerHTML = "* All input fields must be filled in."
		}
		// make sure user enters valid age
		else if ((parseInt(this.state.age) < 0) || (parseInt(this.state.age > 199))) {
			//alert("Please enter a valid age (between 0 and 199")
			var paragraph = document.getElementById("signup-alert");
			paragraph.innerHTML = "* Please enter a valid age (between 0 and 199)."
		}

		// validate password (check if password === confirmed password)
		else if (this.state.password !== this.state.confpassword) {
			//alert("Passwords dont match");
			var paragraph = document.getElementById("signup-alert");
			paragraph.innerHTML = "* Passwords do not match."

		} else {
			// sent post request to create a new user
			const url2 = '/user';

			// The data we are going to send in our request
			let data2 = {
				firstName: this.state.first,
				lastName: this.state.last,
				age: this.state.age,
				gender: this.state.gender,
				username: this.state.username,
				password: this.state.password
			}

			// Create our request constructor with all the parameters we need
			const request2 = new Request(url2, {
				method: 'post', 
				body: JSON.stringify(data2),
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
			});

			// Send the request with fetch()
			fetch(request2)
			.then((res2) => {
		
			
				if (res2.status === 200) {
					// If user was added successfully, tell the user.
					alert('You have successfully created a new account. You can now navigate to the ' 
					+ 'log in page and sign in using your new credentials.')
						
				} else {
					// If server couldn't add the user, tell the user.
					console.log('Could not add new user')
					
				}
			}).catch((error) => {
				console.log(error)
			})
		}	
	}

	to_login = () => window.open("/Login", "_self");

	handleKeyPress = (event) => {
	  if(event.key === 'Enter'){
	    this.signup();
	  }
	}
	
	selectGender(e) {
        this.setState({
            gender: e
        })
	}

	render() {
		let options = this.state.genders.map(gender => {
            const item = {}
            item['name'] = gender.value;
            item['value'] = gender.value;
			return item;
        });
		return (
			<div>
				<Appbanner />
				<div id="signup-cont">
					<center>
						<div className="signup-form shadow p-3 mb-5 bg-white"> 
							<h1 className="signup-title">Sign Up Here</h1>

							<input id="signup-first" className="signup-input" type="text" placeholder="Enter First Name" name="first" 
								value={this.state.first}
								onChange={this.onInputchange}
								onKeyPress={this.handleKeyPress}/>
							<input id="signup-last"  className="signup-input" type="text" placeholder="Enter Last Name" name="last" 
								value={this.state.last}
								onChange={this.onInputchange}
								onKeyPress={this.handleKeyPress}/>

							<input id="signup-age"  className="signup-input" type="number" min="0" max="199" placeholder="Enter Age" name="age" 
								value={this.state.age}
								onChange={this.onInputchange}
								onKeyPress={this.handleKeyPress}/>
							
							<SelectSearch id="gender-search" onChange={e => this.selectGender(e)} value={this.state.gender} options={options} search filterOptions={fuzzySearch} placeholder="Select Gender"/>

							<input className="signup-input" type="text" placeholder="Enter Username" name="username" 
								value={this.state.username}
								onChange={this.onInputchange}
								onKeyPress={this.handleKeyPress}/>

							<input className="signup-input" type="password" placeholder="Enter Password" name="password" 
								value={this.state.password}
								onChange={this.onInputchange}
								onKeyPress={this.handleKeyPress}/>

							<input className="signup-input" type="password" placeholder="Confirm Password" name="confpassword" 
								value={this.state.confpassword}
								onChange={this.onInputchange}
								onKeyPress={this.handleKeyPress}/>
							<p id="signup-alert"></p>
							<button 
								onClick={() => this.validateUsername()} 
								className="signup-submit" 
								id="signup-button-primary"
								type="submit">
									Sign Up
							</button>
							<button 
								onClick={() => this.to_login()}
								className="signup-submit"
								id="signup-submit-non-primary"
								type="submit">
									Already have an account? <span id="primary-text">Log In here!</span>
							</button>
						</div>
					</center>
				</div>
				<Appfooter />
			</div>
		);
	}
}