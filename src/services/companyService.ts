import Company from '../models/company';

const createCompany = async (companyData: any) => {
  const company = new Company(companyData);
  return await company.save();
};

const updateCompany = async (code: string, updateData: any) => {
  return await Company.findOneAndUpdate({ code }, updateData, { new: true });
};

const getCompany = async (code: string) => {
  return await Company.findOne({ code });
};

export default { createCompany, updateCompany, getCompany };
