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

// Hàm tạo một bài viết
function createPost(postData) {
  var postBox = document.createElement("div");
  postBox.classList.add("post-box");

  var profileHTML = `
    <div class="heading-post">
      <a class="profile" href="/blogOfUser.html?userId=${
        postData.post.author.id
      }">
        <img src="https://ui-avatars.com/api/?name=${
          postData.post.author.username
        }" alt="" class="profile-img">
        <span class="profile-name">${postData.post.author.username}</span>
      </a>
      <span style="margin: 0 16px;"> - </span>
      <span class="post-txt">${convertTime(postData.post.publishedAt)}</span>
    </div>
  `;

  var postTitleHTML = `<a href="blogpage.html?postId=${postData.post.id}" class="post-title">${postData.post.title}</a>`;
  var postDescriptionHTML = `<p class="post-description">${postData.post.desc}</p>`;

  var topicsHTML = `<div class="topic-list">`;
  postData.post.postTags.forEach(function (tag) {
    topicsHTML += `<a href="/topicBlogs.html?tag=${tag.tagId}&&tagName=${tag.tagName}" class="topic">${tag.tagName}</a>`;
  });
  topicsHTML += `</div>`;

  var footerHTML = `
    <div class="footer-post">
      ${topicsHTML}
      <div class="footer-detail">
      <div class="icon icon-view">
      <i class='bx bx-show'></i>
      <p>${postData.post.views}</p>
    </div>        
        <div class="icon icon-bookmark"  style="background: yellow">
          <i class='bx bx-bookmark' onclick="deleteBookmarkClick('${postData.post.id}')"></i>
          <p>${postData.post.bookmarks}</p>
        </div>
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
      `http://localhost:5105/api/Bookmark/AllByUser?PageSize=1000`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response);

    if (!response.ok) {
      throw new Error("Đã có lỗi xảy ra khi lấy dữ liệu từ API.");
    }

    const data = await response.json();

    console.log(data);

    postData = [...data.data].reverse();

    return postData;
  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
    return null;
  }
}

async function contentPost() {
  try {
    await getHomeBlogs(token);
    console.log("postData", postData);

    displayPosts();
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

    } else {
      console.error("Đã có lỗi xảy ra khi xóa bài viết đã lưu.");
    }
  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
  }
}

contentPost();
