//Get the Paramenters fro the URL
function getQueryStringValue(queryParam){
    // Get current URL.
    var currentURL = new URI();
 
   // If queryParam is in the querystring of currentURL
   if(currentURL.hasQuery(queryParam)){
     // Get all querystring values as a json object
     var qsValues = currentURL.query(true);
     // return queryParam's value
     return qsValues[queryParam];
   }
   else
   {
     // queryParam is not in the querystring. So return as undefined.
     return undefined;
   }
 }
 var url = window.location.href
 var APIKey = '';
 if (getQueryStringValue('key')) {
   console.log('API Key Found: OK');
   var APIKey = getQueryStringValue('key')
 } else {
   var APIKey = prompt('You will need an API key from ( https://forebears.io/onograph ) You can register for a free account and then login to see your API Key, then enter it below. Please enter your API Key:');
   url += '?key=' + APIKey;
   window.location.href = url;
 };

 // If currentURL="/index.html?search=test" then,
 // getQueryStringValue("search") returns "test"
 // getQueryStringValue("notPresentQueryParam") returns undefined

//Set variables that are needed in the Vue Template
//var searchname = (typeof getQueryStringValue("search") === 'undefined') ? '' : getQueryStringValue("search");
var searchfn = (typeof getQueryStringValue("fn") === 'undefined') ? '' : getQueryStringValue("fn");
var searchln = (typeof getQueryStringValue("ln") === 'undefined') ? '' : getQueryStringValue("ln");

//Name API URL
var nameApi = 'https://ono.4b.rs/v1/nat?key=' + APIKey + '&fn='+ searchfn +'&sn='+ searchln;
console.log(nameApi); 

//grab HTML Countries Table and create JSON from it
var arbtbl = $('#arbtbl').tableToJSON();

//function to search our arabic speaking countries table and compare ther results. 
// if one country matches it returns possibly
//if two countries match it returns likely
//if no countries match it returns not likely
function search(item1, item2, myArray){
  var result = 0
  for (var i=0; i < myArray.length; i++) {
      if (myArray[i].Country === item1) {
        result++
      } else if (myArray[i].Country === item2) {
        result++
  } }
    if (result === 2) {
      languageArab = 'Very Likely (2 Matches)';
    } else if (result === 1) {
      languageArab = 'Possibly (1 Match)';
    } else {
      languageArab = 'Not Likely (No Matches)'
    }
    return languageArab;
};

//console.log(arbtbl.find( ({ Country }) => Country === 'Germany' ));
//begin Vue Code
 var app = new Vue({
    el: '#app',
    data: {
        //If URI includes ?search= then display the search parameter else display default text. 
        query: (typeof getQueryStringValue("ln") === 'undefined') ? 'Search for a Name to Begin' : 'You searched for ' + searchfn + ' '+ searchln,
        forebears: 'https://forebears.io/surnames/' + searchln,
        country1: 'none',
        country2: 'none ',
        arabspeaking: '',
        apikey: APIKey,
    },
    watch: {
        country1: function(NewValue, OldValue) {
           //check if the country is arabic speaking by crossreferencing our arabic speaking countries table.
           this.arabspeaking = search(this.country1.jurisdiction, this.country2.jurisdiction, arbtbl)
          },
        country2: function(NewValue, OldValue) {
          //check if the country is arabic speaking by crossreferencing our arabic speaking countries table.
          this.arabspeaking = search(this.country1.jurisdiction, this.country2.jurisdiction, arbtbl)
          }
    },
    mounted() {
      //fetch forebears.io info and set the top two countries to data variables. 
      axios.get(nameApi).then(response => {
        console.log(response);
        this.country1 = response.data.countries[0];
        this.country2 = response.data.countries[1];
      })
    }
    })

