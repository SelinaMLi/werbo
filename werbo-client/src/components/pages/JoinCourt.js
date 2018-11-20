import React, { Component } from "react";
import Court from "../Court";

class JoinCourt extends Component {
	componentDidMount() {
		console.log(this.props.location.code);
	}

	getCourtInfo = code => {
		fetch("http://localhost:4000/courts/join/?access_code=" + code).catch(
			err => console.error(err)
		);
	};

	render() {
		return (
			<div>
				<Court />
			</div>
		);
	}
}

export default JoinCourt;
