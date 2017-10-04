window.json = JSON
require './quite'
require './box'
require './under'
frame = require './frame'
# frame = require "pages/nav"
window.onload = ->
  document.body.insertBefore frame.build().elmt, document.body.childNodes[0]
  Router.frame(frame).index('todo')
  Router.hash(Hash.init()).change()
