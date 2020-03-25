'use strict';

const  matcher = require('./Matcher'); 
const  surf = require('./Surf'); 

var colors = require('colors');
const Readline = require('readline');
const rl = Readline.createInterface({
    input : process.stdin,
    output:process.stdout,
    terminal : false
})

function ChoiceToGo(h,p)
{
    var hok = Height(h) // height ok
    var pok = Period(p) // period ok
    
    if(hok==10 && pok==1)
    {
        console.log("It's a good day to surf with all kind of boards ! Take your 6'6 !")     
    }
    else if(hok==20 && pok==1)
    {
        console.log("It's a good day for beginners and longboards session !")
    }
    else if(hok==30 && pok==1)
    {
        console.log("It's kind of huge conditions. Go for the tube !")
    }
    else if(hok == 0 || pok==0)
    {
        console.log("Not enough waves to surf today... Stay at home or go paddle !")
    }
}

function Height(h)
{
    var hok=1
    if(h <= 1.2 && h > 0.7)
    {
        console.log("The height of the waves is perfect !")
        hok=10
    }
    if(h <= 0.7 && h >= 0.4)
    {
        hok=20
        console.log("The height of the waves is pretty small ! ")     
    }
    else if(h > 1.2)
    {
        hok=30
        console.log("Alert big waves ! ")
    }
    else if(h < 0.4)
    {
        console.log("No waves to surf today... Stay at home or go paddle !")
        hok=0
    }
    return hok
}

function Period(p)
{
    var pok = 1;
    if(p > 4 && p < 13)
    {
        console.log("By the way, the period is good, you have time between waves but not too much ! ")
        
    }
    else if(p >= 13)
    {
        console.log("By the way, the period between waves is a little bit long .. you may have to wait. Don't get bored and catch it when it comes. ")
    }
    else if(p <= 4)
    {
        console.log("By the way, the period is too short .. it's gonna be a mess")
        pok=0
    }

    return pok
}

function WetSuit(t)
{
    console.log("The temperature of the sea is "+ t + " degrees Celsius")

    if (t<6)
    {
        console.log("It is super cold ! You are not a polar bear, are you?")
    }
    else if(t<=14 && t>6)
    {
        console.log("Therefore, you should wear your 4/3mm wet suit to surf today")
        
    }
    else if(t>14 && t<=17)
    {
        console.log("Therefore, you should wear your 3/2mm wet suit to surf today")
    }
    else if(t>17 && t<=20)
    {
        console.log("Therefore, you should wear your shorty wet suit to surf today")       
    }
    else if(t>20)
    {
        console.log("Therefore, you don't need a wet suit to surf today !")       
    }


}

function Wind(windspeed, windunit)
{
    console.log("Surf report : There will be a wind of "+ windspeed+ " "+ windunit +".");
    const kmh = windspeed * 3.6
    console.log("This is equivalent to "+ kmh +" km/h");

    if(kmh>25)
    {
        console.log("You should consider doing kitesurf today ...")
    }
}

function Board(h)
{
    var hok = Height(h)  
    
    if(hok==10)
    {
        console.log("Waves are good for all boards today ! For example, take your 6'6 !")     
    }
    else if(hok==20)
    {
        console.log("Waves are small and smooth .. Take your longboard 9'2 !")
    }
    else if(hok==30 )
    {
        console.log("Ehh "+h+"m waves ! Take your fish 5'1 board !")
    }
    else if(hok == 0 || pok==0)
    {
        console.log("It's flat .. Take a paddle dude!")
    }
}

function Spot(i)
{
    var result= 1540 //bidart by default

    if (i == "bidart")
    {
        result= 1540
    }
    if (i == "parlementia")
    {
        result= 1515
    }

    return result
}




rl.setPrompt('> ')
rl.prompt();
rl.on('line',reply=>{
    matcher(reply , cb => {
        switch(cb.intent){
            case "Hello": 
                console.log(`${cb.entities.greeting} you !`);
                rl.prompt();
                break;
            case "Cava": 

                surf(Spot(cb.entities.spot), "current")
                .then(response => {                            
                    console.log("Surf report : "+ response[0]+" voila.");
                    rl.prompt();
                })
                .catch(error => {
                    console.log(error);
                    rl.prompt();
                })
                rl.prompt();
                break;
            case "Exit":
                console.log("Bye !");
                process.exit(0);        

            case "Spot": 
                surf(Spot(cb.entities.spot), "current")
                .then(response => {  

                    const intro = "Surf report in "+cb.entities.spot+"."          
                    console.log(intro.red);
                    const period =response[0].swell.components.combined.period ;
                    const height=response[0].swell.components.combined.height;

                    const t =response[0].condition.temperature

                    const windspeed = response[0].wind.speed 
                    const windunit = response[0].wind.unit

                    Wind(windspeed, windunit)
                    console.log("There is waves of "+ height +response[0].swell.unit+" and a period of "+period+" seconds"+".");
                    ChoiceToGo(height, period)
                    Board(height)
                    WetSuit(t)
                    
                    rl.prompt();
                })
                .catch(error => {
                    console.log(error);
                    rl.prompt();
                })
                rl.prompt();
                break;

            case "Mood": 
                surf(Spot(cb.entities.spot), "current")
                .then(response => {            
                    console.log("Surf report in "+cb.entities.spot+" about "+cb.entities.nature);
                    //console.log(JSON.stringify(response, null, 2));
                    const spot = cb.entities.spot

                    const period =response[0].swell.components.combined.period ;
                    const height=response[0].swell.components.combined.height;

                    const t =response[0].condition.temperature
                    
                    const windspeed = response[0].wind.speed 
                    const windunit = response[0].wind.unit

                    console.log("In "+ spot.red)

                    if(cb.entities.nature == "wind")
                    {
                        Wind(windspeed, windunit)
                    }
                    if(cb.entities.nature == "waves")
                    {                

                      console.log("There is waves of "+ height +response[0].swell.unit+" and a period of "+period+" seconds"+".");
                      ChoiceToGo(height, period)

                    }

                    if(cb.entities.nature == "temperature")
                    {
                        console.log("The temperature of the sea is "+ t + " degrees Celsius")
                    }

                    rl.prompt();
                })
                .catch(error => {
                    console.log(error);
                    rl.prompt();
                })
                rl.prompt();
                break;

            case "Equipment": 
                surf(Spot(cb.entities.spot), "current")
                .then(response => {  

                    const intro = "For "+ cb.entities.spot+ " :"          
                    console.log(intro.red);
                    const period =response[0].swell.components.combined.period ;
                    const height=response[0].swell.components.combined.height;

                    const t =response[0].condition.temperature          
                    console.log("There is waves of "+ height +response[0].swell.unit+" and a period of "+period+" seconds"+".");

                    if(cb.entities.equipment == "board" || cb.entities.equipment == "equipment" )
                    {
                        Board(height)
                    }

                    if(cb.entities.equipment == "suit" || cb.entities.equipment == "equipment")
                    {
                        WetSuit(t)            
                    }
                    
                    
                    rl.prompt();
                })
                .catch(error => {
                    console.log(error);
                    rl.prompt();
                })
                rl.prompt();
                break;

            default: {
                console.log("Sorry I didn't understand, please rephrase your question.");
                rl.prompt();                
            }
        }

    });
    rl.prompt();
})