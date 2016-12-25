// bandwidth API consts
const Bandwidth = require("node-bandwidth");
const userId = process.env.USER_ID || require('./env/development.js').userId;
const apiToken = process.env.API_TOKEN || require('./env/development.js').apiToken;
const apiSecret = process.env.API_SECRET || require('./env/development.js').apiSecret;

const client = new Bandwidth({
  userId,
  apiToken,
  apiSecret
});

// scraping
const request = require('request');
const cheerio = require('cheerio');

const task = () => {

  // toggle so doesn't send message multiple times if continuously available
  let alreadyAvailable = false;

  let url = 'http://www.costco.com/Kirkland-Signature-Four-Piece-Urethane-Cover-Golf-Ball,-2-dozen.product.100310467.html';
  request(url, function(error, response, html){

    var $ = cheerio.load(html);

    if(error){
      throw new Error(error);
    }

    // if there is an out of stock button - don't send text, else alert!

    if ( $('#product-page #product-details #ctas #add-to-cart input[type="button"]')['0'].attribs.value === 'Out of Stock') {
      alreadyAvailable = false;
      console.log("still out of stock");
    } else {
      if (alreadyAvailable === false) {
        sendMessage();
        alreadyAvailable = true;
      }
    }

  });
};

const sendMessage = () => {

  //send text using bandwidth client
  client.Message.send({
    from : "+13473780691",
    to   : "+12035921392",
    text : "The balls are available! Log on quick and grab yourself some."
  })
  .then(function(message) {
      console.log("Message sent with ID " + message.id);
  })
  .catch(function(err) {
      console.log(err.message);
  });
};

// invocate task when heroku scheduler runs this script
task();
