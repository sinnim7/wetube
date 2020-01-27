import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

// Home

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 }); // -1은 위아래 순서를 바꾸겠다는 의미.
    res.render("home", { pageTitle: "Home", videos }); // videos는 videos: videos임.
  } catch (error) {
    res.render("home", { pageTitle: "Home", videos: [] }); // 에러면 빈 배열되게
  }
};

// Search

export const search = async (req, res) => {
  const {
    query: { term: searchingBy }
  } = req;
  // const searchingBy = req.query.term;  <- ECMAScript, ES6 이전의 코딩 방식
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" }
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

// Upload

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path }
  } = req;
  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description,
    creator: req.user.id
    // creatorAvatar: req.user.avatarUrl
  });
  req.user.videos.push(newVideo.id);
  // req.user.videos.push(newVideo.avatarUrl);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

// Video Detail

export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator") // populate() 객체를 데려오는 함수. object ID 타입에만 쓸 수 있음.
      .populate("comments");
    res.render("videoDetail", { pageTitle: video.title, video }); // video:video
  } catch (error) {
    res.redirect(routes.home);
  }
};

// Edit Video

export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description }); // title:title =>이건 모델이름이랑 같게 해서 가능함
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

// Delete Video

export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

// Register Video View

export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
    res.end();
  } finally {
    res.end();
  }
};
// => 만약 누군가 이 url로 오면 우린 id를 얻어서 video를 찾은 다음
// 찾았다면 views count에 1개 더 증가시키고 비디오를 저장할 거임.
// 그리고 status를 200으로 설정할 거임.
// 에러가 있다면 status 400으로 할 거고
// 그리고 무슨 일이 일어나든 우린 우리 요청을 끝낼 거임.
// 여긴 템플릿이 없음. 그냥 API view인 거임.
// 이는 server하고만 소통한다는 얘기.

// Add Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
// => 우린 id로 video를 얻고 creator: user.id로 comment를 만들지

// Delete Comment

export const postDeleteComment = async (req, res) => {
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
//     body: { videoId, commentId },
//     user
//   } = req;

//   console.log(videoId);
//   console.log(commentId);

//   try {
//     const video = await Video.findById(videoId);
//     const comment = await Comment.findById(commentId);

//     if (comment.creator.toString() === user.id) {
//       await comment.remove();
//       await video.comments.remove(commentId);
//       await video.save();
//     }
//   } catch (error) {
//     res.status(400);
//   } finally {
//     res.end();
//   }
// };
