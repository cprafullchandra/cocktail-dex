var fromauth = false;
var newUser = false;

var config = {
  apiKey: 'AIzaSyBFsh2d7QP0HAWEiRRpb8K3syc8JIDjQQA',
  authDomain: 'https://cocktaildex.firebaseapp.com/',
  databaseURL: 'https://cocktaildex.firebaseio.com/',
  storageBucket: 'gs://cocktaildex.appspot.com'
};
firebase.initializeApp(config);

//Get a reference to the database service
var database = firebase.database();
var storage  = firebase.storage();
var filter = [];

//Toggles SignIn/SignOut based off user status
firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
    //console.log(firebaseUser);
    $('#signinli').addClass('hide');
    $('#signoutli').removeClass('hide');
  } else{
    //console.log('not logged in.');
    $('#signinli').removeClass('hide');
    $('#signoutli').addClass('hide');
  }
  if(newUser && firebaseUser) {
    initializeNewUserData()
    newUser = false;
  }
  if(fromauth) {
    window.location.href = 'index.html'
    fromauth = false;
  }
});

/**
 * Name: signUp
 * Params: none
 * Return: false
 * Details: Creates a user account by Email and Password via Firebase auth
 */
function signUp() {
  // Get document elements
  const email = $('#txtEmail').val();
  const pass  = $('#txtPassword').val();

  console.log(email, pass);
  // Sign in
  var promise = firebase.auth().createUserWithEmailAndPassword(email, pass);
  promise.catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
  newUser = true;
  fromauth = true;

  return false; // return false to prevent page refresh on form submit
}

/**
 * Name: signIn
 * Params: none
 * Return: false
 * Details: Signs the current user in to the app
 */
function signIn() {
  // Get document elements
  const email = $('#txtEmail').val();
  const pass  = $('#txtPassword').val();

  console.log(email, pass);
  // Sign in
  var promise = firebase.auth().signInWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));
  promise.catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
    console.log(error);
  });
  fromauth = true;

  return false; // return false to prevent page refresh on form submit
}


/**
 * Name: signOut
 * Params: none
 * Return: undefined
 * Details: Signs the current user out of the app
 */
function signOut() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    location.reload();
  }, function(error) {
    // An error happened.
  });
}

/**
 * Name: accessAsUser
 * Params: none
 * Return: undefined
 * Details: Redirects the users on entry to user-based pages
 */
function accessAsUser(url) {
  var user = firebase.auth().currentUser;
  if(user) {
    window.location.href = url;
  } else {
    alert('Must be logged in to access this page.');
    window.location.href = 'signin.html'
  }
}

/**
 * Name: initializeNewUserData
 * Params: none
 * return: undefined
 * Details: Creates the initial set of data for the newly created user
 */
function initializeNewUserData() {
  var userref = database.ref('users');
  userref.child(firebase.auth().currentUser.uid).set({
    cocktails: {
      drinks: "",
    },
    email: firebase.auth().currentUser.email,
    favorites: {
      drinks: "",
    },
    shelf: {
      ingredients: "",
    }
  });
}

// Heap Underflow Special
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Filters results by params
function filterResults(cocktail){
  var result = false;
  if(filter.length == 0)
    return true;
  if(filter.indexOf("Any") >= 0){
    result = true;
  }else{
    var length = Object.keys(cocktail.ingredients).length;
    if(filter.indexOf("1-3") >= 0){
      if(length <= 3 && length >= 1)
        result = true;
    }
    if(filter.indexOf("4-5") >= 0){
      if(length <= 5 && length >= 4)
        result = true;
    }
    if(filter.indexOf("6+") >= 0){
      if(length >= 6)
        result = true;
    }
  }
  return result;
}

