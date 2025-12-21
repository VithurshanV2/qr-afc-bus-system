import {
  sendOperatorAccountApproved,
  sendOperatorAccountReject,
  sendOperatorRequestReceived,
} from '../emails/index.js';
import {
  approveRequest,
  countOperatorRequests,
  createActivationToken,
  createBusesForOperator,
  createBusOperator,
  createOperatorRequest,
  createUser,
  existingRegisteredBus,
  existingRequestByEmail,
  getOperatorRequestList,
  rejectRequest,
} from '../models/operatorRequestModel.js';
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
      .json({ success: false, message: 'At least one bus must be provided' });
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
        message: `Bus ${duplicateBuses.map((bus) => bus.registrationNumber).join(', ')} has been already registered to the system`,
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

// Search operator requests form
export const searchOperatorRequests = async (req, res) => {
  try {
    const { search = '', status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const requests = await getOperatorRequestList({
      search,
      status,
      skip,
      take,
    });
    const total = await countOperatorRequests({ search, status });

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      requests,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Approve operator account requests
export const approveOperatorRequest = async (req, res) => {
  try {
    const { requestId, remarks } = req.body;

    const request = await approveRequest({ requestId, remarks });

    // create user account
    const newUser = await createUser({
      name: request.name,
      email: request.email,
      role: 'BUSOPERATOR',
    });

    // create BusOperator account
    const operator = await createBusOperator({ userId: newUser.id });

    // Add buses to bus model
    await createBusesForOperator({
      operatorId: operator.id,
      buses: request.buses,
    });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await createActivationToken({ userId: newUser.id, token, expiresAt });

    const activationLink = `${process.env.FRONTEND_URL}/activate-account?token=${token}`;

    await sendOperatorAccountApproved({
      to: newUser.email,
      name: newUser.name,
      activationLink,
    });

    return res.status(200).json({
      success: true,
      message: 'Request approved and activation link sent to email',
      request,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// Reject operator account requests
export const rejectOperatorRequest = async (req, res) => {
  try {
    const { requestId, remarks } = req.body;

    const request = await rejectRequest({ requestId, remarks });

    await sendOperatorAccountReject({
      to: request.email,
      name: request.name,
      remarks,
    });

    return res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      request,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};
