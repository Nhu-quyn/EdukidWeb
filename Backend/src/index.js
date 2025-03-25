const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes");
const cors = require("cors");
const admin = require("firebase-admin");

// Khởi tạo Firebase Admin
const serviceAccount = require("./project1-22f97-firebase-adminsdk-fbsvc-35b1c5ada3.json"); // File tải từ Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const port = process.env.PORT || 3001;

dotenv.config();
const app = express();

app.use(cors());
// app.use(cors());
app.use(express.json({ limit: "50mb" })); // Tăng giới hạn payload
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Tăng giới hạn cho form data

app.use(bodyParser.json());
routes(app);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect to Mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
