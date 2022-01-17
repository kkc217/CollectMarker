const router = require('express').Router();

router.get('/', (req,res) => {
    var template = `
    <script>
        window.location.href="/marker?fileNum=change001";
    </script>
    `;

    res.end(template);
});

module.exports = router;