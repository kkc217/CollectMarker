const http = require('http');
const fs = require('fs');

const hostname = 'localhost';
const port = 3000;

const router = require('express').Router();

var dir = __dirname;
dir = dir.slice(0,-7);

let fileList = fs.readFileSync(dir + 'change_files.txt','utf-8');
fileList = fileList.split('/');
router.get('/', (req,res) => {
    var fileNum = req.param("fileNum");
    var numExt = parseInt(fileNum.slice(6));
    let oldFileData = fs.readFileSync(dir + '/changes/' + fileNum + '/old/' + fileList[numExt],'utf-8');
    let newFileData = fs.readFileSync(dir + '/changes/' + fileNum + '/new/' + fileList[numExt],'utf-8');

    var template = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>${fileNum}</title>
            <style>
                body {
                    background-color: #ffffff;
                }
                pre {
                    overflow-x: hidden;
                }
                code {
                    overflow-x: scroll;
                }
                .flex_container {
                display: flex;
                border: 6px;
                padding: 10px;
                height: 100%;
                justify-content: center;
                }
                #inner {
                    background-color: #f4f4f4;
                    word-break:break-all;
                }
                #left {
                    background-color: #f4f4f4;
                    flex: 0.49;
                    overflow-x: hidden;
                    max-width: 1000px;
                }
                #right {
                    background-color: #f4f4f4;
                    flex: 0.49;
                    overflow-x: hidden;
                    max-width: 1000px;
                }
                #middle {
                    width: 10px;
                }
                #nav {
                    list-style:none;
                    height: 40px;
                    padding: 5px 1px;
                    margin: 0;
                }
                #nav select{
                    float: right;
                    position: relative;
                    margin: 5px 30px;
                    padding: 0;
                }
                select {
                    width: 150px;
                    height: 30px;
                    font-family: inherit;
                    border: 1px solid #999;
                    border-radius: 0px;
                    
                }
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/intellij-light.min.css">
            <script>
                function selOptions() {
                    let selectEl = document.getElementById("jump");
                    for (var i = 1; i <= 500; i++) {
                        var opt = document.createElement("option");
                        if (i < 10) {
                            fileName = "change00" + i;
                        }
                        else if (i < 100) {
                            fileName = "change0" + i;
                        }
                        else {
                            fileName = "change" + i;
                        }

                        opt.value = "/marker?fileNum=" + fileName;
                        opt.text = fileName;

                        if (fileName == '${fileNum}') {
                            opt.selected = 'true';
                        }
                        
                        selectEl.append(opt);
                    }
                }
    
                window.onload = function() {
                    selOptions();
                }
            </script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/java.min.js"></script>
            <script>hljs.initHighlightingOnLoad();</script>
        </head>
        <body>
            <ul id="nav">
                <select name="jump" id="jump" onchange="location.href=this.value"></select>
            </ul>
            
            <br>
            
            <div class="flex_container">
                <div id="left">
                    <pre><code class="java" id="inner">
                        ${oldFileData}
                    </code></pre>                    
                </div>
                <div id="middle">&nbsp</div>
                
                <div id="right">
                    <pre><code class="java" id="inner">
                        ${newFileData}
                    </code></pre>    
                </div>
            </div>
    
        </body>
    </html>
        `;
    res.end(template);
});

router.get('/login', (req,res) => {
    res.send('login');
});

module.exports = router;