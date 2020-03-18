var Scraper = require("images-scraper");

let google = new Scraper.Google({
  keyword: "banana",
  limit: 3,
  puppeteer: {
    headless: false
  },
  tbs: {
    // every possible tbs search option, some examples and more info: http://jwebnet.net/advancedgooglesearch.html
    isz: undefined, // options: l(arge), m(edium), i(cons), etc.
    itp: undefined, // options: clipart, face, lineart, news, photo
    ic: undefined, // options: color, gray, trans
    sur: undefined // options: fmc (commercial reuse with modification), fc (commercial reuse), fm (noncommercial reuse with modification), f (noncommercial reuse)
  }
});

(async () => {
  let results = await google.start();
  console.log("results", results);
})();

/*async function f() {
  let promise = new Promise((resolve, reject) => {
    console.log("inside the promise");
    setTimeout(() => resolve("done!"), 1000);
  }).catch(() => console.log("error"));

  let result = await promise; // wait until the promise resolves (*)

  console.log("immediateStart");
  console.log(result); // "done!"
  console.log("immediateEnd");
}

f();
console.log("stopheredebug");
console.log("orheredebug");
*/
