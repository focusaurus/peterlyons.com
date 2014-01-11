config = require 'app/config'

YMD = /(19|20)\d{6}/
monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', \
 'August', 'September', 'October', 'November', 'December']

parseISO8601 = (dateString) ->
  try
    maybe = new Date(dateString)
  catch error
    return false
  if maybe and maybe.toString() != "Invalid Date"
    return maybe #ISO 8601 Format
  else
    return false

parseTimestamp = (timestamp) ->
  if not /^\d$/.test timestamp
    return false
  return new Date(new Number(dateString))

parseYMD = (ymd) ->
  if not YMD.test ymd
    return false
  year = new Number(ymd.slice(0, 4))
  month = new Number(ymd.slice(4, 6))
  day = new Number(ymd.slice(6, 8))
  return new Date(year, month - 1, day)

parseMDY = (dmy) ->
  if not /(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})/.test dmy
    return false
  [month, day, year] = dmy.split('/')
  if year.length == 2
    year = new Date().getFullYear().toString().slice(0, 2) + year
  return new Date(new Number(year), new Number(month) - 1, new Number(day))

parseDate = (dateString) ->
  #Timestamp test must come before YMD test
  for parser in [parseISO8601, parseTimestamp, parseYMD, parseMDY]
    result = parser dateString
    if result
      return result
  console.log "BUGBUG cannot parse date #{dateString}"
  return null

exports.Gallery = class Gallery
  constructor: (@dirName, @displayName, @startDate) ->
    #avoid errors if these are undefined
    @dirName = @dirName or ''
    @displayName = @displayName or @dirName
    @dirPath = config.photos.galleryDir + '/' + @dirName

    #First, check the dirname for an embedded date like 20110402
    match = @dirName.match YMD
    if match
      #Store this in case there is no supplied startDate
      startDateFromDirName = parseDate match[0]
      formattedDate =  monthNames[startDateFromDirName.getMonth()] + ' ' + \
        startDateFromDirName.getDate() + ', ' + \
        startDateFromDirName.getFullYear()
      #If we found a date in YYYYMMDD format, change it to January 1, 1970
      @displayName = @displayName.replace YMD, formattedDate

    #Do some basic prettification of the display name
    @displayName = @displayName.replace /_/g, ' '
    @displayName = @displayName.slice(0, 1).toUpperCase() + \
      @displayName.slice(1)

    if @startDate instanceof Date
      #Done
    else if @startDate
      #OK, let's make sure the data is kosher
      #Simplest to convert to a string initially
      @startDate = parseDate '' + @startDate
    else
      @startDate = startDateFromDirName or null

  URI: () ->
    return "#{config.photos.galleryURI}?gallery=#{@dirName}"

module.exports = Gallery
