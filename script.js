
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
 
 // If currentURL="/index.html?search=test" then,
 // getQueryStringValue("search") returns "test"
 // getQueryStringValue("notPresentQueryParam") returns undefined

//Set variables that are needed in the Vue Template
var searchname = (typeof getQueryStringValue("search") === 'undefined') ? '' : getQueryStringValue("search");

//Name API URL
var nameApi = 'https://ono.4b.rs/v1/jur?key=3fb097ed41c846debeab3789a613ccc3&name='+ searchname +'&type=surname';

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
      languageArab = 'Very Likely';
    } else if (result === 1) {
      languageArab = 'Possibly';
    } else {
      languageArab = 'Not Likely'
    }
    return languageArab;
};

//console.log(arbtbl.find( ({ Country }) => Country === 'Germany' ));
//begin Vue Code
 var app = new Vue({
    el: '#app',
    data: {
        //If URI includes ?search= then display the search parameter else display default text. 
        query: (typeof getQueryStringValue("search") === 'undefined') ? 'Search for a Name to Begin' : 'You searched for ' + getQueryStringValue("search"),
        country1: 'none',
        country2: 'none ',
        arabspeaking: '',
    },
    watch: {
        country1: function(NewValue, OldValue) {
           //check if the country is arabic speaking by crossreferencing our arabic speaking countries table.
           this.arabspeaking = search(this.country1.jurisdiction, this.country2.jurisdiction, arbtbl)
          }
    },
    mounted() {
      //fetch forebears.io info and set the top two countries to data variables. 
      axios.get(nameApi).then(response => {
        this.country1 = response.data.jurisdictions[0];
        this.country2 = response.data.jurisdictions[1];
      })
    }
    })

