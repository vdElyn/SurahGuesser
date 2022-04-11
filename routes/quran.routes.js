module.exports = app => {
    const quran = require("../controllers/quran.controller.js");
    var router = require("express").Router();

    /*
    // Retrieve all Verses
    router.get("/", quran.findAll);
    */

    // Retrieve a single Tutorial with id
    router.get("/getVerse/:id", quran.getVerse);

    // Retrieve three choices from a first Id
    router.get("/getChoices/:id", quran.getChoices);
    
    
    app.use('/api/quran', router);
};
