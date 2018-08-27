var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
 //Comment Routes
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req, res) {
   Campground.findById(req.params.id,function(err,campground){
       if(err)
       {
           console.log(err);
       }
       else{
            res.render("comments/new",{campground:campground});        
       }
   });
    
});
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id,function(err, campground) {
       if(err)
       {
           console.log(err);
           res.redirect("/campgrounds");
       }
       else
       {
           Comment.create(req.body.comment,function(err,newcomment){
               if(err)
               {
                   console.log(err);
               }
               else
               {    //add username and id to comments and save
                newcomment.author.id = req.user._id;
                newcomment.author.username = req.user.username;
                newcomment.save();
                   campground.comments.push(newcomment);
                   campground.save();
                   req.flash("success","Commented Added");
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    });
    //create new comment
    ///connect new comment to campgound
    //redirect campground to show page
    
});
//comment edit
router.get("/campgrounds/:id/comments/:comment_id/edit" ,middleware.checkCommentOwnership ,function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit",{campground_id:req.params.id,comment: foundComment});
        }
    });
    // res.render("/comments/edit",{campgound_id:req.params.id},);
    
});

router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err)
        {
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership ,function(req,res){
   
   Comment.findByIdAndRemove(req.params.comment_id,function(err){
       if(err)
         {
             res.redirect("back");
             
         }
         else{
             req.flash("success","Comment deleted");
             res.redirect("/campgrounds/" + req.params.id);
         }
   }) ;
});



module.exports = router;