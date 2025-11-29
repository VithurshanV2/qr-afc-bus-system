import React, { useState } from 'react';

const BusOperatorForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nic, setNic] = useState('');
  const [address, setAddress] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [routeName, setRouteName] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [busType, setBusType] = useState('normal');
  const [_permit, setPermit] = useState(null);
  const [_insurance, setInsurance] = useState(null);

  return (
    <div>
      <form action="">
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
