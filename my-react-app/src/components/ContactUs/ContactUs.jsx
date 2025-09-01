import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './ContactUs.css';

const SUBJECT_OPTIONS = [
  { value: 'technical', label: 'Technical Difficulties' },
  { value: 'more-images', label: 'Need More Images' },
  { value: 'general', label: 'General Question' }
];

const ContactUs = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    subject: '',
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Initialize EmailJS with your public key
  emailjs.init("uqsSHLW9uC_7XkU7I");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const subjectText = SUBJECT_OPTIONS.find(opt => opt.value === formData.subject)?.label || 'General Question';
      
      const templateParams = {
        to_email: 'mark@smartholidaylights.com',
        title: formData.subject,
        name: formData.name,
        from_email: formData.email,
        message: formData.message
      };

      await emailjs.send(
        'service_px0c4eu',
        'template_52oxkui',
        templateParams
      );

      setSuccess(true);
      setFormData({
        subject: '',
        name: '',
        email: '',
        message: ''
      });
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We're here to help! Send us your questions or concerns.</p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select a subject</option>
            {SUBJECT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Type your message here..."
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Message sent successfully! We'll get back to you soon.
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
