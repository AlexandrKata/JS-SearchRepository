const search = document.querySelector("input");
const searchWrapper = document.querySelector(".search-input");
const searchList = document.querySelector(".search-list");
const choice = document.querySelector(".choice");

searchList.addEventListener("click", function (e) {
  let target = e.target;
  addRepositories(target);
  search.value = "";
  clearSearch();
  searchWrapper.classList.remove("active");
});

choice.addEventListener("click", function (e) {
  let target = e.target;
  if (target.classList.contains("close")) {
    target.parentElement.remove();
  }
});

function clearSearch() {
  searchList.innerHTML = "";
}

function createRepositories(response) {
  clearSearch();
  for (let i = 0; i < 5; i++) {
    let name = response.items[i].name;
    let owner = response.items[i].owner.login;
    let stars = response.items[i].stargazers_count;
    let element = `<li data-owner="${owner}" data-stars="${stars}">${name}</li>`;
    searchList.innerHTML += element;
    // if (name.startsWith(search.value)) {
    //   let element = `<li data-owner="${owner}" data-stars="${stars}">${name}</li>`;
    //   searchList.innerHTML += element;
    // }
  }
  searchWrapper.classList.add("active");
}

function addRepositories(target) {
  let name = target.textContent;
  let owner = target.dataset.owner;
  let stars = target.dataset.stars;

  choice.innerHTML += `<div class="user"><div class="wrap">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}</div><button class="close">Delete</button></div>`;
}

async function searchRepositories() {
  try {
    return await fetch(
      `https://api.github.com/search/repositories?q=${search.value}`
    ).then((response) => {
      if (response.ok) {
        response.json().then((response) => createRepositories(response));
      }
    });
  } catch (e) {
    return null;
  }
}

function debounce(fn, timeout) {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn(...args)), timeout);
    });
  };
}

const searchRepositoriesDebounce = debounce(searchRepositories, 500);
search.addEventListener("input", searchRepositoriesDebounce);
