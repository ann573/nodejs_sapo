import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const checkUser = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res
      .status(401)
      .json({ message: "Cần đăng nhập (Authorization header missing)" });
  }

  const parts = authorizationHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ message: "Token không hợp lệ (Malformed authorization header)" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

    req.role = decoded.role;
    req.name = decoded.name;
    req.id = decoded._id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token hết hạn" });
    } else {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }
  }
};
