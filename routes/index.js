var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer')
const fileUpload = require('express-fileupload');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/home', function(req, res, next) {
  res.render('home')
});

router.get('/explore', function(req, res, next) {
  res.render('explore')
});

router.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);

// Add this line to serve our index.html page
// app.use(express.static('public'));

router.post('/upload', upload.single('file'), (req, res) => {
  // Save uploaded file to database
  const newImage = new Image({
      type: 'file',
      filename: req.file.filename
  });
  newImage.save()
      .then(() => {
          res.send('File uploaded successfully!');
      })
      .catch((err) => {
          console.error('Error uploading file', err);
          res.status(500).send('Error uploading file');
      });
});

// Route for adding image URLs
router.post('/addImage', (req, res) => {
  const imageUrl = req.body.imageUrl;
  // Save image URL to database
  const newImage = new Image({
      type: 'url',
      url: imageUrl
  });
  newImage.save()
      .then(() => {
          res.send('Image URL added successfully!');
      })
      .catch((err) => {
          console.error('Error adding image URL', err);
          res.status(500).send('Error adding image URL');
      });
});


router.get('/create', function(req, res, next) {
  res.render('create')
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel
  .findOne({username: req.session.passport.user})
  .populate('posts')
  res.render('profile', {user});
});

router.get('/show/posts', isLoggedIn, async function(req, res, next) {
  const user = await userModel
  .findOne({username: req.session.passport.user})
  .populate('posts')
  res.render('show', {user});
});

router.get('/feed', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const posts = await postModel.find()
  .populate("user")
  res.render("feed", {user, posts})
});

router.get('/add', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('add', {user});
});

router.post('/createpost',isLoggedIn, upload.single("postimage"), isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description:req.body.description,
    image: req.body.filename
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile")
});

router.post('/fileupload', isLoggedIn, upload.single('image'), async function(req, res, next){
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('profile');
})

router.post('/register', function(req, res, next) {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email
  })
  userModel.register(data, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
    })
  })
});


router.post('/login', passport.authenticate("local", {
  failureRedirect: '/',
  successRedirect: "/profile",
}),
 function(req, res, next) {
});

router.get("/logout", function(req, res, next){
  req.logout(function(err){
    if(err){return next(err); }
    res.redirect('/');
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
