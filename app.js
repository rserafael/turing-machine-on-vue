let express, app, path, port, emailValitador, bodyParser, multer, upload, nodemailer;

function sendEmail(subject, text) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'testemail.rse@gmail.com',
            pass: 'rsegmail95'
        }
    });
    var mailOptions = {
        from: 'rse test',
        to: 'rafael.eusebio95@gmail.com',
        subject: subject,
        text: text,
    };
    transporter.sendMail(mailOptions, function (error, info) { 
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

express = require("express");
path = require("path");
emailValitador = require("email-validator");
bodyParser = require("body-parser");
multer = require('multer');
nodemailer = require('nodemailer');
upload = multer();

app = express();
app.use(express.static(path.join(__dirname, "view")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    let text, subject, dateObj, date, time;
    dateObj = new Date();
    date = dateObj.toLocaleDateString();
    time = dateObj.toLocaleTimeString();
    subject = `Someone visited your site.`;
    text = `date: ${date}, time: ${time}.`;
    sendEmail(subject, text);
    res.redirect("/vue.html");
});

app.post("/verifyemail", upload.array(), (req, res) => {
    let email, name, isEmailValid, isNameEmpty, jsonRes, dateObj, date, time, text, subject;
    jsonRes = {
        isEmailValid: true,
        isNameEmpty: false
    };
    email = req.body['email'];
    name = req.body['name'];
    isEmailValid = emailValitador.validate(email)
    isNameEmpty = name === "";
    if (!isEmailValid) {
        jsonRes.isEmailValid = false;
    }
    if (isNameEmpty) {
        jsonRes.isNameEmpty = true; 
    }
    dateObj = new Date();
    date = dateObj.toLocaleDateString();
    time = dateObj.toLocaleTimeString();
    text = `Name: ${name}, Email: ${email}\nHe received this message: ${JSON.stringify(jsonRes)}\nDate: ${date}, Time: ${time}.`;
    subject=`Somebody logged in your site.`;
    sendEmail(subject, text);
    res.status(200).json(jsonRes);
});

app.get("/linkedin", (req, res) => {
    res.redirect("http://www.linkedin.com/in/rse-rafael");
});

app.listen(
    process.env.PORT || 5000,
    () => {
        console.log(`port: ${process.env.PORT || 5000}`);
        console.log(`dirname: ${__dirname}`);
        // for(var prop in process.env){
        //     var type = typeof process.env[prop];
        //     var text = `(${type}) ${prop}`;
        //     console.log(text);
        // }
    });

