import ApiError from '../utilities/ApiError.js'

import {createDepartment, getDepartments, getDepartmentById,
  updateDepartment, 
  deleteDepartments,
  deleteDepartmentById
}from '../Services/departments.service.js';

async function CreateDepartment(req, res) {
  const createdDep = await createDepartment(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Department created successfully',
    data: createdDep
  });
}

async function GetAllDepartments(req, res) {
  let alldeps = await getDepartments(req.query)
  res.status(200).json(alldeps);
}

async function GetDepartment(req, res) {
  const matched = await getDepartmentById(req.params.id)
  if (!matched) throw new ApiError('Department not found', 404);
  res.status(200).json(matched);
}

async function UpdateDepartment(req, res) {
  const target = await updateDepartment(req.params.id, req.body)
  if (!target) throw new ApiError('Department not found', 404);
  if (error.code === 11000) {
    throw new ApiError('Department number is already exist', 409)
  }
  res.status(200).json(target);
}

async function DeleteDepartments(req, res){
  const alldeleted = await deleteDepartments();
  res.status(200).json(alldeleted)
}

async function DeleteOneDepartment(req, res) {
  const deletedOne = await deleteDepartmentById(req.params.id);    
  if (!deletedOne) throw new ApiError('Department not found', 404);
  res.status(200).json({ 
    status: 'success',
    message: 'Department deleted successfully', 
    department: deletedOne 
  });
}


export {
  CreateDepartment, 
  GetAllDepartments, 
  GetDepartment, 
  UpdateDepartment,
  DeleteDepartments,
  DeleteOneDepartment
};