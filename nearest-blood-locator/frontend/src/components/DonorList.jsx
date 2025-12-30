import React, { useState } from 'react';
import './DonorList.css';

export default function DonorList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState('');
    const [allDonors, setAllDonors] = useState([]);
    const [loading, setLoading] = useState(false);

    // TODO: Load donors from backend API on component mount
    // useEffect(() => {
    //     setLoading(true);
    //     getAllDonors()
    //         .then(response => setAllDonors(response.data))
    //         .catch(error => console.error('Error:', error))
    //         .finally(() => setLoading(false));
    // }, []);

    // Filtering Logic
    const filteredDonors = allDonors.filter(donor => {
        const matchesLocation = donor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donor.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGroup = filterGroup === '' || donor.group === filterGroup;
        return matchesLocation && matchesGroup;
    });

    return (
        <div className="donor-list container" id="donors">
            <div className="list-header">
                <h2>Find Blood Donors</h2>
                <p>Connect with voluntary blood donors nearby</p>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <select
                    value={filterGroup}
                    onChange={(e) => setFilterGroup(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Blood Groups</option>
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

            <div className="donors-grid">
                {loading ? (
                    <div className="no-results">
                        <p>Loading donors...</p>
                    </div>
                ) : filteredDonors.length > 0 ? (
                    filteredDonors.map(donor => (
                        <div key={donor.id} className="donor-card">
                            <div className="donor-card-top">
                                <div className="blood-group-avatar">
                                    {donor.group}
                                </div>
                                <div className="donor-info-main">
                                    <h3>{donor.name}</h3>
                                    <p className="donor-location">{donor.location} • {donor.distance}</p>
                                </div>
                            </div>

                            <div className="donor-card-middle">
                                <div className={`status-indicator ${donor.status === 'Available' ? 'available' : 'unavailable'}`}>
                                    <span className="dot"></span>
                                    {donor.status}
                                </div>
                            </div>

                            <div className="donor-card-footer">
                                <button className="btn btn-primary btn-sm btn-full" disabled={donor.status === 'Unavailable'}>
                                    {donor.status === 'Available' ? 'Call Now' : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No donors found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
