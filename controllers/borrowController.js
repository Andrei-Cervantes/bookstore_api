import { BorrowRequest } from "../models/borrowRequestModel.js";
import { errorResponse, successResponse } from "../utils/formatResponse.js";

const borrowController = () => {
  const createBorrowRequest = async (req, res) => {};

  const getUserBorrowRequests = async (req, res) => {};

  const returnBorrowRequest = async (req, res) => {};

  const getAllBorrowRequests = async (req, res) => {};

  const approveBorrowRequest = async (req, res) => {};

  const rejectBorrowRequest = async (req, res) => {};

  return {
    createBorrowRequest,
    getUserBorrowRequests,
    returnBorrowRequest,
    getAllBorrowRequests,
    approveBorrowRequest,
    rejectBorrowRequest,
  };
};

export default borrowController;
