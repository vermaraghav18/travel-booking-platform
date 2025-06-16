const express = require('express');
const router = express.Router();

router.get('/track', (req, res) => {
  const { link } = req.query;
  console.log(`User clicked: ${link}`);
  res.redirect(link);
});

module.exports = router;
