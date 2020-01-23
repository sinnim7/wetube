import express from "express";
import routes from "../routes";
import {
  postRegisterView,
  postAddComment,
  postDeleteComment
} from "../controllers/videoController";
import {
  postBoardRegisterView,
  postAddBoardComment,
  postDeleteBoardComment
} from "../controllers/boardController";
// import { onlyPrivate } from "../middlewares";

const apiRouter = express.Router();

// videos
apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.deleteComment, postDeleteComment);

// boards

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.deleteComment, postDeleteComment);

export default apiRouter;
