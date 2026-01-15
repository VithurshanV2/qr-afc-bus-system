import { sendAdminActivation } from '../emails/index.js';
import {
  createActivationToken,
  createAdminAccount,
} from '../models/adminModel.js';
import { getUserByEmail } from '../models/userModel.js';
import { v4 as uuidv4 } from 'uuid';

// Email validation
const isEmailValid = (email) => {
  const regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
  return regex.test(email);
};

// Phone number validation
const isPhoneNumberValid = (number) => {
  const regex = /^(?:0|94|\+94)?(7[0-8][0-9]{7})$/;
  return regex.test(number);
};

// Create admin account and send activation
export const createAdminAccountController = async (req, res) => {
  try {
    const { name, email, number } = req.body;

    if (!name || !email || !number) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    if (!isEmailValid(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email address' });
    }

    if (!isPhoneNumberValid(number)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid phone number' });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'User already exists' });
    }

    const newAdmin = await createAdminAccount({ name, email, number });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await createActivationToken({ userId: newAdmin.id, token, expiresAt });

    const activationLink = `${process.env.CLIENT_URL}/activate-account?token=${token}`;

    await sendAdminActivation({
      to: newAdmin.email,
      name: newAdmin.name,
      activationLink,
    });

    return res.status(200).json({
      success: true,
      message: 'Admin account created and activation link sent to email',
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
