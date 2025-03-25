const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const topicSchema = new mongoose.Schema(
  {
    // topicId: {
    //   type: Number,
    //   required: true,
    // },
    topicName: {
      type: String,
      required: true,
    },
    topicVietnamese: {
      type: String,
      required: true,
    },
    topicDescription: {
      type: String,
      // required: true,
    },
    topicImage: {
      type: String,
      required: true,
    },
    topicVideo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
