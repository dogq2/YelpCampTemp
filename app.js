var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"), 
	flash       = require("connect-flash"),
	passport    = require("passport"),
    LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground 	= require("./models/campground"),
	Comment		= require("./models/comment"),	
    User        = require("./models/user"),
	seedDB      = require("./seeds")

//requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index")	

 

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb+srv://dogq2:9f0n5qEdHsln04Xi@cluster0-zu7t2.mongodb.net/test?retryWrites=true&w=majority', { 
// 	useNewUrlParser: true, 
// 	useUnifiedTopology: true
// }).then(() => {
// 	console.log("Connected to DB");
// }).catch(err => {
// 	console.log("Error", err.message);
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.set('useFindAndModify', false);//added by me for deprecation fix
//seedDB();


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Villa till i die",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");

   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


var port = process.env.PORT || 3000;

//app.listen(port);


app.listen(port,process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});

// app.listen(3000, function() {
//     console.log("Server up");
// });