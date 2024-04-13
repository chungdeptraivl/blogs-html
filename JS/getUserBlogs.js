// Dữ liệu của các bài viết
var postData = [];

// Hàm hiển thị các bài viết trên trang hiện tại
function displayPosts() {
  var postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = ""; // Xóa bài viết hiện tại

  var startIndex = (currentPage - 1) * postsPerPage;
  var endIndex = startIndex + postsPerPage;
  var displayedPosts = postData.slice(startIndex, endIndex);

  displayedPosts.forEach(function (postData) {
    var postBox = createPost(postData);
    postContainer.appendChild(postBox);
  });
}

function checkUserLoggedIn() {
  const userString = localStorage.getItem("user");
  if (!userString) {
    return false;
  }

  const user = JSON.parse(userString);
  if (!user || !user.token) {
    return false;
  }
  return true;
}

// Hàm tạo một bài viết
function createPost(postData) {
  var postBox = document.createElement("div");
  postBox.classList.add("post-box");

  var profileHTML = `
    <div class="heading-post">
      <a class="profile" href="/blogOfUser.html?userId=${
        postData.author.id
      }">
        <img src="https://ui-avatars.com/api/?name=${
          postData.author.username
        }" alt="" class="profile-img">
        <span class="profile-name">${postData.author.username}</span>
      </a>
      <span style="margin: 0 16px;"> - </span>
      <span class="post-txt">${convertTime(postData.publishedAt)}</span>
    </div>
  `;

  var postTitleHTML = `<a href="blogpage.html?postId=${postData.id}" class="post-title">${postData.title}</a>`;
  var postDescriptionHTML = `<p class="post-description">${postData.desc}</p>`;

  var topicsHTML = `<div class="topic-list">`;
  postData.postTags.forEach(function (tag) {
    topicsHTML += `<a href="/topicBlogs.html?tag=${tag.tagId}&&tagName=${tag.tagName}" class="topic">${tag.tagName}</a>`;
  });
  topicsHTML += `</div>`;

  var footerHTML = `
    <div class="footer-post">
      ${topicsHTML}
      <div class="footer-detail">
      <div class="icon icon-view">
      <i class='bx bx-show'></i>
      <p>${postData.views}</p>
    </div>

        
  `;

  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);

  if (checkUserLoggedIn() && postData.author.id != user.id) {
    footerHTML += `
      <div class="icon icon-bookmark">
        <i class='bx bx-bookmark' onclick="handleBookmarkClick('${postData.id}')"></i>
        <p>${postData.bookmarks}</p>
      </div>
    `;
  }

  footerHTML += `
      </div>
    </div>
  `;

  // Tạo nội dung của bài viết
  var postContent =
    profileHTML + postTitleHTML + postDescriptionHTML + footerHTML;
  postBox.innerHTML = postContent;

  return postBox;
}

var currentPage = 1;
var postsPerPage = 10;

function nextPage() {
  var totalPages = Math.ceil(postData.length / postsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    document.getElementById("currentPage").textContent = currentPage;
    displayPosts();
  }
}

// Hàm chuyển đến trang trước đó
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    document.getElementById("currentPage").textContent = currentPage;
    displayPosts();
  }
}

async function getHomeBlogs(token) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const authorId = urlParams.get("userId");


  try {
    const response = await fetch(
      `http://localhost:5105/api/Post/AllPublished?AuthorId=${authorId}&PageSize=1000`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Đã có lỗi xảy ra khi lấy dữ liệu từ API.");
    }

    const data = await response.json();

    postData = [...data.data].reverse();

    return postData;
  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
    return null;
  }
}

async function contentPost() {
  try {
    await getHomeBlogs(token); // Chờ cho dữ liệu được lấy trước khi tiếp tục
    console.log("postData", postData);

    displayPosts();
  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
  }
}

async function handleBookmarkClick(postId) {
  try {
    const response = await fetch("http://localhost:5105/api/Bookmark", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId: postId }), // Thay đổi postId tùy theo bài viết bạn muốn bookmark
    });

    if (response.ok) {
      alert("Lưu bài viết thành công");
      window.location.href = `blogpage.html?postId=${postId}`;
    } else {
      console.error("Đã có lỗi xảy ra khi lưu bài.");
    }
  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
  }
}


// Gọi hàm contentPost để hiển thị bài viết
contentPost();
