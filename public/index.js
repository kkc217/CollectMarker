var http = require('http');
var fs = require('fs');
var urlmodule = require('url');
var app = http.createServer(function(request,response){
    var url = request.url;
    var queryData = urlmodule.parse(url, true).query;
    var title = queryData.id;
    var template = `
<!doctype html>
<html>
<head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  <ol>
    <li><a href="1.html">HTML</a></li>
    <li><a href="2.html">CSS</a></li>
    <li><a href="3.html">JavaScript</a></li>
  </ol>
  <h2>${title}</h2>
  <p>The World Wide Web (abbreviated WWW or the Web) is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and can be accessed via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser computer program in 1990 while employed at CERN in Switzerland.[2][3] The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.
  </p>
</body>
</html>
`;
      if(url == '/'){
        url = '/index.html';
      }
      if(url == '/favicon.ico'){
          response.writeHead(404);
          response.end();
          return;        
      }
      response.writeHead(200);
      response.end(template);
 
});
app.listen(3000);