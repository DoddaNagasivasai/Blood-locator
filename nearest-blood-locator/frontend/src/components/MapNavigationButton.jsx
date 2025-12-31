import React, { useState } from 'react';

export default function MapNavigationButton({
    destinationLat,
    destinationLng,
    destinationName
}) {
    const [loading, setLoading] = useState(false);

    const handleNavigate = () => {
        if (!destinationLat || !destinationLng) {
            alert('Location data not available for this donor');
            return;
        }

        setLoading(true);

        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    // Open Google Maps with directions
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destinationLat},${destinationLng}&travelmode=driving`;

                    window.open(url, '_blank');
                    setLoading(false);
                },
                (error) => {
                    // If location permission denied, open maps without origin
                    const url = `https://www.google.com/maps/search/?api=1&query=${destinationLat},${destinationLng}`;
                    window.open(url, '_blank');
                    setLoading(false);
                }
            );
        } else {
            // Fallback: open destination only
            const url = `https://www.google.com/maps/search/?api=1&query=${destinationLat},${destinationLng}`;
            window.open(url, '_blank');
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleNavigate}
            disabled={loading || !destinationLat || !destinationLng}
            className="btn btn-primary"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.6rem 1rem'
            }}
        >
            <span>🗺️</span>
            {loading ? 'Opening Map...' : 'Navigate to Donor'}
        </button>
    );
}