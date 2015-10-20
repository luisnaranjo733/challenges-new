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
var Song = Parse.Object.extend('Song');

// instantiate an
var mySong = new Song();

mySong.set('title', "Can't sleep");
mySong.set('artist', "Vanic x K.Flay");
mySong.increment('score');
mySong.set('year', 2014);

// mySong.save().then(function(obj) {
//     console.log('saved object');
// }, function(error) {
//     console.log(error);
// })

// create query
var query = new Parse.Query(Song);

// specify constraints
query.equalTo('artist', 'Vanic x K.Flay');

// run the query
query.find().then(function(results) {
    results.forEach(function(item) {
        item.increment('score');
        item.save();
        console.log(item.get('score'));    
    })
    
});