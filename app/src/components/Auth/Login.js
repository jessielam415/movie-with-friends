import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import './Styles/Login.css';
import Appbanner from '../Appbanner.js';
import Appfooter from '../Appfooter.js';

import { updateLoginForm, login } from "../../actions/user";

// This will be the base component for the login and signup page
export default class Login extends Component {

	constructor(props) {
        super(props);
        this.props.history.push("/login");
    }

    state = {
			username: "",
			password: "",
	}

	to_signup = () => window.open("/Signup", "_self");

	handleKeyPress = (event) => {
	  if(event.key === 'Enter'){
	    login(this, this.props)
	  }
	}

	render() {
		const { app } = this.props
		return (
			<div>
				<Appbanner />
				<div id="login-cont">
					<center>
						<div className="login-form shadow p-3 mb-5 bg-white"> 
							<h1>Log In Here</h1>
							<input 
								className="login-input" 
								type="text"
								name="username"
								placeholder="Enter Username"
								onChange={e => updateLoginForm(this, e.target)}
								onKeyPress={this.handleKeyPress}/>
							<input 
								className="login-input" 
								type="password" 
								name="password"
								placeholder="Enter Password"
								onChange={e => updateLoginForm(this, e.target)}
								onKeyPress={this.handleKeyPress}/>
							<p id="login-alert"></p>
							<button 
								onClick={() => login(this, app)}
								className="login-submit"
								id="login-button-primary" 
								type="submit">
									Log In
							</button>
							<button 
								onClick={() => this.to_signup()}
								className="login-submit"
								id="login-submit-non-primary" 
								type="submit">
									Dont have an account? <span id="primary-text">Sign Up here!</span>
							</button>
						</div>
					</center>
				</div> 
				<Appfooter />
			</div>
		);
	}
}