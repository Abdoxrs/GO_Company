import express from 'express';
import {
  CreateProject, 
  GetAllProjects, 
  GetProject,
  UpdateProject,
  DeleteProject
} from '../Controllers/projects.controller.js';

const router = express.Router();

router.post('/', CreateProject);

router.get('/', GetAllProjects);
router.get('/:id', GetProject);

router.patch('/:id', UpdateProject);

router.delete('/:id', DeleteProject);

export default router;