import express from "express";
import routes from "../routes";
import {
  boardDetail,
  deleteBoard,
  getUpload,
  postUpload,
  getEditBoard,
  postEditBoard
} from "../controllers/boardController";
import { uploadBoard, onlyPrivate } from "../middlewares";

const boardRouter = express.Router();

// Upload
boardRouter.get(routes.upload, onlyPrivate, getUpload);
boardRouter.post(routes.upload, onlyPrivate, uploadBoard, postUpload);

// Board Detail
boardRouter.get(routes.boardDetail(), boardDetail);

// Edit Board
boardRouter.get(routes.editBoard(), onlyPrivate, getEditBoard);
boardRouter.post(routes.editBoard(), onlyPrivate, postEditBoard);

// Delete Board
boardRouter.get(routes.deleteBoard(), onlyPrivate, deleteBoard);

export default boardRouter;
