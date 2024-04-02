const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/verse";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const path = require("path"); //views ejs chroma
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.send("root");
});

//index
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//new
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

//show
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//create
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  console.log(newListing)
  await newListing.save();
  res.redirect("/listings");
});

//edit
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//update
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect("/listings");
});

//delete
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// app.get("/testlisting", async (req, res) => {
//   let sampleLisitng = new Listing({
//     id: 1,
//     first_name: "anshu",
//     last_name: "yadav",
//     email: "anshu@gmail.com",
//     gender: "female",
//     domain: "sales",
//     available: true,
//   });
//   await sampleLisitng.save();
//   console.log("sample is saved")
//   res.send("success")
// });

app.listen(8080, () => {
  console.log("listening");
});
