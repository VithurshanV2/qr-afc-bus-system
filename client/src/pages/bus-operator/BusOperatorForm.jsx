import React from 'react';

const BusOperatorForm = () => {
  return (
    <div>
      <form action="">
        {/* Basic info */}
        <div>
          <label>Full Name</label>
          <input type="text" required />
        </div>
        <div>
          <label>Email</label>
          <input type="text" required />
        </div>
        <div>
          <label>Phone Number</label>
          <input type="text" required />
        </div>
        <div>
          <label>NIC number</label>
          <input type="text" required />
        </div>
        <div>
          <label>Address</label>
          <input type="text" required />
        </div>
        {/* Bus section */}
        <div>
          <h2>Buses</h2>
        </div>
        <div>
          <label>Registration Number</label>
          <input type="text" required />
        </div>
        <div>
          <label>Route Name</label>
          <input type="text" required />
        </div>
        <div>
          <label>Route Number</label>
          <input type="text" required />
        </div>
        <div>
          <label>Bus Type</label>
          <select>
            <option value="normal">Normal</option>
            <option value="semi-luxury">Semi-Luxury</option>
            <option value="luxury">Luxury</option>
            <option value="super-luxury">Super-Luxury</option>
          </select>
        </div>
        {/* Documents */}
        <div>
          <h2>Documents</h2>
        </div>
        <div>
          <label>Permit</label>
          <input type="file" />
        </div>
        <div>
          <label>Insurance</label>
          <input type="file" />
        </div>

        <button>Submit</button>
      </form>
    </div>
  );
};

export default BusOperatorForm;
