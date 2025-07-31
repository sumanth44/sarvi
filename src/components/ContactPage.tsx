import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/contacts', { // ✅ fixed path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Thank you for your message! We'll get back to you soon.");
        setFormData({ name: '', email: '', phone: '' });
      } else {
        alert('There was an error submitting the form.');
      }
    } catch (error) {
      console.error('Submit failed:', error);
      alert('There was a problem connecting to the server.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Get in <span className="text-orange-400">Touch</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Have questions, feedback, or special requests? We'd love to hear from you.
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-stone-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-orange-300 font-semibold">Phone</h3>
                    <p className="text-gray-300">+1 416-413-9813</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-orange-300 font-semibold">Email</h3>
                    <p className="text-gray-300">info@sarvi.com</p>
                    <p className="text-gray-300">support@sarvi.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-orange-300 font-semibold">Address</h3>
                    <p className="text-gray-300">464 Sherbourne St,</p>
                    <p className="text-gray-300">Toronto, ON M4X 1K2</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-orange-300 font-semibold">Hours</h3>
                    <p className="text-gray-300">Mon - Sun: 10:00 AM - 11:00 PM</p>
                    <p className="text-gray-300">Delivery available 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <div className="bg-orange-500 p-3 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="bg-orange-500 p-3 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                  <span className="text-white font-bold">@</span>
                </div>
                <div className="bg-orange-500 p-3 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                  <span className="text-white font-bold">in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-stone-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-stone-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-stone-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-stone-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Get in touch
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
