# CocktailDex
VERSION: v1.0  
[Link to FirebaseApp](https://cocktaildex.firebaseapp.com/)

## Project Summary
CocktailDex is an app that allows users to easily navigate through different types of cocktails and drink mixes. Not only can users search for drinks based on their names but they can also search based on the ingredients they have in their own cabinets. The search results can be filtered based on the name of the drink, ingredients involved, glass type, or number of ingredients necessary for the drink. Information on how to create the drink properly can be found under the description of the drinks on click. Are you a new to alcohol or cocktails? Are you a professional cocktail builder or alcoholic? Doesn't matter because CocktailDex can be useful for all levels of drinkers!

## Stack
* HTML
* CSS/Bootstrap
* VanillaJS
* Firebase (v2.2.1)

## Features
* User authentication
  * Account creation (email + password)
  * Logging in
  * Signing out
* Search functionality (Search cocktails by ingredients or by name or from myShelf)
* Filter functionality (After an initial search)
  * By number of ingredients
  * By type of spirit
  * By type of glass
* Creating cocktails (below aspects are required to be defined when creating a cocktail)
  * drink image
  * name
  * spirit type
  * glass type
  * ingredients list
  * information
  * instructions
* Deleting user-created cocktails
* Editing user-created cocktails (below aspects are available to be edited)
  * spirit type
  * glass type
  * ingredients list
  * information
  * instructions
* Favoriting cocktails (saves details of a cocktail onto the logged in user's 'favorites' list. This cocktail does not change even if the creator edits/deletes that cocktail)
* Un-favoriting cocktails
* Add saved ingredients onto 'My Shelf' and search by shelf ingredients
* About section (provides usage details and general cocktail information)

## Video Walkthrough

### Sign in flow

<img src='http://i.imgur.com/HVyP3BK.gif' title='Sign In Flow' width='' alt='Sign In Flow' />


### Searching

<img src='http://i.imgur.com/6klMPeW.gif' title='Search Flow' width='' alt='Search Flow' />


### Favorites

<img src='http://i.imgur.com/oMlWmxC.gif' title='Favorites Flow' width='' alt='Favorites Flow' />


### My Cocktails

<img src='http://i.imgur.com/zZt7OkQ.gif' title='My Cocktails Flow' width='' alt='My Cocktails Flow' />


### My Shelf

<img src='http://i.imgur.com/0TKUQVj.gif' title='My Shelf Flow' width='' alt='My Shelf Flow' />


### Team Info/FAQS

<img src='http://i.imgur.com/1wyRFfg.gif' title='Extra Flow' width='' alt='Extra Flow' />


## Current Issues/Limitations
* Does not have any offline capability
* Searching functionality is not available until a user is logged in
* Searching functionality is limited to searching by 1 ingredient only
* Filtering does not function for spirit or glass type
* Drink creation has limited validation (mostly checks for if inputs have been filled out)
* Creating an account does not verify email (allows for false emails)
* Creating a drink if the name has already been used in a previously created drink overrides the old drink's values
* Creating a drink with multiple ingredients of the same name will only save one of those values
* Not all non-user created cocktails hold the attributes required for cocktail creation (sometimes image, information, instructions, etc. might not be available)
* Google Sign In does not work (we found that may be an issue with our Firebase instance but have yet to figure out why)

## File Structure
`archive` contains old `bootstrap` code from our attempt to use pure `bootstrap` to design our app. The code is dead and not in use but kept for those interested.

`documentation` contains our written analyses of the app and the runtime/loadtime of the app on a throttled android device.

`public` is where the bulk of our app code resides.

And at the very top layer are simply administrative files pertaining to `firebase` or `documentation` for the app.

## Dev Workflow
To get started contributing simply clone the repo and code locally. For deployment to `firebase`, you will need to:
```
> npm install -g firebase@2.2.1
> npm install -g firebase-tools@2.2.1
```
and then reach out to one of us for access to the `firebase console`.

## Contribution
Interested in contributing! Great :) Just make a PR and one of us will get back to you! If you don't hear from us feel free to ping below. Thanks!

## Team & Maintainers
* [Brandon Huang](https://github.com/brandonjhuang)
* [Chiraag Prafullchandra](https://github.com/cprafullchandra)
* [Daniel Ku](https://github.com/danieljku)
* [David Lee](https://github.com/dcl004)
