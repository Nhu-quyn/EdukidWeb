// const ActivityService = require("../services/ActivityService");
// const createCategory = async (req, res) => {
//   try {
//     const { categoryName } = req.body;

//     if (!categoryName) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The input is required",
//       });
//     }

//     const result = await ActivityService.createCategory(req.body);
//     return res.status(200).json(result);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };
// const createActivity = async (req, res) => {
//   try {
//     const { activityName, testTime, categoryId, questionIds } = req.body;

//     if (!categoryId || !activityName) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The input is required",
//       });
//     }
//     const result = await ActivityService.createActivity(req.body);
//     return res.status(200).json(result);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };
// const updateActivity = async (req, res) => {
//   try {
//     const data = req.body;
//     const activityId = req.params.id;

//     if (!activityId) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The activityId is required",
//       });
//     }
//     // Kiểm tra dữ liệu đầu vào
//     if (!Object.keys(data).length) {
//       return res.status(400).json({
//         status: "ERR",
//         message: "No data provided for update",
//       });
//     }

//     const result = await ActivityService.updateActivity(activityId, data);
//     return res.status(200).json(result);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };
// const deleteActivity = async (req, res) => {
//   try {
//     const activityId = req.params.id;

//     if (!activityId) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The activityId is required",
//       });
//     }
//     const result = await ActivityService.deleteActivity(activityId);
//     return res.status(200).json(result);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };
// module.exports = {
//   createCategory,
//   createActivity,
//   updateActivity,
//   deleteActivity,
// };

// khởi tạo bảng xếp hạng?\
// xep hang (categoryId, userId)  trong day tinh score và hang

// neu da co => so sanh nguoi truoc va sau de sap lai hanghang
