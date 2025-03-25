//thêm category => thêm activity =>

//Chức năng lấy câu hỏi lên game => trộn (dựa vào mức độ ưu tiên,
//  ưu tiên cao *2 lần nếu chưa chơi game học từ vựng-1 lần nữa nếu đã chơi,
//  trung bình 1 lần => 0,5 , thấp nếu đã học rồi thì không xuất hiện nữa)

//Lấy danh sách theo chủ đề => nếu chủ đề chưa hoàn thành, lọc lấy danh sách và thêm mức độ ưu tiên
// => danh sách
//Nếu không có chủ đề đã hoàn thành lấy ngẫu nhiên chủ đề tiếp theo

//Chấm điểm => nếu người dùng có tải khoản sẽ gửi yêu cầu về backend,
//Chưa có tài khoản => lưu vào bộ nhớ tạm hiển thị => Mỗi lần chơi tại front phải reset kết quả

// Ôn tập theo chủ đề, chủ đề có nhiều mức độ
// Test không theo chủ đề, được gọi là đánh giá. Test sẽ ngày bắt đầu và ngày kết thúc
// Test được coi là thử thách cao hơn, được điểm sẽ cao hơn.

//Xếp hạng lấy hết user,
// lấy hết learning process bao gồm activityId và Userid,
// activity lấy được categoryId,
//Lọc danh sách gồm 3 danh sách nhỏ và 1 danh sách tổng,
// + điểm theo người dùng => tiến hành sắp xếp và lưu vào bảng
// Nếu đã có raking => tính lại điểm so sánh người trước và sau

//khi game có liên quan từ vựng khi trả lời xong => gọi hàm updateProgress => neu chua co tao ?

// tinh so cau hoi muc do de tren tu vung (game) neu nguoi dung on tap van tinh
