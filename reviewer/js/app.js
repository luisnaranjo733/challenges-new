Parse.initialize("lnI74xBuUcxJ5JwlWcdRMNfMlBSvvPRh5v2WRWVU", "iWPTeMpRzvObmJk2ndAyCmEZnrmMXOEmjrer1l7v");
var Review = Parse.Object.extend('Review');

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


function alert(title, content, alert_type, parent) {
    var html = '<div class="alert alert-' + alert_type;
    html += ' alert-dismissible" role="alert">';
    html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
    html += '<span aria-hidden="true">&times;</span></button>';
    html += '<strong>' + title;
    html += '</strong> ' + content + '</div>';
    html = $(html);
    html.prependTo(parent);
    return html;
}


function deleteReview(close_icon) {
    showLoadingIcon();

    var objectID = close_icon.target.id.slice(13);

    var query = new Parse.Query(Review);
    query.equalTo('objectId', objectID);
    query.find().then(function (results) {
        results.forEach(function(item) {
            item.destroy({});
        });
    }).then(function () {
        updateAvgReview();
        hideLoadingIcon();
    });

    var reviewDiv = $('#saved-review-' +  objectID);
    reviewDiv.remove();
}

function updateReviewCount(objectID, direction) {
    var query = new Parse.Query(Review);
    query.equalTo('objectId', objectID);
    console.log(objectID);
    query.first({
        'success': function(result) {
            result.increment('reviewCount', direction);
            result.save().then(function (result){
                var counter_element = $('#review-counter-' + objectID);
                var updated_count = result.get('reviewCount');
                if (updated_count > 0) {
                    updated_count = '+' + updated_count;
                }
                counter_element.text(updated_count);
                hideLoadingIcon();
            });
        }
    });
    
}

function thumbsUp(icon) {
    showLoadingIcon();
    var objectID = icon.target.id.slice(10);
    updateReviewCount(objectID, 1);
}

function thumbsDown(icon) {
    showLoadingIcon();
    var objectID = icon.target.id.slice(12);
    updateReviewCount(objectID, -1);
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
    review_counter.attr('id', 'review-counter-' + data['id']);
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

function showLoadingIcon() {
    var container = $('#container');
    var loading_icon = $('<i>');
    loading_icon.attr('class', 'fa fa-5x fa-circle-o-notch fa-spin loading');
    loading_icon.attr('id', 'loading_icon');
    loading_icon.appendTo(container);
}

function hideLoadingIcon() {    
    $('#loading_icon').remove();
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
        showLoadingIcon();
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

        var data = {
            'title': form.title,
            'content': form.content,
            'rating': form.rating,
            'id': myReview.id,
            'reviewCount': 0,
        }

        myReview.save().then(function(obj) {
            updateAvgReview();
            var data = {
                'title': form.title,
                'content': form.content,
                'rating': form.rating,
                'id': myReview.id,
                'reviewCount': 0,
            }
            addReviewToDOM(data, true);
            hideLoadingIcon();
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

/* Remaining requirements

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