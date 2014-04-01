function slug(phrase) {
  return (phrase || "")
    .replace(/\s/g, "-")
    .replace(/'/g, "")
    .replace(/!/g, "")
    .replace(/\./g, "-")
    .replace(/--/g, "-")
    .replace(/-$/, "")
    .toLowerCase();
}

module.exports = slug;
