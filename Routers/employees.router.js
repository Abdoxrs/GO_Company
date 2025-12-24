import express from 'express';
import { 
  createEmp, 
  GetAllEmps, 
  GetEmp, 
  updateEmp, 
  deleteEmp, 
} from '../Controllers/Emps.controller.js';

const router = express.Router();

router.post('/', createEmp);

router.get('/', GetAllEmps);
router.get('/:id', GetEmp);

router.patch('/:id', updateEmp);

router.delete('/:id', deleteEmp);

export default router;