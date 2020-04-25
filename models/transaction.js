// import mongoose
const mongoose = require("mongoose");

// create Schema object from mongoose
const Schema = mongoose.Schema;

// START define transactionSchema
const transactionSchema = new Schema(
  {
    // define name key
    name: {
      type: String,
      trim: true,
      required: "Enter a name for transaction"
    },
    // define value key
    value: {
      type: Number,
      required: "Enter an amount"
    },
    // define date key
    date: {
      type: Date,
      default: Date.now
    }
  }
);
// END define transactionSchema

// create Transaction model from mongoose and schema
const Transaction = mongoose.model("Transaction", transactionSchema);

// exposrt Transaction model
module.exports = Transaction;
