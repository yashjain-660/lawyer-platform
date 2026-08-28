import React from 'react';

const ConsultationPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold mb-8">Book a Consultation</h1>
      <form className="max-w-2xl bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Lawyer</label>
          <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700"></select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Date & Time</label>
          <input type="datetime-local" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700" />
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
          Book Consultation
        </button>
      </form>
    </div>
  );
};

export default ConsultationPage;
