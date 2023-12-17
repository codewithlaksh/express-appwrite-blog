const express = require('express');
const sdk = require('node-appwrite');
const exphbs = require('express-handlebars');
const { formatDate } = require('./helpers/hbs');
const { Marked } = require('marked');
const marked = new Marked();
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'base.hbs',
    extname: '.hbs',
    helpers: {
        formatDate
    }
}))
app.set('view engine', '.hbs')
app.use(express.json());

const client = new sdk.Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setKey(process.env.APPWRITE_API_KEY)
    .setProject(process.env.APPWRITE_PROJECT_ID)

const databases = new sdk.Databases(client);

app.get('/', async (req, res) => {
    const response = await databases.listDocuments(
        process.env.APPWRITE_DB_ID,
        process.env.APPWRITE_COLLECTION_ID
    )
    res.status(200).render('index', {
        documents: response.documents,
        count: response.total
    })
})

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const response = await databases.getDocument(
        process.env.APPWRITE_DB_ID,
        process.env.APPWRITE_COLLECTION_ID,
        id
    )
    res.status(200).render('post', {
     title: response.title,
     tagline: response.tagline,
     content: marked.parse(response.content),
     published: response.$createdAt,
    })
})

app.listen(port, () => {
    console.log(`Server app listening on port ${port}`)
})
