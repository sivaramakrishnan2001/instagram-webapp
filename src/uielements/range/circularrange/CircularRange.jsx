import React, { useEffect, useState } from 'react';
import "./circularrange.css";

export const CircularRange = (props) => {

    const [value, setValue] = useState(10); // Initial value for the range input

    useEffect(() => {
      setValue(props.currentTime);
    }, [props.currentTime])
    

    const handleInputChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <div className="circular-range-container">
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => handleInputChange(e)}
                className="circular-range-input"
            />
            <div className="circular-range-value">{value}</div>
        </div>
    );
};
