import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const BusOperatorForm = () => {
  const { backendUrl, setGlobalLoading } = useContext(AppContext);

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
      busType: 'normal',
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
        busType: 'normal',
      },
    ]);

    setErrors({ ...errors, buses: [...errors.buses, {}] });
  };

  const removeBus = (index) => {
    const updatedBuses = buses.filter((bus, i) => i !== index);
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
        toast.success('Your account request form has been submitted');
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
    <div>
      {submitted ? (
        <div>
          <h2>Request Form Submitted Successfully!</h2>
          <p>
            Thank you for submitting your bus operator account request form. The
            National Transport Commission (NTC) has received your application
            and will review it shortly. You will be notified via email once the
            verification process is complete.
          </p>
          <a href="/">Go back to home page</a>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Basic info */}
          <section>
            <div>
              <label>Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && (
                <p className="text-red-600">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label>Phone Number</label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {errors.phoneNumber && (
                <p className="text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
            <div>
              <label>NIC number</label>
              <input
                type="text"
                required
                value={nic}
                onChange={(e) => setNic(e.target.value)}
              />
              {errors.nic && <p className="text-red-600">{errors.nic}</p>}
            </div>
            <div>
              <label>Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && (
                <p className="text-red-600">{errors.address}</p>
              )}
            </div>
          </section>

          {/* Bus section */}
          <section>
            <h2>Buses</h2>
            {buses.map((bus, i) => (
              <div key={i}>
                <div>
                  <label>Registration Number</label>
                  <input
                    type="text"
                    required
                    value={bus.registrationNumber}
                    onChange={(e) =>
                      updateBus(i, 'registrationNumber', e.target.value)
                    }
                  />
                  {errors.buses[i]?.registrationNumber && (
                    <p className="text-red-600">
                      {errors.buses[i].registrationNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label>Route Name</label>
                  <input
                    type="text"
                    required
                    value={bus.routeName}
                    onChange={(e) => updateBus(i, 'routeName', e.target.value)}
                  />
                  {errors.buses[i]?.routeName && (
                    <p className="text-red-600">{errors.buses[i].routeName}</p>
                  )}
                </div>
                <div>
                  <label>Route Number</label>
                  <input
                    type="text"
                    required
                    value={bus.routeNumber}
                    onChange={(e) =>
                      updateBus(i, 'routeNumber', e.target.value)
                    }
                  />
                  {errors.buses[i]?.routeNumber && (
                    <p className="text-red-600">
                      {errors.buses[i].routeNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label>Bus Type</label>
                  <select
                    value={bus.busType}
                    onChange={(e) => updateBus(i, 'busType', e.target.value)}
                  >
                    <option value="normal">Normal</option>
                    <option value="semi-luxury">Semi-Luxury</option>
                    <option value="luxury">Luxury</option>
                    <option value="super-luxury">Super-Luxury</option>
                  </select>
                </div>
                {buses.length > 1 && (
                  <button type="button" onClick={() => removeBus(i)}>
                    Remove Bus
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addBus}>
              Add Bus
            </button>
          </section>

          {/* Documents */}
          <section>
            <div>
              <h2>Documents</h2>
            </div>
            <div>
              <label>Permit</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange(setPermit, 'permit')}
              />
              {errors.permit && <p className="text-red-600">{errors.permit}</p>}
            </div>
            <div>
              <label>Insurance</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange(setInsurance, 'insurance')}
              />
              {errors.insurance && (
                <p className="text-red-600">{errors.insurance}</p>
              )}
            </div>
          </section>

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default BusOperatorForm;
