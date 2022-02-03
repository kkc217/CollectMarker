const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');

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

router.use(bodyParser.urlencoded({extended: false}));
router.use('/public', express.static(path.join(__dirname, '../public')))

router.use('/', function(req, res, next) {
    var fileNum = req.body.fileNum ? req.body.fileNum : "change001";
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
            if ("add" in diff[cnt].lhs) {
                lhsTemplate += `<span class="line_add" id="#l${cnt}">`;
            }
            else {
                lhsTemplate += `<span class="line_del" id="#l${cnt}">`;
            }
            for (var j = 0; j < diff[cnt].lhs.length; j++) {
                lhsTemplate += lhs[i];
                i++;
            }
            lhsTemplate += lhs[i];
            lhsTemplate += `</span>`;

            cnt++;
        }
        else {
            lhsTemplate += lhs[i];
        }
    }
    var diffNum = cnt;

    var rhsTemplate = ``;

    var cnt = 0;
    for (var i = 0; i < rhs.length; i++) {
        if (rhsPos.includes(i)) {
            if ("add" in diff[cnt].rhs) {
                rhsTemplate += `<span class="line_add" id="#r${cnt}">`;
            }
            else {
                rhsTemplate += `<span class="line_del" id="#r${cnt}">`;
            }
            for (var j = 0; j < diff[cnt].rhs.length; j++) {
                rhsTemplate += rhs[i];
                i++;
            }
            rhsTemplate += rhs[i];
            rhsTemplate += `</span>`;
            
            cnt++;
        }
        else {
            rhsTemplate += rhs[i];
        }
    }

    var editScriptArray = new Array();
    for (var i = 0; i < 10; i++) {
        var editScript = new Object();
        editScript.type = "del" + i;
        editScript.oldCode = "a" + i;
        editScript.lineOld = i;
        editScript.newCode = "h" + i;
        editScript.lineNew = i + 1;
        editScriptArray.push(editScript);
    }
    
    var editScripts = new Object;
    editScripts.data = editScriptArray;

    var jsonInfo = JSON.stringify(scriptsArray);

    res.render('../views/marker.ejs', {
        currentFileName : fileNum,
        mkFileName : mkFileName,
        lhsTemplate : lhsTemplate,
        rhsTemplate : rhsTemplate,
        scripts : jsonInfo,
        editScripts : editScripts,
        diffNum : diffNum
    });
})

router.get('/test2', function(req, res, next) {
    res.render('../views/test2.ejs', {
    });
})

module.exports = router;