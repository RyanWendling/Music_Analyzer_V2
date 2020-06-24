# Music_Analyzer_V2
second take at creating a music match application

Hello,

This application helps a user discover new music by taking your itunes playlist xml files and performing calculations on them with the help of the lastfm API to return similar artists. 


Instructions:
1. Go to https://newmusicmatch.herokuapp.com/ or AWS WEBSITE TO BE NAMED to load the MusicMatch application.

2. Follow website instructions or continue following below:

3. To begin, you must have an xml extract of an itunes playlist. To acquire this, simply highlight the desired playlist from the lefthand navbar of your Itunes application. Next, go to File > Library > Export Playlist... From there, save the playlist as an XML file, and load it into the MusicMatch application! NOTE: you may also use the examle xml playlist file for this step that is available at the bottom of the web app.

4. After a short while, the results will load. The algorithm for this will take into account your favorite/most numerous artists and perform some calculations using the LastFM API. Results will then show you the most similar artists to your own library, from most similar, to less. Results will even exclude artists you already know!

5. Click a resulting artist to see additional information about them. The most recently selected artist can be revisited using the "Artist Details" tab.

6. You may resubmit a new XML playlist file at any time.


Technical specifications:
- Uses Express.js and adheres to best practices for web application design, making use of a controller class, routes class, service class, views folder(with EJS templating), Public folder (for the client side static resources like css, js, and stored images/playlists).
- Makes use of Eslint and Prettier to assure that code is styled consistently and correctly.
- Uses the "path" and "fs" libraries to dynamically save Images from the Deezer API that will then be re-used for future uses of the application. 
- Uses the "express-session" library to save session data for the user on the server side. Used to save time by guranteeing that user will keep musicmatch results through entire session (24 hours max).
- Uses "memorystore" library to prevent memory leaks in conjunction with "express-session"
- Uses "serve-favicon" library for favicons.
- Uses "compression" library to  compress the HTTP response sent back to a client, significantly reducing the time required for the client to get and load the page. 
- Uses "helmet" library to set appropriate HTTP headers that help protect  app from well-known web vulnerabilities.
- Uses "multer" library for handling multipart/form-data. Is used for uploading XML playlist files. Additional error handling was created to assure XML playlist files were legitimate. "xml-parse" library was eventually used to read through the received xml.
- Uses "node-fetch" library for elegant HTTP requests.
- Created own LinkedList class for an efficient data structure for artist names. Includes function to remove consecutive erroneous characters.
- Makes use of Javascript modules.
- Artist Details page data gathered by calling LastFM API.
- Responsive Nav bar created using Flexbox, CSS transitions and media queries.
- Paging system designed to allow user to page through results, 50 artists at a time.
- CSS Grid used to show Artist results to user after XML has been submitted. 
- FontAwesome used for a few icons.
- Google fonts used for a couple fonts.
- reset.css used to allow for fine-grained control over design.
