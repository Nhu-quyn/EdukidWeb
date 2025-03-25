// const ProgressVocabService = require("../services/ProgressVocabService");

// const createProgressVocab = async (req, res) => {
//   try {
//     const { userId, vocabularyId, hasLearned, priorityLevel, studyDate } =
//       req.body;

//     if (!userId || !vocabularyId) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The input is required",
//       });
//     }
//     const result = await ProgressVocabService.createProgressVocab(req.body);
//     return res.status(200).json(result);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };
// const updateProgressVocab = async (req, res) => {
//   try {
//     const data = req.body;
//     const progressVocabId = req.params.id;

//     if (!progressVocabId) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "The progressVocabId is required",
//       });
//     }
//     // Kiểm tra dữ liệu đầu vào
//     if (!Object.keys(data).length) {
//       return res.status(400).json({
//         status: "ERR",
//         message: "No data provided for update",
//       });
//     }

//     const result = await ProgressVocabService.updateProgressVocab(
//       progressVocabId,
//       data
//     );
//     return res.status(200).json(result);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };
// // const deleteProgressVocab = async (req, res) => {
// //   try {
// //     const progressVocabId = req.params.id;

// //     if (!progressVocabId) {
// //       return res.status(200).json({
// //         status: "ERR",
// //         message: "The progressVocabId is required",
// //       });
// //     }
// //     const result = await ProgressVocabService.deleteProgressVocab(
// //       progressVocabId
// //     );
// //     return res.status(200).json(result);
// //   } catch (e) {
// //     return res.status(404).json({
// //       message: e,
// //     });
// //   }
// // };

// // khong can tao
// module.exports = {
//   createProgressVocab,
//   updateProgressVocab,
//   // deleteProgressVocab,
// };
