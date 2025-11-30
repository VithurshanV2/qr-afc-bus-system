import { sendOperatorRequestReceived } from '../emails/index.js';
import { createOperatorRequest } from '../models/operatorRequestModel.js';

// Phone number validation
const isPhoneNumberValid = (number) => {
  const regex = /^(?:0|94|\+94)?(7[0-8][0-9]{7})$/;
  return regex.test(number);
};

// NIC validation
const isNicValid = (nic) => {
  const regex = /^(\d{9}[VvXx]|\d{12})/;
  return regex.test(nic);
};

// Create a new bus operator request
export const submitOperatorRequest = async (req, res) => {
  const { name, nic, email, number, address } = req.body;
  const buses = JSON.parse(req.body.buses || '[]');
  const permitFile = req.files?.permit?.[0];
  const insuranceFile = req.files?.insurance?.[0];

  const uploadedDocs = {
    permit: permitFile.filename,
    insurance: insuranceFile.filename,
  };

  if (
    !name ||
    !nic ||
    !email ||
    !number ||
    !address ||
    buses.length === 0 ||
    !permitFile ||
    !insuranceFile
  ) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields' });
  }

  if (!isPhoneNumberValid(number)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid phone number' });
  }

  if (!isNicValid(nic)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid NIC number' });
  }

  try {
    const request = await createOperatorRequest({
      name,
      nic,
      email,
      number,
      address,
      buses,
      uploadedDocs,
    });

    await sendOperatorRequestReceived({ to: email, name });

    return res.status(201).json({
      success: true,
      message: 'Request form submitted successfully',
      request,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
