import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const authenticateUser = async (username: string, password: string) => {
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return { token };
};

export default { authenticateUser };
