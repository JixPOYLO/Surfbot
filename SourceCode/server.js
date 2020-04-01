'use strict';
const bodyparser = require('body-parser');

const express = require('express');
const config = require('./config');
const FBeamer = require('./fbeamer');
const  matcher = require('./Matcher'); 
const  surf = require('./Surf'); 

const server = express();
const PORT = process.env.PORT || 3000;

const FB = new FBeamer(config.FB);

server.get('/', (request, response) => FB.registerHook(request, response));
server.listen(PORT, () => console.log(`FBeamer Bot Service running on Port ${PORT}`));
server.post('/', bodyparser.json({ verify: FB.verifySignature.call(FB) }));

server.post('/', (request, response, data) => {
    
  return FB.incoming(request, response, data => 
    {            
                    //console.log("data0")
                    //console.log(data[0])
                    //console.log("done")
        if(data[0].hasOwnProperty("message"))
            {
                // console.log("enfin")
                var userData = FB.messageHandler(data);
                    
                    
                 //console.log("ici")
                //console.log(userData.content)
                var reply = userData.content

                    
                    

                    //#region 
                    
                matcher(reply , cb => {
             
                            switch(cb.intent){
                                case "Hello": 
                                    var r = "Aloha !" +"\n"
                                    r=r+"Ask me questions about your fav surfspots ! "
                                    FB.sendMessage("RESPONSE", userData.sender, r);
                                    //rl.prompt();
                                    break;

                                case "Cava": 

                                    surf(Spot(cb.entities.spot), "current") 
                                    .then(response => {                            
                                        console.log("Surf report : "+ response[0].swell.components.combined.height+"m of waves voila.");
                                        var rc = "Surf report : "+ response[0].swell.components.combined.height+"m of waves voila."
                                        FB.sendMessage("RESPONSE", userData.sender, rc);
                                        // rl.prompt();
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        //rl.prompt();
                                    })
                                    // rl.prompt();
                                    break;
                                case "Exit":
                                    console.log("Have a good time ! Adios !");
                                    var re = "Have a good time ! Adios !"
                                    FB.sendMessage("RESPONSE", userData.sender, re);
                                    //process.exit(0);     
                                    break;   

                                case "Spot": 
                                    surf(Spot(cb.entities.spot), "current")
                                    .then(async(response) => {  
                                        const spot =cb.entities.spot

                                        const period =response[0].swell.components.combined.period ;
                                        const height=response[0].swell.components.combined.height;

                                        const t =response[0].condition.temperature

                                        const windspeed = response[0].wind.speed 
                                        const windunit = response[0].wind.unit

                                        var rep1="There is waves of "+ height +response[0].swell.unit+" in "+spot+" and a period of "+period+" seconds"+"."
                                        FB.sendMessage("RESPONSE", userData.sender, rep1);

                                        var rep2=ChoiceToGo(height, period)
                                        FB.sendMessage("RESPONSE", userData.sender, rep2);

                                       
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        //rl.prompt();
                                    })
                                    //rl.prompt();
                                    break;


                                case "Mood": 
                                    surf(Spot(cb.entities.spot), "current")
                                    .then(response => {            
                                        
                                        //FB.sendMessage("RESPONSE", userData.sender, repm);
                                        const spot = cb.entities.spot
                                        const param=cb.entities.nature

                                        const period =response[0].swell.components.combined.period ;
                                        const height=response[0].swell.components.combined.height;

                                        const t =response[0].condition.temperature
                                        
                                        const windspeed = response[0].wind.speed 
                                        const windunit = response[0].wind.unit

                                        var repSpot="I really like "+spot+" too !"
                                        if (spot=="Bidart")
                                        {
                                            repSpot="I love "+spot+" and I love the nice bars around hehe"
                                        }

                                        FB.sendMessage("RESPONSE", userData.sender, repSpot);
                                        wait(300)

                                        if(param  == "wind")
                                        {
                                            var repw=Wind(windspeed, windunit)
                                            FB.sendMessage("RESPONSE", userData.sender, repw);
                                            //console.log("winnnnnd")

                                        }
                                        
                                        else if(param == "waves")
                                        {                

                                            console.log("wavessss")
                                            console.log("There is waves of "+ height +response[0].swell.unit+" and a period of "+period+" seconds"+".");

                                            var repA="There is waves of "+ height +response[0].swell.unit+" in "+spot+" and a period of "+period+" seconds"+"."
                                            FB.sendMessage("RESPONSE", userData.sender, repA);
                                            wait(5000)
                                            var repB=ChoiceToGo(height, period)
                                            FB.sendMessage("RESPONSE", userData.sender, repB);


                                        }

                                        else if(cb.entities.nature == "temperature")
                                        {
                                            console.log("The temperature of the sea is "+ t + " degrees Celsius")
                                            var rept="The temperature of the sea is "+ t + " degrees Celsius"
                                            FB.sendMessage("RESPONSE", userData.sender, rept);

                                        }

                                        //rl.prompt();
                                    })

                                    .catch(error => {
                                        console.log(error);
                                        // rl.prompt();
                                    })
                                    //rl.prompt();
                                    break;

                                case "Equipment": 
                                    surf(Spot(cb.entities.spot), "current")
                                    .then(response => {                           
                                        
                                        const spot = cb.entities.spot
                                        const period =response[0].swell.components.combined.period ;
                                        const height=response[0].swell.components.combined.height;
                                        const unit =response[0].swell.unit;

                                        const t =response[0].condition.temperature          
                                        //console.log("There is waves of "+ height +response[0].swell.unit+" and a period of "+period+" seconds"+".");
                                        // var repX="There is waves of "+ height +unit+" and a period of "+period+" seconds"+"."
                                        //FB.sendMessage("RESPONSE", userData.sender, repX);

                                        //var repS="For "+spot+" today:"
                                        //FB.sendMessage("RESPONSE", userData.sender, repS);
                                        //wait(5000)

                                        if(cb.entities.equipment == "board" || cb.entities.equipment == "equipment" )
                                        {
                                            var repV=Board(height)
                                            FB.sendMessage("RESPONSE", userData.sender, repV);
                                        }

                                        if(cb.entities.equipment == "suit" || cb.entities.equipment == "equipment")
                                        {
                                            var repN=WetSuit(t)      
                                            FB.sendMessage("RESPONSE", userData.sender, repN);      
                                        }
                                        
                                        
                                        //rl.prompt();
                                    })

                                    .catch(error => {
                                        console.log(error);
                                        //rl.prompt();
                                    })
                                    //rl.prompt();
                                    break;

                                default: {
                                    console.log("Sorry I didn't understand, please rephrase your question.");
                                    var repdef="Sorry I didn't understand, please rephrase your question."
                                    FB.sendMessage("RESPONSE", userData.sender, repdef);
                                    //rl.prompt();                
                                }
                        }

                    });

                
                    //#endregion
                } //test big if to not get errors


                  
        

    });
});



