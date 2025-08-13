// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const taskSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   isPinned: {
//     type: Boolean,
//     default: false,
//   },
//   userId: {
//     type: String,
//     required: true,
//   },
//   createdOn: {
//     type: Date,
//     default: new Date().getTime(),
//   },
// });

// module.exports = mongoose.model("Task", taskSchema);


const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: new Date().getTime(),
  },
});

module.exports = mongoose.model("Task", taskSchema);
