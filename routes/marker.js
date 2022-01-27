const express = require('express');
const router = express.Router();
const editScript = require('../public/js/editScript');

var scriptsArray = new Array();
var script = new Object();
script.type = "Delete";
script.old_code = "import java.io.IOException;";
script.old_line = "22";
script.new_code = "import java.utile.Map;";
script.new_line = "20";
scriptsArray.push(script);

function mkFileName(num) {
    if (num < 1) {
        result = "change500";
    } else if (num < 10) {
        result = "change00" + num;
    } else if (num < 100) {
        result = "change0" + num;
    } else if (num <= 500) {
        result = "change" + num;
    } else {
        result = "change001";
    }
    return result;
}

const fs = require('fs');
const myers = require('myers-diff');

var baseDir = __dirname.slice(0, -7);

let fileList = fs.readFileSync(baseDir + '/change_files.txt', 'utf-8');
fileList = fileList.split('/');


router.get('/', function(req, res, next) {
    var fileNum = req.param("fileNum") ? req.param("fileNum") : "change001" ;
    var numExt = parseInt(fileNum.slice(6));
    const lhs = fs.readFileSync(baseDir + '/changes/' + fileNum + '/old/' + fileList[numExt],'utf-8');
    let rhs = fs.readFileSync(baseDir + '/changes/' + fileNum + '/new/' + fileList[numExt],'utf-8');

    const diff = myers.diff(lhs, rhs);

    var lhsPos = [];
    var rhsPos = [];
    for (var i = 0; i < diff.length; i++) {
        lhsPos.push(diff[i].lhs.pos);
        rhsPos.push(diff[i].rhs.pos);
    }

    var lhsTemplate = ``;

    var cnt = 0;
    for (var i = 0; i < lhs.length; i++) {
        if (lhsPos.includes(i)) {
            lhsTemplate += `<div class="dropdown">`;
            if ("add" in diff[cnt].lhs) {
                lhsTemplate += `<span class="dropbtn" id="line_add">`;
            }
            else {
                lhsTemplate += `<span class="dropbtn" id="line_del">`;
            }
            for (var j = 0; j < diff[cnt].lhs.length; j++) {
                lhsTemplate += lhs[i];
                i++;
            }
            lhsTemplate += lhs[i];
            lhsTemplate += `</span>`;

            lhsTemplate += `<div class="dropdown-content">`;
            lhsTemplate += `<a href="#" class="del" id="${cnt}" onclick="Del()">Delete</a>`;
            lhsTemplate += `<a href="#">Move</a>`;
            lhsTemplate += `<a href="#">Update</a>`;
            lhsTemplate += `</div>`;
            lhsTemplate += `</div>`;
            lhsTemplate += "\n";
            cnt++;
        }
        else {
            lhsTemplate += lhs[i];
        }
    }

    var rhsTemplate = ``;

    var cnt = 0;
    for (var i = 0; i < rhs.length; i++) {
        if (rhsPos.includes(i)) {
            rhsTemplate += `<div class="dropdown">`;
            if ("add" in diff[cnt].rhs) {
                rhsTemplate += `<span class="dropbtn" id="line_add">`;
            }
            else {
                rhsTemplate += `<span class="dropbtn" id="line_del">`;
            }
            for (var j = 0; j < diff[cnt].rhs.length; j++) {
                rhsTemplate += rhs[i];
                i++;
            }
            rhsTemplate += rhs[i];
            rhsTemplate += `</span>`;

            rhsTemplate += `<div class="dropdown-content">`;
            rhsTemplate += `<a href="#" id="${cnt}">Insert</a>`;
            rhsTemplate += `<a href="#">Move</a>`;
            rhsTemplate += `<a href="#">Update</a>`;
            rhsTemplate += `</div>`;
            rhsTemplate += `</div>`;
            rhsTemplate += "\n";
            cnt++;
            
        }
        else {
            rhsTemplate += rhs[i];
        }
    }
    
    var jsonInfo = JSON.stringify(scriptsArray);

    res.render('../views/marker.ejs', {
        currentFileName : fileNum,
        mkFileName : mkFileName,
        lhsTemplate : lhsTemplate,
        rhsTemplate : rhsTemplate,
        scripts : jsonInfo,
        Del : editScript.Del(),
    });
})

module.exports = router;