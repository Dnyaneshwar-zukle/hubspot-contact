const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.static("public"));
app.set("view engine", "pug");

const PRIVATE_APP_ACCESS = "pat-na1-4f0ea632-73c7-4321-803e-f0caddc144db";

// Render the homepage with data from HubSpot
app.get("/", async (req, res) => {
  const contactsEndpoint = "https://api.hubspot.com/crm/v3/objects/contacts";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const resp = await axios.get(contactsEndpoint, { headers });
    const data = resp.data.results;
    res.render("homepage", { title: "Homepage", data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/update", (req, res) => {
  res.render("update", {
    userEmail: "example@email.com",
    favoriteBook: "Example Book",
  });
});

// Handle form submission and update data in HubSpot
app.get("/update", async (req, res) => {
  const email = req.query.email;
  const getContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=email,favorite_book`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(getContact, { headers });
    const data = response.data;
    res.render("update", {
      userEmail: data.properties.email,
      favoriteBook: data.properties.favorite_book,
    });
  } catch (err) {
    console.error(err);
  }
});

app.get("/update", async (req, res) => {
  const email = req.query.email;

  // Check if an email parameter is provided in the URL
  if (email) {
    // Fetch the contact data for the provided email
    const getContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=email,favorite_book`;
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.get(getContact, { headers });
      const data = response.data;
      res.render("update", {
        userEmail: data.properties.email,
        favoriteBook: data.properties.favorite_book,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    // Handle the case where no email parameter is provided
    res.render("update", { userEmail: "", favoriteBook: "" });
  }
});

app.post("/update", async (req, res) => {
  const email = req.body.email;
  const newVal = req.body.newVal;

  // Check if an email is provided in the form data
  // if (email) {
  //   // Proceed with the update
  //   const update = {
  //     properties: {
  //       favorite_book: newVal,
  //     },
  //   };

  //   const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
  //   const headers = {
  //     Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  //     "Content-Type": "application/json",
  //   };

  //   try {
  //     await axios.patch(updateContact, update, { headers });
  //     res.redirect("/");
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send("Internal Server Error");
  //   }
  // } else {
  //   res.status(400).send("Email is required for the update.");
  // }
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
