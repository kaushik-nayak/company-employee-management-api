import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  phone: string;
  companyCode: string;
  reportingManagerId: string;
}

const EmployeeSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  companyCode: { type: String, required: true },
  reportingManagerId: { type: Schema.Types.ObjectId, ref: 'Employee' }
});

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
