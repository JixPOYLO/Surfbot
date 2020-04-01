const patternDict = [
    {
        pattern: '\\b(?<greeting>Hi|Hello|Hey|Hey!)\\b',
        intent: 'Hello'
    },

    {
        pattern:'(?<ww>weather|cold|warm)\\s+(in)\\s+(?<city>.+?)\\s+(?<time>today|tomorrow|the day after tomorrow)?\\?',
       
        intent: 'CurrentWeather'
    }, 

    {
        pattern : '\\b(bye|exit)\\b',
        intent: 'Exit'
    },

    {
        pattern : '(?<forecast>conditions|atmosphere|mood)\\s+(in)\\s+(?<spot>Bidart|Parlementia)?\\?',
        intent: 'Spot'
    },

    {
        pattern : '(?<nature>wind|waves|temperature)\\s+(in)\\s+(?<spot>Bidart|Parlementia)?\\?',
        intent: 'Mood'
    },

    {
        pattern : '(?<equipment>board|suit|equipment)\\s+(for)\\s+(?<spot>Bidart|Parlementia)?\\?',
        intent: 'Equipment'
    },

    {
        pattern : '\\b(ca va ?|cava)\\b',
        intent: 'Cava'
    },

   

];

    module.exports = patternDict ;