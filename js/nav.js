"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);


function navSubmitStoryClick(evt) {// show story submit form when submit clicked */
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents(); //hiding redundant HTML elems
  $allStoriesList.show(); //show list of stories 
  $submitForm.show();
}

$navSubmitStory.on("click", navSubmitStoryClick);


function navFavoritesClick(evt) {// display favorite stories when clicking favs
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesListOnPage();
}

$body.on("click", "#nav-favorites", navFavoritesClick);


function navMyStories(evt) { //show my stories after clicking
  console.debug("navMyStories", evt);
  hidePageComponents(); //hiding other page HTML
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStories);


function navLoginClick(evt) {
  console.debug("navLoginClick", evt); // show login-signup when clicking
  hidePageComponents();
  $loginForm.show(); //showing login form
  $signupForm.show(); //showing signup as well
  $storiesContainer.hide()
}

$navLogin.on("click", navLoginClick);


function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navProfileClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").css('display', 'flex');;
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
