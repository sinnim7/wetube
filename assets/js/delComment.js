import axios from "axios";
import routes from "../../routes";

const commentNum = document.querySelector("#jsCommentNumber");
const commentList = document.querySelector("#jsCommentList");
const comment = document.querySelectorAll(".jsCommnet");

const decreaseNum = () => {
  commentNum.innerHTML = parseInt(commentNum.innerHTML, 10) - 1;
};

const delComment = (id, target) => {
  const span = target.parentElement;
  const li = span.parentElement;
  commentList.removeChild(li);
  decreaseNum();
};

const handleClick = async event => {
  const target = event.target;

  const commentId = target.id;

  const response = await axios({
    url: `${routes.api}/${commentId}/comment/delete`,
    method: "POST",
    data: {
      commentId
    }
  });
  if (response.status === 200) {
    delComment(commentId, target);
  }
};

const addEvent = () => {
  comment.forEach(el => {
    const delBtn = el.childNodes[1];
    delBtn.addEventListener("click", handleClick);
  });
};

function init() {
  addEvent();
}

if (comment) {
  init();
}
