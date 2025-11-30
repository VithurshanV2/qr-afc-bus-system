import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const BusOperatorForm = () => {
  const { backendUrl, globalLoading, setGlobalLoading } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nic, setNic] = useState('');
  const [address, setAddress] = useState('');

  const [buses, setBuses] = useState([
    {
      registrationNumber: '',
      routeName: '',
      routeNumber: '',
      busType: '',
    },
  ]);

  const [permit, setPermit] = useState(null);
  const [insurance, setInsurance] = useState(null);

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    nic: '',
    address: '',
    buses: [{}],
    permit: '',
    insurance: '',
  });

  const isPhoneNumberValid = (number) => {
    const regex = /^(?:0|94|\+94)?(7[0-8][0-9]{7})$/;
    return regex.test(number);
  };

  const isNicValid = (nic) => {
    const regex = /^(\d{9}[VvXx]|\d{12})/;
    return regex.test(nic);
  };

  // File check
  const handleFileChange = (setter, field) => (e) => {
    const file = e.target.files[0];
    const newErrors = { ...errors };

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      newErrors[field] = 'Only PDF files are allowed';
      setErrors(newErrors);
      setter(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      newErrors[field] = 'File size must be less than 5MB';
      setErrors(newErrors);
      setter(null);
      return;
    }

    newErrors[field] = '';
    setErrors(newErrors);
    setter(file);
  };

  // Add, remove and update bus fields
  const addBus = () => {
    setBuses([
      ...buses,
      {
        registrationNumber: '',
        routeName: '',
        routeNumber: '',
        busType: '',
      },
    ]);

    setErrors({ ...errors, buses: [...errors.buses, {}] });
  };

  const removeBus = (index) => {
    const updatedBuses = buses.filter((bus, i) => i !== index);
    setBuses(updatedBuses);

    const updatedErrors = { ...errors };
    updatedErrors.buses = updatedErrors.buses.filter((_, i) => i !== index);
    setBuses(updatedBuses);
  };

  const updateBus = (index, field, value) => {
    const updatedBuses = [...buses];
    updatedBuses[index][field] = value;
    setBuses(updatedBuses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: '',
      email: '',
      phoneNumber: '',
      nic: '',
      address: '',
      buses: [{}],
      permit: '',
      insurance: '',
    };

    let hasError = false;

    if (!fullName) {
      newErrors.fullName = 'Full name is required';
      hasError = true;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
      hasError = true;
    } else if (!isPhoneNumberValid(phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
      hasError = true;
    }

    if (!nic) {
      newErrors.nic = 'NIC number is required';
      hasError = true;
    } else if (!isNicValid(nic)) {
      newErrors.nic = 'Invalid NIC number';
      hasError = true;
    }

    if (!address) {
      newErrors.address = 'Address is required';
      hasError = true;
    }

    buses.forEach((bus, i) => {
      newErrors.buses[i] = {};

      if (!bus.registrationNumber) {
        newErrors.buses[i].registrationNumber = 'Required';
        hasError = true;
      }

      if (!bus.routeName) {
        newErrors.buses[i].routeName = 'Required';
        hasError = true;
      }

      if (!bus.routeNumber) {
        newErrors.buses[i].routeNumber = 'Required';
        hasError = true;
      }

      if (!bus.busType) {
        newErrors.buses[i].busType = 'Bus type is required';
        hasError = true;
      }
    });

    if (permit === null) {
      newErrors.permit = 'Permit document is required';
      hasError = true;
    }

    if (insurance === null) {
      newErrors.insurance = 'Insurance document is required';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setGlobalLoading(true);

      const formData = new window.FormData();
      formData.append('name', fullName);
      formData.append('email', email);
      formData.append('number', phoneNumber);
      formData.append('nic', nic);
      formData.append('address', address);
      formData.append('buses', JSON.stringify(buses));
      formData.append('permit', permit);
      formData.append('insurance', insurance);

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + '/api/operator-requests',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-200 to-orange-400 py-20 px-4">
        <motion.img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="logo"
          className="absolute left-5 sm:left-20 top-5 w-32 sm:w-48 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col justify-center items-center bg-dark-bg p-10 rounded-lg shadow-lg w-full max-w-4xl"
          >
            <h2 className="text-3xl font-bold text-white mb-3 text-center">
              Request Form Submitted Successfully!
            </h2>
            <p className="text-gray-300">
              Thank you for submitting your bus operator account request form.
              The National Transport Commission (NTC) has received your
              application and will review it shortly. You will be notified via
              email once the verification process is complete.
            </p>
            <a href="/" className="mt-6 text-yellow-400 underline text-sm">
              Return to Home page
            </a>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="bg-dark-bg p-10 rounded-lg shadow-lg w-full max-w-4xl text-yellow-300 flex flex-col gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white text-2xl font-semibold text-center mb-6">
              Bus Operator Request Form
            </h2>
            {/* Basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="bg-input-bg w-full px-5 py-2.5 rounded-full mb-1 outline-none"
                />
                {errors.fullName && (
                  <p className="text-red-600 text-sm ml-5">{errors.fullName}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="bg-input-bg w-full px-5 py-2.5 rounded-full mb-1 outline-none"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm ml-5">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="bg-input-bg w-full px-5 py-2.5 rounded-full mb-1 outline-none"
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-sm ml-5">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  required
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  placeholder="NIC Number"
                  className="bg-input-bg w-full px-5 py-2.5 rounded-full mb-1 outline-none"
                />
                {errors.nic && (
                  <p className="text-red-600 text-sm ml-5">{errors.nic}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="bg-input-bg w-full px-5 py-2.5 rounded-full mb-1 outline-none"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm ml-5">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-yellow-300" />
            </div>

            {/* Bus section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl text-white">Buses</h3>
              {buses.map((bus, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-4 p-4 items-center"
                >
                  <div className="flex-1 min-w-[190px]">
                    <input
                      type="text"
                      placeholder="Registration Number"
                      required
                      value={bus.registrationNumber}
                      onChange={(e) =>
                        updateBus(i, 'registrationNumber', e.target.value)
                      }
                      className="bg-input-bg w-full px-5 py-2.5 rounded-full mb-1 outline-none"
                    />
                    {errors.buses[i]?.registrationNumber && (
                      <p className="text-red-600 text-sm ml-5">
                        {errors.buses[i].registrationNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Route Name"
                      required
                      value={bus.routeName}
                      onChange={(e) =>
                        updateBus(i, 'routeName', e.target.value)
                      }
                      className="bg-input-bg w-full px-5 py-2.5 rounded-full mb-1 outline-none"
                    />
                    {errors.buses[i]?.routeName && (
                      <p className="text-red-600 text-sm ml-5">
                        {errors.buses[i].routeName}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Route Number"
                      required
                      value={bus.routeNumber}
                      onChange={(e) =>
                        updateBus(i, 'routeNumber', e.target.value)
                      }
                      className="bg-input-bg w-full px-5 py-2.5 rounded-full mb-1 outline-none"
                    />
                    {errors.buses[i]?.routeNumber && (
                      <p className="text-red-600 text-sm ml-5">
                        {errors.buses[i].routeNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <select
                      value={bus.busType}
                      required
                      onChange={(e) => updateBus(i, 'busType', e.target.value)}
                      className="bg-input-bg w-full px-5 py-2.5 rounded-full mb-1 outline-none"
                    >
                      <option value="" disabled>
                        Select Bus Type
                      </option>
                      <option value="normal">Normal</option>
                      <option value="semi-luxury">Semi-Luxury</option>
                      <option value="luxury">Luxury</option>
                      <option value="super-luxury">Super-Luxury</option>
                    </select>
                    {errors.buses[i]?.busType && (
                      <p className="text-red-600 text-sm ml-5">
                        {errors.buses[i].busType}
                      </p>
                    )}
                  </div>
                  {buses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBus(i)}
                      className="px-4 py-2 rounded-full bg-red-600  text-white shadow-md 
                    hover:shadow-red-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addBus}
                className="px-4 py-2 rounded-full bg-green-600  text-white shadow-md 
                    hover:shadow-green-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform"
              >
                Add Bus
              </button>
            </div>

            {/* Separator */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-yellow-300" />
            </div>

            {/* Documents */}
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl text-white">Documents</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex flex-col">
                  <label className="text-white">Permit </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange(setPermit, 'permit')}
                  />
                  <span className="text-gray-400 text-sm ml-5 mt-1">
                    PDF only, max 5MB
                  </span>
                  {errors.permit && (
                    <p className="text-red-600 text-sm ml-5">{errors.permit}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-white">Insurance </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange(setInsurance, 'insurance')}
                  />
                  <span className="text-gray-400 text-sm ml-5 mt-1">
                    PDF only, max 5MB
                  </span>
                  {errors.insurance && (
                    <p className="text-red-600 text-sm ml-5">
                      {errors.insurance}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={globalLoading}
              className="w-full py-2.5 px-3 rounded-full font-medium bg-gradient-to-r from-yellow-600 text-sm ml-5 to-orange-700 
          text-white shadow-md hover:shadow-yellow-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform"
            >
              Submit
            </button>
          </motion.form>
        )}
      </div>
    </AnimatePresence>
  );
};

export default BusOperatorForm;
