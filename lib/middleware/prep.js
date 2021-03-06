var fs   = require("fs")
var path = require("path")
var tar  = require('tar')
var zlib = require('zlib')
var fsReader  = require('fstream-ignore')

module.exports = function(req, next){
  var pack = tar.Pack()
  var zip = zlib.Gzip()
  var project = fsReader({ 'path': req.project, ignoreFiles: [".surgeignore"] })
  project.addIgnoreRules([".git"])

  req.tarballPath = path.resolve("/tmp/", Math.random().toString().split(".")[1] + ".tar")

  var tarball = fs.createWriteStream(req.tarballPath)

  tarball.on("finish", function(e){
    next()
  })

  project.pipe(pack).pipe(zip).pipe(tarball)
}