const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { body } = require("express-validator/check");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "",
    },
  })
);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post(
  "/contact",
  [
    body("name").notEmpty().withMessage("Name is Empty"),
    body("email").notEmpty(),
  ],
  (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res
        .status(422)
        .sendFile(path.join(__dirname, "public", "views", "contact.html"));
    }

    res.redirect("index.html");
    return transporter.sendMail({
      to: "max.dubakov@gmail.com",
      from: "onlineshopnodejs@gmail.com",
      subject: "New Message",
      html: `
        <h1>${name}</h1>
        <p>${message}</p>
        <br><br><br>
        <h3>From: ${email}</h3>`,
    });
  }
);

app.get("/contact.html", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "views", "contact.html"));
});

app.get("/about.html", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "views", "about.html"));
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "views", "index.html"));
});

app.listen(3000);
