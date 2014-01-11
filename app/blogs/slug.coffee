slug = (phrase="") ->
  phrase
    .replace(/\s/g, "-")
    .replace(/'/g, "")
    .replace(/\./g, "-")
    .replace(/--/g, "-")
    .replace(/-$/, "")
    .toLowerCase()

module.exports = slug
