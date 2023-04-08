var express = require("express");

var router = express.Router();

router.get("/", function(req,res){
    console.log("hello Im on the home page here");
    //res.render("index");
});

module.exports = router;