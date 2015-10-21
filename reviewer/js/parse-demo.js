'use strict';

/*

* Sign up for parse
* Create a new app
* Include the parse library in html (js)
* Initialize app (in js) using your ID and app tokens

*/


Parse.initialize("lnI74xBuUcxJ5JwlWcdRMNfMlBSvvPRh5v2WRWVU", "iWPTeMpRzvObmJk2ndAyCmEZnrmMXOEmjrer1l7v");

//more code goes here!

// extend the 
var Review = Parse.Object.extend('Review');

// instantiate an
// var myReview = new Review();

// myReview.set('title', "Phenomenal movie");
// myReview.set('content', "Great acting, great directing, what's not to love?");
// myReview.set('rating', 4);

// myReview.save().then(function(obj) {
//     console.log('saved object');
// }, function(error) {
//     console.log(error);
// })

// create query
var query = new Parse.Query(Review);

// specify constraints
// query.equalTo('artist', 'Vanic x K.Flay');

// run the query
query.find().then(function(results) {
    results.forEach(function(item) {
        console.log(item.get('title'));    
    })
    
});