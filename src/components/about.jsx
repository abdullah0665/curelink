import React from 'react'
import NavBar from './topNav'
import fast from '../components/fast.png'

const About = () => {
  return (
    <>
      <NavBar />
      <div id="about" className="flex flex-col md:flex-row w-full h-screen bg-gray-100 mt-16">

        <div className="w-full md:w-1/2 p-0 md:p-8 flex items-center justify-center ">

          <img
            src={fast}
            alt="About Us"
            className="w-full h-auto object-cover  rounded-bl-ful"
          />
        </div>


        <div className="w-full md:w-1/2 p-4 md:p-8 bg-[#291f82] flex items-center justify-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              About Us
            </h2>
            <p className="text-lg md:text-xl text-white mb-8">
              "Cure Link," a groundbreaking web platform set to revolutionize healthcare connectivity. By centralizing medical prescriptions and reports, it offers a unified system granting healthcare professionals effortless access to patients' complete medical records. Utilizing a secure QR code system, doctors can swiftly retrieve patient profiles, facilitating real-time updates. Enhancing patient care, the platform suggests nearby clinics tailored to individual needs, leveraging the Google Maps API. Prioritizing appointment efficiency, Cure Link allows clients to schedule appointments online, monitor appointment volumes in real-time, and reduce waiting times. In urgent situations, paid consultations are available for immediate medical assistance. Featuring an advanced lab module, the platform streamlines test design, lowers costs, and speeds up turnaround times while seamlessly linking prescriptions to test reports. With its holistic approach, Cure Link revolutionizes healthcare management by visually representing patient health trends, promoting effective communication, and enhancing overall patient outcomes.
            </p>
          </div>
        </div>
      </div>
    

      <div id="about" className="flex flex-col md:flex-row w-full h-screen ">



        <div className="w-full md:w-1/2 p-4 md:p-8 bg-[#291f82] flex items-center justify-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Introduction
            </h2>
            <p className="text-lg md:text-xl text-white mb-8">
              Introducing “Cure Link” is a web platform poised to redefine healthcare connectivity. By consolidating medical prescriptions and medical reports, it provides an integrated system that provides healthcare professionals with seamless access to a patient's complete medical history. Through a secure QR code mechanism, doctors gain efficient access to patient profiles, enabling real-time updates. The platform improves patient care by suggesting nearby clinics based on individual needs and leveraging the Google Maps API. With a focus on appointment optimization, Cure Link enables clients to schedule appointments online, track appointment numbers in realtime and minimize wait times. In urgent cases, the platform offers paid consultations for immediate medical assistance. By introducing an advanced lab module, Cure Link designs tests, reduces cost and turnaround time, and seamlessly links recipes to test reports. With its comprehensive approach, Cure Link transforms healthcare management by visualizing patient health trends through graphical representations, supporting effective communication and improving overall patient outcomes.
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-0 md:p-8 flex items-center justify-center ">

          <img
            src="logo.png"
            alt="About Us"
            className="w-96 h-auto object-cover  rounded-bl-ful"
          />
        </div>
      </div>

    </>
  )
}

export default About