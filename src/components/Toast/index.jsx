import React from 'react';
import './style.scss';

const Toast = ({ className, text }) => {
  return(
    <div className="Toast">{text}</div>
  );
};

export default Toast;
