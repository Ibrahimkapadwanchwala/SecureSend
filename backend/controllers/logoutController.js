import auditLogEvent from "../services/auditService.js";
const logout =async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
    });
    await auditLogEvent({
      userId: req.user?.userId,
      action:"LOGOUT_SUCCESS",
      ip_address:req.ip
    })
    return res.json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
};

export default logout;
