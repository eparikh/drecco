class GoBoard
  constructor: (id,game) ->
    @$el = $ "#{id}"
    @size = @$el.children().length
    @$el.on 'click', @handleClick
    @game = game
    @cells = []
    @states = []
    @buildCells()

  handleClick: (e) =>
    $t = $(e.target)
    return unless $t.data('x')? and $t.data('y')?
    @game.handleClick $t.data('x'), $t.data('y')

  addCell: (c) ->
    @cells[c.x] = [] unless @cells[c.x]
    @cells[c.x][c.y] = c

  buildCells: ->
    for cell in @$el.find(".cell")
      c = new GoCell $(cell).data('x'), $(cell).data('y'), @
      @addCell c

  removeCell: (x,y,color) ->
    console.log("remove cell "+x+","+y)
    @cells[x] = [] unless @cells[x]
    if @cells[x][y].removeStone()
      return true
    else
      return false

  isEmpty: (x,y) ->
    @cells[x][y].isEmpty()

  updateColor: ->
    @$el.removeClass @game.currentColor
    @$el.addClass @game.nextColor()


  addStone: (stone) ->
    cell = @cells[stone.x][stone.y]
    if cell.addStone(stone)
      state = @encodeState()
      true
    else
      false

  isGameEnded: (stone) ->
      count =  (0 for n in [0..8])
      shouldContinueCounting = (true for n in [0..8])
      ###
      current stone is X, search surrounding up to length 4
       0 1 2
       3 X 4
       5 6 7
      ###
      length = 1
      while length <= 4 and ((shouldContinueCounting.filter (x) -> x is true).length != 0)

        counter = 0
        for i in [-1,0,1]
            for j in [-1,0,1]
              if (i != 0 or j != 0) and shouldContinueCounting[counter]
                  if @cells[stone.x + i*length][stone.y + j*length]?.color(stone.color)
                    count[counter] += 1
                  else
                    shouldContinueCounting[counter] = false
              counter +=1
        length +=1
      if count[0]+count[8] >= 4 or count[1]+count[7]>=4 or count[2]+count[6] >= 4 or count[3]+count[5] >= 4
        return true
      return false
  encodeState: ->
    ( parseInt( row.map( (cell) -> cell.state() ).join(''), 3 ).toString(36) for row in @cells ).join(',')

  state: ->
    s = []
    for row in @cells
      s.push( cell.state() ) for cell in row
    s

class GoCell
  constructor: (x,y,board) ->
    @board = board
    [ @x, @y ] = [ x, y ]
    @stone = false
    @$el = @board.$el.find "[data-x=#{x}][data-y=#{y}]"
    @dead = false

  state: ->
    return 0 if @isEmpty()
    return 1 if @isBlack()
    return 2 if @isWhite()

  isEmpty: ->
    not @stone

  isWhite: ->
    @stone?.color is 'white'

  isBlack: ->
    @stone?.color is 'black'


  color: (c) ->
      @stone?.color is c

  oppositeColor: ->
    return 'empty' unless 'stone'
    if @stone?.color is 'black' then 'white' else 'black'

  addStone: (stone) ->
    @stone = stone
    @$el.data 'stone', @stone
    @$el.addClass @stone.color

  removeStone: () ->
    if @stone.color is 'black'
      @$el.data 'stone', ''
      @$el.removeClass @stone.color
      @stone = false
      return true
    return false

class GoStone
  constructor: (game,x,y,color) ->
    @game = game
    @x = x
    @y = y
    @color = color

class GoPlayers
  constructor: (id, game) ->
    @$el = $ "#{id} .goPlayers"
    @game = game

class GoGame
  constructor: (id) ->
    @board = new GoBoard id, @
    @players = new GoPlayers id, @
    @currentColor = 'black'
    @black = 0
    @white = 0
    @step = 0

  handleClick: (x,y) ->
    stone =new GoStone @, x, y, @currentColor
    if @step == 6
      if !@board.isEmpty(x,y)
        if @board.removeCell(x, y,'black')
          @black--
          @step++
    else
      return unless @board.isEmpty(x,y)
      if @addStone stone
        @step++
        console.log(@step)
        if @board.isGameEnded stone
          console.log(stone.x, stone.y,"five in a row!")
          alert(@currentColor + " is the winner! Black: "+@black+" White: "+@white)
          return
        if @step != 5
          @board.updateColor()
    if @step == 4
      alert("Black places two stones in this round")
    if @step == 6
      alert("White: click on any black on the board to remove it, then place a white stone")

  addStone: (stone) ->
    if ret = @board.addStone stone
      if @currentColor is 'black' then @black +=1 else @white +=1
      return true
    return false

  nextColor: ->
    if @currentColor is 'black' then @currentColor='white' else @currentColor='black'



new GoGame '#board15'
