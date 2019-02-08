window.onload = () => {
    // Display loading screen at start
    displayWaiting('Finding your location...');

    let locationTimer = setTimeout(() => displayError('Timeout while waiting for location.'), 10000);

    if (navigator.geolocation) {

        // Get user location
        navigator.geolocation.getCurrentPosition(position => {
            // Clear timer for failed location load
            clearTimeout(locationTimer);
            let coordinates = [position.coords.latitude, position.coords.longitude];
            // Send call to api
            // Use cors proxy to allow development off of csunix server
            displayWaiting('Finding restaurants near you...');
            fetch('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=' + coordinates[0] + '&longitude=' + coordinates[1], {
                method: 'GET',
                headers: {
                    Authorization: "Bearer Hft_knYBD4x7ZRUH_m7EyS7OLZcN_RVkYvK_jLRk4KQA3AsqVaFJbn2koe4D1X_sZ4ywu8ePRUEAl2Gl4_PSaUwuJfHdZPpMlpl-18cXHdDf28jd8yWKyn53yrdcXHYx"
                }
            }).then(response => response.ok ? response.json() : response.statusText
            ).then(response => {
                if (!Number.isInteger(response)) {
                    // Display results
                    displayResults(response);
                    // function to display results
                } else {
                    // Handle error if results not found
                    throw new Error('Could not get restaurants.');
                }
            }).catch(error => displayError(error));
        });

        // Display wait screen while loading results

    } else {
        // Handle error if location denied or not able to get
        let message = 'Error retrieving restaurants';
        displayError(message);
    }
};

const displayError = (error) => {
    // Display error screen on timeout
    $("#loader").hide();
    $("#restaurantScreen").hide();
    $("#errorScreen").prepend("<h2>" + error + "</h2><p>Please try again later</p>");
    $("#errorScreen").show();

};

const displayWaiting = (message) => {
    // Display waiting screen with message and title at top of screen
    $("#message").html("");
    $("#loader").prepend("<p id='message'>" + message + "</p>");
    $("#loader").show();

};

const displayResults = results => {

    $("#loader").hide();
    $("#restaurantScreen").show();
    let div = document.getElementById("restaurantScreen");
    div.innerHTML = "<h2 class='display-6 text-center'>Found these restaurants...</h2>";

    for (let i = 0; i < results['businesses'].length; i++) {

        let business = results['businesses'][i];
        // Place business details in restaurant template
        let restaurant = "<div class='media'>";
        restaurant += "<div class='img_container media-left media-middle'><img class='img_url media-object' src='" + business["image_url"] + "'/></div>";
        restaurant += "<div class='media-body'><h3 class='name media-heading'>" + business["name"] + "</h3>";

        restaurant += "<p class='categories'>";

        for (let j = 0; j < business["categories"].length; j++) {

            restaurant += business["categories"][j]["title"];
            if (j !== business["categories"].length - 1) {
                restaurant += "/";
            }
        }
        restaurant += "</p>";
        restaurant += "<p class='display_address'>" + business["location"]["display_address"] + "</p>";
        restaurant += "<p class='phone'>" + business["display_phone"] + "</p>";
        restaurant += "<p class='reviews'><img class='rating img-responsive' src='assets/img/yelp_stars/web_and_ios/small/small_" + business["rating"] + ".png' alt='Rating'/>";
        restaurant += business["review_count"] + " Reviews</p>";
        restaurant += "</div></div>";
        // Append template to #restarurantScreen
        div.innerHTML += restaurant;

    }

};