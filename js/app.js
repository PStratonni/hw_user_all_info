const URL = [
  "https://jsonplaceholder.typicode.com",
  "/users",
  "/todos",
  "/posts",
  "/albums",
  "/comments",
  "/photos",
];

const main = () => {
  getUser();
  addEventTabs();
  document.querySelector("#off").addEventListener("click", () => {
    document.querySelector("#off").parentNode.classList.add("hidden");
  });
};

const getUser = async () => {
  const response = await fetch(`${URL[0] + URL[1]}`);
  const users = await response.json();
  renderUsers(users);
  addEventUsers();
};

const renderUsers = (users) => {
  users.forEach((user) => {
    document.querySelector(
      "#users"
    ).innerHTML += `<div id="user_${user.id}" class="users"><h4>${user.username}</h4></div>`;
  });
  if (localStorage.getItem("user")) {
    const id = localStorage.getItem("user");
    toStart(id);
    getData(id);
  }
};

const addEventUsers = () => {
  const divs = document.querySelectorAll("#users div");
  for (let div of divs) {
    div.addEventListener("click", (event) => {
      event.preventDefault();
      const [, id] = event.currentTarget.id.split("_");
      localStorage.setItem("user", id);
      toStart(id);
      getData(id);
    });
  }
};

const toStart = (id) => {
  divClassRemove("#users div", "user-event");
  document.querySelector(`#user_${id}`).classList.add("user-event");
  document.querySelector("#ex-2").classList.remove("hidden");
  divClassRemove(".tabs", "tabs-event");
  document.querySelector("#tabs_info").classList.add("tabs-event");
  divClassAdd(".content", "hidden");
  document.querySelector("#info").classList.remove("hidden");
};

const addEventTabs = () => {
  const tabs = document.querySelectorAll(".tabs");
  for (let tab of tabs) {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      const windowInnerWidth = document.documentElement.clientWidth;
      if (windowInnerWidth < 768 && tab.classList.contains("tabs-event")) {
        tab.classList.remove("tabs-event");
        document.querySelector(`#${event.currentTarget.id.split("_")[1]}`).classList.add('hidden');
      }else
      {divClassRemove(".tabs", "tabs-event");
      tab.classList.add("tabs-event");
      const [, id] = event.currentTarget.id.split("_");
      removeHidden(id);}
    });
  }
};

const removeHidden = (id) => {
  const divs = document.querySelectorAll(".content");
  for (let div of divs) {
    if (div.id === id) {
      div.classList.remove("hidden");
      continue;
    }
    div.classList.add("hidden");
  }
};

const divClassRemove = (id, clas) => {
  const divs = document.querySelectorAll(id);
  for (let div of divs) {
    div.classList.remove(clas);
  }
};

const divClassAdd = (id, clas) => {
  const divs = document.querySelectorAll(id);
  for (let div of divs) {
    div.classList.add(clas);
  }
};

const getData = async (id) => {
  const result = [];
  for (let i = 1; i < 5; i++) {
    if (i === 1) {
      const response = await fetch(`${URL[0] + URL[1]}/${id}`);
      const data = await response.json();
      result.push(data);
      continue;
    }
    const response = await fetch(`${URL[0] + URL[1]}/${id}${URL[i]}`);
    const data = await response.json();
    result.push(data);
  }
  renderInfo(result[0]);
  renderToDo(result[1]);
  renderPosts(result[2]);
  renderAlbums(result[3]);
};

const renderInfo = (user) => {
  document.querySelector("#info").innerHTML = `<h3>${user.name}</h3>
  <h5>Email: ${user.email}</h5>
  <h5>Address:</h5>
  <ul class="addres">
  <li><h6>Street: ${user.address.street}</h6></li>
  <li><h6>Suite: ${user.address.suite}</h6></li>
  <li><h6>City: ${user.address.city}</h6></li>
  <li><h6>Zipcode: ${user.address.zipcode}</h6></li>
  </ul>
  <h5>Phone: ${user.phone}</h5>
  <h5>Website: ${user.website}</h5>
  <h5>Company: ${user.company.name}</h5>
  `;
};

const renderToDo = (todos) => {
  document.querySelector("#todo ul").innerHTML = "";
  todos.forEach((todo) => {
    document.querySelector(
      "#todo ul"
    ).innerHTML += `<li><p>${todo.title}</p></li>
  `;
  });
};

const renderPosts = (posts) => {
  document.querySelector("#posts ul").innerHTML = "";
  posts.forEach((post) => {
    document.querySelector("#posts ul").innerHTML += `<li class="position">
      <span id="post_${post.id}">${post.title}</span>
        <div id="coments_${post.id}" class="comments hidden">
        </div>
    </li>
  `;
    getComments(post.id);
  });
  addEventPosts();
};

const renderAlbums = (albums) => {
  document.querySelector("#photos").innerHTML = "";
  document.querySelector("#albums ul").innerHTML = "";
  albums.forEach((album) => {
    document.querySelector(
      "#albums ul"
    ).innerHTML += `<li><span id="album_${album.id}">${album.title}</span></li>
  `;
    getPhotos(album.id);
  });
  addEventAlbums();
};

const addEventAlbums = () => {
  const spans = document.querySelectorAll("#albums span");
  for (let span of spans) {
    span.addEventListener("click", (event) => {
      event.preventDefault();
      const [, id] = event.target.id.split("_");
      document.querySelector("#photos").parentNode.classList.remove("hidden");
      const divs = document.querySelectorAll("#photos >div");
      for (let div of divs) {
        divClassAdd(`#${div.id}`, "hidden");
      }
      document.querySelector(`#photos_${id}`).classList.remove("hidden");
    });
  }
};

const getPhotos = async (id) => {
  const response = await fetch(`${URL[0] + URL[6]}?albumId=${id}`);
  const album = await response.json();
  renderPhotos(album);
};

const renderPhotos = (album) => {
  const div = document.createElement("div");
  div.id = `photos_${album[0].albumId}`;
  div.classList.add("wrapper-photo");
  div.classList.add("hidden");
  album.forEach((photo) => {
    div.innerHTML += `<div><img src=${photo.thumbnailUrl}></div>`;
  });
  document.querySelector("#photos").appendChild(div);
};

const getComments = async (id) => {
  const response = await fetch(`${URL[0] + URL[5]}?postId=${id}`);
  const comments = await response.json();

  renderComments(comments.length, comments[0].postId);
};

const renderComments = (quantity, id) => {
  document.querySelector(
    `#coments_${id}`
  ).innerHTML = `<span>${quantity} comments</span>`;
};

const addEventPosts = () => {
  const spans = document.querySelectorAll("#posts span");
  for (let span of spans) {
    span.addEventListener("mouseover", (event) => {
      event.preventDefault();
      const [, id] = event.target.id.split("_");
      document.querySelector(`#coments_${id}`).classList.remove("hidden");
    });
    span.addEventListener("mouseout", (event) => {
      event.preventDefault();
      const [, id] = event.target.id.split("_");
      document.querySelector(`#coments_${id}`).classList.add("hidden");
    });
    span.addEventListener("mousemove", (event) => {
      event.preventDefault();
      const [, id] = event.target.id.split("_");
      document.querySelector(
        `#coments_${id}`
      ).style.left = `${event.clientX}px`;
      document.querySelector(`#coments_${id}`).style.top = `${
        event.clientY - 40
      }px`;
    });
  }
};

main();
