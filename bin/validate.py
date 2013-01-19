#!/usr/bin/python2.6
import glob
import os
import re
import string
import urllib
import urllib2

def validate(URL):
    validatorURL = "http://validator.w3.org/check?uri=" + \
        urllib.quote_plus(URL)
    opener = urllib2.urlopen(validatorURL)
    output = opener.read()
    opener.close()
    if re.search("This document was successfully checked as".replace(
            " ", r"\s+"), output):
        print "    VALID: ", URL
    else:
        print "INVALID: ", URL

def main():
    conf = {}
    for line in open("site_conf.sh"):
        line = line.strip()
        if line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        value = value.replace('"', "")
        value = string.Template(value).safe_substitute(conf)
        conf[key] = value

    URIs = ["/", "/problog", "/persblog", "/app/photos"]
    if os.path.isdir("/Users"):
        conf["WORK"] = conf["WORK"].replace("/home", "/Users")
    for template in glob.glob(os.path.join(conf["WORK"], "templates/*_tmpl.tmpl")):
        template = os.path.basename(template)
        pageName = template.replace("_tmpl.tmpl", "")
        if pageName in ("main", "photos"):
            continue
        URIs.append("/%s.html" % pageName)

    for URI in URIs:
        validate(conf["PRODURL"] + URI)


if __name__ == "__main__":
    main()
