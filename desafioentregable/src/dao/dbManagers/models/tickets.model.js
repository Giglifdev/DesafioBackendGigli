import mongoose from "mongoose";

const ticketsCollection = "tickets";
const ticketsSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now(),
  },
  amount: {
    type: Number,
  },
  purchaser: {
    type: String,
  },
});

export const ticketModel = mongoose.model(ticketsCollection, ticketsSchema);
