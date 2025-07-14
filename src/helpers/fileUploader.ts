import fs from "node:fs";
import path from "node:path";
import type { UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { config } from "@/config/index.js";

cloudinary.config({
	cloud_name: config.cloudinaryCloudName,
	api_key: config.cloudinaryApiKey,
	api_secret: config.cloudinaryApiSecret,
	secure: true,
});

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), "/uploads")),
	filename: (_req, file, cb) => cb(null, file.originalname),
});
const multerUpload = multer({ storage });

const uploadToServer = () => multerUpload.single("file");

const uploadToCloudinary = async (file: Express.Multer.File): Promise<UploadApiResponse> => {
	try {
		const result = await cloudinary.uploader.upload(file.path, {
			public_id: file.originalname,
		});
		return result;
	} catch (error) {
		console.error("Cloudinary upload failed:", error);
		throw error;
	} finally {
		fs.unlinkSync(file.path);
	}
};

export const fileUploader = {
	uploadToServer,
	uploadToCloudinary,
};
