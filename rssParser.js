const axios = require('axios');
const xml2js = require('xml2js');
const he = require('he');

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.3',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36',
];

function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

exports.parseRss = async function (rssUrl) {
    try {
        const response = await axios.get(rssUrl, {
            headers: {
                'User-Agent': getRandomUserAgent(),
            }
        });

       
        const parser = new xml2js.Parser();
        const companies = []; // This array will hold all the job objects

        const result = await parser.parseStringPromise(response.data);
        const items = result.rss.channel[0].item;

        for (let i = 0; i < items.length; i++) {
            try {
                let title = items[i].title[0];
                let link = items[i].link[0];
                let description = items[i].description[0];
                let company = items[i].source[0];
                let pubDate = items[i].pubDate[0];
                let georssPoint = items[i]['georss:point'][0];

                // Decode HTML entities
                // **it is not being properly decoded
                title = he.decode(title);
                description = he.decode(description);

                // Create a new object with the job data and add it to the companies array
                companies.push({
                    title,
                    link,
                    description,
                    company,
                    pubDate,
                    georssPoint
                });
            } catch (e) {
                console.log(`An error occurred in item ${i}: ${e}`);
            }
        }

        // Log the companies array to see the collected job data
        // console.log(companies);
        return companies;
    } catch (e) {
        console.log("An error occurred: ", e);
    }
}

