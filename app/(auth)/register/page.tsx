"use client";
import React from 'react';

const RegisterPage = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8 text-center">Register</h1>
      <form className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Email</label>
          <input type="email" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700" />
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
