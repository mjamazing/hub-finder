$(document).ready(function() {
    google.load('maps', '3.27', { other_params: 'key=API_KEY', callback: init });

    function init() {}

    $("#findhubsbutton").click(function() {
        var hubs = $("#hublist").val().split("\n");
        var addresses = $("#addresslist").val().split("\n");

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: addresses,
            destinations: hubs,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false
        }, callback);
    });

    function callback(response, status) {
        if (status != google.maps.DistanceMatrixStatus.OK) {
            $('#results').html("A parsing error has occurred.");
        } else {
            for (i = 0; i < response.originAddresses.length; i++) {
                originAddress = '';
                destinationAddresses = [];
                // distance = 0;
                originAddress = response.originAddresses[i];
                $("#results").append("<div class='hubresult'><b>" + originAddress + "</b>");
                // Switch to rows/elements
                for (j = 0; j < response.destinationAddresses.length; j++) {
                    destinationAddresses[j] = [];
                    destinationAddresses[j]['address'] = response.destinationAddresses[j];
                    destinationAddresses[j]['distance_text'] = response.rows[i].elements[j].distance.text;
                    destinationAddresses[j]['distance_value'] = response.rows[i].elements[j].distance.value;
                }
                destinationAddresses.sort(function(a, b) {
                    return a['distance_value'] - b['distance_value'];
                });
                for (j = 0; j < destinationAddresses.length; j++) {
                    $("#results").append("<div class='hubresult'>" + destinationAddresses[j]['address'] + " " + destinationAddresses[j]['distance_text'] + "</div>");
                    // $("#results").append(address, " -&gt; ", hubAddress, "<br/>");
                }
                $("#results").append("</div><br/>");
            }
        }
    }
});