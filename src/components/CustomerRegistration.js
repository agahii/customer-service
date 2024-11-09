import React, { useState } from 'react';

const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert('Registration Successful!\n' + JSON.stringify(formData, null, 2));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Customer Registration</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter your country"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter a password"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>Register</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '60px',  // Adjust to match the navbar height
    marginLeft: '250px',  // Adjust to match the sidebar width
    padding: '20px',  // Padding inside the content area
    width: 'calc(100% - 250px)', // Ensure it fills the remaining space after the sidebar
    boxSizing: 'border-box',
  },
  header: {
    fontSize: '26px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    color: '#555',
    fontWeight: '500',
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border 0.3s ease',
  },
  submitButton: {
    padding: '12px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
};

export default CustomerRegistration;
