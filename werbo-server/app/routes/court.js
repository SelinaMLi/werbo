const router = require('express').Router();
const {newCourt,joinCourt,updateCourt} = require('../core/court');

var returnCourtRoutes = function(io){

    //TODO: return error message if no results is returned
    router.get("/court/:access_code", (req, res) => {
        joinCourt(req.params.access_code)
            .then(results => {
                res.json({data:results});
            });
    });

    //operation: increase/decrease/resetAll
    router.post("/court/update", (req, res) => {
        updateCourt(req)
            .then(() => {
                io.in(req.body.access_code).emit("Refresh");
                res.end();
            });
        
    });

    router.get("/courts/new", (req, res) => {
        newCourt().then(result => {
            console.log(result);
            res.send(result);
        });
    });

    return router;
}

module.exports = returnCourtRoutes;