expect = require("chai").expect
Gallery = require "app/photos/Gallery"

describe "the Gallery model", ->
  describe "constructor", ->
    it "should not mess with dirName", ->
      gal = new Gallery("foo_20110402")
      expect(gal.dirName).to.eql "foo_20110402"

    describe "displayName default computation based on dirName", ->
      it "should capitalize the first letter", ->
        gal = new Gallery("baloney_sandwich")
        expect(gal.displayName.slice(0, 7)).to.eql "Baloney"

      it "should replace underscores with spaces", ->
        gal = new Gallery("baloney_sandwich_bingo-time")
        expect(gal.displayName).to.eql "Baloney sandwich bingo-time"

      it "should convert YYYYMMDD dates in to pretty format", ->
        gal = new Gallery("foo_20110402")
        expect(gal.displayName).to.eql "Foo April 2, 2011"

      it "should not get confused by an almost-date string", ->
        gal = new Gallery("bar_201104")
        expect(gal.displayName).to.eql "Bar 201104"

    describe "startDate default computation based on dirName", ->
      it "should set the startDate from dirName if available", ->
        gal = new Gallery("bar_20110402")
        expect(gal.startDate).to.eql new Date(2011, 3, 2)

      it "should set the startDate from dirName if available with displayName set", ->
        gal = new Gallery("bar_20110402", "Bar Far")
        expect(gal.startDate).to.eql new Date(2011, 3, 2)

      it "should not get confused by an almost-date string", ->
        gal = new Gallery("bar_201104")
        expect(gal.startDate).not.to.eql

      it "should leave startDate undefined if there is no timestamp", ->
        gal = new Gallery("test_2011_airplane")
        expect(gal.startDate).not.to.eql

    describe "startDate parsing", ->
      it "should handle YYYYMMDD", ->
        gal = new Gallery("test", "test", "20110402")
        expect(gal.startDate).to.eql new Date(2011, 3, 2)

      it "should handle YYYYMMDD as object", ->
        gal = new Gallery("test", "test", new String("20110402"))
        expect(gal.startDate).to.eql new Date(2011, 3, 2)

      it "should handle MM/DD/YYYY", ->
        gal = new Gallery("test", "test", "04/02/2011")
        expect(gal.startDate).to.eql new Date(2011, 3, 2)

      it "should handle MM/DD/YY", ->
        gal = new Gallery("test", "test", "04/02/11")
        expect(gal.startDate).to.eql new Date(2011, 3, 2)

      it "should handle years before 2000", ->
        gal = new Gallery("test", "test", "08/01/1999")
        expect(gal.startDate).to.eql new Date(1999, 7, 1)

      it "should handle ISO 8601 format", ->
        gal = new Gallery("test", "test",
          new Date(1999, 7, 1).toISOString())
        expect(gal.startDate).to.eql new Date(1999, 7, 1)

    describe "URI", ->
      it "should return the right value", ->
        gal = new Gallery("dirName1", "Test Gal", "20110402")
        expect(gal.URI()).to.eql "/app/photos?gallery=dirName1"
