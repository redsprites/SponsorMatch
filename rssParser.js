const puppeteer = require('puppeteer');
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
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        // await page.setUserAgent(getRandomUserAgent());
        await page.goto(rssUrl);
        await page.screenshot({ path: "test.png" });

      // The content fetched from the page
      const content = await page.content();

      // Use regex to extract the content within the <pre> tag
      const preTagContentRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/i;
      const matchedContent = content.match(preTagContentRegex);
      
      if (matchedContent && matchedContent[1]) {
          // Unescape the XML content
          const unescapedContent = he.decode(matchedContent[1]);
      
          // Continue with your XML parsing
          const parser = new xml2js.Parser();
          const companies = []; // This array will hold all the job objects
          try {
              const result = await parser.parseStringPromise(unescapedContent);
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
          } catch (parsingError) {
              console.error('Error parsing the content:', parsingError);
          }
      
          // Log the companies array to see the collected job data
          console.log(companies);
          return companies;
      
      } else {
          console.error("Could not extract the XML content from the page");
          return [];
      }
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
}




// exports.parseRss = async function (rssUrl) {
//     let browser;
//     let companies = [];

//     try {
//         browser = await puppeteer.launch({ headless: false });
//         const page = await browser.newPage();
//         // await page.setUserAgent(getRandomUserAgent());
//         await page.goto(rssUrl);
//         await page.screenshot({ path: "test.png" });

//         const content = await page.content();

//         const parser = new xml2js.Parser();

//         try {
//             const result = await parser.parseStringPromise(content);
//             const items = result.rss.channel[0].item;

//             for (let i = 0; i < items.length; i++) {
//                 let title = items[i].title[0];
//                 let link = items[i].link[0];
//                 let description = items[i].description[0];
//                 let company = items[i].source[0];
//                 let pubDate = items[i].pubDate[0];
//                 let georssPoint = items[i]['georss:point'][0];

//                 title = he.decode(title);
//                 description = he.decode(description);

//                 companies.push({
//                     title,
//                     link,
//                     description,
//                     company,
//                     pubDate,
//                     georssPoint
//                 });
//             }

//         } catch (parsingError) {
//             console.error('Error parsing the content:', parsingError);
//         }

//     } catch (error) {
//         console.error('An error occurred:', error);
//     } finally {
//         if (browser) {
//             await browser.close();
//         }
//     }

//     return companies;
// };