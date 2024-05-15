import React from "react";
import NavBar from "./topNav"; // Assuming you have a NavBar component

const Contact = () => {
  return (
    <div className="bg-gray-100 h-full">
      <NavBar />
      <div className="container h-screen mx-auto px-4 py-8">
        <div className="text-center font-bold text-2xl mb-6 text-[#291f82]">Contact us</div>
        <form action="#">
          <div className="form-row flex flex-wrap -mx-4 mb-6">
            <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
              <div className="input-data relative">
                <input type="text" required className="block w-full bg-gray-100 border-b-2 border-gray-300 focus:border-[#291f82] outline-none py-2 px-4" />
                <label htmlFor="" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all">First Name</label>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4">
              <div className="input-data relative">
                <input type="text" required className="block w-full bg-gray-100 border-b-2 border-gray-300 focus:border-[#291f82] outline-none py-2 px-4" />
                <label htmlFor="" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all">Last Name</label>
              </div>
            </div>
          </div>
          <div className="form-row flex flex-wrap -mx-4 mb-6">
            <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
              <div className="input-data relative">
                <input type="email" required className="block w-full bg-gray-100 border-b-2 border-gray-300 focus:border-[#291f82] outline-none py-2 px-4" />
                <label htmlFor="" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all">Email Address</label>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4">
              <div className="input-data relative">
                <input type="text" required className="block w-full bg-gray-100 border-b-2 border-gray-300 focus:border-[#291f82] outline-none py-2 px-4" />
                <label htmlFor="" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all">Subject</label>
              </div>
            </div>
          </div>
          <div className="form-row mb-6">
            <div className="input-data relative">
              <textarea rows="8" required className="block w-full bg-gray-100 border-b-2 border-gray-300 focus:border-[#291f82] outline-none py-2 px-4"></textarea>
              <label htmlFor="" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all">Write your message</label>
            </div>
          </div>
          <div className="text-center">
            <div className="submit-button-row inline-block cursor-pointer">
              <div className="input-data relative">
                {/* <div className="inner"></div> */}
                <input type="submit" value="Submit" className="bg-[#291f82] text-white py-2 px-4 rounded cursor-pointer transition-all hover:bg-green-600" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
