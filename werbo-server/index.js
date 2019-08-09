require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(express.json());

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const SELECT_ALL_COURTS_QUERY = "SELECT * FROM TB_COURTS";
const GET_ALL_CODES = "SELECT access_code FROM TB_COURTS";
const FIND_EXISITNG_COURT =
	"SELECT access_code,team1,team2 FROM TB_COURTS WHERE access_code= ?";
const INCREMENT_EXISTING_COURT =
	"UPDATE TB_COURTS SET team? = team? + 1 WHERE access_code = ? AND team? < 9999";
const DECREMENT_EXISTING_COURT =
	"UPDATE TB_COURTS SET team? = team? - 1 WHERE access_code = ? AND team? > 0";

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_SCHEMA
});

connection.connect(err => {
	if (err) {
		console.log(err);
		return err;
	}
	console.log("connected to mysql database.");
});

//TODO: return error message if no results is returned
app.get("/court/:access_code", (req, res) => {
	connection.query(
		FIND_EXISITNG_COURT,
		req.params.access_code,
		(err, results) => {
			if (err) {
				return res.send(err);
			} else {
				return res.json({
					data: results
				});
			}
		}
	);
});

//operation: increase/decrease/resetAll
app.post("/court/update", (req, res) => {
	var fields = [
		req.body.team_number,
		req.body.team_number,
		req.body.access_code,
		req.body.team_number
	];

	if (req.body.operation === "increase") {
		connection.query(INCREMENT_EXISTING_COURT, fields, (err, results) => {
			if (err) {
				console.log(err);
				res.end();
			} else {
				res.end();
			}
		});
	}
	if (req.body.operation === "decrease") {
		connection.query(DECREMENT_EXISTING_COURT, fields, (err, results) => {
			if (err) {
				console.log(err);
				res.end();
			} else {
				res.end();
			}
		});
	}

	//let sockets belonging to a certain room know to refresh
	io.in(req.body.access_code).emit("Refresh");
	res.end();
});

app.get("/courts/new", (req, res) => {
	newCourt().then(result => {
		console.log(result);
		res.send(result);
	});
});

io.on("connection", socket => {
	console.log("client connected");

	socket.on("JoinCourt", access_code => {
		console.log("joined room: " + access_code);
		socket.join(access_code);
	});

	socket.on("LeaveCourt", access_code => {
		console.log("left room: " + access_code);
		socket.leave(access_code);
	});

	socket.on("disconnect", () => {
		console.log("client disconected");
	});
});

server.listen(4000, () => {
	console.log("werbo server listening on port 4000");
});

//sql is capped at 65535 entries
// function generateAccessCode() {
// 	//let random = Math.floor(Math.random() * (+65535 - +4369)) + +4369;

function getCourtByCode(code) {
	return new Promise((resolve, reject) => {
		connection.query(FIND_EXISITNG_COURT, [code], (err, results) => {
			if (err) {
				reject(err);
			} else {
				resolve(results.length);
			}
		});
	});
}

async function generateAccessCode() {
	var random = Math.floor(Math.random() * (+65535 - +4369)) + +4369;
	var code = random.toString(16);

	var hasDupe = false;

	let count = 0;
	try {
		do {
			count = await getCourtByCode(code);
			if (count > 0) {
				random = Math.floor(Math.random() * (+65535 - +4369)) + +4369;
				code = random.toString(16);

				hasDupe = true;
			} else {
				hasDupe = false;
			}
		} while (hasDupe);

		return code;
	} catch (e) {
		throw e;
	}
}

//TODO- make sure error message returns when database is capped
function insertCourt(code) {
	return new Promise((resolve, reject) => {
		const INSERT_COURTS_QUERY = `INSERT INTO TB_COURTS (access_code,team1,team2) VALUES ('${code}', 0, 0)`;

		connection.query(INSERT_COURTS_QUERY, (err, results) => {
			if (err) {
				reject(err);
			} else {
				resolve(code);
			}
		});
	});
}

async function newCourt() {
	code = await generateAccessCode();
	return await insertCourt(code);
}

// app.get("/courts", (req, res) => {
// 	connection.query(SELECT_ALL_COURTS_QUERY, (err, results) => {
// 		if (err) {
// 			return res.send(err);
// 		} else {
// 			console.log(results);
// 			res.send(results);
// 			// return res.json({
// 			// 	data: results
// 			// });
// 		}
// 	});
// });