// Populate the cocktail list to be displayed
function populateCocktailList(results, parentElement, cocktailPanelElement){
  document.getElementById(parentElement).innerHTML = "";
  for(var index = 0; index < results.length; index++){
    var result = results[index];
    var listitem = document.createElement("li");
    document.getElementById(parentElement).appendChild(listitem);
    var div = document.createElement("div");
    listitem.appendChild(div);
    var header = document.createElement("h2");
    div.appendChild(header);
    header.class = "drinkname";
    header.id = result.idDrink;
    header.innerHTML = (index+1)+": "+result.strDrink;
    header.onclick = function(){
      displayCocktail(this.id, cocktailPanelElement);
    }
  }
}

//Recreate the webpage in terms of content
function displayCocktail(id, parentElement){
  var result = database.ref('/drinks/'+id+'/');
  result.on("value", function(snapshot){
    var result = snapshot.val();
    document.getElementById(parentElement).innerHTML= "";
    var listitem = document.createElement("li");
    document.getElementById(parentElement).appendChild(listitem);

    var div = document.createElement("div");
    listitem.appendChild(div);
    if(result.strDrinkThumb){
      var thumbnail = document.createElement("img");
      div.appendChild(thumbnail);
      thumbnail.src = result.strDrinkThumb;
      thumbnail.width = 100;
      thumbnail.height = 100;
    }
    var header = document.createElement("h2");
    div.appendChild(header);
    header.class = "drinkname";
    header.innerHTML = result.strDrink;

    var button = document.createElement("button");
    div.appendChild(button);
    button.id = "favoriteButton"
    button.class = "favorite";
    button.type = "button";
    button.innerHTML = "Favorite";

    var favoriteLabel = isFavorited(snapshot.key, "searchResults");

    // Test grabbing key name
    button.addEventListener('click', function() {
      console.log("what is button inner html" + button.innerHTML);

      if(button.innerHTML == "Favorite"){
        console.log("FAVORITING");
        addFavorite(snapshot.key, "searchResults");
      }else{
        console.log("UNFAVORITING");
        unFavorite(snapshot.key, "searchResults");
      }
    });

    var description = document.createElement("div");
    div.appendChild(description);

    var dl = document.createElement("dl");
    description.appendChild(dl);

    var glassType = document.createElement("dt");
    dl.appendChild(glassType);

    var glassName = document.createElement("dd");
    dl.appendChild(glassName);
    glassName.innerHTML = result.strGlass;

    var ingredientsName = document.createElement("dt");
    dl.appendChild(ingredientsName);
    ingredientsName.innerHTML = "Ingredients: ";

    var ingredientsList = document.createElement("ul");
    dl.appendChild(ingredientsList);
    for(var key in result.ingredients){
      var item = document.createElement("li");
      item.innerHTML = key+": "+result.ingredients[key];
      ingredientsList.appendChild(item);
    }

    var informationName = document.createElement("dt");
    dl.appendChild(informationName);
    if(result.info){
      informationName.innerHTML = "Information:"+result.info;
    }else{
      informationName.innerHTML = "Information: Sample Text goes here";
    }

    var instructionsName = document.createElement("dt");
    dl.appendChild(instructionsName);
    instructionsName.innerHTML = "Instructions: ";

    var instructionsList = document.createElement("dd");
    dl.appendChild(instructionsList);
    instructionsList.innerHTML = result.strInstructions;
  });
}

// Adds a drink to a user's favorites list
function addToFavorite(){
  const name       = $('#drinkname').text();
  const spirittype = $('#strSpirit').val();
  const glasstype  = $('#strGlass').val();
  const info       = $('#info').val();
  var ingrs        = {};
  $('#ingredientslist').find('li').each(function() {
    var listitem  = $(this).find('span').first().text().split(': ');
    ingrs[listitem[0]] = listitem[1];
  });
  const instrs     = $('#strInstructions').val();

  var user = firebase.auth().currentUser;
  if(user) {
    var cocktailRef = database.ref('/users/' + user.uid + '/cocktails/' + name);
    cocktailRef.update({
      strGlass: glasstype,
      info: info,
      ingredients: ingrs,
      strInstructions: instrs,
      strSpirit: spirittype
    });
    var drinkId = user.uid + name;
    var drinkRef = database.ref('/drinks/' + drinkId);
    drinkRef.update({
      strGlass: glasstype,
      info: info,
      ingredients: ingrs,
      strInstructions: instrs,
      strSpirit: spirittype
    });
    return false;
  }
}

