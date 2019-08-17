"use strict"
const env = require('dotenv').config();
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const formatter = require('html-formatter');
const recursive = require("recursive-readdir");
const edge = require('edge.js');
const chokidar = require('chokidar');
const base_dir = path.normalize(__dirname.split("bin").join("") + process.env.RESOURCES_DIR + '/views');
const public_dir = path.normalize(__dirname.split("bin").join("") + process.env.PUBLIC_DIR);
const protected_dir = JSON.parse(process.env.LAYOUT_DIR);
const app_mode = process.env.APP_MODE
const sub_dir = JSON.parse(process.env.SUB_DIR);
const helpers = require('../helpers/helpers.js');
/**
 ** set edge views dir 
 **/
edge.registerViews(path.join(base_dir));
/**
 ** this handle protector directory
 ** @param disable compile file on directory
 **/
async function protector(file) {
  var red =  null;
  for (var i = 0; i < protected_dir.length; i++) {
     if (file.includes(protected_dir[i])) {
        return null;
     }
  }
  return file;
}
/**
 ** this handle compile data
 ** set compiler by edge adonis
 **/
function compile(item) {
  var  replacement = fs.readFileSync(path.normalize(__dirname.replace("bin","")+"helpers/helpers_after_compile.json"));
  var  rcf         = fs.readFileSync(path.normalize(__dirname.replace("bin","")+"helpers/helpers_before_compile.json"));
  try {
    replacement  = JSON.parse(replacement);
  } catch(e) {
    console.warn(e);
  }
  var file = path.normalize(item.split( path.normalize(base_dir + "/")).join(""));
  /**
   ** call helpers with editebe component helpers
   **/
  try {
    var rendered = edge.render(file, {
      env: process.env
    })

    /**
     ** replace components
     **/
    for (var i = 0; i < sub_dir.length; i++) {
      var lang_mode = (item.includes("/"+sub_dir+"/") == true ? sub_dir[i] : "base");
    }
    for (var i = 0; i < replacement.length; i++) {
      if (replacement[i]["app_mode"] == "all") {
        if (replacement[i]["sub_dir"] == "all" || replacement[i]["sub_dir"] == lang_mode) {
          rendered = rendered.split(replacement[i]["find"]).join(replacement[i]["replace"]);
        }
      } else if (replacement[i]["app_mode"] == process.env.APP_MODE) {
        if (replacement[i]["sub_dir"] == "all" || replacement[i]["sub_dir"] == lang_mode) {
          rendered = rendered.split(replacement[i]["find"]).join(replacement[i]["replace"]);
        }
      }
    }
  } catch (e) {
   rendered  =  edge.render(path.normalize('layouts/woops-errors'),{
    errors  : e.toString(),
    files   : item
   })
  }
  rendered  =  (process.env.PRETIFY == "true" ? formatter.render(rendered) : rendered);
     write(file.split(".edge").join(".html"), rendered); 
}
/**
 ** this handle wariitng file
 **/
function write(name, data) {
  var target_dir = public_dir + "/" + name;
  try {
    fse.outputFile(target_dir, data, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log("writted " + target_dir)
      }
    });
  } catch (err) {
    console.log(err);
  }
}
/**
 ** handle rendering all components
 **/
function rendererAll() {
  recursive(base_dir, async function (err, files) {
    if (err) {
      console.log(err)
    } else {
      for (var i = 0; i < files.length; i++) {
        if (await protector(files[i])) {
          for (var j = 0; j < sub_dir.length; j++) {
            if (files.includes(sub_dir[j]) == false && files[i].includes('.edge') == true && protector(files[i])) {
              compile(files[i])
            }
          }
        }
      }
    }
  });
}
/**
 ** this handle watcher 
 ** use chokidar
 **/
if (process.env.APP_MODE == "development") {
  const watcher = chokidar.watch(base_dir);
  watcher
    .on('add', async  function (file) {
      if (await protector(file)) {
         compile(file)
      }
    })
    .on('change', async  function (file) {
      console.log("File was changed " + file)
      if ( await protector(file) ) {
        compile(file)
      } else {
        rendererAll()
      }
    })
    .on('unlink', function (file) {
      console.log("File was removed " + file)
      console.log("removed :  " + file)
    })
} else {
  rendererAll();
}