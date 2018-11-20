import React, { Component } from "react";

class HomePage extends Component {
	createCourt = () => {
		fetch("http://localhost:4000/courts/new").catch(err =>
			console.error(err)
		);

		fetch("http://localhost:4000/courts")
			.then(response => response.json())
			.then(response => this.setState({ courts: response.data }))
			.catch(err => console.error(err));
	};

	render() {
		return (
			<div>
				<div>
					<button onClick={this.createCourt}>Create a court</button>
				</div>
				<div>
					<button>Join a court</button>
				</div>
			</div>
		);
	}
}

export default HomePage;
