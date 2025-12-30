import express from 'express';
import {
  CreateUser, Login, FindUser
} from '../Controllers/users.controller.js';

const router = express.Router();

router.post('/signup',CreateUser);
router.post('/login',Login);
router.get('/:id',FindUser);


export default router;