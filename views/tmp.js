const fs = require('fs');
const myers = require('myers-diff');

const router = require('express').Router();

var dir = __dirname;
dir = dir.slice(0,-7);

let fileList = fs.readFileSync(dir + '/change_files.txt','utf-8');
fileList = fileList.split('/');

router.get('/', (req,res) => {
    var fileNum = req.param("fileNum");
    var numExt = parseInt(fileNum.slice(6));
    let oldFileData = fs.readFileSync(dir + '/changes/' + fileNum + '/old/' + fileList[numExt],'utf-8');
    let newFileData = fs.readFileSync(dir + '/changes/' + fileNum + '/new/' + fileList[numExt],'utf-8');
    
    var preFileNum = Number(fileNum.slice(6)) - 1;
    var nextFileNum = Number(fileNum.slice(6)) + 1;

    if (preFileNum < 10) {
        preFileNum = "changes00" + preFileNum;
    }
    else if (preFileNum < 100) {
        preFileNum = "changes0" + preFileNum;
    }
    else {
        preFileNum = "changes" + preFileNum;
    }

    if (nextFileNum < 10) {
        nextFileNum = "changes00" + nextFileNum;
    }
    else if (preFileNum < 100) {
        nextFileNum = "changes0" + nextFileNum;
    }
    else {
        nextFileNum = "changes" + nextFileNum;
    }

    const lhs = oldFileData;
    const rhs = newFileData;
    
    const diff = myers.diff(lhs, rhs);
    
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
                .line_add {
                    background-color: #e6ffec;
                }
                .line_del {
                    background-color: #ffebe9;
                }
                #inner_left {
                    background-color: #f4f4f4;
                    word-break:break-all;
                }
                #inner_right {
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
             <!-- <div class="flex_container">
                <a class="pre" href="/marker?fileNum=${preFileNum}">Previous</button>
                <a class="pre" onClick="location.href='/marker?fileNum=${nextFileNum}'">Next</button>
            </div> -->

            <div class="flex_container">
                <div id="left">
                    <pre><code class="java" id="inner_left">`;

    var lhsPos = [];
    var rhsPos = [];
    for (var i = 0; i < diff.length; i++) {
        lhsPos.push(diff[i].lhs.pos);
        rhsPos.push(diff[i].rhs.pos);
    }
    
    var cnt = 0;
    for (var i = 0; i < oldFileData.length; i++) {
        if (lhsPos.includes(i)) {
            if ("add" in diff[cnt].lhs) {
                template += `<span class="line_add">`;
            }
            else {
                template += `<span class="line_del">`;
            }
            for (var j = 0; j < diff[cnt].lhs.length; j++) {
                template += oldFileData[i];
                i++;
            }
            if (diff[cnt].lhs.length != 0) {
                template += oldFileData[i];
                template += `</span>`;
            }
            else {
                template += `</span>`;
                template += oldFileData[i];
            }
            cnt++;
        }
        else {
            template += oldFileData[i];
        }
    }

    template += `
                    </code></pre>                    
                </div>
                <div id="middle">&nbsp</div>
    
                <div id="right">
                    <pre><code class="java" id="inner_right">`;
    var cnt = 0;
    for (var i = 0; i < newFileData.length; i++) {
        if (rhsPos.includes(i)) {
            if ("add" in diff[cnt].rhs) {
                template += `<span class="line_add">`;
            }
            else {
                template += `<span class="line_del">`;
            }
            for (var j = 0; j < diff[cnt].rhs.length; j++) {
                template += newFileData[i];
                i++;
            }
            if (diff[cnt].rhs.length != 0) {
                template += newFileData[i];
                template += `</span>`;
            }
            else {
                template += `</span>`;
                template += newFileData[i];
            }
            cnt++;
        }
        else {
            template += newFileData[i];
        }
    }

    template += `
                    </code></pre>    
                </div>
            </div>
        </body>
    </html>`;

    res.end(template);
});

module.exports = router;