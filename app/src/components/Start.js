import React, { Component } from "react";
import Login from "./Auth/Login.js"

// This will be the base component for the login and signup page
export default class Start extends Component {

	
	render() {
		return (
			<div>
				<Login />
			</div>
		);
	}
}