require("dotenv").config();
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let request = require("request");
let mongoose = require("mongoose");
let Journey = require("./models/journey");
let mapsAPI = process.env.MAPS_API;
let Location = require("./models/location");
let flash = require("connect-flash");
let methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/travelapp_refactored", {
  useNewUrlParser: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

app.use(
  require("express-session")({
    secret: "potatoes, always",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(function(req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// landing page route
app.get("/", function(req, res) {
  res.render("landing");
});

// mileage page route
app.get("/mileage", function(req, res) {
  Location.find({}, function(err, foundLocations) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("./mileage", { locations: foundLocations });
    }
  });
});

// mileageLog route
app.get("/mileage/mileageLog", function(req, res) {
  Journey.find({}, function(err, foundJournies) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("./mileage/mileageLog", { journies: foundJournies });
    }
  });
});

// view all locations route
app.get("/locations", function(req, res) {
  Location.find({}, function(err, foundLocations) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("locations", { locations: foundLocations });
    }
  });
});

// handles logic for creating a new Journey in the database

app.post("/mileage", function(req, res) {
  let location;
  let destination;
  Location.findOne({ name: req.body.locationselect }, function(
    err,
    foundLocation
  ) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      location = foundLocation;
      Location.findOne({ name: req.body.destinationselect }, function(
        err,
        foundDestination
      ) {
        if (err) {
          console.log(err);
          res.redirect("/");
        } else {
          destination = foundDestination;
          let start = location.name;
          let end = destination.name;
          let returncheckbox = false;
          if (req.body.returncheckbox == "true") {
            returncheckbox = true;
          }
          request(
            "https://maps.googleapis.com/maps/api/directions/json?origin=" +
              location.postcode +
              "&destination=" +
              destination.postcode +
              "&key=" +
              mapsAPI,
            function(err, response, body) {
              console.log(
                "https://maps.googleapis.com/maps/api/directions/json?origin=" +
                  location.postcode +
                  "&destination=" +
                  destination.postcode +
                  "&key=" +
                  mapsAPI
              );
              console.log(body);
              const parsedData = JSON.parse(body);
              let kms = parsedData.routes[0].legs[0].distance.text;
              kmsnum = parseInt(kms);
              let miles = Math.round(kmsnum * 0.621371);
              if (returncheckbox) {
                miles = miles * 2;
              }
              Journey.create(
                {
                  startpoint: start,
                  destination: end,
                  returncheckbox: returncheckbox,
                  mileage: miles,
                  date: req.body.mileagedate,
                },
                function(err, createdJourney) {
                  if (err) {
                    console.log(err);
                    res.redirect("/");
                  } else {
                    // console.log('location: '+location);
                    // console.log('destination: '+destination);
                    // console.log("created a journey!");
                    console.log(createdJourney);
                    // console.log(req.body);
                    Location.find({}, function(err, foundLocations) {
                      if (err) {
                        console.log(err);
                        res.redirect("/");
                      } else {
                        req.flash("success", "Successfully created a journey!");
                        res.render("./mileage", { locations: foundLocations });
                      }
                    });
                  }
                }
              );
            }
          );
        }
      });
    }
  });
});

// handles logic for creating a new location in the database
app.post("/locations", function(req, res) {
  let locationName = req.body.locationName;
  let locationPostcode = req.body.locationPostcode;

  Location.findOne({ name: locationName }, function(err, foundLocation) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else if (foundLocation) {
      console.log(foundLocation);
      req.flash("error", "Error: This location name already exists");
      res.redirect("/mileage");
    } else {
      Location.create(
        {
          name: locationName,
          postcode: locationPostcode,
        },
        function(err, createdLocation) {
          if (err) {
            console.log(err);
            res.redirect("/mileage");
          } else {
            console.log(createdLocation);
            req.flash(
              "success",
              "Successfully created a new Location: " + createdLocation.name
            );
            res.redirect("/mileage");
          }
        }
      );
    }
  });
});

// handles delete logic for journeys
app.delete("/journeys/:id", function(req, res) {
  Journey.findByIdAndDelete(req.params.id, function(err, deletedJourney) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("back");
    }
  });
});

// handles delete logic for locations
app.delete("/locations/:id", function(req, res) {
  Location.findByIdAndDelete(req.params.id, function(err, deletedJourney) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("back");
    }
  });
});

app.listen(3000, function() {
  console.log("Woodward Audio Server Is Up!");
});
