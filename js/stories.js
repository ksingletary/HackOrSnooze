"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  console.debug("getAndShowStoriesOnStart");
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * 10/17/23 - markup dynamically decides favIcon
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  const hostName = story.getHostName(); 
  let favIds = [];
  let favState;
  let favTag ="";
  if(currentUser instanceof User){
    favIds = User.ownFavorites( currentUser );
    favState = favIds.includes(story.storyId) ? "fa-solid" : "fa-regular";
    favTag = `<i class="${favState} fa-star" id="favorite-icon"></i>`;
  }

  return $(`
      <li id="${story.storyId}">
        ${favTag}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
      <hr>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
/** Gets list of favorite stories from server, generates their HTML, and puts on page. */

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  if(currentUser.favorites.length === 0){
    $allStoriesList.append("<h3>No Favorited Stories!</h3>");
  }
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
/** Gets list of my stories from server, generates their HTML, and puts on page. 
 * Stories should have trash icon and functionality to remove
*/

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  if(currentUser.ownStories.length === 0){
    $allStoriesList.append("<h3>No Stories Submitted!</h3>");
  }

  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
    
  }
    
  const removeIcon = `<i class="fa-solid fa-trash" id="rmv-icon"></i>`;
  
  $(".story-hostname").after(removeIcon);

  $allStoriesList.show();
}

async function getStoryAndRemove(evt){
  console.debug("getStoryAndRemove", evt); 
  const storyId = $(evt.target).parent().attr("id");
  const removedStory = await storyList.removeStory(currentUser, storyId);
  
  //below removes the user's story in the DOM
  currentUser.ownStories = currentUser.ownStories.filter(id => id === removedStory.storyId);
  $(`#${removedStory.storyId}`).remove();
}
$allStoriesList.on("click", "#rmv-icon", getStoryAndRemove);

/** Gets story from submit-story-form and put it on the page */
async function submitNewStory(evt){
  console.debug("submitNewStory");
  evt.preventDefault;

  const newStory = {
    title: $("#story-title").val(),
    author: $("#story-author").val(),
    url: $("#story-url").val()
  }
  //new instance of a story object, added to currentUser
  let userStory = await storyList.addStory( currentUser, newStory );
    
  const $story = generateStoryMarkup(userStory);
  $allStoriesList.prepend($story);

  currentUser.ownStories.push(userStory);

  hidePageComponents();
  getAndShowStoriesOnStart();
  $("#story-title").val("");
  $("#story-author").val("");
  $("#story-url").val("");  
}

$submitStoryForm.on('submit', submitNewStory); 

/** update "favorite" icon in the story stream from outline (not favorited) 
 * to solid (favorited)
 */
async function toggleFavorite(evt){
  console.debug("toggleFavorite");
  const favTarget = $(evt.target);
  const favStory = storyList.stories.filter( s => s.storyId == favTarget.parent().attr("Id"))[0];
  
  favTarget.hasClass("fa-regular") ? await currentUser.addFavorite( favStory ) : await currentUser.removeFavorite( favStory );
  
  favTarget.toggleClass("fa-regular");
  favTarget.toggleClass("fa-solid");
}

$allStoriesList.on("click", "#favorite-icon", toggleFavorite);

/********************* WIP EDIT FUNCTION **********************/
/** Show edit form */
function showEditForm(evt) {
  console.debug("showEditForm", evt);
  // hidePageComponents();
  const editForm = `<form action="#" id="edit-story-form" class="account-form">
  <h4>Edit a Story</h4>
  <div class="story-input">
    <label for="story-author">Author</label>
    <input id="story-author" placeholder="author name">
  </div>
  <div class="story-input">
    <label for="story-title">Title</label>
    <input id="story-title" type="text" placeholder="story title">
  </div>
  <div class="story-input">
    <label for="story-url">Url</label>
    <input id="story-url" type="url" placeholder="story url">
  </div>
  <button type="submit">Submit</button>
  <hr>
  </form>`;
  $(evt.target).parent().append(editForm);
}

$allStoriesList.on("click", ".edit-icon", showEditForm);