import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "access denied. No token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired token" });
  }
};
export default verifyToken;