import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class Court extends Component {
	constructor(props) {
		super(props);
		this.state = {
			access_code: "",
			team1_score: 0,
			team2_score: 0
		};
	}

	componentDidMount() {
		//join a specific socket channel belonging to the access_code
		const socket = socketIOClient("http://127.0.0.1:4000");
		socket.emit("JoinCourt", this.props.match.params.access_code);
		socket.on("Refresh", () => {
			this.getCourtInfo();
		});

		this.setState({ access_code: this.props.match.params.access_code });
		this.getCourtInfo();
	}

	getCourtInfo = () => {
		fetch(
			"http://localhost:4000/court/" + this.props.match.params.access_code
		)
			.catch(err => console.error(err))
			.then(results => {
				return results.json();
			})
			.then(results => {
				this.setState({ team1_score: results.data[0].team1 });
				this.setState({ team2_score: results.data[0].team2 });
			});
	};

	updateScore = (team, operation) => {
		fetch("http://localhost:4000/court/update", {
			method: "POST",
			body: JSON.stringify({
				access_code: this.state.access_code,
				team_number: team,
				operation: operation
			}),
			headers: { "Content-Type": "application/json" }
		});
	};

	render() {
		return (
			<div>
				<h1> Court </h1>
				<div>
					<p> Team 1: {this.state.team1_score}</p>
					<button onClick={() => this.updateScore(1, "increase")}>
						+
					</button>
					<button onClick={() => this.updateScore(1, "decrease")}>
						-
					</button>
				</div>
				<div>
					<p> Team 2: {this.state.team2_score}</p>
					<button onClick={() => this.updateScore(2, "increase")}>
						+
					</button>
					<button onClick={() => this.updateScore(2, "decrease")}>
						-
					</button>
				</div>
			</div>
		);
	}
}

export default Court;
