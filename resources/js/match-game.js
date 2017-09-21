var MatchGame = {};

//color variables
var $background_unflipped = 'rgb(32, 64, 86)';
var $value_flipped = 'white';
var $background_match = 'rgb(153, 153, 153)';
var $value_match = 'rgb(204, 204, 204)';
var $colors = ['hsl( 25, 85%, 65%)', // value == 1
               'hsl( 55, 85%, 65%)', // value == 2
               'hsl( 90, 85%, 65%)',
               'hsl(160, 85%, 65%)',
               'hsl(220, 85%, 65%)',
               'hsl(265, 85%, 65%)',
               'hsl(310, 85%, 65%)',
               'hsl(360, 85%, 65%)']; // value == 8


/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/
$(document).ready(function() {
  MatchGame.startGame();

  $('button.startGame').click(function(){
    MatchGame.startGame();
  });
});

MatchGame.startGame= function(){
  var values = MatchGame.generateCardValues();
  MatchGame.renderCards(values, $('#game'));
};

/*
  Generates and returns an array of matching card values.
 */
MatchGame.generateCardValues = function () {

  var valueArray = new Array();
  var value;
  var controlArray = [0, 0, 0, 0, 0, 0, 0, 0]; //represents the count of 1, 2, ..., 8 in valueArray

  //we need 8 different values from 1 to 8 twice
  while (valueArray.length <16){
    //generiere number between 1 and 8:
    value = Math.floor(Math.random()*8)+1;
    if (controlArray[value-1]<2){
      valueArray.push(value);
      controlArray[value-1]++;
    }
  }
  console.log(valueArray);
  return valueArray;
};

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/
MatchGame.renderCards = function(cardValues, $game) {
  //$game is the parameter in this function,
  //$('#game') is the argument used when calling this function:  MatchGame.renderCards(values, $('#game'));
  //hence, $game IS $('#game') from the html!

  //$game object must be empty when game starts
  $game.empty();

  //we need to add a data attribute for the flipped cards (array with 2 cards) (needed in function flipCard())
  var array_flippedCards = new Array();
  $game.data('flippedCards', array_flippedCards);
  //and also to keep count of the number of pairs found
  var pairsFound = 0;
  $game.data('pairsFound', pairsFound);

  //generate card objects and add them to the game (i.e. the 16 <div class="card"> for <div id="game"> will be generated here)
  for (var i=0; i<cardValues.length; i++){
    var $card = $('<div class="card"></div>');
    $card.data('value', cardValues[i]);
    $card.data('color', $colors[cardValues[i]-1]);
    $card.data('flipped', false);
    $game.append($card);
  }

  // event listender for clicking on a card
  $('.card').on('click', function(){
    MatchGame.flipCard($(this), $game);
  });
};


/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */
MatchGame.flipCard = function($card, $game) {

  //create local variable to make code easier to read
  var flippedCardsArray = $game.data('flippedCards');

  //if an already flipped card gets clicked again,
  //or if 2 cards are flipped => nothing happens
  if ($card.data('flipped') || flippedCardsArray.length>1){
    return;
  }

  //adjust flipped card
  adjustCard($card, $card.data('color'), $value_flipped, '8px solid DeepSkyBlue', $card.data('value'), true);

  //add flipped card to the array of flippedCards
  flippedCardsArray.push($card);

  //we need 2 flipped cards, if that is not the case, leave this function, otherwise compare them
  if(flippedCardsArray.length === 1){
    return;
  }
  else {
    if (flippedCardsArray[0].data('value') === flippedCardsArray[1].data('value')){
      //when values match adjust card appearance
      setTimeout(function(){
        adjustCard(flippedCardsArray[0], $background_match, $value_match, '8px solid grey', $card.data('value'), true);
        adjustCard(flippedCardsArray[1], $background_match, $value_match, '8px solid grey', $card.data('value'), true);
        //and delete the array, so that new cards can be added in the next move
        flippedCardsArray.length=0;

        //show modal when 1, 4 or all 8 pairs have been found
        var pairs = $game.data('pairsFound');
        $game.data('pairsFound', pairs+1);
        switch (pairs+1) {
          case 1:
            $('p.modal_message').text("You found the first pair!");
            $("#modal").modal();
          break;
          case 4:
            $('p.modal_message').text("You're halfway there!");
            $("#modal").modal();
            break;
          case 8:
            $('p.modal_message').text("Congrats! You won!!");
            $("#modal").modal();
            break;
          default:
          break;
        }
      }, 300);
    }
    else {
      //if values don't match, reverse the appearance and status of the two flipped cards
      setTimeout(function(){
        adjustCard(flippedCardsArray[0], $background_unflipped, 'none', '', '', false);
        adjustCard(flippedCardsArray[1], $background_unflipped, 'none', '', '', false);
        // and delete the array also here for the next move
        flippedCardsArray.length=0;
      }, 300);
    }
  }
};

function adjustCard(card, backgroundColor, color, border, text, status){
    card.css('background-color', backgroundColor);
    card.css('color', color);
    card.css('border', border);
    card.text(text);
    card.data('flipped', status);
};
