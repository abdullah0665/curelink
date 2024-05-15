import { DirectionsRenderer, GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import NavBar from './topNav';

const containerStyle = {
	width: '1000px',
	height: '550px'
};

const MapComponent = () => {
	const [currentLocation, setCurrentLocation] = useState(null);
	const [places, setPlaces] = useState([]);
	const [selectedPlace, setSelectedPlace] = useState(null);
	const [directions, setDirections] = useState(null);

	useEffect(() => {
		// Get user's current location
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;
					setCurrentLocation({ lat: latitude, lng: longitude });
				},
				error => {
					console.error('Error getting user location:', error);
				}
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
		}
	}, []);

	const handleMapLoad = (map) => {
		if (currentLocation) {
			const request = {
				location: currentLocation,
				radius: '5000', // 5km radius
				type: ['laboratory']
			};

			const service = new window.google.maps.places.PlacesService(map);

			service.nearbySearch(request, (results, status) => {
				if (status === window.google.maps.places.PlacesServiceStatus.OK) {
					setPlaces(results);
				} else {
					console.error('Places request failed due to ' + status);
				}
			});
		}
	};

	const handleDirections = () => {
		if (currentLocation && selectedPlace) {
			const directionsService = new window.google.maps.DirectionsService();

			directionsService.route(
				{
					origin: currentLocation,
					destination: selectedPlace.geometry.location,
					travelMode: window.google.maps.TravelMode.DRIVING
				},
				(result, status) => {
					if (status === window.google.maps.DirectionsStatus.OK) {
						setDirections(result);
					} else {
						console.error('Directions request failed due to ' + status);
					}
				}
			);
		}
	};

	return (
		<div className='bg-gray-100 h-screen pt-16  pl-48'>
			<NavBar />
			<LoadScript googleMapsApiKey='AIzaSyB9irjntPHdEJf024h7H_XKpS11OeW1Nh8&libraries' libraries={['places']}>
				{currentLocation && (
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={currentLocation}
						zoom={13}
						onLoad={handleMapLoad}
					>
						<Marker
							position={currentLocation}
							icon={{
								url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
								labelOrigin: new window.google.maps.Point(15, 10),
								scaledSize: new window.google.maps.Size(32, 32),
							}}
							label={{
								text: 'You are here',
								color: 'green',
								fontWeight: 'bold'
							}}
							cursor="pointer"
						/>

						{places.map(place => (
							<Marker
								key={place.place_id}
								position={place.geometry.location}
								title={place.name}
								onClick={() => {
									setSelectedPlace(place);
									setDirections(null); // Clear previous directions
								}}
							/>
						))}

						{selectedPlace && (
							<>
								<InfoWindow
									position={selectedPlace.geometry.location}
									onCloseClick={() => setSelectedPlace(null)}
								>
									<div>
										<h2>{selectedPlace.name}</h2>
										<p>{selectedPlace.vicinity}</p>
										<button onClick={handleDirections} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
											Get Directions
										</button>
									</div>
								</InfoWindow>

								{directions && (
									<DirectionsRenderer
										directions={directions}
										options={{
											suppressMarkers: true,
											polylineOptions: { strokeColor: 'red' } // Set path color to red
										}}
									/>
								)}
							</>
						)}
					</GoogleMap>
				)}
			</LoadScript>
		</div>
	);
};

export default MapComponent;