/**
 * Name: createCocktail
 * Params: none
 * Return: undefined
 * Details: Adds a newly created cocktail (from the create cocktail page) to the cocktails page under
 *          the current user, as well as the global cocktails list
 */
function createCocktail() {
  var   fileinput = document.getElementById('fileBtn');
  var   file      = null;
  if(!fileinput.files) {
    alert("No file selected.");
    return;
  } else {
    // prepare values to store
    var file = fileinput.files[0];
    var ext = fileinput.files[0].name.split('.').pop().toLowerCase();
    const name       = $('#cocktailname').val();
    const spirittype = $('#spirittype').val();
    const glasstype  = $('#glasstype').val();
    const info       = $('#info').val() + ' ';
    var ingrs        = {};
    $('#ingredientslist').find('li').each(function() {
      var listitem  = $(this).find('span').first().text().split(': ');
      ingrs[listitem[0]] = listitem[1];
    });
    const instrs     = $('#instructions').val() + ' ';

    var user = firebase.auth().currentUser;
    if(user) {
      // add drink to cocktails (list of user's creations)
      var cocktailRef = database.ref('/users/' + user.uid + '/cocktails/' + name);
      cocktailRef.set({
        author: user.email,
        strGlass: glasstype,
        info: info,
        ingredients: ingrs,
        strInstructions: instrs,
        strDrink: name,
        strSpirit: spirittype
      });

      // add drink to global drink list
      var drinkId = user.uid + name;
      var drinkRef = database.ref('/drinks/' + drinkId);
      drinkRef.set({
        idDrink: drinkId,
        strGlass: glasstype,
        info: info,
        ingredients: ingrs,
        strInstructions: instrs,
        strDrink: name,
        strSpirit: spirittype
      });

      // upload image to firebase storage and store public url
      var storageRef = storage.ref(user.uid + '/cocktailImgs/' + name + '/' + file.name);
      var task = storageRef.put(file).then(function(snapshot) {
        cocktailRef.update({strDrinkThumb: snapshot.downloadURL});
        drinkRef.update({strDrinkThumb: snapshot.downloadURL});
        window.location.href = "mycocktails.html";
      });
    }
  }
}

/**
 *  Name: isFavorited
 *  Params: drink - drink to check,
 *          from - determine where this function is being called from.
 *  Details: Checks if the drink is in the user's favorite list to change
 *           button name accordingly.
 */
function isFavorited(drink, from){
  var user = firebase.auth().currentUser;
  if(user){
    var favs = database.ref('/users/' + user.uid + '/favorites');
    favs.once('value').then(function(snapshot) {
      if (snapshot.hasChild(drink)) {
        if(from == "searchResults"){
          document.getElementById("favoriteButton").innerHTML= "Unfavorite";
        }
        if(from == "MyCocktails"){
          document.getElementById("favFromMyCocktails").innerHTML = "Unfavorite";
        }
        return true;
      }else{
        return false;
      }
    });
  }
}

/**
 * Name: addFavorite
 * Params: drink - drink to check,
 *          from - determine where this function is being called from.
 * Details: Adds a drink to the favorites list under the current user
 */
function addFavorite(drink, from) {
  var user = firebase.auth().currentUser;
  if(user) {
    var favs = database.ref('/users/' + user.uid + '/favorites');
    var toFavorite = database.ref('/drinks/' + drink + '/');

    toFavorite.on('value', function(snapshot) {
      var val = snapshot.val();
      var update = {};
      update[drink] = val;
      favs.update(update);
      if(from == "searchResults"){
        document.getElementById("favoriteButton").innerHTML= "Unfavorite";
      }
      if(from == "MyCocktails"){
        document.getElementById("favFromMyCocktails").innerHTML = "Unfavorite";
      }
    });
  }
}

