// Dữ liệu của các bài viết
var postData = [];

// Hàm hiển thị các bài viết trên trang hiện tại
function displayPosts() {
  var postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = ""; // Xóa bài viết hiện tại

  var startIndex = (currentPage - 1) * postsPerPage;
  var endIndex = startIndex + postsPerPage;

  var displayedPosts = postData.slice(startIndex, endIndex);

  var text = document.getElementById("searchText");

  const clearSearch = document.querySelector(".search-close-btn");

  clearSearch.addEventListener("click", () => {
    text.value = "";
  });

  text.addEventListener("input", function () {
    var inputValue = text.value.trim().toLowerCase();
    var foundAnyPost = false;

    postContainer.innerHTML = "";

    displayedPosts.forEach(function (postData) {
      var postBox = createPost(postData);
      var postTitle = postData.title.toLowerCase();

      if (postTitle.includes(inputValue) && inputValue.length > 0) {
        postContainer.appendChild(postBox);
        foundAnyPost = true;
      }
    });

    if (!foundAnyPost && inputValue.length > 0) {
      var noFound = document.createElement("h5");
      noFound.style.textAlign = "center";
      noFound.textContent = "Không tìm thấy bài đăng nào!!!";
      postContainer.appendChild(noFound);
    }
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
      <a class="profile" href="/blogOfUser.html?userId=${postData.author.id}">
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

  if (checkUserLoggedIn() && postData.author.id !== user.id) {
    if (postData.isBookmarked == false) {
      // Render bookmark icon with yellow background if post is bookmarked
      footerHTML += `
        <div class="icon icon-bookmark">
          <i class='bx bx-bookmark' onclick="handleBookmarkClick('${postData.id}')"></i>
          <p>${postData.bookmarks}</p>
        </div>
      `;
    } else {
      // Render bookmark icon without special styling if post is not bookmarked
      footerHTML += `
        <div class="icon icon-bookmark"  style="background: yellow">
          <i class='bx bx-bookmark' onclick="deleteBookmarkClick('${postData.id}')"></i>
          <p>${postData.bookmarks}</p>
        </div>
      `;
    }
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
  try {
    const response = await fetch(
      `http://localhost:5105/api/Post/AllPublished?PageSize=1000`,
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

async function deleteBookmarkClick(postId) {
  try {
    const response = await fetch(
      `http://localhost:5105/api/Bookmark/${postId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      alert("Xoá bài viết lưu trong bookmark thành công");

      const bookmarkIcon = document.querySelector('.icon-bookmark');
      const bookmarkCount = document.querySelector('.icon-bookmark p');

      if (bookmarkIcon && bookmarkCount) {
        bookmarkIcon.style.background = ""; 
        bookmarkIcon.onclick = () => handleBookmarkClick(postId); 
        bookmarkCount.innerText = parseInt(bookmarkCount.innerText) - 1; 
      }
    } else {
      console.error("Đã có lỗi xảy ra khi xóa bài viết đã lưu.");
    }
  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
  }
}


// Gọi hàm contentPost để hiển thị bài viết
contentPost();
