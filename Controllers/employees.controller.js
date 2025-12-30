import ApiError from '../utilities/ApiError.js';
import asyncHandler from '../utilities/asyncHandler.js';  // ✅ Import the wrapper
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployeeById
} from '../Services/employees.service.js';

// ✅ Wrap each controller function with asyncHandler
const createEmp = asyncHandler(async (req, res, next) => {
  const employee = await createEmployee(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Employee created successfully',
    data: employee
  });
});

const GetAllEmps = asyncHandler(async (req, res, next) => {
  const allEmployees = await getEmployees(req.query);
  res.status(200).json(allEmployees);
});

const GetEmp = asyncHandler(async (req, res, next) => {
  const matched = await getEmployeeById(req.params.id);
  if (!matched) throw new ApiError('Employee not found', 404);
  res.status(200).json(matched);
});

const updateEmp = asyncHandler(async (req, res, next) => {
  const target = await updateEmployee(req.params.id, req.body);
  if (!target) throw new ApiError('Employee not found', 404);
  res.status(200).json(target);
});

const deleteEmp = asyncHandler(async (req, res, next) => {
  const deletedOne = await deleteEmployeeById(req.params.id);
  if (!deletedOne) throw new ApiError('Employee not found', 404);
  res.status(200).json({
    status: 'success',
    message: 'Employee deleted successfully',
    employee: deletedOne
  });
});

export {
  createEmp,
  GetAllEmps,
  GetEmp,
  updateEmp,
  deleteEmp
};