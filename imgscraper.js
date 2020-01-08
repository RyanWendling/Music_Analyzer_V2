const NightmareModule = require("nightmare");

const person = {
  firstName: "John",
  lastName: "Doe",
  id: 5566,
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
};
// This gets ran as soon as main code requires it?
console.log(person.fullName());

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
function ScrapeImg() {
  console.log("beginning scrape");
  const nightmareInstance = NightmareModule({ show: true });
  nightmareInstance
    .goto("https://duckduckgo.com")
    .type("#search_form_input_homepage", "github nightmare")
    .click("#search_button_homepage")
    .wait("#r1-0 a.result__a")
    .evaluate(() => document.querySelector("#r1-0 a.result__a").href)
    .end()
    .then(console.log)
    .catch(error => {
      console.error("Search failed:", error);
    });
  return "Yung Brobasaur";
}

ScrapeImg();

module.exports = {
  printYo() {
    return ScrapeImg();
  }
};
