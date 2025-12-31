import React, { useEffect, useState } from 'react';

export default function EmbeddedMapView({
    destinationLat,
    destinationLng,
    destinationName
}) {
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                }
            );
        }
    }, []);

    // Check if destination coordinates are valid
    if (!destinationLat || !destinationLng) {
        return (
            <div style={{
                width: '100%',
                height: '400px',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                color: '#666'
            }}>
                <p>Location coordinates not available</p>
            </div>
        );
    }

    const mapUrl = userLocation
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng - 0.05},${userLocation.lat - 0.05},${destinationLng + 0.05},${destinationLat + 0.05}&layer=mapnik&marker=${destinationLat},${destinationLng}`
        : `https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${destinationLat},${destinationLng}`;

    return (
        <div style={{ width: '100%', height: '400px', marginTop: '1rem' }}>
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px' }}
                loading="lazy"
                src={mapUrl}
                allowFullScreen
            ></iframe>
        </div>
    );
}