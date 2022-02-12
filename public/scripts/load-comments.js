const loadCommentsBtnElement = document.getElementById("load-comments-btn");
const commentSectionElement = document.getElementById("comments");
const commentsFormElement = document.querySelector("#comments-form form");
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text");

function addCommentListElement(comments) {
  if (comments.length === 0) {
    const noCommentElementPara = document.createElement("p");
    noCommentElementPara.innerHTML = `<h3> No comments found! Kindly add some </h3>`;
    return noCommentElementPara;
  }

  const createCommentListElement = document.createElement("ol");

  for (const comment of comments) {
    const commentItemElement = document.createElement("li");
    commentItemElement.innerHTML = `
    <article class="comment-item">
      <h2>${comment.title}</h2>
      <p>${comment.text}</p>
    </article>
    `;
    createCommentListElement.appendChild(commentItemElement);
  }

  return createCommentListElement;
}

//AJAX
async function fetchCommentsForPost(event) {
  // loadCommentsBtnElement.dataset.postId; // alternate
  const postId = loadCommentsBtnElement.dataset.postid;
  try {
    const response = await fetch("/posts/" + postId + "/comments");

    const responseData = await response.json(); //return a js' object means it is decoded

    commentSectionElement.innerHTML = " ";
    const commentListElement = addCommentListElement(responseData);
    commentSectionElement.appendChild(commentListElement);
  } catch (error) {
    alert("Could not get comments ");
  }
}

async function saveComment(event) {
  event.preventDefault();
  const postId = commentsFormElement.dataset.postid;

  // ALTERNATE
  /*   const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value; */
  const formData = new FormData(event.target);
  const enteredTitle = formData.get("title");
  const enteredText = formData.get("text");
  // console.log(enteredTitle, enteredText);

  const comment = { title: enteredTitle, text: enteredText };

  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment), //not encoded but in json format
      headers: {
        "Content-Type": "application/json", //will only if it is added else goes null values
      },
    });

    if (response.ok) {
      commentTitleElement.value = " ";
      commentTextElement.value = " ";
      fetchCommentsForPost();
    } else {
      alert("Something went wrong");
    }
  } catch (error) {
    alert("Could not send request ");
  }
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);
commentsFormElement.addEventListener("submit", saveComment);
