$(function() {
    $("#review-submission-form").submit(function(event){
        var form = {
            'rating_stars': $('#submission-raty').raty('score'),
            'rating_title': $('#reviewTitle').val(),
            'rating_body': $('#reviewBody').val(),
        };
        console.log(form);

        event.preventDefault();    //current standard
        event.returnValue = false; //some older browsers
        return false;              //most older browsers
    });
    // Display average rating for movie
    // var avg_raty = 3;
    // $('#avg-raty').raty({
    //     'score': avg_raty,
    //     'readOnly': true
    // });

    $('#submission-raty').raty();
});

