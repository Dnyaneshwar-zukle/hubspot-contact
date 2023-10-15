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

// Handle form submission and update data in HubSpot
app.get('/update', async (req, res) => {
    // http://localhost:3000/update?email=rick@crowbars.net
    const email = req.query.email;

    const getContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=email,favorite_book`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getContact, { headers });
        const data = response.data;

        // res.json(data);
        res.render('update', {userEmail: data.properties.email, favoriteBook: data.properties.favorite_book});
        
    } catch(err) {
        console.error(err);
    }
});

app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
