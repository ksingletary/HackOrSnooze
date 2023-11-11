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

//show list of all favorited stories when clicking "favorites"
function favStories(evt){
  console.debug("favStories", evt);
  hidePageComponents();
  putFavoritesOnPage();
}
$body.on("click", "#favorites", favStories)

//show list of all user's stories when clicking "my stories"
function myStories(evt){
  console.debug("myStories", evt);
  hidePageComponents();
  putMyStoriesOnPage();
}
$body.on("click", "#my-stories", myStories)

/** Show submit form */
function submitStoryClick(evt) {
  console.debug("submitStoryClick", evt);
  hidePageComponents();
  $submitStoryForm.show();
}

$submitStory.on("click", submitStoryClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $mainNavLinks.show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}