function ChoiceToGo(h,p)
{
    var toreturn =""
     // height ok
    var hok=1
    if(h <= 1.2 && h > 0.7)
    {
        console.log("The height of the waves is perfect !")
        toreturn+= "The height of the waves is perfect !"+"\n"
    }
    if(h <= 0.7 && h >= 0.4)
    {
        hok=20
        console.log("The height of the waves is pretty small ! ")     
        toreturn+= "The height of the waves is pretty small ! "+"\n"

    }
    else if(h > 1.2)
    {
        hok=30
        console.log("Alert big waves ! ")
        toreturn+= "Alert big waves ! "+"\n"

    }
    else if(h < 0.4)
    {
        console.log("No waves to surf today... Stay at home or go paddle !")
        toreturn+= "No waves to surf today... Stay at home or go paddle !"+"\n"

        hok=0
    }

    // period ok
    var pok = 1;

    if(p > 4 && p < 13)
    {
        console.log("By the way, the period is good, you have time between waves but not too much ! ")
        toreturn+= "By the way, the period is good, you have time between waves but not too much ! "+"\n"

    }
    else if(p >= 13)
    {
        console.log("By the way, the period between waves is a little bit long .. you may have to wait. Don't get bored and catch it when it comes. ")
        toreturn+= "By the way, the period between waves is a little bit long .. you may have to wait. Don't get bored and catch it when it comes. "+"\n"

    }
    else if(p <= 4)
    {
        console.log("By the way, the period is too short .. it's gonna be a mess")
        toreturn+= "By the way, the period is too short .. it's gonna be a mess"+"\n"

        pok=0
    }
    
    if(hok==10 && pok==1)
    {
        console.log("It's a good day to surf with all kind of boards ! Take your 6'6 !")   
        toreturn+= "It's a good day to surf with all kind of boards ! Take your 6'6 !"+"\n"  
    }
    else if(hok==20 && pok==1)
    {
        console.log("It can be a good day for beginners and longboards session !")
        toreturn+= "It can be a good day for beginners and longboards session !"+"\n"  

    }
    else if(hok==30 && pok==1)
    {
        console.log("It's kind of huge conditions. Go for the tube !")
        toreturn+= "It's kind of huge conditions. Go for the tube !"+"\n"  

    }
    else if(hok == 0 || pok==0)
    {
        console.log("Not enough waves to surf today... Stay at home or go paddle !")
        toreturn+= "Not enough waves to surf today... Stay at home or go paddle !"+"\n"  


    }

    return toreturn 
}

