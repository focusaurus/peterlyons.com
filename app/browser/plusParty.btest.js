require('angular')
require('angular-mocks')
var expect = require('chaimel')
var plusParty = require('app/browser/plusParty')

describe('plusParty', function () {
  it('sum should work', function () {
    expect(plusParty.sum(42, 7)).toEqual(49)
  })
  it('wrap should work', function () {
    var wrapped = plusParty.wrap(42)
    expect(wrapped).to.be.have.property('value', 42)
  })
})

describe('PlusParty Controller', function () {
  var injector
  var options

  beforeEach(inject(function ($injector) {
    injector = $injector
    options = {
      $scope: injector.get('$rootScope')
    }
  }))

  it('should set up scope with rawText and numbers array', function () {
    injector.instantiate(plusParty.Controller, options)
    expect(options.$scope.rawText.toLowerCase()).to.contain('paste some')
    expect(options.$scope.numbers).to.be.an('array')
    expect(options.$scope.numbers).to.be.empty()
  })
})
