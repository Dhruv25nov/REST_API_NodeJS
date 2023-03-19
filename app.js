const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb://127.0.0.1/wikiDB', { useNewUrlParser: true });

articleSchema = ({
    title: String,
    content: String
});

Article = mongoose.model("Article", articleSchema);

//////////////////////////////// Rest api for all article using chaining////////////////////////////////////
app.route("/articles")
    .get((req, res) => {
        Article.find()
            .then((foundArticles) => {
                res.send(foundArticles);
            })
            .catch((err) => {
                res.send(err);
            })

    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content


        })
        newArticle.save()
            .then(() => {
                res.send("Article successfully saved ")
            })
            .catch((err) => {
                res.send(err)
            });
    })
    .delete((req, res) => {
        Article.deleteMany()
            .then(() => {
                res.send("All articles successfully deleted")
            })
            .catch((err) => {
                res.send(err)
            });
    });


/////////////////////////////////// Rest API for specific article///////////////////////////////////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        const articleTitle = req.params.articleTitle;
        Article.findOne({ title: articleTitle })
            .then((articlefound) => {
                res.send(articlefound);
            })
            .catch((err) => {
                res.send(err);
            })

    })
    .put((req, res) => {
        Article.replaceOne(
            { title: req.params.articleTitle },
            {
                title: req.body.title,
                content: req.body.content
            })
            .then(() => {
                res.send("Article successfully updated");
            })
            .catch((err) => {
                res.send(err);
            });
    })
    .patch((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body })
            .then(() => {
                res.send("Patch request sucess")
            })
            .catch((err) => {
                res.send(err)
            });
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle })
            .then(() => {
                res.send("Article successfully deleted");
            })
            .catch((err) => {
                res.send(err);
            })
    });


app.listen(3000, function () {
    console.log("Server is running on port 3000");
}
);