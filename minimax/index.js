const XElement = `
<svg class="x" aria-label="X" role="img" viewBox="0 0 128 128" style="visibility: visible;">
  <path d="M16,16L112,112" style="stroke: rgb(84, 84, 84);"></path>
  <path d="M112,16L16,112" style="stroke: rgb(84, 84, 84);"></path>
</svg>
`

const OElement = `
<svg class="o" aria-label="O" role="img" viewBox="0 0 128 128" style="visibility: visible;">
  <path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(242, 235, 211);"></path>
</svg>
`

const EMPTY = 0
const X = 1
const O = 2
const DRAW = 3
let bot = null

let els = []
let textEl = null

function clone(d) {
  let out, v, key;
  out = Array.isArray(d) ? [] : {};
  for (key in d) {
      v = d[key];
      out[key] = (typeof v === "object") ? clone(v) : v;
  }
  return out;
  // return Object.assign({}, d);
  // return JSON.parse(JSON.stringify(d));
}

function maxIndex(arr) {
  return arr.indexOf(Math.max(...arr));
}

function minIndex(arr) {
  return arr.indexOf(Math.min(...arr));
}

const game = {
  state: {
    grid: [
      [0,0,0],
      [0,0,0],
      [0,0,0]
    ],
    turn: X
  },

  init() {
    textEl = document.getElementsByClassName('text')[0]
    els = document.getElementsByClassName('item')
    Array.prototype.map.call(els, function (e, i) {
      e.onclick = this._clickFuncFactory(i)
    }.bind(this))
  },

  setBlock(state, {x, y}) {
    let new_state = clone(state)
    new_state.grid[x][y] = new_state.turn
    this._switchTurns(new_state)
    return new_state
  },

  getMoves(grid) {
    let moves = []
    grid.forEach((e, row) => {
      e.forEach((i, col) => {
        if (i === EMPTY) moves.push({ x:row, y:col })
      })
    })
    return moves
  },

  getWinner(grid) {
    let str = [].concat.apply([], grid)
              .join('')
              .split(X).join('X')
              .split(O).join('O')
              .split(EMPTY).join('.')

    let r = str.match(/(\w)(..(\1|.\1.)..\1|.\1.\1..$|\1\1(...)*$)/g)
    if (!r) {
      let isFull = str.indexOf('.') < 0
      
      if (isFull)
        return DRAW;
      
      return EMPTY;
    }
    r = r[0].charAt(0)
    return r === 'X' ? X : O
  },

  userClick({x, y}) {
    this.state = this.setBlock(this.state, { x, y })
    this._render()
    let winner = this.getWinner(this.state.grid)
    if (winner !== EMPTY) {
      this._endGame(winner)
      return;
    }
  },
  
  _switchTurns(state) {
    state.turn = state.turn === X ? O : X
  },

  _endGame(winner) {
    setTimeout(() => {
      let containerEl = document.getElementsByClassName('container')[0]
      let endGameEl = document.getElementsByClassName('endGame')[0]
      containerEl.style.display = 'none'
      textEl.innerHTML = 'Game Over'
      
      if (winner !== DRAW)
        endGameEl.innerHTML = (winner === X ? XElement : OElement) + endGameEl.innerHTML
      else
        document.getElementsByClassName('title')[0].innerHTML = 'DRAW!'
      
      endGameEl.style.display = 'flex'
    }, 500)
  
  },

  _render() {
    this.state.grid.forEach((e, row) => {
      e.forEach((i, col) => {
        let content = ''
        switch(this.state.grid[row][col]) {
          case X: content = XElement; break;
          case O: content = OElement; break;
          default: break;
        }
        els[row*3+col].innerHTML = content
      })
    })
    textEl.innerHTML = (this.state.turn === X ? 'X' : 'O') + ' Turn'
  },

  _clickFuncFactory(count) {
    let y = count % 3
    let x = (count - y) / 3
    return (function() {
      if (this.state.grid[x][y] === EMPTY) {
        this.userClick({x, y})
        if (bot) bot(JSON.parse(JSON.stringify(this.state)))
      }
    }).bind(this)
  }
}

window.onload = game.init.bind(game)