import * as bcrypt from 'bcrypt';

export const comparePasswords = async (
  password: string,
  recievedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, recievedPassword);
};
