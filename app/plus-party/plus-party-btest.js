//
//   it("should parse out numbers correctly", () => {
//     const ul = wrapper.find("ul");
//     wrapper
//       .find("textarea")
//       .simulate("change", { target: { value: "nope 42 biscuits 7 8.5" } });
//     expect(wrapper.find(".total").node.innerText).toEqual("57.5");
//     expect(ul.children().length).toEqual(3);
//     expect(ul.childAt(0).node.innerText).toEqual("42.00");
//     expect(ul.childAt(1).node.innerText).toEqual("7.00");
//     expect(ul.childAt(2).node.innerText).toEqual("8.50");
//   });
// });
const tap = require("tap");
/* global document */

async function getTotal(tab) {
  const wrapper = await tab.evaluate(
    () => document.querySelector(".plus-party .total").innerText
  );
  return wrapper.result.value;
}

async function run(tab) {
  await tap.test(
    "plus-party should have the correct initial total",
    async test => {
      test.same(await getTotal(tab), "6.00");
      test.end();
    }
  );
  //
  // await tap.test("plus-party should calculate total correctly", async test => {
  //   await tab.clear(".plus-party textarea");
  //   await tab.type(".plus-party textarea", "5 6 7.2");
  //   await tab.wait(2000); // total is debounced
  //   test.same(await getTotal(tab), "18.2");
  //   test.end();
  // });
}

exports.run = run;
exports.uri = "/plus-party";
