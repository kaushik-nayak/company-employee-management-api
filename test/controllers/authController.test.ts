import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../src/models/user';
import { signup, login } from '../../src/controllers/authController';
import { mockRequest, mockResponse } from './mocks/express';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../src/models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Signup', () => {
    it('should create a new user and return a token', async () => {
      const req = mockRequest({ body: { username: 'testuser', password: 'password123', role: 'admin' } });
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue(null); // Simulate no existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (User.prototype.save as jest.Mock).mockResolvedValue(undefined);
      (jwt.sign as jest.Mock).mockReturnValue('mocked_token');

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        token: 'mocked_token'
      });
    });

    it('should return 400 if username is already taken', async () => {
      const req = mockRequest({ body: { username: 'testuser', password: 'password123', role: 'user' } });
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue({} as any); // Simulate existing user

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Username is already taken' });
    });

    it('should return 500 on server error', async () => {
      const req = mockRequest({ body: { username: 'testuser', password: 'password123', role: 'user' } });
      const res = mockResponse();

      (User.findOne as jest.Mock).mockRejectedValue(new Error('Server error'));

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });

  });

  describe('Login', () => {
    it('should return a token for valid credentials', async () => {
      const req = mockRequest({ body: { username: 'testuser', password: 'password123' } });
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue({ _id: 'user_id', password: 'hashed_password', role: 'user' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mocked_token');

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'mocked_token' });
    });

    it('should return 401 for invalid credentials', async () => {
      const req = mockRequest({ body: { username: 'testuser', password: 'wrongpassword' } });
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue({ _id: 'user_id', password: 'hashed_password', role: 'user' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 401 if the user does not exist', async () => {
      const req = mockRequest({ body: { username: 'nonexistentuser', password: 'password123' } });
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 500 on server error', async () => {
      const req = mockRequest({ body: { username: 'testuser', password: 'password123' } });
      const res = mockResponse();

      (User.findOne as jest.Mock).mockRejectedValue(new Error('Server error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });
});
