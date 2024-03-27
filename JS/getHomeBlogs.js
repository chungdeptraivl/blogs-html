// Dữ liệu của các bài viết
var postData = [];

async function getHomeBlogs(token) {
  try {
    const response = await fetch(
      `http://localhost:5105/api/Post/AllPublished?SortBy=publishedAt`,
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

    postData = [...data.data];

    return postData;
  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
    return null;
  }
}

async function contentPost() {
  const postData = await getHomeBlogs(token);
  console.log("postData", postData);
  var currentPage = 1;
  var postsPerPage = 10;

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

    var postBox = document.createElement("div");
    postBox.classList.add("post-box");

    var profileHTML = `
<div class="heading-post">
    <a class="profile" href="/blogOfUser.html?userId=${postData.author.id}">
        <img src="https://ui-avatars.com/api/?name=${postData.author.username}" alt="" class="profile-img">
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
      topicsHTML += `<a href="/topicBlogs.html?tag=${tag.tagId}" class="topic">${tag.tagName}</a>`;
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
        <div class="icon icon-bookmark">
            <i class='bx bx-bookmark' ></i>
            <p>${postData.bookmarks}</p>
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

  displayPosts();
}

// Hàm chuyển đến trang tiếp theo

contentPost();
// Hiển thị bài viết trên trang đầu tiên khi trang được tải
