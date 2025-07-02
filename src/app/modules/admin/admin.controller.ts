import send_response from "@shared/send-response";
import type { RequestHandler } from "express";
import pick from "shared/pick";
import { admin_query_fields } from "./admin.constant";
import { AdminServices } from "./admin.service";
import httpStatus from "http-status";

const getAdmins: RequestHandler = async (req, res) => {
  try {
    const filters = pick(req.query, admin_query_fields);
    const options = pick(req.query, ["limit", "page", "sort", "order"]);
    const result = await AdminServices.getAdmins(filters, options);
    if (result.data.length === 0) {
      send_response(res, {
        code: httpStatus.OK,
        status: "success",
        message: "No administrators found.",
        meta: result.meta,
        data: result.data,
      });
    }
    send_response(res, {
      code: httpStatus.OK,
      status: "success",
      message: "Administrators retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error?.name || "Something went wrong",
      error,
    });
  }
};

const getAdminById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.getAdminById(id as string);
    send_response(res, {
      code: httpStatus.OK,
      status: "success",
      message: "Administrator retrieved successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error?.name || "Something went wrong",
      error,
    });
  }
};

const updateAdminIntoDB: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.updateAdminIntoDB(
      id as string,
      req.body,
    );
    send_response(res, {
      code: httpStatus.OK,
      status: "success",
      message: "Administrator updated successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error?.name || "Something went wrong",
      error,
    });
  }
};

const deleteAdminFromDB: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.deleteAdminFromDB(id as string);
    send_response(res, {
      code: httpStatus.OK,
      status: "success",
      message: "Administrator deleted successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error?.name || "Something went wrong",
      error,
    });
  }
};

const softDeleteAdminFromDB: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.softDeleteFromDB(id as string);
    send_response(res, {
      code: httpStatus.OK,
      status: "success",
      message: "Administrator deleted successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error?.name || "Something went wrong",
      error,
    });
  }
};

export const AdminControllers = {
  getAdmins,
  getAdminById,
  updateAdminIntoDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
};