function WetSuit(t)
{
    var toreturn=""
    console.log("The temperature of the sea is "+ t + " degrees Celsius")
    toreturn+="The temperature of the sea is "+ t + " degrees Celsius"+"\n" 

    if (t<6)
    {
        console.log("It is super cold ! You are a polar bear if you go")
        toreturn+= "It is super cold ! You are a polar bear if you go"+"\n"    

    }
    else if(t<=14 && t>6)
    {
        console.log("Therefore, you should wear your 4/3mm wet suit  if you go to surf today")
        toreturn+= "Therefore, you should wear your 4/3mm wet suit  if you go to surf today "+"\n" 
        
    }
    else if(t>14 && t<=17)
    {
        console.log("Therefore, you should wear your 3/2mm wet suit  if you go to surf today")
        toreturn+="Therefore, you should wear your 3/2mm wet suit  if you go to surf today" +"\n" 
    }
    else if(t>17 && t<=20)
    {
        console.log("Therefore, you should wear your shorty wet suit  if you go to surf today")  
        toreturn+= "Therefore, you should wear your shorty wet suit  if you go to surf today "+"\n"      
    }
    else if(t>20)
    {
        console.log("Therefore, you don't need a wet suit  if you go to surf today !")   
        toreturn+= "Therefore, you don't need a wet suit  if you go to surf today ! "+"\n"    
    }

    return toreturn


}

function Wind(windspeed, windunit)
{
    console.log("There will be a wind of "+ windspeed+ " "+ windunit +".");
    var toreturn = "There will be a wind of "+ windspeed+ " "+ windunit +"."+"\n"   
    const kmh = windspeed * 3.6
    console.log("This is equivalent to "+ kmh +" km/h");
    toreturn+= "This is equivalent to "+ kmh +" km/h"+"\n"   

    if(kmh>25)
    {
        console.log("Maybe you should consider doing kitesurf today ...")
        toreturn+= "Maybe you should consider doing kitesurf today ..."+"\n"    
    }

    return toreturn
}


function Board(h)
{
    var hok = 1  
    if(h <= 1.2 && h > 0.7)
    {
        hok=10
    }
    if(h <= 0.7 && h >= 0.4)
    {
        hok=20
    }
    else if(h > 1.2)
    {
        hok=30
    }
    else if(h < 0.4)
    {
        hok=0
    }

    var toreturn =""
    if(hok==10)
    {
        console.log("Waves can be good for all boards today ! For example, take your 6'6 if you go!") 
        toreturn+= "Waves can be good for all boards today ! "+ h +"m ! For example, take your 6'6 if you go!"+"\n"        
    }
    else if(hok==20)
    {
        console.log("Waves are small and smooth .. "+ h +"m ! Take your longboard 9'2  if you go!")
        toreturn+= "Waves are small and smooth .. "+ h +"m ! Take your longboard 9'2  if you go!"+"\n"    
    }
    else if(hok==30 )
    {
        console.log("Ehh "+h+"m waves ! Take your fish 5'1 board  if you go!")
        toreturn+= "Ehh "+h+"m waves ! Take your fish 5'1 board  if you go!"+"\n"  
    }
    else if(hok == 0 )
    {
        console.log("It's flat .."+ h +"m ! Take a paddle dude!")
        toreturn+= "It's flat .. "+ h +"m !Take a paddle dude!"+"\n"  
    }

    return toreturn
}

function Spot(i)
{
    var result= 1540 //bidart by default

    if (i == "Bidart")
    {
        result= 1540
    }
    if (i == "Parlementia")
    {
        result= 1515
    }

    return result
}


function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
 }

