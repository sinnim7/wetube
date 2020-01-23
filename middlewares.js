import multer from "multer";
import routes from "./routes";

const multerVideo = multer({ dest: "uploads/videos/" });
const multerBoard = multer({ dest: "uploads/boards/" });
const multerAvatar = multer({ dest: "uploads/avatars/" });

export const localMiddleware = (req, res, next) => {
  res.locals.siteName = "LindoLindo";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;

  // user가 존재하거나 아니면 존재하지 않다면 {}를 주도록.
  // passport는 쿠키나 serialize, deserialize 등의 기능을 다 지원해줌은 물론이고,
  // user가 담긴 object를 요청(request)에도 올려줄 거임.
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};

export const uploadVideo = multerVideo.single("videoFile");
export const uploadBoard = multerBoard.single("boardFile");
export const uploadAvatar = multerAvatar.single("avatar");
