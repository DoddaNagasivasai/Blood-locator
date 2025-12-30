import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BloodSearch from '../components/BloodSearch';
import ResultsSection from '../components/ResultsSection';
import BloodBankList from '../components/BloodBankList';
import DonorList from '../components/DonorList';
import AddDonorForm from '../components/AddDonorForm';
import AddBloodBankForm from '../components/AddBloodBankForm';
import DonorListUser from '../components/DonorListUser';
import BloodBankListUser from '../components/BloodBankListUser';
import './Dashboard.css';

export default function Dashboard() {
    const { user } = useAuth();
    const [searchResults, setSearchResults] = useState(null);
    const [searchMeta, setSearchMeta] = useState({ type: 'donor', bloodGroup: '' });
    const [activeTab, setActiveTab] = useState('search');

    const handleSearch = async (criteria) => {
        const { bloodGroup, searchType } = criteria;
        setSearchMeta({ type: searchType, bloodGroup });
        setSearchResults(null);

        const API_URL = "http://localhost:5000/api";
        let endpoint = "";

        if (searchType === 'donor') {
            endpoint = `${API_URL}/donors?bloodGroup=${encodeURIComponent(bloodGroup)}`;
        } else {
            endpoint = `${API_URL}/bloodbanks?bloodGroup=${encodeURIComponent(bloodGroup)}`;
        }

        try {
            const response = await fetch(endpoint);
            const data = await response.json();

            // Backend returns { donors: [], count: n } for donors
            // Backend returns [ {}, {} ] for banks (based on my quick impl check)
            // Wait, let's verify app.py returns for blood banks... 
            // app.py: return jsonify([b.to_dict() for b in banks]), 200

            if (searchType === 'donor') {
                setSearchResults(data.donors || []);
            } else {
                setSearchResults(data || []);
            }
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="container">
                    <h1>Welcome back, {user?.name || 'User'}! 🩸</h1>
                    <p className="dashboard-subtitle">
                        Find blood donors and blood banks near you
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="dashboard-tabs">
                    <button
                        className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        🔍 Search Blood
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'addDonor' ? 'active' : ''}`}
                        onClick={() => setActiveTab('addDonor')}
                    >
                        🩸 Add Donor
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'addBloodBank' ? 'active' : ''}`}
                        onClick={() => setActiveTab('addBloodBank')}
                    >
                        🏥 Add Blood Bank
                    </button>
                </div>

                <div className="dashboard-content">
                    {activeTab === 'search' && (
                        <div className="tab-panel">
                            <BloodSearch onSearch={handleSearch} />
                            <ResultsSection results={searchResults} searchMeta={searchMeta} />
                            <hr style={{ margin: '3rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
                            <BloodBankList />
                            <hr style={{ margin: '3rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
                            <DonorList />
                        </div>
                    )}

                    {activeTab === 'addDonor' && (
                        <div className="tab-panel">
                            <AddDonorForm />
                            <DonorListUser />
                        </div>
                    )}

                    {activeTab === 'addBloodBank' && (
                        <div className="tab-panel">
                            <AddBloodBankForm />
                            <BloodBankListUser />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
