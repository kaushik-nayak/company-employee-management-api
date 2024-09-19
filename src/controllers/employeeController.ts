import { Request, Response } from 'express';
import employeeService from '../services/employeeService';
import Employee from '../models/employee';

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.updateEmployee(id, req.body);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.deleteEmployee(id);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const searchEmployee = async (req: Request, res: Response) => {
  try {
    const { name, id, phone } = req.query;
    const employees = await employeeService.searchEmployee({ name, id, phone });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const listSubordinates = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 

    const manager = await Employee.findById(id);

    if (!manager) {
      return res.status(404).json({ error: "Reporting manager not found." });
    }

    const subordinates = await Employee.find({
      reportingManagerId: id,
      companyCode: manager.companyCode 
    });

    if (subordinates.length === 0) {
      return res.status(404).json({ message: "No subordinates found for this manager." });
    }

    return res.status(200).json({ subordinates });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching subordinates." });
  }
};

export const getReportingManager = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const manager = await Employee.findOne({
      _id: employee.reportingManagerId,
      companyCode: employee.companyCode 
    });

    if (manager) {
      return res.status(200).json({ manager });
    } else {
      return res.status(404).json({ error: "Reporting manager not found or companyCode mismatch." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error fetching reporting manager." });
  }
};
