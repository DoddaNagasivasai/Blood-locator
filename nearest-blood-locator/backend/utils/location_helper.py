# Location Helper Utilities
# Helper functions for location-based operations

import math

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two coordinates using Haversine formula
    
    Args:
        lat1: Latitude of first point
        lon1: Longitude of first point
        lat2: Latitude of second point
        lon2: Longitude of second point
    
    Returns:
        Distance in kilometers
    """
    R = 6371  # Earth's radius in kilometers
    
    # Convert to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.asin(math.sqrt(a))
    distance = R * c
    
    return round(distance, 1)

def sort_by_distance(items):
    """
    Sort array of items by distance
    
    Args:
        items: List of dictionaries with 'distance' key
    
    Returns:
        Sorted list
    """
    def get_distance_value(item):
        # Extract numeric value from distance string (e.g., "1.2 km" -> 1.2)
        distance_str = item.get('distance', '0 km')
        try:
            return float(distance_str.split()[0])
        except (ValueError, IndexError):
            return 0
    
    return sorted(items, key=get_distance_value)

def filter_by_radius(items, max_distance_km):
    """
    Filter items within a certain radius
    
    Args:
        items: List of dictionaries with 'distance' key
        max_distance_km: Maximum distance in kilometers
    
    Returns:
        Filtered list
    """
    filtered = []
    for item in items:
        distance_str = item.get('distance', '0 km')
        try:
            distance = float(distance_str.split()[0])
            if distance <= max_distance_km:
                filtered.append(item)
        except (ValueError, IndexError):
            continue
    
    return filtered

def format_distance(distance_km):
    """
    Format distance for display
    
    Args:
        distance_km: Distance in kilometers
    
    Returns:
        Formatted string (e.g., "1.2 km")
    """
    return f"{distance_km} km"

def get_nearby_locations(location, items):
    """
    Get nearby locations (Mock implementation)
    In production, this would use actual coordinates
    
    Args:
        location: User's location string
        items: List of donors or blood banks
    
    Returns:
        Items near the location
    """
    if not location:
        return items
    
    # Mock implementation - filter by location string matching
    return [item for item in items if location.lower() in item.get('location', '').lower()]
