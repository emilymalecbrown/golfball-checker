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
  let url = 'http://www.costco.com/Kirkland-Signature-Four-Piece-Urethane-Cover-Golf-Ball,-2-dozen.product.100310467.html';
  request(url, function(error, response, html){

    var $ = cheerio.load('body');

    if(error){
      throw new Error(error);
    }

     // look for #ctas > ul > li (if li has ID qty then send text!)

    $('#product-page > #product-details > .row > .col-xs-12 col-sm-12 col-xl-9 > #ctas').forEach(function(i, element) {
      console.log(element)
    });

  });
});

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
};

module.exports = router
