$(document).ready(function() {

    $("#findhubsbutton").click(function() {
        var hubs = $("#hublist").val().split("\n");
        var addresses = $("#addresslist").val().split("\n");

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: hubs,
            destinations: addresses,
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
            $("#results").text(JSON.stringify(response));
            // var origin = response.originAddresses[0];
            // var destination = response.destinationAddresses[0];
            // if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
            //     $('#result').html("Better get on a plane. There are no roads between " +
            //         origin + " and " + destination);
            // } else {
            //     var distance = response.rows[0].elements[0].distance;
            //     var distance_value = distance.value;
            //     var distance_text = distance.text;
            //     var miles = distance_text.substring(0, distance_text.length - 3);
            //     $('#result').html("It is " + miles + " miles from " + origin + " to " + destination);
            // }
        }
    }
});