var router = require('express').Router();


var returnRouter = function(io){

    router.get('/',(req,res) =>{
        res.send({msg: 'server is up and running'})
    });
    
    router.use(require('./court')(io));
    
    //catch all
    router.all('*',(req,res)=>{
        res.status(404).send({msg:'not found'});
    });

    return router;
}

module.exports = returnRouter;
