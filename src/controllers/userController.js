import { findAllUser } from "../services/userService.js"
import { errorResponse, successResponse } from "../utils/returnResponse.js"

export const getUser = async (req, res) => {
    if (req.role !== "boss") {
        errorResponse(res, 400, "Bạn không có quyền thực hiện")
    }

    try {
        const user = await findAllUser()
        successResponse(res, 200, user, "Lấy danh sách nhân viên thành công")
    } catch (error) {
        errorResponse(res, 500, "Có lỗi xảy ra")
    }

} 