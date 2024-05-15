import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import NavBar from './topNav';
// import { toast } from 'react-toastify';

const MapExample = () => {
	const [locations, setLocations] = useState([
		{ id: 1, name: 'Clock Tower Faisalabad', lat: 31.4181, long: 73.0776 },
		{ id: 2, name: 'University of Agriculture, Faisalabad', lat: 31.4338, long: 73.0832 },
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
		<div className='bg-gray-100'>
			<NavBar />
			<div className="flex flex-col items-center  w-full h-screen pt-20 ">
				<div className="w-11/12 max-w-screen-xl">
					{selectedLocation ? (
						// If a location is selected, don't render the list
						null
					) : (
						<ul className="list-none space-y-2 mt-4">
							{locations.map((loc) => (
								<li
									key={loc.id}
									onClick={() => handleLocationSelect(loc)}
									className="cursor-pointer bg-[#291f82] hover:bg-[#0b0638] text-white py-5 px-4 rounded-xl w-full text-center"
								>
									{loc.name} - Lat: {loc.lat}, Long: {loc.long}
								</li>
							))}
						</ul>
					)}
				</div>
				{selectedLocation && currentLocation && (
					<div
						className="map-container mt-4 w-11/12 max-w-screen-xl"
						style={{ height: '500px', border: '2px solid #000' }}
					>
						<MapContainer
							center={[currentLocation.lat, currentLocation.long]}
							zoom={13}
							style={{ height: '100%', width: '100%' }}
						>
							<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
							<Marker position={[currentLocation.lat, currentLocation.long]}>
								<Popup>Your Location</Popup>
							</Marker>
							<Marker position={[selectedLocation.lat, selectedLocation.long]}>
								<Popup>{selectedLocation.name}</Popup>
							</Marker>
							<Polyline
								positions={[
									[currentLocation.lat, currentLocation.long],
									[selectedLocation.lat, selectedLocation.long],
								]}
								color="red"
							/>
						</MapContainer>
					</div>
				)}

				{/* <button
					onClick={() => navigate('/home')}
					className="bg-[#291f82] hover:bg-[#0b0638] text-white font-bold py-2 px-4 rounded mt-4"
				>
					Return To Home
				</button> */}
			</div>
		</div>
	);

};

export default MapExample;
