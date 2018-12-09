import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";

class HomePage extends Component {
	state = {
		code: "",
		redirect: false
	};

	onChange = e => {
		this.setState({ code: e.target.value });
	};

	createCourt = () => {
		// fetch("http://localhost:4000/courts/new").catch(err =>
		// 	console.error(err)
		// );
		fetch("http://localhost:4000/courts/new")
			.catch(err => console.error(err))
			.then(
				response => {
					console.log(response);
					response.json();
				}
				//this.setState({ code: response });
			)
			.then(response => {
				console.log(response.code);
				this.setState({ code: response.code });
				this.setState({ redirect: true });
			});

		// fetch("http://localhost:4000/courts")
		// 	.then(response => response.json())
		// 	.then(response => this.setState({ courts: response.data }))
		// 	.catch(err => console.error(err));
	};

	onSubmit = () => {
		this.props.submit(this.state.code);
	};

	render() {
		const { redirect } = this.state;

		if (redirect) {
			return (
				<Redirect
					to={{
						pathname: "/court",
						code: this.state.code
					}}
				/>
			);
		}

		return (
			<div>
				<div>
					<button onClick={this.createCourt}>Create a court</button>
				</div>
				<div>
					<form>
						<label>
							Your access code:{" "}
							<input type="text" onChange={this.onChange} />
						</label>
						<Link
							to={{
								pathname: "/join/" + this.state.code
							}}
						>
							<input type="submit" value="submit" />
						</Link>
					</form>
				</div>
			</div>
		);
	}
}

export default HomePage;
