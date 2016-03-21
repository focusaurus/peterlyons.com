var expect = require('chaimel')
var core = require('./plus-party-core')

describe('plus-party-core.sum', function () {
  it('should do a basic addition', function () {
    expect(core.sum(21, 21)).toDeepEqual(42, 'sum should add numbers')
  })
})

describe('plus-party-core.parseNumbers', function () {
  it('should handle simple positive integers and whitespace', function () {
    expect(core.parseNumbers('42')).toDeepEqual([42])
    expect(core.parseNumbers('42 15 666')).toDeepEqual([42, 15, 666])
    expect(core.parseNumbers('0 0 79')).toDeepEqual([0, 0, 79])
    expect(core.parseNumbers('   \t\n26\t\r32\n')).toDeepEqual([26, 32])
  })

  it('should handle simple decimal points and negatives', function () {
    expect(core.parseNumbers('-42')).toDeepEqual([-42])
    expect(core.parseNumbers('42.15 666')).toDeepEqual([42.15, 666])
    expect(core.parseNumbers('0 -0 -79')).toDeepEqual([0, -0, -79])
    expect(core.parseNumbers(
      '   \t\n-26.987\t\r32.005\n')).toDeepEqual([-26.987, 32.005])
  })

  it('should handle currency symbols', function () {
    expect(core.parseNumbers('$42')).toDeepEqual([42])
    expect(
      core.parseNumbers('$42.15 $666 £92'))
      .toDeepEqual([42.15, 666, 92])
    expect(core.parseNumbers('€0')).toDeepEqual([0])
  })

  it('should handle commas', function () {
    expect(core.parseNumbers('1484.57')).toDeepEqual([1484.57])
    expect(core.parseNumbers('123,456.57')).toDeepEqual([123456.57])
  })

  it('should ignore mm/dd/yyyy dates', function () {
    expect(core.parseNumbers('12/31/1984')).toDeepEqual([])
    expect(
      core.parseNumbers('6 09/20/78 17')).toDeepEqual([6, 17])
  })
})
