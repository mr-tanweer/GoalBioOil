

document.addEventListener("DOMContentLoaded", () => {
    const updateLocationBtn = document.getElementById("updateLocationBtn");

    updateLocationBtn.addEventListener("click", async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Update the latitude and longitude input fields
                document.getElementById("latitude").value = latitude;
                document.getElementById("longitude").value = longitude;

                // Perform reverse geocoding to get the place name
                const placeName = await reverseGeocode(latitude, longitude);

                // Update the place name field
                document.getElementById("placeName").value = placeName;

                // Update the current latitude and longitude display
                document.getElementById("currentLatitude").textContent = latitude;
                document.getElementById("currentLongitude").textContent = longitude;
            }, (error) => {
                console.error(`Error getting geolocation: ${error.message}`);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    });

    async function reverseGeocode(latitude, longitude) {
        try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=f4224d2ea5364a5888206467240e81b0&q=${latitude}+${longitude}&pretty=1`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                return data.results[0].formatted;
            } else {
                console.log('No results found.');
                return '';
            }
        } catch (error) {
            console.error('Error during reverse geocoding:', error.message);
            return '';
        }
    }
});

