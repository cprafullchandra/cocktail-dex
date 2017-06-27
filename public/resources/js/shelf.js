// Function when passed an ingredient will add it
function addIngredient(id, ingredient) {
  // Get user and reference path to shelf for user
  var user = firebase.auth().currentUser;
  var path = '/users/'+user.uid+'/shelf';
  var ingr = $(ingredient).val();

  // Logging
  console.log(user);
  console.log(ingr);

  // Get the refer to the list of ingredients
  var ingrRef = database.ref(path+'/ingredients');

  ingrRef.once('value').then(function(snapshot) {
    // Upon update of that path
    var ings = snapshot.val();
    var dup = false;

    if(ings) {
      // Check if ingredient is duplicate
      for(var i = 0; i < ings.length; i++) {
        if (ings[i] === ingr) {
          dup = true;
          console.log(dup);
        }
      }
    }

    if (dup === false) {
      if(ings) {
        ings.push(ingr);
      }
      else {
        ings = [ingr];
      }
      return database.ref(path).set({
        ingredients: ings
      });
    }
  });

  // Clear input form
  document.getElementById(id).value = "";
  displayIngredients();
}

function removeIngredient(ingredient) {
  // Get user and reference path to shelf for user
  var user = firebase.auth().currentUser;
  var path = '/users/'+user.uid+'/shelf';

  // Logging
  console.log(user);
  console.log(ingredient);

  // Get the refer to the list of ingredients
  var ingrRef = database.ref(path+'/ingredients');

  // On update of that path
  ingrRef.once('value').then(function(snapshot){
    var ings = snapshot.val();
    var present = false;
    var index = -1;

    if(ings) {
      for(var i = 0; i < ings.length; i++) {
        if(ings[i] === ingredient) {
          index = i;
        }
      }
    }
    if (index > -1) {
      if (ings.length == 1) {
        ings[index] = "";
      }
      else {
        ings.splice(index, 1);
      }
      database.ref(path).set({
        ingredients: ings
      })
    }
  });

  displayIngredients();
}

function populateIngredients(ingredients, parentElement) {
  // for ingredient in ingredients
  var parent = document.getElementById(parentElement);
  parent.innerHTML = ""
  for (var i = 0; i < ingredients.length; i++) {
    if(ingredients[i]) {
      //console.log(ingredients[i]);
      //console.log(parentElement);
      var listitem = document.createElement("li");
      listitem.innerHTML = ingredients[i] + '<button id='+ingredients[i]+' style="float: right;" onclick="removeIngredient(\''+ingredients[i]+'\')">✖</button><div style="clear:both"></div>';
      parent.appendChild(listitem);
    }
  }
}

var displayIngredients = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log(user);
      if(user) {
        var ingredients = database.ref('/users/'+user.uid+'/shelf/');

        ingredients.orderByKey().on("child_added", function(snapshot){
          var val = snapshot.val();
          if(snapshot.key === "ingredients" && val) {
            console.log(val);
            shelve = val;
            document.getElementById("ingreds").value = shelve.join(" ");
            populateIngredients(val, "ingr-list");
          }
        });
      }
    }
  });
}

// Filters the shelf as user searches
var filterShelf = function(shelf, query){
  if(query.length == 0){
    return shelf;
  }
  var ret = [];
  for(var index in shelf){
    if(shelf[index].toLowerCase().includes(query.toLowerCase()))
      ret.push(shelf[index]);
  }
  return ret;
}

var shelve = {};
displayIngredients();
$(document).ready(function () {
$('#search').on('input',function(e){
     console.log('Changed!')
     var search = document.getElementById("search").value;
     console.log(search);
     populateIngredients(filterShelf(shelve,search), "ingr-list");
    });
});
