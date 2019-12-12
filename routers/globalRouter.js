import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controllers/videoController";
import {
  getJoin,
  logout,
  postJoin,
  postLogin,
  getLogin,
  githubLogin,
  postGithubLogin
} from "../controllers/userController";
import { onlyPublic, onlyPrivate } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);
// postJoin에서 받은 username(여기선 email)과 password 정보들을 postLogin으로 보내도록 할 거임
// 마치 로그인화면에서 form을 통해 postLogin에게 정보를 주듯이.
// 즉, postJoin은 이메일, 패스워드 등 정보들을 받아 사용자를 가입시키고,
// 그리고 이건 미들웨어라서 userController의 export const postJoin 내 next(); 가 호출돼 다음 것으로 가고,
// 같은 정보를 전달하게 되는데, 다음 것인 postLogin은 사용자를 로그인 시켜주는 거임.

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.gitHub, githubLogin);

globalRouter.get(
  routes.githubCallback,
  passport.authenticate("github", { failureRedirect: "/login" }),
  postGithubLogin
);

export default globalRouter;
