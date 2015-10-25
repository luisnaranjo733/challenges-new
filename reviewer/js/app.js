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
        });
    }).then(updateAvgReview);

    var reviewDiv = $('#saved-review-' +  objectID);
    reviewDiv.remove();
}

function thumbsUp(icon) {
    var objectID = icon.target.id.slice(10);
    var query = new Parse.Query(Review);
    query.equalTo('objectId', objectID);
    query.first({
        'success': function(result) {
            result.increment('reviewCount');
            result.save();
        }
    });
}

function thumbsDown(icon) {
    var objectID = icon.target.id.slice(12);
    var query = new Parse.Query(Review);
    query.equalTo('objectId', objectID);
    query.first({
        'success': function(result) {
            result.increment('reviewCount', -1);
            result.save();
        }
    });
}


function addReviewToDOM(data, created) {
    var review_div = $('<div>').attr('class', 'saved-review');
    review_div.attr('id', 'saved-review-'  + data['id']);
    var h3 = $('<h3>').text(data['title']);
    var close_icon = $('<i>').attr('id', 'review-close-' +  data['id']);
    close_icon.attr('class', 'fa fa-close exit-icon');
    close_icon.click(deleteReview);
    var thumbs_up_icon = $('<i>').attr('class', 'fa fa-thumbs-up thumbs-icon');
    thumbs_up_icon.attr('id', 'thumbs-up-' + data['id']);
    thumbs_up_icon.click(thumbsUp);
    var review_counter =  $('<i>').attr('class', 'thumbs-icon');
    review_counter_str = data['reviewCount'];

    if (review_counter_str > 0) {
        review_counter_str = '+' + review_counter_str;
    } 
    review_counter.text(review_counter_str);
    var thumbs_down_icon = $('<i>').attr('class', 'fa fa-thumbs-down thumbs-icon');
    thumbs_down_icon.attr('id', 'thumbs-down-' + data['id']);
    thumbs_down_icon.click(thumbsDown);
    var raty_div_id = 'review-raty-' + data['id'];
    var raty_div = $('<div>').attr('id', raty_div_id);
    raty_div.attr('class', 'raty');
    var body = $('<p>').text(data.content);

    var children = [h3, close_icon, thumbs_up_icon, review_counter, thumbs_down_icon, raty_div, body];
    children.forEach(function(element, i) {
        children[i] = element.get(0);
    });
    $(children).appendTo(review_div);
    review_div.appendTo($('#saved-reviews'));

    if (created) {
        $('html, body').animate({
            scrollTop: $('#review-raty-' + data['id']).offset().top
        }, 250);      
    }

    $('#' + raty_div_id).raty({
        'readOnly': true,
        'score': data.rating,
    })   
}

function updateAvgReview() {
    var query = new Parse.Query(Review);

    query.find().then(function(results) {
        var ratings_count = 0;
        var ratings_sum =  0;
        results.forEach(function(item) {
            ratings_count += 1;
            var rating = item.get('rating');
            ratings_sum += rating;
        });
        var avg_rating = ratings_sum / ratings_count;
        avg_rating = round(avg_rating, 1);
        console.log('Upaged avg: ' +  avg_rating);

        // Display average rating for movie at movie description header
        $('#avg-raty').raty({
            'score': avg_rating,
            'readOnly': true
        });
            // calculate average rating
    });

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
                'reviewCount': item.get('reviewCount'),
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
        myReview.set('reviewCount', 0);

        myReview.save().then(function(obj) {
            console.log('saved object');
            updateAvgReview();
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

/* Remaining requirements

* Users must be able to indicate whether a particular review was helpful or unhelpful
    (e.g., up/down vote icons or yes/no buttons), and these vote totals must be
    persisted with the review object on Parse. Note that multiple users may be voting
    on the same review at the same time, so you should use Parse's atomic increment
    function to safely increment the values. To keep things simple, you may let users
    vote on their own reviews and vote multiple times. Check out the advanced
    extra-credit requirements if you want to enable authentication and authorization
    rules that prohibit this.
    - tl;dr atomic review upvote/downvote

* You must also display the vote totals with the review. How you display these vote
    totals is up to you, but look at how Amazon, Yelp, and other review sites do it.
    A typical approach is to build a string that says something like "2 out of 5
    people found this review helpful," but you may opt to show a percentage (texturally
    or graphically) instead.
    - tl;dr Display review upvote/downvote

* Because communication with the Parse server is asynchronous and not instantaneous,
    you must display visual feedback to the user that a save or fetch operation is in
    progress. This is typically done using some kind of animated icon that is shown while
    the request is happening, and hidden when the request ends. An easy and attractive
    option is to use the spin feature of the Font Awesome library.
    - tl;dr Visual feedback for the user during fetch operations

* If any of the Parse operations return an error, you should display the error's message
    property on the page so the user knows why the operation failed. If you are using Bootstrap,
    remember that they define style classes for alerts that are appropriate for displaying
    errors and other feedback to the user. You can even make these alerts interactive.
    - tl;dr Display error messages to user from parse operations

* Because the review title and body are entered by the user and integrated into the page
    by your code, you must protect against script injection attacks. The easiest way to
    do this is to use jQuery's text() method instead of it's html() method when
    populating the review title and body elements. The text() method escapes the HTML,
    so any embedded HTML will just show up literally on the page, and will not be
    interpreted as HTML by the browser.
    - tl;dr prevent script injection attacks

* Testing with a friend
* Extra Credit
    - Authentication/Authorization
    - Multiple things to review
    - Use a templating engine
*/