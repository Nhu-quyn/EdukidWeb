const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes");
const cors = require("cors");
const admin = require("firebase-admin");

// Khởi tạo Firebase Admin
// const serviceAccount = require("./project1-22f97-firebase-adminsdk-fbsvc-35b1c5ada3.json"); // File tải từ Firebase Console
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key:process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  }),
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
    require("./services/ReminderService");
  })

  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
