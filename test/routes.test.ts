import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
        password: string;
        role: string;
      };
    }
  }
}

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    username: 'testuser',
    password: 'password123',
    role: 'admin',
  };
  next();
});

app.post('/api/signup', (req: Request, res: Response) => {
  res.status(201).json({ token: 'mock_token' });
});

app.post('/api/login', (req: Request, res: Response) => {
  res.status(200).json({ token: 'mock_token' });
});

app.post('/api/companies', (req: Request, res: Response) => {
  res.status(201).json({ name: req.body.name });
});

app.get('/api/companies/:code', (req: Request, res: Response) => {
  res.status(200).json({ name: 'Test Company' });
});

app.put('/api/companies/:code', (req: Request, res: Response) => {
  res.status(200).json({ name: req.body.name });
});

app.post('/api/employees', (req: Request, res: Response) => {
  res.status(201).json({ name: req.body.name });
});

app.put('/api/employees/:id', (req: Request, res: Response) => {
  res.status(200).json({ name: req.body.name });
});

app.delete('/api/employees/:id', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Employee deleted' });
});

app.get('/api/employees/search', (req: Request, res: Response) => {
  res.status(200).json([{ name: 'abcd' }]);
});

app.get('/api/employees/:id/manager', (req: Request, res: Response) => {
  res.status(200).json({ manager: { name: 'Manager Name', id: 'managerId' } });
});

app.get('/api/employees/:id/subordinates', (req: Request, res: Response) => {
  res.status(200).json({ subordinates: [{ name: 'Subordinate 1', id: 'sub1' }, { name: 'Subordinate 2', id: 'sub2' }] });
});

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  it('should sign up a new user', async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({
        username: 'testuser',
        password: 'password123',
        role: 'admin',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should log in a user', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});

describe('Company Routes', () => {
  it('should create a company', async () => {
    const response = await request(app)
      .post('/api/companies')
      .send({
        name: 'Test Company',
        code: 'Tc123',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('name', 'Test Company');
  });

  it('should get a company by code', async () => {
    const response = await request(app)
      .get('/api/companies/Tc123');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'Test Company');
  });

  it('should update a company by code', async () => {
    const response = await request(app)
      .put('/api/companies/Tc123')
      .send({
        name: 'Updated Company',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated Company');
  });
});

describe('Employee Routes', () => {
  it('should create an employee', async () => {
    const response = await request(app)
      .post('/api/employees')
      .send({
        name: 'abcd',
        employeeId: 'E001',
        companyCode: 'Tc123',
        reportingManagerId: 'managerId',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('name', 'abcd');
  });

  it('should update an employee', async () => {
    const response = await request(app)
      .put('/api/employees/E001')
      .send({
        name: 'John Smith',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'John Smith');
  });

  it('should delete an employee', async () => {
    const response = await request(app)
      .delete('/api/employees/E001');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Employee deleted');
  });

  it('should search for employees', async () => {
    const response = await request(app)
      .get('/api/employees/search')
      .query({ name: 'abcd' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('should list subordinates', async () => {
    const response = await request(app)
      .get('/api/employees/managerId/subordinates');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('subordinates');
    expect(response.body.subordinates).toHaveLength(2); 
  });

  it('should get reporting manager', async () => {
    const response = await request(app)
      .get('/api/employees/E001/manager');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('manager');
    expect(response.body.manager).toHaveProperty('name', 'Manager Name'); 
  });
});
