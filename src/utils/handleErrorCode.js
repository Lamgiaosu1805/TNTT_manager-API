const HandleErrorCode = (errorCode) => {
    switch (errorCode) {
        case "01":
            return "Error:01, Username đã tồn tại";
        case "02":
            return "Error:02, Có lỗi trong quá trình tạo account";
        case "03":
            return "Error:03, User không còn tồn tại";
        case "04":
            return "Error:04, Có lỗi trong quá trình lấy thông tin user";
        case "05":
            return "Error:05, Tên tài khoản không tồn tại";
        case "06":
            return "Error:06, Có lỗi khi login";
        case "07":
            return "Error:07, Sai mật khẩu";
        case "08":
            return "Error:08, Mật khẩu mới không được trùng với mật khẩu cũ";
        case "09":
            return "Error:09, Mật khẩu hiện tại không đúng";
        case "10":
            return "Error:10, Có lỗi trong lúc đổi mật khẩu";
        case "11":
            return "Error:11, Có lỗi khi tạo xứ đoàn và account admin xứ đoàn";
        case "12":
            return "Error:12, Có lỗi khi tạo Ngành";
        case "13":
            return "Error:13, Not Authenticated";
        case "14":
            return "Error:14, Token không hợp lệ";
    
        default:
            return "Error: " + errorCode + ", Lỗi không xác định";
    }
}

//Auth: "01", "02", "05", "06", "07", "08", "09", "13", "14"

//User: "03", "04", "10"

//Xứ Đoàn: "11"

//Ngành: "12"
module.exports = HandleErrorCode