const commentBtn = document.querySelector(".btn-comment");
const commentValue = document.getElementById("tnc");

document.addEventListener("click", function (event) {
  const target = event.target;
  const parentContainer = target.closest(".comment__container");

  if (target.classList.contains("open-reply")) {
    const replyAction = parentContainer.querySelector(".reply-action");

    if (replyAction) {
      replyAction.style.display = "flex";
    }

    target.style.display = "none";

    const closeReply = parentContainer.querySelector(".close-reply");

    if (closeReply) {
      closeReply.style.display = "inline";
    }

    const replyInputValue = parentContainer.querySelector(".reply-input-value");
    const replyBtnInsert = parentContainer.querySelector(".reply-btn-insert");
    const parentContainerId = parentContainer.id;

    const replyNameTag = parentContainer.querySelector(".comment__title");
    const replyName = replyNameTag.innerHTML;

    replyInputValue.value = replyName + " ";

    replyBtnInsert.addEventListener("click", () => {
      postComment(replyInputValue.value, parentContainerId);
    });
  }

  if (target.classList.contains("close-reply")) {
    const replyAction = parentContainer.querySelector(".reply-action");

    if (replyAction) {
      replyAction.style.display = "none";
    }

    target.style.display = "none";

    const openReply = parentContainer.querySelector(".open-reply");

    if (openReply) {
      openReply.style.display = "inline";
    }

    const replyInputValue = parentContainer.querySelector(".reply-input-value");
    replyInputValue.value = "";
  }

  if (target.classList.contains("edit-comment")) {
    const editAction = parentContainer.querySelector(".edit-action");

    if (editAction) {
      editAction.style.display = 'flex'
    }

    target.style.display = "none";

    const closeEdit = parentContainer.querySelector(".cancel-edit-comment");

    if (closeEdit) {
      closeEdit.style.display = "inline";
    }

    const editInputValue = parentContainer.querySelector(".edit-input-value");
    const editBtnInsert = parentContainer.querySelector(".edit-btn-insert");
    const commentId = parentContainer.id;

    const oldComment = parentContainer.querySelector(".comment-content")
    editInputValue.value = oldComment.innerHTML + " "

    editBtnInsert.addEventListener("click", () => {
      putComment(editInputValue.value , commentId)
    })
  }

  if (target.classList.contains("cancel-edit-comment")) {
    const editAction = parentContainer.querySelector(".edit-action");

    if (editAction) {
      editAction.style.display = "none";
    }

    target.style.display = "none"

    const openEdit = parentContainer.querySelector(".edit-comment");

    if (openEdit) {
      openEdit.style.display = "inline";
    }
  }
});

commentBtn.addEventListener("click", () => {
  postComment(commentValue.value, null);
});

async function postComment(value, parentId) {
  const commentData = {
    content: value,
    postId: postId,
    parentId: parentId,
  };

  try {
    const response = await fetch("http://localhost:5105/api/Comment", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json-patch+json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });

    if (response.ok) {
      console.log("Comment đã được đăng thành công!");

      commentValue.value = "";

      getComments(postId);
    } else {
      console.error("Đã có lỗi xảy ra khi đăng comment.");
    }
  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
  }
}


async function putComment(value, parentId) {
  const commentData = {
    id: parentId,
    content: value,
  };

  try {
    const response = await fetch("http://localhost:5105/api/Comment", {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json-patch+json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });

    if (response.ok) {
      console.log("Comment đã được suawr thành công!");

      commentValue.value = "";

      getComments(postId);
    } else {
      console.error("Đã có lỗi xảy ra khi suaw comment.");
    }
  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
  }
}

async function deleteComment(commentId) {

  try {
    const response = await fetch(`http://localhost:5105/api/Comment/${commentId}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json-patch+json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("Comment đã được XOA thành công!");

      getComments(postId);
    } else {
      console.error("Đã có lỗi xảy ra khi xoa comment.");
    }
  } catch (error) {
    console.error("Đã có lỗi xảy ra:", error);
  }
}

