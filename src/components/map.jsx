import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

const MapExample = () => {
	const [locations, setLocations] = useState([
		{ id: 1, name: 'Clock Tower Faisalabad', lat: 31.4181, long: 73.0776 },
		{ id: 2, name: 'University of Agriculture, Faisalabad', lat: 31.4338, long: 73.0832 }
	]);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [currentLocation, setCurrentLocation] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCurrentLocation({ lat: position.coords.latitude, long: position.coords.longitude });
			},
			() => {
				toast.error('Unable to fetch your location');
			}
		);
	}, []);

	const handleLocationSelect = location => {
		setSelectedLocation(location);
	};

	const resetSelection = () => {
		setSelectedLocation(null);
	};

	return (
		<div className="flex flex-col lg:flex-row rounded-lg items-center justify-center" style={{ height: '100vh' }}>
			<div className="flex-grow transition-all duration-300 ease-in-out">
				<ul className="list-none">
					{locations.map(loc => (
						<li key={loc.id} onClick={() => handleLocationSelect(loc)}>
							{loc.name}
						</li>
					))}
				</ul>
				{selectedLocation && currentLocation && (
					<div className="map-container" style={{ height: '500px', width: '800px', margin: '0 auto', border: '2px solid #000' }}>
						<MapContainer center={[currentLocation.lat, currentLocation.long]} zoom={13} style={{ height: '100%', width: '100%' }}>
							<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
							<Marker position={[currentLocation.lat, currentLocation.long]}>
								<Popup>Your Location</Popup>
							</Marker>
							<Marker position={[selectedLocation.lat, selectedLocation.long]}>
								<Popup>{selectedLocation.name}</Popup>
							</Marker>
							<Polyline positions={[[currentLocation.lat, currentLocation.long], [selectedLocation.lat, selectedLocation.long]]} color="red" />
						</MapContainer>
					</div>
				)}
				<button onClick={resetSelection} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
					Reset Selection
				</button>
				<button onClick={() => navigate('/')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
					Return To Home
				</button>
			</div>
		</div>
	);
};

export default MapExample;
