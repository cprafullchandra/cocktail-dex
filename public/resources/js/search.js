$(document).ready(function(){
	document.getElementById("filterbtn").onclick = function(){
		filter = [];
		$("input:checkbox[name=num_ingredient]:checked").each(function(){
			console.log($(this).val());
			filter.push($(this).val());
		});
		/*$("input:checkbox[name=glass]:checked").each(function(){
			console.log($(this).val());
			filter.push($(this).val());
		});
		$("input:checkbox[name=spirit]:checked").each(function(){
			console.log($(this).val());
			filter.push($(this).val());
		});*/
		document.getElementById("resultslist").innerHTML= "";
		getResults(getParameterByName("query"));
	}	
})

// Search algorithm
var match = function(query, drink){
  query = query.toLowerCase();
  var json = JSON.stringify(drink).toLowerCase();
  var matches = 0;
  var terms = query.split(" ");
  for(var index in terms){
    if(json.includes(terms[index]) ){
      matches++;
    }
  }
  return matches;
}

//sort and show only best 20 results
var sorts = function(drinks){
  shuffle(drinks);
  drinks.sort(function(a,b){
    return b.priority - a.priority;
  });
  return drinks.slice(0,20);
}

var shuffle = function(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
  }
}

//Query db for cocktails and search each cocktail for key words
var getResults = function(query){
  var drinks = database.ref('drinks');
  count = 0;
  drinks.limitToFirst(400).on("value", function(snapshot){
    if(count > 0)
      return;
    var results = snapshot.val();
    for(var index in results){
      var drink = results[index];
      if(filterResults(drink)){
        drink.priority = match(query,drink);
        drinkResults.push(drink);
        count++;
      }
    }
    drinkResults = sorts(drinkResults);
    console.log(drinkResults);
    populateCocktailList(drinkResults, "resultslist", "fullItem");
  })
}

var once = false;
var drinkResults = [];
getResults(getParameterByName("query"));
