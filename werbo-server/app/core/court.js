const mysql = require("mysql");

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
    
    
//joins a court with access code
function joinCourt(access_code){
    return new Promise((resolve,reject) => {
        connection.query(
            FIND_EXISITNG_COURT,
            access_code,
            (err,results) => {
                if(err){
                    return reject(err);
                }
                else{
                    resolve(results);
                }
            }
        )
    });
}

//updates court using specified court, team, and operation
function updateCourt(req){
    var fields = [
        req.body.team_number,
        req.body.team_number,
        req.body.access_code,
        req.body.team_number
    ];

    return new Promise((resolve, reject) => {
        if (req.body.operation === "increase") {
            connection.query(INCREMENT_EXISTING_COURT, fields, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        }
        if (req.body.operation === "decrease") {
            connection.query(DECREMENT_EXISTING_COURT, fields, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        }
    });
}

//creates new court by generating unique access code and then inserting it into db
async function newCourt() {
    code = await generateAccessCode();
    return await insertCourt(code);
}

//sql is capped at 65535 entries
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

//TODO- make sure error message returns when database is capped
function insertCourt(code) {
    return new Promise((resolve, reject) => {
        let INSERT_COURTS_QUERY = `INSERT INTO TB_COURTS (access_code,team1,team2) VALUES ('${code}', 0, 0)`;

        connection.query(INSERT_COURTS_QUERY, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(code);
            }
        });
    });
}

module.exports = {
    newCourt,
    joinCourt,
    updateCourt
}



