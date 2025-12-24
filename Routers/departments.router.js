import express from 'express';
import {
  CreateDepartment, 
  GetAllDepartments, 
  GetDepartment, 
  UpdateDepartment,
  DeleteDepartments,
  DeleteOneDepartment
} from '../Controllers/departments.controller.js';

const router = express.Router();

router.post('/',CreateDepartment);

router.get('/',GetAllDepartments);
router.get('/:id',GetDepartment);

router.patch('/:id',UpdateDepartment);

router.delete('/',DeleteDepartments)
router.delete('/:id',DeleteOneDepartment)

export default router;