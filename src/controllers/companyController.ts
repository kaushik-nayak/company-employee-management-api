import { Request, Response } from 'express';
import companyService from '../services/companyService';

export const createCompany = async (req: Request, res: Response) => {
  try {
    const company = await companyService.createCompany(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const company = await companyService.updateCompany(code, req.body);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const company = await companyService.getCompany(code);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error });
  }
};
