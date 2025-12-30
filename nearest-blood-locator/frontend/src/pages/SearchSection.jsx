import React, { useState } from 'react';
import './SearchSection.css';

export default function SearchSection({ onSearch }) {
    const [searchType, setSearchType] = useState('donor'); // 'donor' or 'bank'
    const [bloodGroup, setBloodGroup] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({ searchType, bloodGroup, location });
    };

    return (
        <section className="search-section container" id="search">
            <div className="search-card">
                <h2 className="search-title">Search for Blood Availability</h2>

                <form onSubmit={handleSearch}>
                    <div className="search-type-toggle">
                        <button
                            type="button"
                            className={`toggle-btn ${searchType === 'donor' ? 'active' : ''}`}
                            onClick={() => setSearchType('donor')}
                        >
                            Find Donors
                        </button>
                        <button
                            type="button"
                            className={`toggle-btn ${searchType === 'bank' ? 'active' : ''}`}
                            onClick={() => setSearchType('bank')}
                        >
                            Find Blood Banks
                        </button>
                    </div>

                    <div className="search-grid">
                        <div className="form-group">
                            <label htmlFor="blood-group">Blood Group</label>
                            <select
                                id="blood-group"
                                value={bloodGroup}
                                onChange={(e) => setBloodGroup(e.target.value)}
                                required
                                className="form-control"
                            >
                                <option value="">Select Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location (City/Area)</label>
                            <input
                                type="text"
                                id="location"
                                placeholder="e.g. New York, Downtown"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group btn-wrapper">
                            <button type="submit" className="btn btn-primary btn-block">
                                Search Availability
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
