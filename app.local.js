/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var builder_cognitiveservices = require("botbuilder-cognitiveservices");

// Setup Restify Server to run the bot application app.js
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// keys are hard coded for local config only
var qnarecognizer = new builder_cognitiveservices.QnAMakerRecognizer({knowledgeBaseId: "e9f4a9e8-4248-449a-8829-4256931e51fb", 
subscriptionKey: "6582f5c4a2d649d1be85220918e56bdf"});

// create a dialog that interacts with the qnamaker
var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
    recognizers: [qnarecognizer],
    defaultMessage: 'So sorry, but I do not understand the question. For all information please checkout the website at www.cancer.ie, or try rephrasing your question',
    qnaThreshold: 0.3}
);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.dialog('/', basicQnAMakerDialog);

/* replace line below before 
var qnarecognizer = new builder_cognitiveservices.QnAMakerRecognizer({knowledgeBaseId: process.env.QnAKnowledgebaseId, subscriptionKey: process.env.QnASubscriptionKey});

// *************************************************** QnAMaker********************************* //

// Create your bot with a function to receive messages from the user
//var bot = new builder.UniversalBot(connector);

/*
var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({knowledgeBaseId: process.env.QnAKnowledgebaseId, subscriptionKey: process.env.QnASubscriptionKey});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: 'So sorry, but I do not understand the question. For all information please checkout the website at www.cancer.ie, or try rephrasing your question',
                qnaThreshold: 0.3}
);


// this is where the message is posted to the QnA maker to get a response
bot.dialog('/', basicQnAMakerDialog);
*/

// *************************************************** LUIS ********************************* //

/*

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })

.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/

.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

bot.dialog('/', intents);    

*/