import React from 'react';

const TimeRangeSelector = ({ selectedRange, selectedType, onRangeChange, onTypeChange }) => {
    return (
      <div className="container my-4">
        <div className="row justify-content-center mb-3">
          <div className="col-md-8">
            <div className="btn-group w-100" role="group">
              <button 
                className={`btn ${selectedRange === 'short_term' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => onRangeChange('short_term')}
              >
                Last 4 Weeks
              </button>
              <button 
                className={`btn ${selectedRange === 'medium_term' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => onRangeChange('medium_term')}
              >
                Last 6 Months
              </button>
              <button 
                className={`btn ${selectedRange === 'long_term' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => onRangeChange('long_term')}
              >
                All Time
              </button>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="btn-group w-100" role="group">
              <button 
                className={`btn ${selectedType === 'artists' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => onTypeChange('artists')}
              >
                Top Artists
              </button>
              <button 
                className={`btn ${selectedType === 'tracks' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => onTypeChange('tracks')}
              >
                Top Songs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default TimeRangeSelector;