/**
 * Name: unFavorite
 *  Params: drink - drink to check,
 *          from - determine where this function is being called from.
 * Details: Unfavorites drink from user's MyFavorites list
 */
function unFavorite(drink, from){
  var user = firebase.auth().currentUser;
  if(user) {
    var ref = database.ref('/users/' + user.uid + '/favorites');
    ref.child(drink).remove().then(function() {
      if(from == "searchResults"){
        document.getElementById("favoriteButton").innerHTML= "Favorite";
      }
      if(from == "MyCocktails"){
        console.log("ARE WE IN HERE/")
        document.getElementById("favFromMyCocktails").innerHTML = "Favorite";
      }
    });
  }
}

/**
 * Name: deleteDrink
 * Params: drink - drink to be deleted
 *         category - (currently: 'cocktails' or 'favorites') -> if 'cocktails',
 *                     then delete from global list as well
 * Return: undefined
 * Details: Deletes drink from specified category under the logged in user.
 */
function deleteDrink(drink, category) {
  var user = firebase.auth().currentUser;
  if(user) {
      if(confirm('Do you want to delete this drink from your ' + category + ' list?')) {
        var ref = database.ref('/users/' + user.uid + '/' + category);
        ref.child(drink).remove().then(function() {
          if(category === 'cocktails') {
            // if deleting user's creation, delete from global drinks list as well
            var ref = database.ref('/drinks/');
            ref.child(user.uid + drink).remove().then(function() { window.location.reload(true); });
          } else { window.location.reload(true); }
        });
      }
  }
}

/**
 * Name: populateUserCocktailList
 * Params: category - the category for which the drink is to be displayed in:
 *                    (currently: 'cocktails' or 'favorites')
 * Return: undefined
 * Details: Populates the list for cocktails to be displayed (can be clicked for more info)
 */
function populateUserCocktailList(category) {
  $('#resultslist').html('');
  var listitem = document.createElement('li');
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      var userUid = firebaseUser.uid;
      // get list of cocktails to be displayed
      var drinksRef = database.ref('users/' + userUid + '/' + category);
      drinksRef.orderByKey().on('child_added', function(snapshot) {
        var val = snapshot.val();
        var listitem = document.createElement('li');
        $('#resultslist').append($(listitem));
        var div = document.createElement('div');
        $(listitem).append($(div));
        var header = document.createElement('h2');
        $(header).addClass('drinkname');
        $(header).css({
          'cursor': 'pointer'
        });
        $(header).attr('id', snapshot.key);
        $(header).text(val.strDrink);
        $(header).click(function() {
          displayUserCocktail(this.id, category);
        });
        $(div).append($(header));
      });
    }
  });
}

/**
 * Name: DisplayUserCocktail
 * Params: id       - the id of drink to be displayed
 *         category - the category for which the drink is to be displayed in:
 *                    (currently: 'cocktails' or 'favorites')
 * Return: undefined
 * Details: Creates the elements necessary for cocktail display, and then provides
 *          information for those cocktails.
 */
