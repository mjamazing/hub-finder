$(document).ready(function() {
    google.load('maps', '3.28', { other_params: 'key=API_KEY', callback: init });

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
            var maps = new Array();
            for (i = 0; i < response.originAddresses.length; i++) {
                originAddress = '';
                destinationAddresses = [];
                mapID = 'map_' + i;
                originAddress = response.originAddresses[i];
                $("#results").append("<div class='hubresult'><div id='hubaddress_" + i + "' style='font-weight: bold;'>" + originAddress + "</div>");

                for (j = 0; j < response.destinationAddresses.length; j++) {
                    destinationAddresses[j] = [];
                    destinationAddresses[j]['address'] = response.destinationAddresses[j];
                    destinationAddresses[j]['distance_text'] = response.rows[i].elements[j].distance.text;
                    destinationAddresses[j]['distance_value'] = response.rows[i].elements[j].distance.value;
                }
                destinationAddresses.sort(function(a, b) {
                    return a['distance_value'] - b['distance_value'];
                });
                var sortedAddresses = $.map(destinationAddresses, function(a) { return a['address']; });
                var destinationAddressTableOutput = "";
                destinationAddressTableOutput += "<table class='hubtable' id='addresstable_" + i + "'>";
                destinationAddressTableOutput += "<thead><tr><th>Hub #</th><th>Hub</th><th>Distance</th></tr></thead>";
                destinationAddressTableOutput += "<tbody>";
                for (j = 0; j < destinationAddresses.length; j++) {
                    destinationAddressTableOutput += "<tr><td>" + (j + 1) + "</td><td>" + destinationAddresses[j]['address'] + "</td><td>" + destinationAddresses[j]['distance_text'] + "</td></tr>";
                }
                destinationAddressTableOutput += "</tbody></table>";
                $("#results").append(destinationAddressTableOutput);
                $("#results").append("<span class='map' id='" + mapID + "'><input class='drawmapbutton' id='drawmap_" + i + "' type='button' value='Show Map'/></span>");
                $("#drawmap_" + i).click({ mapID: mapID, originAddress: originAddress, destinationAddresses: sortedAddresses }, function(event) {
                    drawMap(event.data.mapID, event.data.originAddress, event.data.destinationAddresses);
                });
            }
        }
    }

    function drawMap(mapID, originAddress, destinationAddresses) {
        // mapID = "map_" + element;
        mapElement = document.getElementById(mapID);
        var map = new google.maps.Map(mapElement, {
            center: { lat: 0.0, lng: 0.0 },
            zoom: 10
        });
        var bounds = new google.maps.LatLngBounds();

        marker = addMarker(map, originAddress, bounds);
        for (j = 0; j < destinationAddresses.length; j++) {
            marker = addMarker(map, destinationAddresses[j], bounds, (j + 1).toString());
        }
    }

    function addMarker(map, address, bounds, label = '') {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    title: address,
                    label: label
                });
                bounds.extend(marker.position);
                map.setCenter(bounds.getCenter());
                map.fitBounds(bounds);
            } else {
                $('#' + mapID).text("The map could not be created");
            }
        });
    }
});