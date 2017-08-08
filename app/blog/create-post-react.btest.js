const CreatePost = require("./create-post-react");
const expect = require("chaimel");
const React = require("react");
const enzyme = require("enzyme");

describe("Blog CreatePost", () => {
  const storage = {};
  const cpElement = React.createElement(CreatePost, { storage });

  it("should render in DOM properly", () => {
    enzyme.mount(cpElement);
  });

  it("should have the correct initial default title", () => {
    const wrapper = enzyme.mount(cpElement);
    const title = wrapper.find('input[name="title"]');
    expect(title.node.value).toEqual("new-post-title-here");
  });

  it("should load title from storage", () => {
    const element = React.createElement(CreatePost, {
      storage: {
        postDraft: '{"title":"title from storage"}'
      }
    });
    const wrapper = enzyme.mount(element);
    expect(wrapper.state()).toHaveProperty("title", "title from storage");
    const title = wrapper.find('input[name="title"]');
    expect(title.node.value).toEqual("title from storage");
  });

  it("should load content from storage", () => {
    const element = React.createElement(CreatePost, {
      storage: {
        postDraft: '{"content":"content from storage"}'
      }
    });
    const wrapper = enzyme.mount(element);
    expect(wrapper.state()).toHaveProperty(
      "contentMarkdown",
      "content from storage"
    );
    const content = wrapper.find("textarea");
    expect(content.node.value).toEqual("content from storage");
  });

  it("should track title changes", () => {
    const wrapper = enzyme.mount(cpElement);
    const title = wrapper.find('input[name="title"]');
    title.simulate("change", { target: { value: "new title 1" } });
    expect(wrapper.state()).toHaveProperty("title", "new title 1");
    expect(storage).toHaveProperty("postDraft");
    let postDraft;
    try {
      postDraft = JSON.parse(storage.postDraft);
    } catch (e) {
      expect(e).notToExist();
    }
    expect(postDraft).toHaveProperty("title", "new title 1");
  });

  it("should track password changes", () => {
    const wrapper = enzyme.mount(cpElement);
    const password = wrapper.find('input[type="password"]');
    password.simulate("change", { target: { value: "new password 1" } });
    expect(wrapper.state()).toHaveProperty("password", "new password 1");
  });

  it("should disable save button initially", () => {
    const wrapper = enzyme.mount(cpElement);
    const save = wrapper.find("button");
    expect(save.node.disabled).toBeTrue();
  });

  it("should enable save button when password is set", () => {
    const wrapper = enzyme.mount(cpElement);
    const save = wrapper.find("button");
    const password = wrapper.find('input[type="password"]');
    password.simulate("change", { target: { value: "a" } });
    expect(save.node.disabled).toBeFalse();
  });
  //
  // it('should preview markdown to HTML', (done) => {
  //   // fauxJax.install()
  //   // fauxJax.on('request', respond)
  //   const preview = container.querySelector('section.preview')
  //   const html = '<p>unit test <b>markdown</b></p>'
  //   // function respond (request) {
  //   //   request.respond(200, {}, html)
  //   //   fauxJax.restore()
  //   //   done()
  //   // }
  //   server.respondWith('POST', 'convert', [200, {}, html])
  //
  //   ReactTestUtils.Simulate.change(
  //     cp.refs.content, {target: {value: 'unit test **markdown**'}})
  //   server.respond()
  //   this.timeout(0)
  //   setTimeout(() => {
  //     expect(preview.innerHTML).toEqual(html)
  //     done()
  //   }, 1000)
  // })
});
