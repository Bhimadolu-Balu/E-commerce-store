import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		const { accessToken } = req.cookies;

		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		// Verify token
		const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

		// Fetch user, excluding password
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(401).json({ message: "Unauthorized - User not found" });
		}

		req.user = user; // Attach user to request object
		next(); // Proceed to next middleware

	} catch (error) {
		console.error("Error in protectRoute middleware:", error.message);

		// Handle specific JWT errors
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ message: "Unauthorized - Access token expired" });
		} else if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ message: "Unauthorized - Invalid access token" });
		}

		return res.status(500).json({ message: "Internal server error" });
	}
};

export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};
