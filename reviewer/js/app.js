Parse.initialize("lnI74xBuUcxJ5JwlWcdRMNfMlBSvvPRh5v2WRWVU", "iWPTeMpRzvObmJk2ndAyCmEZnrmMXOEmjrer1l7v");
var Review = Parse.Object.extend('Review');
var raty_id = 0

function loadUser(params) {
  $.get('load_review.mst', function(template) {
    var rendered = Mustache.render(template, params);
    $('#saved-reviews').append(rendered);
    $('#review-raty-' + params['raty-id']).raty({
        'readOnly': true,
        'score': params['rating'],
    });
  });
}

$(function() {
    // Display average rating for movie at movie description header
    var avg_raty = 3; // Needs to be calculated
    $('#avg-raty').raty({
        'score': avg_raty,
        'readOnly': true
    });

    // Raty for submitting reviews
    $('#submission-raty').raty();

    // fetch reviews
    var query = new Parse.Query(Review);

    query.find().then(function(results) {
        results.forEach(function(item) {
            var rating = item.get('rating');
            raty_id += 1;
            var params = {
                'title': item.get('title'),
                'content': item.get('content'),
                'raty-id': raty_id,
                'rating': rating
            }
            loadUser(params);
        });
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

        raty_id += 1;
        var params = {
            'title': form.title,
            'content': form.content,
            'raty-id': raty_id,
            'rating': form.rating,
        }
        loadUser(params);
        

        event.preventDefault();    //current standard
        event.returnValue = false; //some older browsers
        return false;              //most older browsers
    });
});

