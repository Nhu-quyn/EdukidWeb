const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/google-sign-in", userController.loginWithGoogle);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", authMiddleWare, userController.deleteUser);
// router.get("/get-user/:id", authMiddleWare, userController.getUserById);
router.get("/get-user/:id", userController.getUserById);
router.post("/refresh-token", userController.refreshToken);
router.post("/logout", userController.logoutUser);
router.post("/update-learning-progress", userController.updateLearningProgress);
router.get("/leader-board/get-all", userController.getAllLeaderBoard);
module.exports = router;
