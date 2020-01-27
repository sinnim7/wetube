import routes from "../routes";
import Board from "../models/Board";
import Comment from "../models/Comment";

// Home

export const home = async (req, res) => {
  try {
    const boards = await Board.find({}).sort({ _id: -1 }); // -1은 위아래 순서를 바꾸겠다는 의미.
    res.render("home", { pageTitle: "Home", boards }); // boards는 boards: boards임.
  } catch (error) {
    res.render("home", { pageTitle: "Home", boards: [] }); // 에러면 빈 배열되게
  }
};

// Search

export const search = async (req, res) => {
  const {
    query: { term: searchingBy }
  } = req;
  // const searchingBy = req.query.term;  <- ECMAScript, ES6 이전의 코딩 방식
  let boards = [];
  try {
    boards = await Board.find({
      title: { $regex: searchingBy, $options: "i" }
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, boards });
};

// Upload

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path }
  } = req;
  const newBoard = await Board.create({
    fileUrl: path,
    title,
    description,
    creator: req.user.id
    // creatorAvatar: req.user.avatarUrl
  });
  req.user.boards.push(newBoard.id);
  // req.user.boards.push(newboard.avatarUrl);
  req.user.save();
  res.redirect(routes.boardDetail(newBoard.id));
};

// Board Detail

export const boardDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const board = await Board.findById(id)
      .populate("creator") // populate() 객체를 데려오는 함수. object ID 타입에만 쓸 수 있음.
      .populate("comments");
    res.render("boardDetail", { pageTitle: board.title, board }); // board:board
  } catch (error) {
    res.redirect(routes.home);
  }
};

// EditBoard

export const getEditBoard = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const board = await Board.findById(id);
    if (String(board.creator) !== req.user.id) {
      throw Error();
    } else {
      res.render("editBoard", { pageTitle: `Edit ${board.title}`, board });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditBoard = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Board.findOneAndUpdate({ _id: id }, { title, description }); // title:title =>이건 모델이름이랑 같게 해서 가능함
    res.redirect(routes.boardDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

// Delete Board

export const deleteBoard = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const board = await Board.findById(id);
    if (String(board.creator) !== req.user.id) {
      throw Error();
    } else {
      await Board.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

// Register Board View

export const postBoardRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const board = await Board.findById(id);
    board.views += 1;
    board.save();
    res.status(200);
  } catch (error) {
    res.status(400);
    res.end();
  } finally {
    res.end();
  }
};
// => 만약 누군가 이 url로 오면 우린 id를 얻어서 board를 찾은 다음
// 찾았다면 views count에 1개 더 증가시키고 비디오를 저장할 거임.
// 그리고 status를 200으로 설정할 거임.
// 에러가 있다면 status 400으로 할 거고
// 그리고 무슨 일이 일어나든 우린 우리 요청을 끝낼 거임.
// 여긴 템플릿이 없음. 그냥 API view인 거임.
// 이는 server하고만 소통한다는 얘기.

// Add Comment

export const postAddBoardComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    const board = await Board.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id
    });
    board.comments.push(newComment.id);
    board.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
// => 우린 id로 board를 얻고 creator: user.id로 comment를 만들지

// Delete Comment

export const postDeleteBoardComment = async (req, res) => {
  const {
    params: { id },
    user
  } = req;
  try {
    const comment = await Comment.findById(id);
    if (String(comment.creator) !== user.id) {
      throw Error();
    } else {
      await Comment.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Delete Comment

// export const postDeleteComment = async (req, res) => {
//   const {
//     body: { boardId, commentId },
//     user
//   } = req;

//   console.log(boardId);
//   console.log(commentId);

//   try {
//     const board = await board.findById(boardId);
//     const comment = await Comment.findById(commentId);

//     if (comment.creator.toString() === user.id) {
//       await comment.remove();
//       await board.comments.remove(commentId);
//       await board.save();
//     }
//   } catch (error) {
//     res.status(400);
//   } finally {
//     res.end();
//   }
// };
