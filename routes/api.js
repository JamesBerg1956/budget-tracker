// create instance of router object from express
const router = require("express").Router();

// import Transaction model
const Transaction = require("../models/transaction.js");

// START /api/transaction POST route
router.post("/api/transaction", ({body}, res) => {
  // create new Transaction object from req.body from POST request
  Transaction.create(body)
    // START use new transaction as parameter to callback function
    .then(dbTransaction => {
      // and convert and respond with new transaction in json format
      res.json(dbTransaction);
    })
    // END use new transaction as parameter to callback function
    // START error catching for POST callback function
    .catch(err => {
      // respond with 404 (not found) error in json format
      res.status(404).json(err);
    });
    // END error catching for POST callback function
});
// END /api/transaction POST route

// START /api/transaction/bulk POST route
router.post("/api/transaction/bulk", ({body}, res) => {
  // create multiple Transaction objects from req.body from POST request
  Transaction.insertMany(body)
    // START use new transaction as parameter to callback function
    .then(dbTransaction => {
      // and convert and respond with new transaction in json format
      res.json(dbTransaction);
    })
    // END use new transaction as parameter to callback function
    // START error catching for POST callback function
    .catch(err => {
      // respond with 404 (not found) error in json format
      res.status(404).json(err);
    });
    // END error catching for POST callback function
});
// END /api/transaction/bulk POST route

// START /api/transaction GET route
router.get("/api/transaction", (req, res) => {
  // get all Transaction objects and sort in descending order
  Transaction.find({}).sort({date: -1})
    // START use new transaction as parameter to callback function
    .then(dbTransaction => {
      // and convert and respond with new transaction in json format
      res.json(dbTransaction);
    })
    // END use new transaction as parameter to callback function
    // START error catching for POST callback function
    .catch(err => {
      // respond with 404 (not found) error in json format
      res.status(404).json(err);
    });
    // END error catching for POST callback function
});
// END /api/transaction GET route

// export router
module.exports = router;