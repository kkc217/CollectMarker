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
        opt.value = "?fileNum=" + fileName;
        opt.text = fileName;
        selectEl.append(opt);
    }
}

window.onload = function() {
    selOptions();
}