require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

const SELECT_ALL_COURTS_QUERY = "SELECT * FROM courts";
const GET_ALL_CODES = "SELECT access_code FROM courts";
const FIND_EXISITNG_COURT =
	"SELECT access_code,team1,team2 FROM courts WHERE access_code= ?";
const UPDATE_EXISTING_COURT = "";

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: "werbo"
});

connection.connect(err => {
	if (err) {
		console.log(err);
		return err;
	}
	console.log("connected!");
});

app.use(cors());
app.use(express.json());

app.get("/court/:access_code", (req, res) => {
	console.log(req.params.access_code);

	connection.query(
		FIND_EXISITNG_COURT,
		req.params.access_code,
		(err, results) => {
			if (err) {
				return res.send(err);
			} else {
				console.log(results);
				return res.json({
					data: results
				});
			}
		}
	);
});

app.post("/court/update", (req, res) => {
	console.log(req.body);
	res.end();
});

app.get("/courts/new", (req, res) => {
	newCourt().then(result => {
		console.log(result);
		res.send(result);
	});
});

app.listen(4000, () => {
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
		const INSERT_COURTS_QUERY = `INSERT INTO courts (access_code,team1,team2) VALUES ('${code}', 0, 0)`;

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
