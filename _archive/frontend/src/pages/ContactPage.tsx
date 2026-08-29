import React from 'react';

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <form className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Name</label>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Email</label>
          <input type="email" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Message</label>
          <textarea rows={5} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700"></textarea>
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
