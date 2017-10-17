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


var qnarecognizer = new builder_cognitiveservices.QnAMakerRecognizer({knowledgeBaseId: process.env.QnAKnowledgebaseId, subscriptionKey: process.env.QnASubscriptionKey});

// *************************************************** QnAMaker********************************* //

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);


var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({knowledgeBaseId: process.env.QnAKnowledgebaseId, subscriptionKey: process.env.QnASubscriptionKey});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: 'So sorry, but I do not understand the question. For all information please checkout the website at www.cancer.ie, or try rephrasing your question',
                qnaThreshold: 0.3}
);


// this is where the message is posted to the QnA maker to get a response
bot.dialog('/', basicQnAMakerDialog);
