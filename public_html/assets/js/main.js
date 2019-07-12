window.onload = () => {

    // Display search box for manual location entry

        // If navigator.geolocation fill search box  with location

        // Else prompt for user interatction

        // Display button to trigger search

    // Display loading screen after button is pressed

    document.getElementById("submit").onclick = function () {


        let location = document.getElementById("location").value;

        if (location) {
            
            let locationTimer = setTimeout(() => displayError('Timeout while waiting for location.'), 10000);

            document.getElementById("default").style.display = "none";
            
            displayWaiting('Finding your location...');

            clearTimeout(locationTimer);
            displayWaiting('Finding restaurants near you...');
            fetch('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=' + location + '&radius=' + document.getElementById("radius").value, {
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
        } else {
            // Display error saying input needs to be filled in
            console.log("Error");
            document.getElementById("locationFormGroup").classList.add("has-error");
            document.getElementById("locationHelpBlock").textContent = "Either press \"Locate Me\" or fill in the search box.";
        }

    };

    document.getElementById("locate").onclick = function () {

        document.getElementById("default").style.display = "none";
    
        displayWaiting('Finding your location...');

        if (navigator.geolocation) {
    
            let locationTimer = setTimeout(() => displayError('Timeout while waiting for location.'), 10000);

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
    let heading = document.createTextNode("Found these restaurants...");
    let h2 = document.createElement("h2");

    let btnDiv = document.createElement("div");
    btnDiv.classList.add("text-center");
    let backButton = document.createElement("button");
    backButton.setAttribute("type", "button");
    backButton.classList.add("btn", "btn-default", "btn-lg", "back-button");
    let buttonText = document.createTextNode("Back to Search");
    backButton.appendChild(buttonText);
    btnDiv.appendChild(backButton);

    div.appendChild(btnDiv);

    h2.appendChild(heading);
    h2.classList.add("display-6", "text-center");
    div.appendChild(h2);

    for (let i = 0; i < results['businesses'].length; i++) {

        let business = results['businesses'][i];

        // Place business details in restaurant template
        let container = document.createElement("div");
        container.classList.add("media");

        let imageContainer = document.createElement("div");
        imageContainer.classList.add("img_container", "media-left", "media-middle");

        let image = document.createElement("img");
        image.classList.add("img_url", "media-object");
        image.setAttribute("src", business["image_url"]);
        
        imageContainer.appendChild(image);
        container.appendChild(imageContainer);

        let infoContainer = document.createElement("div");
        infoContainer.classList.add("media-body");
        let name= document.createElement("h3");
        name.classList.add("name", "media-heading");
        name.appendChild(document.createTextNode(business["name"]));
        infoContainer.appendChild(name);
        container.appendChild(infoContainer);

        let categoriesContainer = document.createElement("p").appendChild(document.createElement("em"));
        categoriesContainer.classList.add("categories");

        for (let j = 0; j < business["categories"].length; j++) {

            categoriesContainer.appendChild(document.createTextNode(business["categories"][j]["title"]));

            if (j !== business["categories"].length - 1) {

                categoriesContainer.appendChild(document.createTextNode("/"));
            }
        }

        infoContainer.appendChild(categoriesContainer);
        let address = document.createElement("p");
        address.classList.add("displayAddress");
        address.appendChild(document.createTextNode(business["location"]["display_address"]));
        infoContainer.appendChild(address);

        let directionsForm = document.createElement("form");
        directionsForm.classList.add("directions");
        directionsForm.setAttribute("action", "http://maps.google.com/maps");
        directionsForm.setAttribute("method", "get");
        directionsForm.setAttribute("target", "_blank");

        let destination = document.createElement("input");
        destination.setAttribute("type", "hidden");
        destination.setAttribute("name", "daddr");
        destination.setAttribute("value", business["location"]["display_address"]);

        let submitDirections = document.createElement("input");
        submitDirections.setAttribute("type", "submit");
        submitDirections.setAttribute("value", "Directions");
        submitDirections.classList.add("btn", "btn-primary");

        directionsForm.appendChild(destination);
        directionsForm.appendChild(submitDirections);
        infoContainer.appendChild(directionsForm);

        let phone = document.createElement("a");
        let phoneHref = "tel:" + business["display_phone"];

        phone.setAttribute("href", phoneHref);
        phone.classList.add("phone");
        phone.appendChild(document.createTextNode(business["display_phone"]));
        infoContainer.appendChild(phone);

        let reviewContainer = document.createElement("p");
        reviewContainer.classList.add("reviews");

        let reviewImage = document.createElement("img");
        reviewImage.classList.add("rating", "img-responsive");

        let srcAttribute = "assets/img/yelp_stars/web_and_ios/small/small_" + business["rating"] + ".png";
        reviewImage.setAttribute("src", srcAttribute);
        reviewImage.setAttribute("alt", "Rating");
        reviewContainer.appendChild(reviewImage);

        let reviewCount = document.createElement("a");
        reviewCount.setAttribute("href", business["url"]);

        let count = business["review_count"] + " Reviews";
        reviewCount.appendChild(document.createTextNode(count));
        reviewContainer.appendChild(reviewCount);
        infoContainer.appendChild(reviewContainer);
        container.appendChild(infoContainer);

        // Append template to #restarurantScreen
        div.appendChild(container);
    }
    


    let btnDiv2 = document.createElement("div");
    btnDiv2.classList.add("text-center");
    let backButton2 = document.createElement("button");
    backButton2.setAttribute("type", "button");
    backButton2.classList.add("btn", "btn-default", "btn-lg", "back-button");
    let buttonText2 = document.createTextNode("Back to Search");
    backButton2.appendChild(buttonText2);
    btnDiv2.appendChild(backButton2);

    div.appendChild(btnDiv2);


    var backButtons = document.getElementsByClassName("back-button");

    for (let i = 0; i < backButtons.length; i++) {
        backButtons[i].onclick = function () {
            document.getElementById("restaurantScreen").style.display = "none";
            document.getElementById("default").style.display = "block";
        }
    }
};