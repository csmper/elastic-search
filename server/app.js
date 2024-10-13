const { Client } = require('@elastic/elasticsearch');
const express = require("express");
const bodyParser = require("body-parser");
const elasticClient = new Client({
    cloud: {
        id: '810b523d774b479e84fb8746adf7fa19:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGFiMzUyMzc5YmYyZTRjMDdhZmJhMTk0NDAzN2NiNTQ5JGU5ODAxNjliNmVkNzQwNjA4ZmVkZTI4ZTE4OTM4NWM2',
    },
    auth: {
        username: 'elastic',
        password: 'kIzkEdHcCyxumzvAwtaSN44k'
    }
});


const app = express();
app.use(bodyParser.json());

app.get('/hello', (req, res) => {
    res.send('hello');
});

app.post("/create-post", async (req, res) => {
    console.log('in create post');
    const result = await elasticClient.index({
        index: "search-post",
        document: {
            title: req.body.title,
            author: req.body.author,
            content: req.body.content,
        },
    });
    res.send(result);
});

app.get("/search", async (req, res) => {
    const result = await elasticClient.search({
        index: "search-post",
        query: { fuzzy: { title: req.query.query } },
    });

    res.json(result);
});

app.get("/posts", async (req, res) => {
    const result = await elasticClient.search({
        index: "search-post",
        query: { match_all: {} },
    });

    res.send(result);
});

app.delete("/remove-post", async (req, res) => {
    const result = await elasticClient.delete({
        index: "search-post",
        id: req.query.id,
    });

    res.json(result);
});

app.listen(3001, () => {
    console.log('server running at port 3001')
});
