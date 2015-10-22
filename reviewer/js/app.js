Parse.initialize("lnI74xBuUcxJ5JwlWcdRMNfMlBSvvPRh5v2WRWVU", "iWPTeMpRzvObmJk2ndAyCmEZnrmMXOEmjrer1l7v");
var Review = Parse.Object.extend('Review');

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function deleteReview(close_icon) {
    // review-close-9UOvQLnXXy --> 9UOvQLnXXy
    var objectID = close_icon.target.id.slice(13);

    var query = new Parse.Query(Review);
    query.equalTo('objectId', objectID);
    query.find().then(function (results) {
        results.forEach(function(item) {
            item.destroy({});
            console.log(item);
        });
    });

    var reviewDiv = $('#saved-review-' +  objectID);
    reviewDiv.remove();
}


function addReviewToDOM(data, created) {
    var review_div = $('<div>').attr('class', 'saved-review');
    review_div.attr('id', 'saved-review-'  + data['id']);
    var h3 = $('<h3>').text(data['title']);
    var close_icon = $('<i>').attr('id', 'review-close-' +  data['id']);
    close_icon.attr('class', 'fa fa-close exit-icon');
    close_icon.click(deleteReview);
    var thumbs_up_icon = $('<i>').attr('class', 'fa fa-thumbs-up thumbs-icon');
    var thumbs_down_icon = $('<i>').attr('class', 'fa fa-thumbs-down thumbs-icon');
    var raty_div_id = 'review-raty-' + data['id'];
    var raty_div = $('<div>').attr('id', raty_div_id);
    raty_div.attr('class', 'raty');
    var body = $('<p>').text(data.content);

    var children = [h3, close_icon, thumbs_up_icon, thumbs_down_icon, raty_div, body];
    children.forEach(function(element, i) {
        children[i] = element.get(0);
    });
    $(children).appendTo(review_div);
    review_div.appendTo($('#saved-reviews'));

    if (created) {
        $('html, body').animate({
            scrollTop: $('#review-raty-' + data['id']).offset().top
        }, 2000);      
    }

    $('#' + raty_div_id).raty({
        'readOnly': true,
        'score': data.rating,
    })
    
}

$(function() {
    // Raty for submitting reviews
    $('#submission-raty').raty({
        'score': 3,
    });

    // fetch reviews
    var query = new Parse.Query(Review);

    query.find().then(function(results) {
        var ratings_count = 0;
        var ratings_sum =  0;
        results.forEach(function(item) {
            var rating = item.get('rating');
            ratings_count += 1;
            ratings_sum += rating;
            var data = {
                'title': item.get('title'),
                'content': item.get('content'),
                'rating': rating,
                'id': item.id,
            }
            addReviewToDOM(data);
        });
        var avg_rating = ratings_sum / ratings_count;
        avg_rating = round(avg_rating, 1);

        // Display average rating for movie at movie description header
        $('#avg-raty').raty({
            'score': avg_rating,
            'readOnly': true
        });
            // calculate average rating
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

        var data = {
            'title': form.title,
            'content': form.content,
            'rating': form.rating,
            'id': myReview.id,
        }

        addReviewToDOM(data, true)
        

        event.preventDefault();    //current standard
        event.returnValue = false; //some older browsers
        return false;              //most older browsers
    });
});

