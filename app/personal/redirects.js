function noHtml(req, res, next) {
  if (/\.html$/.test(req.path)) {
    const to = req.path.slice(0, req.path.length - 5);
    res.redirect(301, to);
    return;
  }
  next();
}

module.exports = [noHtml];
