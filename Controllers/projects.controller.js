import ApiError from '../utilities/ApiError.js';
import asyncHandler from '../utilities/asyncHandler.js';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProjectById
} from '../Services/projects.service.js';

const CreateProject = asyncHandler(async (req, res, next) => {
  const project = await createProject(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Project created successfully',
    data: project
  });
});

const GetAllProjects = asyncHandler(async (req, res, next) => {
  const allProjects = await getProjects(req.query);
  res.status(200).json(allProjects);
});

const GetProject = asyncHandler(async (req, res, next) => {
  const matched = await getProjectById(req.params.id);
  if (!matched) throw new ApiError('Project not found', 404);
  res.status(200).json(matched);
});

const UpdateProject = asyncHandler(async (req, res, next) => {
  const target = await updateProject(req.params.id, req.body);
  if (!target) throw new ApiError('Project not found', 404);
  res.status(200).json(target);
});

const DeleteProject = asyncHandler(async (req, res, next) => {
  const deletedOne = await deleteProjectById(req.params.id);
  if (!deletedOne) throw new ApiError('Project not found', 404);
  res.status(200).json({
    status: 'success',
    message: 'Project deleted successfully',
    project: deletedOne
  });
});

export {
  CreateProject,
  GetAllProjects,
  GetProject,
  UpdateProject,
  DeleteProject
};