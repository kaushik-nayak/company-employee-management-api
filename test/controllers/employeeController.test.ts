import { createEmployee, updateEmployee, deleteEmployee, searchEmployee, listSubordinates, getReportingManager } from '../../src/controllers/employeeController';
import employeeService from '../../src/services/employeeService';
import { mockRequest, mockResponse } from './mocks/mock';
import Employee from '../../src/models/employee';

jest.mock('../../src/services/employeeService');
jest.mock('../../src/models/employee');

describe('EmployeeController', () => {
  
  describe('createEmployee', () => {
    it('should create a new employee and return it', async () => {
      const req = mockRequest({ name: 'abcd', id: '123', companyCode: 'c123' });
      const res = mockResponse();

      (employeeService.createEmployee as jest.Mock).mockResolvedValue({ name: 'abcd', id: '123', companyCode: 'c123' });

      await createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ name: 'abcd', id: '123', companyCode: 'c123' });
    });
  });

  describe('updateEmployee', () => {
    it('should update the employee and return the updated employee', async () => {
      const req = mockRequest({ name: 'abcd' }, { id: '123' });
      const res = mockResponse();

      (employeeService.updateEmployee as jest.Mock).mockResolvedValue({ name: 'abcd', id: '123' });

      await updateEmployee(req, res);

      expect(res.json).toHaveBeenCalledWith({ name: 'abcd', id: '123' });
    });
  });

  describe('deleteEmployee', () => {
    it('should delete the employee and return the result', async () => {
      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      (employeeService.deleteEmployee as jest.Mock).mockResolvedValue({ success: true });

      await deleteEmployee(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('searchEmployee', () => {
    it('should search for employees and return the result', async () => {
      const req = mockRequest({}, {}, { name: 'John', id: '123', phone: '1234567890' });
      const res = mockResponse();

      (employeeService.searchEmployee as jest.Mock).mockResolvedValue([{ name: 'John', id: '123' }]);

      await searchEmployee(req, res);

      expect(res.json).toHaveBeenCalledWith([{ name: 'John', id: '123' }]);
    });
  });

  describe('listSubordinates', () => {
    it('should list all subordinates for a manager', async () => {
      const req = mockRequest({}, { id: 'M001' });
      const res = mockResponse();

      const manager = { _id: 'M001', companyCode: 'c123' };
      const subordinates = [{ name: 'Subordinate 1', reportingManagerId: 'M001' }];

      (Employee.findById as jest.Mock).mockResolvedValue(manager);
      (Employee.find as jest.Mock).mockResolvedValue(subordinates);

      await listSubordinates(req, res);

      expect(res.json).toHaveBeenCalledWith({ subordinates });
    });
  });

  describe('getReportingManager', () => {
    it('should return the reporting manager for an employee', async () => {
      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      const employee = { _id: '123', reportingManagerId: 'M001', companyCode: 'c123' };
      const manager = { _id: 'M001', name: 'Manager', companyCode: 'c123' };

      (Employee.findById as jest.Mock).mockResolvedValue(employee);
      (Employee.findOne as jest.Mock).mockResolvedValue(manager);

      await getReportingManager(req, res);

      expect(res.json).toHaveBeenCalledWith({ manager });
    });
  });
});
