import { Request, Response } from 'express';
import { createCompany, updateCompany, getCompany } from '../../src/controllers/companyController';
import companyService from '../../src/services/companyService';
import { mockRequest, mockResponse } from './mocks/express';

jest.mock('../../src/services/companyService');

describe('Company Controller', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('createCompany', () => {
    it('should create a company and return status 201', async () => {
      const mockCompany = { code: 'C123', name: 'Test Company' };
      req.body = mockCompany;
      (companyService.createCompany as jest.Mock).mockResolvedValue(mockCompany);

      await createCompany(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCompany);
    });

    it('should return status 500 when there is an error', async () => {
      const errorMessage = 'Failed to create company';
      (companyService.createCompany as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await createCompany(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
  });

  describe('updateCompany', () => {
    it('should update a company and return the updated data', async () => {
      const mockCompany = { code: 'C123', name: 'Updated Company' };
      req.params = { code: 'C123' };
      req.body = { name: 'Updated Company' };
      (companyService.updateCompany as jest.Mock).mockResolvedValue(mockCompany);

      await updateCompany(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCompany);
    });

    it('should return status 500 when there is an error', async () => {
      const errorMessage = 'Failed to update company';
      req.params = { code: 'C123' };
      (companyService.updateCompany as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await updateCompany(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
  });

  describe('getCompany', () => {
    it('should return a company by its code', async () => {
      const mockCompany = { code: 'C123', name: 'Test Company' };
      req.params = { code: 'C123' };
      (companyService.getCompany as jest.Mock).mockResolvedValue(mockCompany);

      await getCompany(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCompany);
    });

    it('should return status 500 when there is an error', async () => {
      const errorMessage = 'Failed to get company';
      req.params = { code: 'C123' };
      (companyService.getCompany as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await getCompany(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
  });
});