function displayUserCocktail(id, category) {
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      var userUid = firebaseUser.uid;
      var drinksRef = database.ref('users/' + userUid + '/' + category + '/' + id);
      $('#fullItem').html('');
      var listitem = document.createElement('li');
      $('#fullItem').append($(listitem));
      drinksRef.once('value').then(function(snapshot) {
        var val = snapshot.val();
        if(!val) { return }
        var div = document.createElement('div');
        $(listitem).append($(div));

        var tn = document.createElement('img');
        $(div).append($(tn));
        $(tn).attr('id', 'drinkImg');
        $(tn).addClass('tnImg');
        // set img src
        if('strDrinkThumb' in val) {
          $(tn).attr('src', val.strDrinkThumb);
        } else {
          $(tn).attr('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=');
        }
        $(div).append('<br />');

        // cocktails are editable on 'cocktails' category -> add a save button
        if(category === 'cocktails') {
          var saveBtn = document.createElement("button");
          $(div).append($(saveBtn));
          $(saveBtn).addClass('resultsBtn');
          $(saveBtn).attr({
            'type': 'button',
            'onclick': 'triggerClick(\'#btnSubmit\')'
          });
          $(saveBtn).text('Save');
        }

        // cocktails are not in 'favorites' category -> add an (un)favorite button
        if(category !== 'favorites') {
          var favBtn = document.createElement("button");
          favBtn.id = "favFromMyCocktails";
          favBtn.innerHTML = "Favorite";
          var drinkPath = userUid + snapshot.key
          $(div).append($(favBtn));
          $(favBtn).addClass('resultsBtn');
          $(favBtn).attr('type', 'button');
          var favOption = isFavorited(drinkPath, "MyCocktails")

          favBtn.addEventListener('click', function() {
            if(favBtn.innerHTML == "Favorite"){
              console.log("FAVORITING");
              addFavorite(drinkPath, "MyCocktails");
            }else{
              console.log("UNFAVORITING");
              unFavorite(drinkPath, "MyCocktails");
            }
          });
        }

        // add a delete button
        var delBtn = document.createElement("button");
        $(div).append($(delBtn));
        $(delBtn).addClass('resultsBtn');
        $(delBtn).attr('type', 'button');
        $(delBtn).text('Delete');
        $(delBtn).click(function() { deleteDrink(snapshot.key, category); });

        $(div).append('<br />');

        //Drink name as header
        var header = document.createElement('h2');
        $(div).append($(header));
        $(header).addClass('drinkname');
        $(header).attr('id', 'drinkname');
        $(header).text(val.strDrink);

        // build information data
        var description = document.createElement('div');
        $(div).append($(description));
        var dl = document.createElement('dl');

        if(category === 'cocktails') {
          var form = $(document.createElement('form'));
          form.attr({
            'id': 'editForm',
            'onsubmit': 'saveCocktail();'
          });
          $(description).append(form);
          $(form).append($(dl));
          var submitBtn = $(document.createElement('input'));
          submitBtn.attr({
            'id': 'btnSubmit',
            'type': 'submit'
          });
          form.append(submitBtn);
          submitBtn.css({
            'display': 'none'
          });
        } else {
          $(description).append($(dl));
        }

        // add cocktail detail elements
        appendElement(dl, val, 'GlassType', 'strGlass', category);
        appendElement(dl, val, 'SpiritType', 'strSpirit', category);
        appendElement(dl, val, 'Ingredients', 'ingredients', category);
        appendElement(dl, val, 'Information', 'info', category);
        appendElement(dl, val, 'Instructions', 'strInstructions', category);
      });
    }
  });
}

/**
 * Name: triggerClick
 * Params: buttonid - the button to trigger click action for
 * Return: undefined
 * Details: Find a button to trigger the click action of. (Currently used for
 *          binding a form-submit behavior to a button that is external to that
 *          form).
 */
function triggerClick(buttonid) {
  var btn = $(buttonid);
  btn.trigger('click');
}

function appendElement(parentN, snapval, title, itemKey, category) {
  var headT = document.createElement('dt');
  $(parentN).append($(headT));
  $(headT).text(title + ': ');
  var itemBody = document.createElement('dd');
  $(parentN).append($(itemBody));

  extractData(itemBody, snapval, itemKey, category);
}

/**
 * Name: getDrinkStruct
 * Params: none
 * Return: drinkStruct - the defined structure for cocktails (for create and edit)
 * Details: Provides the defined structure for cocktails (for create and edit)
 */
