const cron = require('node-cron');

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
const request = require('request');
const cheerio = require('cheerio');

const task = cron.schedule('*/1 * * * *', () => {

  let url = 'http://www.costco.com/Callaway-Hex-Soft-Golf-Ball-4-dozen-.product.100233776.html';
  request(url, function(error, response, html){

    var $ = cheerio.load(html);

    if(error){
      throw new Error(error);
    }

    // if there is an out of stock button - don't send text, else alert!

    if ( $('#product-page #product-details #ctas #add-to-cart input[type="button"]')['0'].attribs.value === 'Out of Stock') {
      console.log("still out of stock");
    } else {
      sendMessage();
    }

  });

}, true);

const sendMessage = () => {
  client.Message.send({
    from : "+13473780691", // This must be a Catapult number on your account
    to   : "+12024684923",
    text : "Balls are available!!!"
  })
  .then(function(message) {
      console.log("Message sent with ID " + message.id);
  })
  .catch(function(err) {
      console.log(err.message);
  });
};

task.start();
