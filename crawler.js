const fetch = require("node-fetch");
const cheerio = require("cheerio");
const moment = require("moment");
const fs = require('fs');

let url = `http://kenyalaw.org/caselaw/cases/advanced_search`;
let id = 0;
let cases = [];
const firstDec = new Date("December 01,2020");
const lastDate = new Date("December 15,2020");

function getCases(page) {
  if (page > 250) {
    return;
  } else {
    if (page) {
      url = `http://kenyalaw.org/caselaw/cases/advanced_search` + "/page/" + page;
      page = page + 10;
    }

    return fetch(`${url}`)
      .then((response) => response.text())
      .then((body) => {
        const $ = cheerio.load(body);
        $(".post").each(function (i, element) {
          const post = $(element);
          const title = post
            .find(".post > table > tbody > tr:first-child td > h2")
            .text()
            .trim();

          const url = post
            .find('> a')
            .attr('href');

          let dateDelivered = post
            .find("table > tbody > tr:nth-child(2) td:last-child")
            .children()
            .remove()
            .end()
            .text()
            .trim();

          dateDelivered = new Date(dateDelivered);
          if (dateDelivered >= firstDec && dateDelivered <= lastDate) {
            dateDelivered = moment(dateDelivered).format("YYYY-MM-DD");
            const single = {
              id: id,
              title: title,
              url: url,
              date: dateDelivered,   
            };
            id++;

            cases.push(single);

            fs.writeFile('results.html', JSON.stringify(cases, null), () => {
              console.log(`case saved to 'results.html' successfully`);
            });

          }
        });

        console.log("Page number: ", page);
        console.log("Total cases: ", cases.length);
       
        if (page) {
          getCases(page);
        } else {
          getCases(240);
        }

      })
      .catch((err) => console.log(err))
  }
}

getCases();