function getDrinkStruct() {
  var drinkStruct = {
    strGlass: {
      type: 'select',
      options: {
        o0: { text: 'Glass Type' },
        o1: {
          text: 'Lowball',
          value: 'Lowball glass'
        },
        o2: {
          text: 'Highball',
          value: 'Highball glass'
        },
        o3: {
          text: 'Martini',
          value: 'Martini glass'
        },
        o4: {
          text: 'Cocktail',
          value: 'Cocktail glass'
        }
      }
    },
    strSpirit: {
      type: 'select',
      options: {
        o0: { text: 'Spirit Type' },
        o1: {
          text: 'Bourbon',
          value: 'Bourbon'
        },
        o2: {
          text: 'Gin',
          value: 'Gin'
        },
        o3: {
          text: 'Rum',
          value: 'Rum'
        },
        o4: {
          text: 'Vodka',
          value: 'Vodka'
        },
        o5: {
          text: 'Whiskey',
          value: 'Whiskey'
        },
        o6: {
          text: 'Wine',
          value: 'Wine'
        }
      }
    },
    ingredients: { type: 'list' },
    info: { type: 'textbox' },
    strInstructions: { type: 'textbox' }
  };

  return drinkStruct;
}

/**
 * Name: defaultAttrs
 * Params: input - the form input to set attrs for
 *         keyVal - the identifier for the cocktail (to be set for id and name)
 * Return: undefined
 * Details: Sets the default attrs for the specified input
 */
function defaultAttrs(input, keyVal) {
  input.attr({
    'id': keyVal,
    'name': keyVal
  });
  input.prop('required', true);
}

/**
 * Name: addAsEditable
 * Params: parentN - node to append details/elements to
 *         snapval - struct from which data is extracted from
 *         itemKey - key for which data is accessed with (from snapval)
 * Return: undefined
 * Details: Adds displayed elements as editable components
 */
function addAsEditable(parentN, snapval, itemKey) {
  if(snapval[itemKey] instanceof Object) {
    // element is originally created by appendable list -> editable is an appendable list
    makeEditList(parentN, snapval, itemKey);
  } else {
    switch(getDrinkStruct()[itemKey].type) {
      case 'textbox': {
        // element is originally created by textbox -> editable is a textbox
        makeEditTextBox(parentN, snapval, itemKey); break;
      }
      case 'select': {
        // element is originally created by select -> editable is a select
        makeEditSelect(parentN, snapval, itemKey); break;
      }
      default: {
        parentN.append(snapval[itemKey]); // just read as primitive value (non-editable)
      }
    }
  }
}

/**
 * Name: makeEditList
 * Params: parentN - node to append details/elements to
 *         snapval - struct from which data is extracted from
 *         itemKey - key for which data is accessed with (from snapval)
 * Return: undefined
 * Details: Creates and displays list-type details for cocktails in an editable, appendable list format
 */
function makeEditList(parentN, snapval, itemKey) {
  var addBtn = $(document.createElement('button'));
  addBtn.addClass('addElem');
  addBtn.attr('type', 'button');
  addBtn.attr('onclick', 'addToList(\'#ingredientslist\', \'#newingredient\')')
  addBtn.text('+');
  //addBtn.click(addToList(addToList('#ingredientslist', '#newingredient')));
  parentN.append(addBtn);

  var newItemInput = $(document.createElement('input'));
  newItemInput.addClass('input3');
  newItemInput.attr({
    'id': 'newingredient',
    'type': 'text',
    'placeholder': 'Add Ingredient',
    'maxlength': '30'
  });
  parentN.append(newItemInput);

  var itemList = $(document.createElement('ul'));
  itemList.attr('id', 'ingredientslist');
  parentN.append(itemList);
  for(var objKey in snapval[itemKey]) {
    itemList.append(getEditLi(objKey + ': ' + snapval[itemKey][objKey]));
  }
}

/**
 * Name: makeEditTextBox
 * Params: parentN - node to append details/elements to
 *         snapval - struct from which data is extracted from
 *         itemKey - key for which data is accessed with (from snapval)
 * Return: undefined
 * Details: Creates and displays textbox-type details for cocktails in an editable, textbox format
 */
