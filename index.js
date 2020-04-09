const Alexa = require('ask-sdk');

const LaunchRequest = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
      
    return handlerInput.responseBuilder
      .speak(welcomeMessage)
      .reprompt(helpMessage)
      .getResponse();
  },
};

//handles which artist and launches the first question
const ArtistHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    console.log('Inside ArtistHandler');
    console.log(JSON.stringify(request));
    return request.type === 'IntentRequest'
      && request.intent.name === "ArtistIntent";
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    console.log("THIS.EVENT = " + JSON.stringify(this.event));
    const response = handlerInput.responseBuilder;
    const request = handlerInput.requestEnvelope.request

//setting values for session attributes
    var answerVal = attributes.answerVal = 0;
    var counter = attributes.counter = 0;
    const artist_string = attributes.artist_string = request.intent.slots.Artist.resolutions.resolutionsPerAuthority[0].values[0].value.id.toLowerCase();
    
//grabbing first question
    var question = questions[artist_string][counter];
    var answerOptions = answers[artist_string][counter][0] + ' or ' + answers[artist_string][counter][1];
    var repromptSpeech = answerOptions;
    var speakText = quizMessage + " " + question +" " + chooseAorB + " " + answerOptions;

    return response
      .speak(speakText)
      .reprompt(repromptSpeech)
      .getResponse();
  } 
};

//handles answers and asks a question if quiz is not over
const QuestionAnswerHandler = {
  canHandle(handlerInput) {
    console.log("THIS.EVENT = " + JSON.stringify(this.event));    
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
       && (request.intent.name === "AnswerAIntent" || request.intent.name === "AnswerBIntent");

  },
  handle(handlerInput) {
    console.log("THIS.EVENT = " + JSON.stringify(this.event));  
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const response = handlerInput.responseBuilder;
    const request = handlerInput.requestEnvelope.request;
    const artist_string = attributes.artist_string

    var speakOutput = ``;
    var repromptOutput = ``;
//updates the answer value with the response
    if (request.intent.name === "AnswerAIntent") {
      attributes.answerVal += (10**attributes.counter * 1);
    }
    else {
      attributes.answerVal += (10**attributes.counter * 2);
    }
    attributes.counter ++;

//if there are still questions left, ask another question
    if (attributes.counter < 3) {
      var question = questions[artist_string][attributes.counter];
      var answerOptions = answers[artist_string][attributes.counter][0] + ' or ' + answers[artist_string][attributes.counter][1];
      speakOutput = 'Got it. Next Question, ' + question + " " + answerOptions;
      repromptOutput = answerOptions;
      return response.speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();

    }
    
//otherwise give them their song
    else {
      speakOutput = 'Thank you for playing. Your song is ' + songs[artist_string][attributes.answerVal]+ ". " + 'Would you like to play with another artist? If so, say the artist name. Otherwise, say stop.';
      attributes.counter = 0
      attributes.artist_string = ''
      return response
      .speak(speakOutput)
      .reprompt('Would you like to play another Artist?')
      .getResponse();
    }
  }

}


//handles repeat requests
const RepeatIntentHandler = {
  canHandle(handlerInput) {
   return Alexa.getRequestType(handlerInput.requestEnvelope) ===   'IntentRequest' 
   && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
   },handle(handlerInput) {
    // Get the session attributes.
    const sessionAttributes =   
    handlerInput.attributesManager.getSessionAttributes(); 
    const { lastResponse } = sessionAttributes;
    const speakOutput = lastResponse;
   return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
  }
};
//handles exits
const ExitHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    return handlerInput.responseBuilder
      .speak('Thank you for playing!')
      .getResponse();
  },
};

//handles the end of the session

const SessionEndedRequest = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};


//handles weird input, wrong words said
const FallbackHandler = {

  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    var FALLBACK_MESSAGE = ""
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    if (attributes.counter === 0 || attributes.counter === 3){
      FALLBACK_MESSAGE = toStartFallback;
    }
    else {
      FALLBACK_MESSAGE = answerQuestionFallback;
    }

    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE)
      .reprompt(FALLBACK_MESSAGE)
      .getResponse();
  },

};


//takes care of when the user asks for help
const HelpIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    return handlerInput.responseBuilder
      .speak('Please say an artist name to get started')
      .reprompt('Please say an artist name to get started')
      .getResponse();
  },
};


//our response receptor for repeat requests
const saveResponseForRepeatingInterceptor = {  
    process( handlerInput ) {
     console.log( 'Saving for repeating later…' );
     const response = handlerInput.responseBuilder.getResponse().outputSpeech.ssml;
     const sessionAttributes =  handlerInput.attributesManager.getSessionAttributes();
     sessionAttributes.lastResponse = response;     
     handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
},};
/**
 * Request Interceptor to log the request sent by Alexa
 */
const LogRequestInterceptor = {
  process(handlerInput) {
    // Log Request
    console.log("==== REQUEST ======");
    console.log(JSON.stringify(handlerInput.requestEnvelope, null, 2));
  }
}
/**
 * Response Interceptor to log the response made to Alexa
 */
