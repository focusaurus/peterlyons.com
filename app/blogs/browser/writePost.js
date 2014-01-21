;(function iife(exports, undefined) {

function $find(selector) {
  return $(".create_blog").find(selector);
}

function $preview() {
  return $find(".preview");
}

function content() {
  return $find(".content").val();
}

function preview(content, $out) {
  $.ajax({
    type: "POST",
    url: "/convert",
    contentType: "text/x-markdown",
    data: content,
    success: function(response) {
      $out.html(response);
    }
  });
}

function handleKeys(event) {
  var postDraft = {
    content: content(),
    title: $find("[name=title]").val()
  };
  localStorage.postDraft = JSON.stringify(postDraft);
  preview(postDraft.content, $preview());
}

function save() {
  $find(".notices").html("");
  var data = {
    title: $find("[name=title]").val(),
    content: content(),
    password: $find("[type=password]").val()
  };
  $.ajax({
    type: "POST",
    url: "post",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: function(response) {
      $find(".notices").html("New post saved at <a href='/" + response.URI + "'>" + response.URI + "</a>");
      window.scrollTo(0, 0);
    },
    error: function(response) {
      $find(".notices").html("<strong>BORKED!</strong>");
    }
  });
}

var savedPost = {
  title: "",
  content: ""
};
try {
  savedPost = JSON.parse(localStorage.postDraft);
} catch (_error) {
  console.log(localStorage.postDraft);
}
$find(".content").val(savedPost.content).focus().on(
  "keyup", _.debounce(handleKeys, 250));
$find("[name=title]").val(savedPost.title);
preview(savedPost.content, $preview());
$find("button").on("click", save);

})();
