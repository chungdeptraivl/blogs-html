async function getComments(postId) {
  try {
    const response = await fetch(
      `http://localhost:5105/api/Comment?PostId=${postId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    console.log(data);

    const parentContainer = document.getElementById("commentTNC");

    // Xóa tất cả các comment hiện có trong phần hiển thị
    parentContainer.innerHTML = "";

    // Duyệt qua các comment mới
    data.data.forEach((comment) => {
      // Tạo một thẻ div mới cho comment
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment__container");
      commentElement.setAttribute("dataset", comment.parentId);
      commentElement.id = comment.id;
      commentElement.innerHTML = `
          <div class="comment__card">
              <div class="header-comment">
                  <a href="/blogOfUser.html?userId=${comment.createdBy.id}" class="user-comment">
                      <img class="avt-comment" src="https://ui-avatars.com/api/?name=${comment.createdBy.username}" alt="">
                      <h6 class="comment__title">${comment.createdBy.username}</h6>
                  </a>
                  <div class="btn-action-comment">
                      <button class="btn-reply">
                          <span class="open-reply" style="font-size: 16px">Phản hồi <i class='bx bxs-chat'></i></span>
                          <span class="close-reply" style="font-size: 16px; color: red; display: none">Đóng phản hồi</span>
                      </button>
                      <div class="btn-edit-delete">
                          <button class="btn btn-edit edit-comment">Sửa</button>
                          <button class="btn btn-edit cancel-edit-comment" style="display: none">Huỷ sửa</button>
                          <button class="btn btn-delete delete-comment">Xoá</button>
                      </div>
                  </div>
              </div>
              <p class="comment-content">${comment.content}</p>
              <div class="comment__card-footer">
                  <div class="show-replies"></div>
              </div>
          </div>
          <div class="reply-action">
              <input class="reply-input-value" />
              <button class="reply-btn-insert">Phản hồi</button>
          </div>

          <div class="edit-action">
            <input class="edit-input-value" />
            <button class="edit-btn-insert">Sửa phản hồi</button>
          </div>
        `;

      const formattedTime = convertTime(comment.updatedAt);
      commentElement.querySelector(
        ".show-replies"
      ).innerText = `${formattedTime}`;

      const deleteBtn = commentElement.querySelector(".delete-comment");
      deleteBtn.addEventListener("click", () => {
        const commentId = commentElement.closest(".comment__container").id;
        deleteComment(commentId);
      });

      if (comment.parentId) {
        const parentComment = document.querySelector(
          `div[id="${comment.parentId}"]`
        );
        if (parentComment) {
          parentComment.appendChild(commentElement);
        }
      } else {
        parentContainer.appendChild(commentElement);
        commentElement.classList.add("parentComment");
      }

      const btnReply = commentElement.querySelector(".btn-reply");
      const btnEditDelete = commentElement.querySelector(".btn-edit-delete");

      if (comment.createdBy.id === user.id) {
        btnReply.style.display = "none";
        btnEditDelete.style.display = "inline-block";
      } else {
        btnReply.style.display = "inline-block";
        btnEditDelete.style.display = "none";
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("postId");

getComments(postId);
