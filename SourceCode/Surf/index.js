"use strict ";
 const axios = require ("axios");
 const apikey = '2393fdec24636ec46ed95c85937aae43' ; 

 const getForecast= idlocation => { 
 return new Promise ( async ( resolve , reject ) => {
 try {
 const Conditions = await axios.get( `http://magicseaweed.com/api/${apikey}/forecast/?spot_id=${idlocation}`,

       {
        params : {
            key: apikey ,
            q: idlocation ,
         }
    
      });

             resolve (Conditions.data ) // returns back the results to the chatbot
         }
        catch ( error ){
            reject ( error );
        }
    });
 }

 module.exports = getForecast ;