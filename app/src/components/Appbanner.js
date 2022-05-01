import React, { Component } from "react";
import './Styles/Banner.css';

// This will be the base component for the login and signup page
export default class Appbanner extends Component {

	

	render() {
		return (
			<div id="banner-cont">
				<img id="banner-image" src="camera.png"></img>
				<span id="banner-title">Movies With Friends</span>
			</div>
			
		);
	}
}