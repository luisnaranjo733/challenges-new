Parse.initialize("lnI74xBuUcxJ5JwlWcdRMNfMlBSvvPRh5v2WRWVU", "iWPTeMpRzvObmJk2ndAyCmEZnrmMXOEmjrer1l7v");
var Review = Parse.Object.extend('Review');

function loadUser(params) {
  $.get('load_review.mst', function(template) {
    var rendered = Mustache.render(template, params);
    $('#saved-reviews').html(rendered);
  });
}

$(function() {
    // Display average rating for movie
    var avg_raty = 3; // Needs to be calculated
    $('#avg-raty').raty({
        'score': avg_raty,
        'readOnly': true
    });

    $('#submission-raty').raty();

    // fetch reviews
    var query = new Parse.Query(Review);
    var raty_id = 0
    query.find().then(function(results) {
        results.forEach(function(item) {
            var rating = item.get('rating');
            raty_id += 1;
            var params = {
                'title': item.get('title'),
                'body': item.get('content'),
                'raty-id': raty_id,
            }
            loadUser(params);
            $('#review-raty-' + raty_id).raty('score', rating);
        });
    });

    // for each review
    $('#review-raty-1').raty({
        'score': 1,
        'readOnly': true
    });

    $('#review-raty-2').raty({
        'score': 5,
        'readOnly': true
    });

    // Intercept review submission form
    $("#review-submission-form").submit(function(event){
        var form = {
            'title': $('#reviewTitle').val(),
            'content': $('#reviewBody').val(),
            'rating': $('#submission-raty').raty('score'),
        };

        var myReview = new Review();

        myReview.set('title', form.title);
        myReview.set('content', form.content);
        myReview.set('rating', form.rating);

        myReview.save().then(function(obj) {
            console.log('saved object');
        }, function(error) {
            console.log(error);
        })

        $('#reviewTitle').val('')
        $('#reviewBody').val('')
        $('#submission-raty').raty('score', 0)


        event.preventDefault();    //current standard
        event.returnValue = false; //some older browsers
        return false;              //most older browsers
    });
});

