import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMedicines } from '../../features/pharmacy/medicineSlice';
import MedicineCard from './MedicineCard';
import Spinner from '../common/Spinner';
import './MedicineList.css';

const MedicineList = () => {
  const dispatch = useDispatch();
  const { medicines, isLoading } = useSelector((state) => state.medicines);

  useEffect(() => {
    dispatch(getMedicines());
  }, [dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="medicine-list">
      {medicines.length === 0 ? (
        <div className="empty-list">
          <h3>No medicines found</h3>
        </div>
      ) : (
        <div className="grid">
          {medicines.map((medicine) => (
            <MedicineCard key={medicine._id} medicine={medicine} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineList;