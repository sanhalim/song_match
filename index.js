
const Alexa = require('ask-sdk-core')

const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
// i18n library dependency, we use it below in a localisation interceptor
const i18n = require('i18next');


const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder
			.speak(welcomeMessage)
			.reprompt(helpMessage)
			.getResponse();
	}
}

const SongMatchHandler = {
  canHandle(handlerInput) {
  	const request = handlerInput.requestEnvelope.request;
  	console.log('Inside SongMatch');
  	console.log(JSON.stringify(request));
    return request.type === 'IntentRequest'
      && (request.intent.name === "SongMatchIntent");
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  } 
};

const ArtistHandler = {
	canHandle(handlerInput) {
    return request.type === 'IntentRequest'
      && (request.intent.name === "ArtistIntent");

	},
	handle(handlerInput) {

	//which artist?
	if handlerInput.

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();

	}

}

const QuestionHandler = {
	canHandle(handlerInput) {
    return request.type === 'IntentRequest'
      && (request.intent.name === "ArtistIntent");

	},
	handle(handlerInput) {

	//keep asking question

	//var song_id = 0
	//song_id += 10 ^ index of question * (1+index of answer)

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();

	}

}



const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .withShouldEndSession(true)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    //any cleanup logic goes here
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

let skill;

exports.handler = async function (event, context) {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);

  return response;
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();

const welcomeMessage = "Welcome to Song Match. Through a series of questions, we are able to discover which of your favorite artist's songs best match you. Please tell me the name of your favorite artist.";
const repromptSpeech = 'What is the name of your favorite artist?';
const KhalidQuestions = ['What would you crack open on a warm summer night?', 'How do you deal with negative emotions?', 'Favorite pick-up line?'];
const BrunoMarsQuestions = ['What is your ideal date night?', 'What is your vibe?', 'Its Saturday Night, where are you going?'];
const TaylorSwiftQuestions  = ['How do you deal with a break up?', 'Who are you feuding with right now?', 'Favorite cat color?'];
const SZAQuestions = ["What are people's first impressions of you?", "Who are you doing a collab with?", "Least favorite TikTok Dance"];
const AnswerOptionsBruno = [['A, Strawberry and Champagne in front of a fire place', 'B, Rollercoasters and dinner at Pizza Hut'], ['A, Kinda Jazzy', 'B, Bangers all night long'],['A, At home with a nice book', "B,The disco club"]];
const AnswerOptionsKhalid = [['A, A cold one with the boys', 'B, A refreshing can of Sprite'],['A, Cry', 'B, Cry a lot'],['A, Did it hurt when you fell from Heaven?', "B, If the coronavirus doesn't take you out, can I?"]];
const AnswerOptionsTaylor = [['A, Write an angry song about that person', 'B, Write a sad song about that person'], ['Kim Kardashian', 'Katy Perry'],['Brown', 'White']];
const AnswerOptionsSZA = [['Mysterious', 'Charming'],['Kendrick Lamar', 'Chance the Rapper'],['Renegade', 'Say So']];
var BrunoSongs = {111:"Uptown Funk", 112:"Lazy Song", 121:'When I was your man', 122: "That's what I like", 211: "Locked Out of Heaven", 212: "Just the way you are", 221:"Versace on the Floor", 222:"Finesse"};
var KhalidSongs = {111:"lovely", 112:"Eastside", 121:'Young, Dumb, and Broke', 122:'American Teen', 211:'Location', 212:'Suncity', 221:'Saturday Nights', 222:'Talk'};
var SZASongs = {111:"All the Stars", 112:"The Weekend", 121:'Love Galore', 122:'Doves in the Wind', 211:"Broken Clocks", 212:"Go Gina", 221:"Childs Play", 222:"Garden"};
var SwiftSongs = {111:"Red", 112:"Soon you'll get better", 121:'Everything has Changed', 122:'Love Story', 211:'Lover', 212:'Mine', 221:'Dear John', 222:'Mean'};