import { Router } from 'express';
import {
  createCompany,
  updateCompany,
  getCompany
} from './controllers/companyController';
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployee,
  listSubordinates,
  getReportingManager
} from './controllers/employeeController';
import { login } from './controllers/authController';
import authMiddleware from './middlewares/authMiddleware';

const router = Router();

router.post('/login', login);

router.post('/companies', authMiddleware, createCompany);
router.put('/companies/:code', authMiddleware, updateCompany);
router.get('/companies/:code', authMiddleware, getCompany);

router.post('/employees', authMiddleware, createEmployee);
router.put('/employees/:id', authMiddleware, updateEmployee);
router.delete('/employees/:id', authMiddleware, deleteEmployee);
router.get('/employees/search', authMiddleware, searchEmployee);
router.get('/employees/:id/subordinates', authMiddleware, listSubordinates);
router.get('/employees/:id/manager', authMiddleware, getReportingManager);

export default router;
