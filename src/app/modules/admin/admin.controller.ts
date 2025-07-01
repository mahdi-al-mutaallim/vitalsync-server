import type { RequestHandler } from "express";
import pick from "shared/pick";
import { admin_query_fields } from "./admin.constant";
import { AdminServices } from "./admin.service";

const getAdmins: RequestHandler = async (req, res) => {
  try {
    const filters = pick(req.query, admin_query_fields);
    const options = pick(req.query, ['limit', 'page', 'sort', 'order'])
    const result = await AdminServices.getAdmins(filters, options);
    if (result.length === 0) {
      res.status(200).json({
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
