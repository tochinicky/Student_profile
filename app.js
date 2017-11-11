var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var mongoose   = require("mongoose");
var methodOverride = require("method-override");

mongoose.connect("mongodb://tochi:onyeamah@ds259105.mlab.com:59105/tochi_students");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//MONGOOSE CONFIG
var studentSchema = new mongoose.Schema({
   name: String,
   email: String,
  gender: {
        type: String,
        enum: ["Male", "Female"],
    },
   age: { type: Number, min: 14, max: 65 },
   image: String,
});

var Student = mongoose.model("String", studentSchema);
 
app.get("/", function(req, res) {
   res.redirect("/home");
});

app.get("/home", function(req, res){
    Student.find({}, function(err, students){
           res.render("home", {students: students});    
       }
    );
});

app.get("/home/newStudent", function(req, res) {
   res.render("newStudent"); 
});

app.post("/home", function(req, res){
   req.body.student.name = req.sanitize(req.body.student.name);
   Student.create(req.body.student, function(err, student){
       if(err){
           console.log(err);
       } else {
          res.redirect("/home");
       }
   });
});

app.get("/home/:id/edit", function(req, res) {
    Student.findById(req.params.id, function(err, student){
          res.render("edit", {student: student});    
        }
    );
});

app.put("/home/:id", function(req, res){
    req.body.student.name = req.sanitize(req.body.student.name);
   Student.findByIdAndUpdate(req.params.id, req.body.student, function(err, student){
          res.redirect("/home");
        }
    );
});

app.delete("/home/:id", function(req, res){
   Student.findByIdAndRemove(req.params.id, function(err){
           res.redirect("/home");
        }
    );
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server running");
});