"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * - showDeleteBtn: show delete button?
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser); // if user is logged in, show favorite/not-favorite star

  return $(`
      <li id="${story.storyId}">
        <div>
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        </div>
      </li>
    `);
}


function getDeleteBtnHTML() { //Make delete button HTML for story 
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}



function getStarHTML(story, user) { //  favorite/not-favorite star for story */
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}


function putStoriesOnPage() {
  console.debug("putStoriesOnPage");  //function to get list of user stories from server

  $allStoriesList.empty();

  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);   // loop through all of our stories and generate HTML for them
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function deleteStory(evt) {   //deletes a story
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);



async function displayNewStory(evt) { // submitting new story form. 
  console.debug("displayNewStory");
  evt.preventDefault(); // cancels page  reload

  const title = $("#make-title").val();   
  const url = $("#make-url").val();       //user input and story data
  const author = $("#make-author").val();
  const storyData = { title, url, author};   

  const story = await storyList.addStory(currentUser, storyData); //addStory method to add to current user and SD to storylist

  const $story = generateStoryMarkup(story);  //generating html 
  $allStoriesList.prepend($story);

  $submitForm.slideUp("slow"); //hiding the form
  $submitForm.trigger("reset"); //resetting it
}

$submitForm.on("submit", displayNewStory);


function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    
    for (let story of currentUser.ownStories) { // loop through all users stories and generate HTML 
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

//
//  Functionality for favorites list 
 //

function displayFavoritesListOnPage() {
  console.debug("displayFavoritesListOnPage");

  $favoritedStories.empty();    //clear out fav list
 
  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added!</h5>");     //if nothing show no favss
  } else {
                                                  // iterate through  users favorites and generate HTML
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}


async function toggleFavoriteStory(evt) { //favorite/un-favorite a story */
  console.debug("toggleFavoriteStory");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($tgt.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");     // see if the item is favorited (checking by presence of star)
  } else {
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");   // if not a favorite: do the opposite
  }
}

$storiesLists.on("click", ".star", toggleFavoriteStory);
