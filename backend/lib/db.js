import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Ensures environment variables are loaded

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(` MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(" Error connecting to MongoDB:", error.message);
		process.exit(1); // Exit process with failure
	}
};
