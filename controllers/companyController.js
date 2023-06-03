// A while loop is introduced that continuously fetches new pages until a page with no results (empty) is encountered.
//The processCompany function sends each company found immediately as a response instead of waiting to process the whole batch.
//The fetchPage function fetches a page and puts all companies into a queue.
//The number of companies found is used to calculate the start parameter for the next page request.
//The response headers are set to send a stream of JSON objects.
// The response is ended when all companies have been sent.

const { parseRss } = require('../rssParser');
let Queue;
import('queue').then((module) => {
    Queue = module.default;
}).catch(err => {
    console.error(err);
});

exports.jobTitleQuery = async (req, res) => {
    console.log("controller called");
    console.log(req.params.jobTitle);
    let start = 0;
    const jobTitle = req.params.jobTitle;
    const encodedJobTitle = encodeURIComponent(jobTitle);
    let companies = [];
    let companiesQueue = new Queue();
    let pageEmpty = false;

    const { PW_2023_Q2 } = req.models; 

    const processCompany = async (companyObj) => {
        const companyName = companyObj.company;
        const regex = new RegExp(companyName, 'i'); // 'i' makes it case insensitive
        const result = await PW_2023_Q2.aggregate([
            {
                $match: {
                    EMPLOYER_LEGAL_BUSINESS_NAME: { $regex: regex }
                }
            },
            {
                $group: {
                    _id: "$EMPLOYER_LEGAL_BUSINESS_NAME",
                    locations: { $addToSet: "$EMPLOYER_CITY" },
                    salaries: { $addToSet: "$PWD_WAGE_RATE" },
                    count: { $sum: 1 }
                }
            }
        ]);

        if (result.length > 0) {
            console.log(companyObj);
            res.write(`data: ${JSON.stringify(companyObj)}\n\n`); // Send company immediately as an SSE event
        }
    }

    const fetchPage = async () => {
        const rssUrl = "https://www.indeed.com/rss?q=" + encodedJobTitle + "&start="+ start;
        console.log(rssUrl);
        companies = await parseRss(rssUrl);
        if (companies.length === 0 || companies.length === "undefined") {
            pageEmpty = true;
        }
        start += companies.length;
        companies.forEach(company => companiesQueue.push(company));
    }

    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // Flush the headers to establish SSE with the client
    
        let isFirstFetch = true;
    
        while (!pageEmpty) {
            if (isFirstFetch) {
                isFirstFetch = false;
            } else {
                // Wait for 3 seconds before making the next fetch
                await new Promise(resolve => setTimeout(resolve, 15000));
            }
    
            await fetchPage();
    
            while (companiesQueue.length > 0) {
                await processCompany(companiesQueue.pop());
            }
        }
    
        if (!errorOccurred) {
            res.end(); // End the response when all companies have been sent
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
        errorOccurred = true;
    }
}

//    try {
     
     
//         const { PW_2023_Q2 } = req.models; 
//         const result = await PW_2023_Q2.aggregate([
//             {
//                 $match: {
//                     JOB_TITLE: jobTitle
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$EMPLOYER_LEGAL_BUSINESS_NAME",
//                     locations: { $addToSet: "$EMPLOYER_CITY" },
//                     salaries: { $addToSet: "$PWD_WAGE_RATE" },
//                     count: { $sum: 1 }
//                 }
//             }
//         ]);
        
//         res.status(200).json({ success: true, result });
//     } catch (error) {
     
//         console.error(error);
//         res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    
//     }
// };
