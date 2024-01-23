const express = require("express");
const passport = require("passport");
const bcrypt = require('bcrypt');
const Appoinment = require("../modals/appoinment");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();
const EnquiryForm = require("../modals/enquiryform");
const Agent = require("../modals/agent");
const hbs = require("hbs");
const geolib = require('geolib');


// Set up Multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Registration route
router.post("/addagent", async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await Agent.findOne({ username });

    if (existingUser) {
      req.flash("error", "Agent already taken.");
      return res.redirect("/register");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const newUser = new Agent({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    req.flash("success", "User registered successfully.");
    res.redirect("/add-user");
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error");
    res.redirect("/addagent");
  

  }
});

// POST route to save Appoinment data with image upload

router.post(
  "/addappoinment",
  upload.single("profileImage"),
  async (req, res, next) => {
    const {
      Name,
      Fathersname,
      Contactno,
      email,
      Address,
      Block,
      Post,
      Ps,
      Disrict,
      Pin,
      State,
      Landmark,
      Aadhar,
      Pan,
      Experience,
    } = req.body;

    try {
      const newAppoinment = new Appoinment({
        Name,
        Fathersname,
        Contactno,
        email,
        Address,
        Block,
        Post,
        Ps,
        Disrict,
        Pin,
        State,
        Landmark,
        Aadhar,
        Pan,
        Experience,
        profileImage: {
          data: req.file ? req.file.buffer : null,
          contentType: req.file ? req.file.mimetype : null,
        },
        educationQualifications: [
          {
            college: req.body.educationQualifications[0].college,
            session: req.body.educationQualifications[0].session,
            division: req.body.educationQualifications[0].division,
          },
          {
            college: req.body.educationQualifications[1].college,
            session: req.body.educationQualifications[1].session,
            division: req.body.educationQualifications[1].division,
          },
          {
            college: req.body.educationQualifications[2].college,
            session: req.body.educationQualifications[2].session,
            division: req.body.educationQualifications[2].division,
          },
          // Add more objects if needed
        ],
      });

      await newAppoinment.save();

      res.status(200).json({ message: "User Appoinment successfully." }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// ...

router.post("/enquiry-form", async (req, res) => {
  try {
    // Extract agent ID and agent name from the authenticated user (req.user)
    const agentId = req.user._id;
    const agentName = req.user.username;

    // Create an instance of the EnquiryForm model with data from the request body
    const newEnquiryFormEntry = new EnquiryForm({
      appoinment: {
        agent: agentId,
        agentName: agentName,
      },
      // Include all fields from req.body
      ...req.body,
    });

    // Save the new entry to the database
    await newEnquiryFormEntry.save();

    // Respond with a success message or the saved data
    res.status(201).json({
      message: "Form submitted successfully",
      data: newEnquiryFormEntry,
    });
  } catch (error) {
    // Handle errors and respond with an error message
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Assuming you have a function to encode data to base64
function encodeToBase64(data) {
  return data ? data.toString("base64") : "";
}

router.get("/show-appointmet", async (req, res) => {
  try {
    const appoinments = await Appoinment.find();
    appoinments.forEach((appoin) => {
      appoin.profileImage.base64 = encodeToBase64(
        appoin.profileImage && appoin.profileImage.data
      );
    });
    return res.render("admin/show-appointmet", {
      appoinments,
      successMessage: req.flash("success"),
      errorMessage: req.flash("error"),
    });
  } catch (error) {
    console.log(error);
  }
});

// // Middleware to check if the user is authenticated and is an admin
// const isAdminAuthenticated = (req, res, next) => {
//   // Passport.js adds a "user" property to the request object if the user is authenticated
//   if (req.isAuthenticated() && req.user.isAdmin) {
//     return next(); // User is authenticated and is an admin
//   }

//   // Redirect to login page or handle unauthorized access as needed
//   res.redirect("/login");
// };

router.get("/admin",async(req,res)=>{
  const distinctAgents = await EnquiryForm.distinct("appoinment.agentName");
  res.render("admin/main",{distinctAgents})
})



router.get("/show-enquiry", async (req, res) => {
  try {
    const distinctAgents = await EnquiryForm.distinct("appoinment.agentName");
  
    const enquiries = await EnquiryForm.find();
    res.render("admin/show-enquiry", { enquiries, distinctAgents, });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/agent/:agentName", async (req, res) => {
  try {
    const agentName = req.params.agentName;
    const formsByAgent = await EnquiryForm.find({ "appoinment.agentName": agentName });
    const distinctAgents = await EnquiryForm.distinct("appoinment.agentName");
  

    return res.render("admin/agent-enquiry", {
      formsByAgent,
        distinctAgents,
      agentName,
      successMessage: req.flash("success"),
      errorMessage: req.flash("error"),
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete a enquiry
router.get("/delete-enquiry/:id", async (req, res) => {
  try {
    const enquiryId = req.params.id;

    // Validate if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      console.error("Invalid product ID:", enquiryId);
      return res.status(400).send("Invalid enquiry ID");
    }

    // Find and delete the enquiry by ID
    const deletedProduct = await EnquiryForm.findByIdAndDelete(enquiryId);

    req.flash("success", "Product deleted successfully");
    return res.redirect("/show-enquiry");
  } catch (error) {
    console.error("Internal Server Error:", error);
    req.flash("error", "Internal Server Error");
  }
});

// Update enquiry route
router.post("/edit-enquiry/:id", async (req, res) => {
  const enquiryId = req.params.id;

  try {
    // Find the enquiry by ID and update its fields
    await EnquiryForm.findByIdAndUpdate(enquiryId, req.body);
    res.redirect("/show-enquiry");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/enquiry-form", (req, res) => {
  res.render("enquiry-form");
});

router.get("/add-user", (req, res) => {
  res.render("admin/add-user");
});

router.get("/appointment-form", (req, res) => {
  res.render("appointment-form");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      req.flash("error", "Error logging out");
    }
    res.redirect("/");

    req.flash("error", "logging out ");
  })
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.post("/clockin", isAuthenticated, async (req, res) => {
  try {
    const user = req.user; // Assuming you are using passport to authenticate
    user.clockHistory.push({ type: "clockin", timestamp: new Date() });
    await user.save();
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Clock out route
router.post("/clockout", isAuthenticated, async (req, res) => {
  try {
    const user = req.user; // Assuming you are using passport to authenticate
    user.clockHistory.push({ type: "clockout", timestamp: new Date() });
    await user.save();
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Add this function to calculate the duration
function calculateDuration(clockHistory) {
  let totalDuration = 0;
  let clockIn = null;

  // Find the latest clock-in timestamp
  for (let i = clockHistory.length - 1; i >= 0; i--) {
    const entry = clockHistory[i];
    if (entry.type === "clockin") {
      clockIn = new Date(entry.timestamp);
      break;
    }
  }

  // Calculate the duration from the latest clock-in to the latest clock-out
  for (let i = clockHistory.length - 1; i >= 0; i--) {
    const entry = clockHistory[i];
    if (entry.type === "clockout") {
      const clockOut = new Date(entry.timestamp);
      totalDuration = clockOut - clockIn;
      break; // Stop after finding the latest clock-out
    }
  }

  const seconds = Math.floor(totalDuration / 1000) % 60;
  const minutes = Math.floor((totalDuration / (1000 * 60)) % 60);
  const hours = Math.floor((totalDuration / (1000 * 60 * 60)) % 24);

  return `${hours}h ${minutes}m ${seconds}s`;
}

// In your route handler
// router.get("/", isAuthenticated, async (req, res) => {
//   try {
//     const user = req.user;

//     let clockInTimestamp = null;
//     let latestClockOutTimestamp = null;

//     // Find the latest clock-in and latest clock-out timestamps
//     for (let i = user.clockHistory.length - 1; i >= 0; i--) {
//       const entry = user.clockHistory[i];

//       if (entry.type === 'clockin' && !clockInTimestamp) {
//         clockInTimestamp = new Date(entry.timestamp);
//       } else if (entry.type === 'clockout' && !latestClockOutTimestamp) {
//         latestClockOutTimestamp = new Date(entry.timestamp);
//       }

//       if (clockInTimestamp && latestClockOutTimestamp) {
//         break; // Stop once both the latest clock-in and clock-out are found
//       }
//     }

//     // Calculate the duration using the latest clock-in and clock-out timestamps
//     const duration = calculateDuration(user.clockHistory.filter(entry =>
//       new Date(entry.timestamp) >= clockInTimestamp && new Date(entry.timestamp) <= latestClockOutTimestamp
//     ));

//     res.render("index", { user, duration });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


router.get("/", async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.render("index");  // Render the "index" page without user data
    }

    const user = req.user;

    // Check if user.clockHistory exists before trying to access its properties
    if (user.clockHistory) {
      // Calculate duration for each clock-in and clock-out pair
      for (let i = user.clockHistory.length - 1; i >= 0; i--) {
        if (user.clockHistory[i].type === 'clockout') {
          const duration = calculateDuration(user.clockHistory.slice(0, i + 1));
          user.clockHistory[i].duration = duration;
        }
      }
    }

    res.render("index", { user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Login successful!",
  })
);

module.exports = router;
