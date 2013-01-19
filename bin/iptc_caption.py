#!/usr/bin/env python
import json
import os
import sys
from StringIO import StringIO
from optparse import OptionParser

#We need to be able to import the iptcinfo.py module
sys.path.insert(0, os.path.dirname(__file__))
from iptcinfo import IPTCInfo

NO_IMAGE_DIR = "Image directory '%s' not found. Aborting.\n"
IMAGE_DIR_REQUIRED = "You must specify the path to your image directory with -d or --dir.\n"

def trimNull(caption):
    if caption == None:
        return None
    caption = caption.strip()
    if caption[-1] == u"\x00":
        caption = caption[:-1]
    return caption

def writeJSONCaptions(options):
    photos = []
    #Suppress stupid warning output from IPTCInfo.py on Mac OS X
    realStdout = sys.stdout
    sys.stdout = StringIO()
    names = os.listdir(options.imageDir)
    names.sort()
    for name in names:
        if not name.lower().endswith("-tn.jpg"):
            continue
        photo = {}
        photo["caption"] = ""
        photo["name"] = os.path.splitext(name)[0][:-3] #Strip off -TN.jpg
        fullPath = os.path.join(options.imageDir, name)
        altTxtPath = os.path.join(
            options.imageDir, photo["name"] + ".alt.txt")
        photos.append(photo)
        try:
            iptcData = IPTCInfo(fullPath, force=True)
            caption = trimNull(iptcData.data[120])
            if not caption and os.path.isfile(altTxtPath):
                try:
                    altFile = file(altTxtPath)
                    caption = altFile.read().strip()
                    altFile.close()
                except IOError:
                    pass
            photo["caption"] = caption or ""
        except Exception, message:
            sys.stderr.write(str(message) + "\n")
    sys.stdout = realStdout
    print json.dumps(photos)

parser = OptionParser()
parser.add_option("-d", "--dir", dest="imageDir",
                  help="path to directory of image files with IPTC IIM metadata")
(options, args) = parser.parse_args()

if options.imageDir is None:
    sys.stderr.write(IMAGE_DIR_REQUIRED)
    parser.print_help()
    sys.exit(1)
if not os.path.isdir(options.imageDir):
    sys.stderr.write(NO_IMAGE_DIR % options.imageDir)
    sys.exit(2)

writeJSONCaptions(options)
