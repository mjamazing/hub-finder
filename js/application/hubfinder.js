$(document).ready(function() {

    $("#findhubsbutton").click(function() {
        var hubs = $("#hublist").val().split("\n");
        var addresses = $("#addresslist").val().split("\n");
        hubs = $.map(hubs, function(val) {
            return val.replace(/ /g, "+").replace(/,/g, "+");
        });
        addresses = $.map(addresses, function(val) {
            return val.replace(/ /g, "+").replace(/,/g, "+");
        });
        var hublist = hubs.join("|");
        var addresslist = addresses.join("|");
        alert(hublist);
        alert(addresslist);
    });

});