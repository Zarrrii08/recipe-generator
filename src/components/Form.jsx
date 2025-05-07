import React, { useState } from 'react';

const Form = () => {

function FormComponent(formData) {
 console.log(Object.fromEntries(formData))
}

  return (
    <form action={FormComponent} className="max-w-sm mx-auto p-4 bg-white shadow-md rounded">
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">
          First Name
        </label>
        <input type="email" name='email' id="email" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />

      </div>
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">
        Password
        </label>
        <input type="password" name='password' id='password' className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
        <div className="mb-4">
            <label htmlFor="textarea" className="block text-gray-700 font-bold mb-2">
            textarea
            </label>
            <input type="textarea" name='textarea' id="textarea" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
        </div>
        <div className="border border-gray-300 rounded p-4 mb-4">
            <fieldset>
                <legend className="text-gray-700 font-bold mb-2">Checkboxes</legend>
                <label htmlFor="Employee" className="block text-gray-700 mb-2">
                    <input type="radio" name="employmentstatus" className="mr-2" value="Employee"/>
                    Employee
                </label>
                <label htmlFor="Part_time" className="block text-gray-700 mb-2">
                    <input type="radio" name="employmentstatus" className="mr-2" value="Part time"/>
                   Part time
                </label>
                <label htmlFor="Unemployed" className="block text-gray-700 mb-2">
                    <input type="radio" name="employmentstatus" className="mr-2" value="Unemployed"/>
                    Unemployed
                </label>
            </fieldset>
            
        </div>
        
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Submit
      </button>
    </form>
  );
}
export default Form;