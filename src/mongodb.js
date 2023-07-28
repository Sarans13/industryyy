const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://SaransMishra:SaransIsALearner@industrycluster.hqrm8zx.mongodb.net/IndusAid")
  .then(() => {
    console.log('mongoose connected');
  })
  .catch((e) => {
    console.log(e);
    console.log('failed');
  });

const logInSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  companyname: {
    type: String,
    required: true
  },
  companytype: {
    type: String,
    required: true
  },
  phonenumber: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  problemmentioned: {
    type: String,
    required: false
  },
  color:{
    type :String,
    required:true
  }
});

const StartupCollection = mongoose.model('Startup', logInSchema);
const InvestorCollection = mongoose.model('Investor', logInSchema);

module.exports = {
  StartupCollection,
  InvestorCollection
};
