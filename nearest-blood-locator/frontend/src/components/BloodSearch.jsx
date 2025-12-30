import React, { useState } from 'react';
import './BloodSearch.css';

export default function BloodSearch({ onSearch }) {
    const [bloodGroup, setBloodGroup] = useState('');
    const [searchType, setSearchType] = useState('donor'); // 'donor' or 'bank'
    const [error, setError] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();

        // Validation
        if (!bloodGroup) {
            setError('Please select a blood group.');
            return;
        }

        setError('');
        // Pass search criteria to parent
        onSearch({ bloodGroup, searchType });
    };

    return (
        <div className="blood-search-container">
            <div className="blood-search-card">
                <h2 className="search-heading">Find Blood Availability</h2>

                <form onSubmit={handleSearch} className="search-form">
                    {/* Search Type Toggle */}
                    <div className="search-type-group">
                        <span className="type-label">I am looking for:</span>
                        <div className="toggle-wrapper">
                            <button
                                type="button"
                                className={`type-btn ${searchType === 'donor' ? 'active' : ''}`}
                                onClick={() => setSearchType('donor')}
                            >
                                Blood Donor
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${searchType === 'bank' ? 'active' : ''}`}
                                onClick={() => setSearchType('bank')}
                            >
                                Blood Bank
                            </button>
                        </div>
                    </div>

                    {/* Blood Group Selection */}
                    <div className="input-group">
                        <label htmlFor="bloodGroup" className="input-label">Select Blood Group</label>
                        <select
                            id="bloodGroup"
                            value={bloodGroup}
                            onChange={(e) => {
                                setBloodGroup(e.target.value);
                                setError('');
                            }}
                            className={`form-select ${error ? 'input-error' : ''}`}
                        >
                            <option value="">-- Choose Blood Group --</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                        {error && <span className="error-msg">{error}</span>}
                    </div>

                    {/* Search Button */}
                    <button type="submit" className="search-btn">
                        Search Now
                    </button>
                </form>
            </div>
        </div>
    );
}
