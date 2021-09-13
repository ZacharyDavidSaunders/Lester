
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const express = require('express');
const middlewares = require('./middlewares');
const index = require('./index');

const router = express.Router();

// Empty route
router.get('/', [
  middlewares.getRouteApiLimiter,  
  middlewares.loggingMiddleware], (req, res) => {
  res.status(200).send({
    success: 'TRUE',
    message: `You have reached ${index.NAME}v${index.VERSION}.`,
  });
});

// Search route
router.get('/search', [
  middlewares.getRouteApiLimiter,  
  middlewares.loggingMiddleware], (req, res) => {
  const searchString = req.query.searchString;
  let objectsInApiResponses = [];
  let haveAllApisResponded = false;

  const inventoryApis = ["https://api.jsonbin.io/b/5e2b66793d75894195de548e", 
                         "https://api.jsonbin.io/b/5e2b666350a7fe418c533306", 
                         "https://api.jsonbin.io/b/5e2b68903d75894195de55c4"];

  let numberOfRespondantApis = 0;
  for (let i = 0; i < inventoryApis.length; i++){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        const apiResponse = JSON.parse(xhttp.responseText);
        numberOfRespondantApis++;
        console.log("numberOfRespondantApis: " + numberOfRespondantApis);
        for(const element of apiResponse){
          objectsInApiResponses.push(element);
        }

        if(numberOfRespondantApis == inventoryApis.length){
          console.log(objectsInApiResponses.length);
          res.status(200).send({
            success: 'TRUE',
            message: objectsInApiResponses.filter((element) => {
              return element.name.toLowerCase().includes(searchString.toLowerCase());
            })
          });  
        }
      }
    };
    xhttp.open('GET', (inventoryApis[i]), true);
    console.log(`The following external API was called: ${inventoryApis[i]}`);
    xhttp.send();

    
  }
});

module.exports = router;