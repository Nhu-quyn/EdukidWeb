const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new mongoose.Schema(
  {
    // categoryId: {
    //   type: Number,
    //   required: true,
    // },
    categoryName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
