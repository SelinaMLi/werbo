require("dotenv").config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = require("http").createServer(app);
const io = require("socket.io")(server);

//setting up io and socket for real time score updates
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

const routes = require('./routes')(io);
app.use(routes);

server.listen(4000, () => {
	console.log("werbo server listening on port 4000");
});

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