const LogResponseInterceptor = {
  process(handlerInput, response) {
    // Log Response
    console.log("==== RESPONSE ======");
    console.log(JSON.stringify(response, null, 2));
  }
}


/**
 * Handler to catch exceptions from RequestHandler 
 * and respond back to Alexa
 */
const GlobalErrorHandler = {
  canHandle(handlerInput, error) {
    // handle all type of exceptions
    // Note : To filter on certain type of exceptions use error.type property
    return true;
  },
  handle(handlerInput, error) {
    // Log Error
    console.log("==== ERROR ======");
    console.log(error);
    // Respond back to Alexa
    const speechText = "I'm sorry, I didn't catch that. Could you rephrase ?";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};


function getPersistenceAdapter() {
  // Determines persistence adapter to be used based on environment
    const s3Adapter = require('ask-sdk-s3-persistence-adapter');
    return new s3Adapter.S3PersistenceAdapter({
      bucketName: process.env.S3_PERSISTENCE_BUCKET,
    });
}

const toStartFallback = "I'm sorry, I didn't recognize that. To start a quiz, please say the name of your favorite Artist. Right now, we support SZA, Bruno Mars, Khalid, and Taylor Swift.";
const answerQuestionFallback = "I'm sorry, I didn't get that. Please answer A or B to respond to the question.";
const welcomeMessage = "Welcome to Song Match. Through a series of questions, we are able to discover which of your favorite artist's songs best match you. Please tell me the name of your favorite artist.";
const helpMessage = 'What is the name of your favorite artist?';
const chooseAorB = 'A or B?'
const quizMessage = 'Great. Now please answer these three questions to help me match you to their song.';
const KhalidQuestions = ['What would you crack open on a warm summer night?', 'How do you deal with negative emotions?', 'Favorite pick-up line?'];
const BrunoMarsQuestions = ['What is your ideal date night?', 'What is your vibe?', 'Its Saturday Night, where are you going?'];
const TaylorSwiftQuestions  = ['How do you deal with a break up?', 'Who are you feuding with right now?', 'Favorite cat color?'];
const SZAQuestions = ["What are people's first impressions of you?", "Who are you doing a collab with?", "Least favorite TikTok Dance?"];
const AnswerOptionsKhalid = [['A, A cold one with the boys', 'B, A refreshing can of Sprite'],['A, Cry', 'B, Cry a lot'],['A, Did it hurt when you fell from Heaven?', "B, If the coronavirus doesn't take you out, can I?"]];
const AnswerOptionsTaylor = [['A, Write an angry song about that person', 'B, Write a sad song about that person'], ['A, Kim Kardashian', 'B, Katy Perry'],['A, Brown', 'B, White']];
const AnswerOptionsSZA = [['A, Mysterious', 'B, Charming'],['A, Kendrick Lamar', 'B,Chance the Rapper'],['A, Renegade', 'B, Say So']];
const AnswerOptionsBruno = [['A, Strawberry and Champagne in front of a fire place', 'B, Rollercoasters and dinner at Pizza Hut'],
                            ['A, Kinda Jazzy', 'B, Bangers all night long'],['A, At home with a nice book', 'B,The disco club']];
var BrunoSongs = {111:"Uptown Funk", 112:"Lazy Song", 121:'When I was your man', 122: "That's what I like", 211: "Locked Out of Heaven", 212: "Just the way you are", 221:"Versace on the Floor", 222:"Finesse"};
var KhalidSongs = {111:"lovely", 112:"Eastside", 121:'Young, Dumb, and Broke', 122:'American Teen', 211:'Location', 212:'Suncity', 221:'Saturday Nights', 222:'Talk'};
var SZASongs = {111:"All the Stars", 112:"The Weekend", 121:'Love Galore', 122:'Doves in the Wind', 211:"Broken Clocks", 212:"Go Gina", 221:"Childs Play", 222:"Garden"};
var SwiftSongs = {111:"Red", 112:"Soon you'll get better", 121:'Everything has Changed', 122:'Love Story', 211:'Lover', 212:'Mine', 221:'Dear John', 222:'Mean'};
var questions = {'khalid':KhalidQuestions, 'bruno':BrunoMarsQuestions, 'sza':SZAQuestions, 'taylor':TaylorSwiftQuestions};
var answers = {'khalid':AnswerOptionsKhalid, 'bruno':AnswerOptionsBruno, 'sza':AnswerOptionsSZA, 'taylor':AnswerOptionsTaylor};
var songs = {'khalid':KhalidSongs, 'bruno':BrunoSongs, 'sza':SZASongs, 'taylor':SwiftSongs};


const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .withPersistenceAdapter(getPersistenceAdapter())
  .addRequestHandlers(
    LaunchRequest,
    ArtistHandler,
    QuestionAnswerHandler,
    ExitHandler,
    SessionEndedRequest,
    HelpIntent,
    RepeatIntentHandler,
    FallbackHandler
  ).addRequestInterceptors(LogRequestInterceptor)
  .addResponseInterceptors(LogResponseInterceptor,
  saveResponseForRepeatingInterceptor)
  .addErrorHandlers(GlobalErrorHandler)
  .lambda();
