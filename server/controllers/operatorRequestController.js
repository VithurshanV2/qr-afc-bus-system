import { sendOperatorRequestReceived } from '../emails/index.js';
import {
  createOperatorRequest,
  existingRegisteredBus,
  existingRequestByEmail,
} from '../models/operatorRequestModel.js';

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
    !permitFile ||
    !insuranceFile
  ) {
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

  if (!isNicValid(nic)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid NIC number' });
  }

  if (!Array.isArray(buses) || buses.length === 0) {
    return res
      .status(400)
      .json({ success: false, menubar: 'At least one bus must be provided' });
  }

  for (let i = 0; i < buses.length; i++) {
    const bus = buses[i];

    if (
      !bus.registrationNumber ||
      !bus.routeName ||
      !bus.routeNumber ||
      !bus.busType
    ) {
      return res.status(400).json({
        success: false,
        message: `Bus ${i + 1} has missing required fields`,
      });
    }
  }

  try {
    const exitingRequest = await existingRequestByEmail(email);

    if (exitingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Account request is already pending for this email',
      });
    }

    const registrationNumber = buses.map((bus) =>
      bus.registrationNumber.toUpperCase(),
    );

    const duplicateBuses = await existingRegisteredBus(registrationNumber);

    if (duplicateBuses.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bus has been already registered to the system',
      });
    }

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
