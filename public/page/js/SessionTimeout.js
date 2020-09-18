$(document).ready(function() {
//
var counter = 5;
var interval = setInterval(function() {
    counter--;
    jQuery("#number").html(counter);
    if (counter == 0) {
        //Do something
        jQuery("#number").html("Countdown ended!");
        // Stop the counter
        clearInterval(interval);
    }
}, 1000);
//
});