function makeEditTextBox(parentN, snapval, itemKey) {
  var textarea = $(document.createElement('textarea'));
  defaultAttrs(textarea, itemKey);
  textarea.text(snapval[itemKey]); // hold current value
  parentN.append(textarea);
}

/**
 * Name: makeEditSelect
 * Params: parentN - node to append details/elements to
 *         snapval - struct from which data is extracted from
 *         itemKey - key for which data is accessed with (from snapval)
 * Return: undefined
 * Details: Creates and displays select-type details for cocktails in an editable, select format
 */
function makeEditSelect(parentN, snapval, itemKey) {
  var select = $(document.createElement('select'));
  defaultAttrs(select, itemKey);
  var options = getDrinkStruct()[itemKey].options;
  for(var objKey in options) {
    var option = $(document.createElement('option'));
    if('value' in options[objKey]) {
      option.attr('value', options[objKey].value);
    } else {
      // if option is default (ex: Glass Type) -> Has no value -> disable
      option.prop('disabled', true);
    }
    if(snapval[itemKey] === options[objKey].value) {
      // select current option in select element
      option.prop('selected', true); // hold current value
    }
    option.text(options[objKey].text);
    select.append(option);
  }
  parentN.append(select);
}

/**
 * Name: addAsValue
 * Params: parentN - node to append details/elements to
 *         snapval - struct from which data is extracted from
 *         itemKey - key for which data is accessed with (from snapval)
 * Return: undefined
 * Details: Creates and displays details for cocktails just as values
 */
function addAsValue(parentN, snapval, itemKey) {
  if(snapval[itemKey] instanceof Object) {
    var itemList = $(document.createElement('ul'));
    parentN.append(itemList);
    for(var objKey in snapval[itemKey]) {
      var item = $(document.createElement('li'));
      item.text(objKey + ': ' + snapval[itemKey][objKey]);
      itemList.append(item);
    }
  } else { parentN.append(snapval[itemKey]); }
}

/**
 * Name: extractData
 * Params: parentN - node to append details/elements to
 *         snapval - struct from which data is extracted from
 *         itemKey - key for which data is accessed with (from snapval)
 *         category - category for which to extract data (currently just cocktails and favorites)
 * Return: undefined
 * Details: Extracts and displays data for whatever category page either as editable or just value
 */
function extractData(parentN, snapval, itemKey, category) {
  var currN = $(parentN);

  if(!snapval[itemKey]) {
    currN.text('Not available');
  } else {
    // Check if in the 'cocktails' category
    if(category === 'cocktails') {
      addAsEditable(currN, snapval, itemKey);
    } else { addAsValue(currN, snapval, itemKey); }
  }
}

/**
 * Name: saveCocktail
 * Params: none
 * Return: false
 * Details: Identifies editable elements on the MyCocktails page, and updates the
 *          saved values in the database with new ones.
 */
function saveCocktail() {
  // Grab values on form
  const name       = $('#drinkname').text();
  const spirittype = $('#strSpirit').val();
  const glasstype  = $('#strGlass').val();
  const info       = $('#info').val();
  var ingrs        = {};
  $('#ingredientslist').find('li').each(function() {
    var listitem  = $(this).find('span').first().text().split(': ');
    ingrs[listitem[0]] = listitem[1];
  });
  const instrs     = $('#strInstructions').val();

  var user = firebase.auth().currentUser;
  if(user) {
    // save to user's cocktail list
    var cocktailRef = database.ref('/users/' + user.uid + '/cocktails/' + name);
    cocktailRef.update({
      strGlass: glasstype,
      info: info,
      ingredients: ingrs,
      strInstructions: instrs,
      strSpirit: spirittype
    });
    // save to global cocktail list
    var drinkId = user.uid + name;
    var drinkRef = database.ref('/drinks/' + drinkId);
    drinkRef.update({
      strGlass: glasstype,
      info: info,
      ingredients: ingrs,
      strInstructions: instrs,
      strSpirit: spirittype
    });
  }
  return false; // return false to not leave the page on form submit
}
