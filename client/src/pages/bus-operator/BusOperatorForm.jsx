import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const BusOperatorForm = () => {
  const { backendUrl, setGlobalLoading } = useContext(AppContext);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nic, setNic] = useState('');
  const [address, setAddress] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [routeName, setRouteName] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [busType, setBusType] = useState('normal');
  const [permit, setPermit] = useState(null);
  const [insurance, setInsurance] = useState(null);

  const isPhoneNumberValid = (number) => {
    const regex = /^(?:0|94|\+94)?(7[0-8][0-9]{7})$/;
    return regex.test(number);
  };

  const isNicValid = (nic) => {
    const regex = /^(\d{9}[VvXx]|\d{12})/;
    return regex.test(nic);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setGlobalLoading(true);

      if (!fullName || !email || !phoneNumber || !nic || !address) {
        toast.error('Please fill all required fields');
        return;
      }

      if (!isPhoneNumberValid(phoneNumber)) {
        toast.error('Invalid phone number');
        return;
      }

      if (!isNicValid(nic)) {
        toast.error('Invalid NIC number');
        return;
      }

      const buses = [{ registrationNumber, routeName, routeNumber, busType }];

      const formData = new window.FormData();
      formData.append('name', fullName);
      formData.append('email', email);
      formData.append('number', phoneNumber);
      formData.append('nic', nic);
      formData.append('address', address);
      formData.append('buses', JSON.stringify(buses));

      if (permit) {
        formData.append('permit', permit);
      }

      if (insurance) {
        formData.append('insurance', insurance);
      }

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + '/api/operator-requests',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      if (data.success) {
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
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <label>NIC number</label>
            <input
              type="text"
              required
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </section>

        {/* Bus section */}
        <section>
          <div>
            <h2>Buses</h2>
          </div>
          <div>
            <label>Registration Number</label>
            <input
              type="text"
              required
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
          </div>
          <div>
            <label>Route Name</label>
            <input
              type="text"
              required
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
            />
          </div>
          <div>
            <label>Route Number</label>
            <input
              type="text"
              required
              value={routeNumber}
              onChange={(e) => setRouteNumber(e.target.value)}
            />
          </div>
          <div>
            <label>Bus Type</label>
            <select
              value={busType}
              onChange={(e) => setBusType(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="semi-luxury">Semi-Luxury</option>
              <option value="luxury">Luxury</option>
              <option value="super-luxury">Super-Luxury</option>
            </select>
          </div>
        </section>

        {/* Documents */}
        <section>
          <div>
            <h2>Documents</h2>
          </div>
          <div>
            <label>Permit</label>
            <input type="file" onChange={(e) => setPermit(e.target.files[0])} />
          </div>
          <div>
            <label>Insurance</label>
            <input
              type="file"
              onChange={(e) => setInsurance(e.target.files[0])}
            />
          </div>
        </section>

        <button>Submit</button>
      </form>
    </div>
  );
};

export default BusOperatorForm;
