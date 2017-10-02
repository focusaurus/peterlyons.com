function slug(phrase) {
  return (phrase || "")
    .replace(/\s/g, "-") // spaces to dashes
    .replace(/['!,:]/g, "") // delete most punctuation
    .replace(/[.]/g, "-") // some punctuation to dashes
    .replace(/--/g, "-") // collapse double dashes
    .replace(/-$/, "")
    .toLowerCase();
}

module.exports = slug;
