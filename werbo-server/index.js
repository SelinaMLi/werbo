const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

const SELECT_ALL_COURTS_QUERY = "SELECT * FROM courts";
const GET_ALL_CODES = "SELECT access_code FROM courts";
const FIND_EXISITNG_COURT =
	"SELECT access_code,team1,team2 FROM courts WHERE access_code= ?";

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: "werbo"
});

connection.connect(err => {
	if (err) {
		return err;
	}
});

app.use(cors());

app.get("/", (req, res) => {
	res.send("go to /courts to see courts");
});

app.get("/join", (req, res) => {
	const { access_code } = req.query;
	console.log(access_code);

	// connection.query(SELECT_ALL_COURTS_QUERY, (err, results) => {
	// 	if (err) {
	// 		return res.send(err);
	// 	} else {
	// 		return res.json({
	// 			data: results
	// 		});
	// 	}
	// });
});

app.get("/courts/new", (req, res) => {
	newCourt().then(result => {
		console.log(result);
		return res.json({ code: result });
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
