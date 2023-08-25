const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()


const websites = [
    {
        name: 'cricbuzz',
        address: 'https://www.cricbuzz.com/',
        base: 'https://www.cricbuzz.com'
    },
    {
        name: 'crickettimes',
        address: 'https://crickettimes.com/',
        base: ''
    },
    {
        name: 'cricketaddictor',
        address: 'https://cricketaddictor.com/',
        base: ''
    },
    {
        name: 'cricviz',
        address: 'https://cricviz.com/news-and-insight/',
        base: ''
    },
    {
        name: 'wisden',
        address: 'https://wisden.com/',
        base: ''
    },
    {
        name: 'espncricinfo',
        address: 'https://www.espncricinfo.com/cricket-news',
        base: 'https://www.espncricinfo.com'
    },
    {
        name: 'abplive',
        address: 'https://news.abplive.com/sports/cricket',
        base: ''
    },
    // {
    //     name: 'cricket365',
    //     address: 'https://www.cricket365.com/home/',
    //     base: ''
    // },
    {
        name: 'thecricketer',
        address: 'https://thecricketer.com/',
        base: ''
    },
    {
        name: 'cricadium',
        address: 'https://www.cricadium.com/category/cricket-news/',
        base: ''
    },
    // {
    //     name: 'icc',
    //     address: 'https://www.icc-cricket.com/news',
    //     base: ''
    // },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/sport/cricket',
        base: 'https://www.bbc.com'
    },
    {
        name: 'skysports',
        address: 'https://www.skysports.com/cricket/news',
        base: ''
    }
    
    
    
]

const articles = []

const keywords = ["cricket", "innings", "win", "pitch", "overs", "wickets", "runs"];

websites.forEach(website => {
    axios.get(website.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            keywords.forEach(keyword => {
                $(`a:contains("${keyword}")`, html).each(function () {
                    const title = $(this).text()
                    const url = $(this).attr('href')
                    articles.push({
                        title,
                        url: website.base + url,
                        source: website.name
                    })
                })
            })
        })
})


app.get('/', (req,res) => {
    res.json('welcome to cricket news and articles API!')
})

app.get('/news', (req,res) => {
     res.json(articles)
})

app.get('/news/:websiteId', async (req,res) => {
    const websiteId = req.params.websiteId

    const websiteAddress = websites.filter(website => website.name === websiteId)[0].address
    const websiteBase = websites.filter(website => website.name == websiteId)[0].base


    axios.get(websiteAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("cricket")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: websiteBase + url,
                    source: websiteId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))

})



app.listen(PORT, () => console.log(`server running on ${PORT}`))