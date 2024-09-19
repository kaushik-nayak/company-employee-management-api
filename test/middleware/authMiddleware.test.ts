import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../src/models/user';
import authMiddleware from '../../src/middlewares/authMiddleware';
import { request } from 'http';

jest.mock('jsonwebtoken');
jest.mock('../../src/models/user');

interface AuthenticatedRequest extends Request {
  user?: any; 
}

const mockRequest = (headers = {}, user?: any): Partial<AuthenticatedRequest> => ({
  headers,
  user
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', async () => {
    const req = mockRequest();
    const res = mockResponse();
    await authMiddleware(req as AuthenticatedRequest, res as Response, mockNext as NextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
  });

  it('should return 401 if an invalid token is provided', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });
    const req = mockRequest({ 'authorization': 'Bearer invalidtoken' });
    const res = mockResponse();
    await authMiddleware(req as AuthenticatedRequest, res as Response, mockNext as NextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should return 403 if user is not an admin', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => ({ userId: 'userId' }));
    (User.findById as jest.Mock).mockResolvedValue({ role: 'user' });
    const req = mockRequest({ 'authorization': 'Bearer validtoken' });
    const res = mockResponse();
    await authMiddleware(req as AuthenticatedRequest, res as Response, mockNext as NextFunction);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });
  });

  it('should attach user to req and call next if token is valid and user is admin', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => ({ userId: 'userId' }));
    (User.findById as jest.Mock).mockResolvedValue({ role: 'admin' });
    const req = mockRequest({ 'authorization': 'Bearer validtoken' });
    const res = mockResponse();
    await authMiddleware(req as AuthenticatedRequest, res as Response, mockNext as NextFunction);
    expect(req.user).toBeDefined();
    expect(mockNext).toHaveBeenCalled();
  });
});
