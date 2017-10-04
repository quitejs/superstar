window.Quite = class Quite 
  constructor: ->
    @_attrs = []
  attrs: (attrs...) ->
    @_attrs or @_attrs = []
    for attr in attrs
      do (attr) =>
        if attr instanceof Array
          @attrs attr...
        else 
          @_attrs.push attr
          @[attr] = (attrValue...) ->
            if attrValue.length is 0
              @["_#{attr}"]
            else if attrValue.length is 1
              @["_#{attr}"] = attrValue[0]
              @
            else
              @["_#{attr}"] = attrValue
              @
