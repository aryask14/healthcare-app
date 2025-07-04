import React from 'react';
import { FaPills, FaShoppingCart } from 'react-icons/fa';
import './MedicineCard.css';
const MedicineCard = ({ medicine }) => {
  return (
    <div className="medicine-card">
      <div className="medicine-icon">
        <FaPills size={24} />
      </div>
      <div className="medicine-info">
        <h3 className="medicine-name">{medicine.name}</h3>
        <p className="medicine-description">{medicine.description.substring(0, 60)}...</p>
        <div className="medicine-details">
          <span className="medicine-price">${medicine.price.toFixed(2)}</span>
          {medicine.prescriptionRequired && (
            <span className="prescription-badge">Prescription Required</span>
          )}
        </div>
      </div>
      <button className="add-to-cart-btn">
        <FaShoppingCart /> Add to Cart
      </button>
    </div>
  );
};

export default MedicineCard;