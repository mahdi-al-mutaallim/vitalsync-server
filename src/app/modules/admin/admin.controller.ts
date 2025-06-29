import type { RequestHandler } from "express";
import { AdminServices } from "./admin.service";

const pick = (obj, keys) => {
  const finalObject = {};
  for (const key of keys) {
    if(obj && Object.hasOwn(obj, key)){
      finalObject[key] = obj[key]
    }
  }
  console.log(finalObject)
}

const getAdmins: RequestHandler = async (req, res) => {
	try {
    const filters = pick(req.query, ['name', 'email', 'search', 'contactNo'])
		const result = await AdminServices.getAdmins(filters);
		if (result.length === 0) {
			res.status(204).json({
				status: "success",
				message: "No administrators found.",
				data: [],
			});
		}
		res.status(200).json({
			status: "success",
			message: "Administrators retrieved successfully!",
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: error?.name || "Something went wrong",
			error,
		});
    return;
	}
};

export const AdminControllers = {
	getAdmins,
};
