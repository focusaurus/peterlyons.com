const dateFns = require("date-fns");
const renderPost = require("./render-post");

function asObject(post) {
  const withDefaults = Object.assign(
    {
      publish_date: new Date(),
      content: "",
      title: "",
      name: "",
      uri: ""
    },
    post
  );
  return {
    date: dateFns.format(withDefaults.publish_date, "MMMM DD, YYYY"),
    html: renderPost(withDefaults.content),
    name: withDefaults.name.trim(),
    publish_date: withDefaults.publish_date,
    title: withDefaults.title.trim(),
    uri: withDefaults.uri
  };
}
exports.asObject = asObject;
