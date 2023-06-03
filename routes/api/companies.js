const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/companyController');

module.exports = function() {
    console.log("router called");
   
    // Attach route handlers to the router here.
    router.get('/:jobTitle', companyController.jobTitleQuery);
    // router.get('/:id', companyController.getCompany);

    // Return the router.
    return router;
};
