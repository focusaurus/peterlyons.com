const PlusParty = require("./plus-party");
const expect = require("chaimel");
const enzyme = require("enzyme");

describe("PlusParty", () => {
  let wrapper;

  before(() => {
    wrapper = enzyme.mount(PlusParty.PlusParty);
  });

  it("should have the correct initial total", () => {
    const total = wrapper.find(".total");
    expect(total.node.innerText).toEqual("6");
  });

  it("should update total correctly", () => {
    const total = wrapper.find(".total");
    wrapper.find("textarea").simulate("change", { target: { value: "5 6 7" } });
    expect(total.node.innerText).toEqual("18");
  });

  it("should parse out numbers correctly", () => {
    const ul = wrapper.find("ul");
    wrapper
      .find("textarea")
      .simulate("change", { target: { value: "nope 42 biscuits 7 8.5" } });
    expect(wrapper.find(".total").node.innerText).toEqual("57.5");
    expect(ul.children().length).toEqual(3);
    expect(ul.childAt(0).node.innerText).toEqual("42.00");
    expect(ul.childAt(1).node.innerText).toEqual("7.00");
    expect(ul.childAt(2).node.innerText).toEqual("8.50");
  });
});
