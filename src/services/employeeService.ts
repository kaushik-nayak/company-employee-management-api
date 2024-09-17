import Employee from '../models/employee';
import Company from '../models/company';

const createEmployee = async (employeeData: any) => {
  const company = await Company.findOne({ code: employeeData.companyCode });
  if (!company) throw new Error('Company does not exist');

  const employee = new Employee(employeeData);
  return await employee.save();
};

const updateEmployee = async (id: string, updateData: any) => {
  return await Employee.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteEmployee = async (id: string) => {
  return await Employee.findByIdAndDelete(id);
};

const searchEmployee = async (query: any) => {
  const { name, id, phone } = query;
  const searchCriteria: any = {};
  if (name) searchCriteria.name = new RegExp(name, 'i');
  if (id) searchCriteria._id = id;
  if (phone) searchCriteria.phone = phone;

  return await Employee.find(searchCriteria);
};

const listSubordinates = async (id: string) => {
  return await Employee.find({ reportingManagerId: id });
};

const getReportingManager = async (id: string) => {
  const employee = await Employee.findById(id).populate('reportingManagerId');
  return employee ? employee.reportingManagerId : null;
};

export default { createEmployee, updateEmployee, deleteEmployee, searchEmployee, listSubordinates, getReportingManager };
