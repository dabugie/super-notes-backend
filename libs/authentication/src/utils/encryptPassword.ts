import * as bcrypt from 'bcrypt';

export const encryptPassword = async (password: string): Promise<string> => {
  const saltOrRounds = 10;

  const salt = await bcrypt.genSalt(saltOrRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
