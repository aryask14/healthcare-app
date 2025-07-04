import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaStar, FaRegClock, FaMoneyBillWave } from 'react-icons/fa';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <div className="doctor-image">
        <FaUserMd size={50} />
      </div>
      <div className="doctor-info">
        <h3 className="doctor-name">Dr. {doctor.userId.name}</h3>
        <p className="doctor-specialization">{doctor.specialization}</p>
        <div className="doctor-rating">
          <FaStar color="#f39c12" />
          <span>4.8 (120 reviews)</span>
        </div>
        <div className="doctor-details">
          <div className="detail-item">
            <FaRegClock />
            <span>Available Today</span>
          </div>
          <div className="detail-item">
            <FaMoneyBillWave />
            <span>${doctor.consultationFee}</span>
          </div>
        </div>
        <Link to={`/doctors/${doctor._id}`} className="btn btn-outline">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;