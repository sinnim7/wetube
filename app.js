// app.js에는 application 관련 코드들을 둠.
import express from "express"; // express를 import함.
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localMiddleware } from "./middlewares";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";

import "./passport";

const app = express(); // express를 실행한 결과를 상수 app으로 만듦.

const CokieStore = MongoStore(session);

app.set("view engine", "pug"); // view engine 설정값을 pug로 바꿈
app.use("/uploads", express.static("uploads")); // directory에서 file을 보내주는 미들웨어임.
app.use("/static", express.static("static"));

// middleware 추가.
app.use(helmet()); // application 보완을 도와줌.
app.use(cookieParser()); // cookie를 전달받아서 사용할 수 있도록 만들어줌. 사용자 인증 등에 사용됨.
app.use(bodyParser.json()); // 사용자가 웹사이트로 전달하는 정보들을 검사. request 정보에서 form이나 json 형태로 된 body 검사.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev")); // application에서 발생하는 모든 일들을 logging함.
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CokieStore({ mongooseConnection: mongoose.connection }) // mongoose가 이 저장소를 데이텁이스(즉 mongoDB)에 연결해 줄 거임.
  })
);
app.use(passport.initialize()); // passport가 초기화됨. 이후 passport가 제 스스로 쿠키를 들여다봐서, 그 쿠키 정보에 해당하는 사용자를 찾아줄 거임.
app.use(passport.session()); // 그리고 passport는 자기가 찾은 그 사용자를 요청(request)의 object, 즉 req.user로 만들어줌.

app.use(localMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
