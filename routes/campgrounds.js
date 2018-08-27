var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX
router.get("/campgrounds",function(req,res){
        //get all acamps from db and render
        
        Campground.find({},function(err,allcampgrounds){
            if(err){
                console.log(err);
            }
            else{
                res.render("campgrounds/index",{campgrounds:allcampgrounds});
            }
        });
        // res.render("campgrounds",{campgrounds:campgrounds});
});
//CREATE
router.post("/campgrounds", middleware.isLoggedIn ,function(req,res){
    //get data from form and add to campground array
    //redirect back to campgrounds page
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name,image: image,description:desc,author:author}
    //create new camp ground
    Campground.create(newCampground,function(err,newlycreated){
        if(err){
            console.log(err);
        }
        else{
        res.redirect("/campgrounds");
            
        }
    });
    // campgrounds.push(newCampground);
    });
//NEW
router.get("/campgrounds/new", middleware.isLoggedIn ,function(req, res) {
   res.render("campgrounds/campform"); 
   
});
//SHOW
router.get("/campgrounds/:id",function(req, res) {
   //find campground provided id render show template
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
                res.render("campgrounds/show",{campground: foundCampground});
         
        }
    });
    // req.params.id 
   });
   //edit route
   router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership ,function(req, res) {
       //is user logged in?
                Campground.findById(req.params.id,function(err,foundCampground){
                res.render("campgrounds/edit",{campground:foundCampground});
                });
   });
       //does user own campground
       //otherwise redirect
    //   Campground.findById(req.params.id,function(err,foundCampground){
    //       if(err)
    //       {
    //           res.redirect("/campgrounds");
    //       }
    //       else{
    //             res.render("campgrounds/edit",{campground:foundCampground});         
    //       }
    //   });
   //update route
   router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
       //find and update camp
       Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
           if(err)
           {
               res.redirect("/campgrounds");
           }
           else{
               res.redirect("/campgrounds/" + req.params.id);
           }
       });
       //redirect somewhere
   });
   //destroy
   router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
      Campground.findByIdAndRemove(req.params.id,function(err){
         if(err)
         {
             res.redirect("/campgrounds");
             
         }
         else{
             res.redirect("/campgrounds");
         }
      });
   });
   
   
   


module.exports = router;