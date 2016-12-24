const cron = require('node-cron');
const router = require('express').Router();

// bandwidth API consts
const Bandwidth = require("node-bandwidth");
const userId = process.env.USER_ID || require('./api_keys.js').userId;
const apiToken = process.env.API_TOKEN || require('./api_keys.js').apiToken;
const apiSecret = process.env.API_SECRET || require('./api_keys.js').apiSecret;

const client = new Bandwidth({
  userId,
  apiToken,
  apiSecret
});

// scraping
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');


router.get('/', (req, res, next) => {
   url = 'http://www.costco.com/Kirkland-Signature-Four-Piece-Urethane-Cover-Golf-Ball,-2-dozen.product.100310467.html';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var stockStatus;

            console.log($);
        }
    })
})

const sendMessage = () => {
  client.Message.send({
    from : "++12024684923", // This must be a Catapult number on your account
    to   : "+12035921392",
    text : "Balls are available!!!"
  })
  .then(function(message) {
      console.log("Message sent with ID " + message.id);
  })
  .catch(function(err) {
      console.log(err.message);
  });
}

module.exports = router
