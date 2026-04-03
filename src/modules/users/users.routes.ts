import express from 'express';
import authenticate from '../../middleware/authenticate';
import authorize from '../../middleware/authorize';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from './users.controller';

const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;