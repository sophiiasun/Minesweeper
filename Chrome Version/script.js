const GRID_SIZE = 30
const TOTAL_MINES_COUNT = 120
const boardElement = document.getElementById("game-board")
const MINE_POSITIONS = []
const ALL_DIRECTION = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
const STRAIGHT_DIRECTION = [[-1, 0], [1, 0], [0, -1], [0, 1]]

var gameboard = []
var minesFound = 0
var tilesFound = 0

main()
window.addEventListener("contextmenu", e => e.preventDefault());

function main(currentTime) {
	createGrid()
	createBombs()
	fillNumbers()
}

// CLICKS

function singleLeft(tile) {
	checkClick(tile)
}

function doubleLeft(tile) {
	doubleClick(tile)
}

function singleRight(tile) {
	markTile_2(tile)
}

function doubleRight(tile) {
	markTile_1(tile)
}

gameboard.forEach(row => {
    row.forEach(tile => {
		var clicks = 0, timeout;
        tile.buttonElement.addEventListener('mousedown', e => {
            switch (e.which) {
                case 1: 
                    clicks++;
                    if (clicks == 1) timeout = setTimeout(function () { singleLeft(tile); clicks = 0; }, 250);
                    else { clearTimeout(timeout); doubleLeft(tile); clicks = 0; }
                    break
                case 3:
                    clicks++;
                    if (clicks == 1) timeout = setTimeout(function () { singleRight(tile); clicks = 0; }, 250);
                    else { clearTimeout(timeout); doubleRight(tile); clicks = 0; }
                    break
            }
        }, false);
        boardElement.appendChild(tile.buttonElement)
    })    
})
// GRID

function createGrid() {
    for (var r = 0; r < GRID_SIZE; r++) {
    	let row = []
    	for (var c = 0; c < GRID_SIZE; c++) {
    		const buttonElement = document.createElement("button")
    		var type = 0, clickable = true, status = "button", flagged = false
    		buttonElement.classList.add('button')
    		buttonElement.style.border = "outset"
    		buttonElement.id = r+"-"+c
    		buttonElement.gridRowStart = r
    		buttonElement.gridColumnStart = c
    		const tile = { buttonElement, r, c, type, clickable, status, flagged } 
    		row.push(tile)
    	}
    	gameboard.push(row)
    }
}

function validPosition(row, col) {
	return row >= 0 && col >= 0 && row < GRID_SIZE && col < GRID_SIZE
}

// CREATING BOMBS

function createBombs() {
	let counter = 0
	var row, col
	while (counter < TOTAL_MINES_COUNT) {
		row = Math.floor(Math.random()*30) 
		col = Math.floor(Math.random()*30)
		if (gameboard[row][col].type === 0) {
			gameboard[row][col].type = -1
			// gameboard[row][col].buttonElement.innerHTML = "X"
			MINE_POSITIONS.push([row, col])
			counter++
		}
	}
}

// FILL NUMBERS

function fillNumbers() {
	MINE_POSITIONS.forEach(pos => { // position
		ALL_DIRECTION.forEach(dir => {
			const row = pos[0] + dir[0]
			const col = pos[1] + dir[1]
			if (validPosition(row, col) && gameboard[row][col].type !== -1) {
				var count = gameboard[row][col].type + 1
				gameboard[row][col].type = count
			}
		})
	})
}

// REVEAL TILE (left click)

function checkClick(tile) {
	if (tile.type === 0) {
		revealTile(tile)
		revealBlanks(tile) 
	} else if (tile.type > 0) 
		revealTile(tile)
	else {
		revealMines(tile)
		displayLose(tile)
	}
}

function revealTile(tile) {
	const button = tile.buttonElement
	tile.clickable = false
	const newTile = document.createElement('div')
	newTile.gridRowStart = tile.r
	newTile.gridColumnStart = tile.c
	newTile.classList.add('tile')
	boardElement.replaceChild(newTile, button)
	tile.status = "tile"
	if (gameboard[tile.r][tile.c].type > 0)
		newTile.innerHTML = gameboard[tile.r][tile.c].type	
	tilesFound++
}

function revealBlanks(tile) {
	let queue = []
	queue.push([tile.r, tile.c])
	while (queue.length !== 0) {
		let pos = queue[0]; queue.shift()
		ALL_DIRECTION.forEach(dir => {
			const row = pos[0] + dir[0]
			const col = pos[1] + dir[1]
			if (validPosition(row, col) && gameboard[row][col].status === "button") {
				revealTile(gameboard[row][col])
				if (gameboard[row][col].type === 0) queue.push([row, col])
			}
		})
	}
}

function countFlagged(r, c) {
	var counter = 0
	STRAIGHT_DIRECTION.forEach(dir => {
		const row = r + dir[0]
		const col = c + dir[1]
		if (validPosition(row, col) && gameboard[row][col].status === "button" && gameboard[row][col].flagged == true) 
			counter++
	})
	return counter
}

function doubleClick(tile) {

}

// MARK TILE (right click)

function markTile_1(tile) {
	const button = tile.buttonElement
	if (button.innerHTML === '?') button.innerHTML = ''
	else button.innerHTML = '?'
}

function markTile_2(tile) {
	const button = tile.buttonElement
	if (button.innerHTML === 'X') button.innerHTML = ''
	else button.innerHTML = 'X'
	tile.flagged = true
}

// CHECK WIN OR LOSE

function displayLose(tile) {
	setTimeout(function(){ 
		if (confirm("You Lost! Press 'OK' or refresh the page to restart.")) location.reload()
		else disableBoard()
	}, 500);
}

function displayWin() {
	disableBoard()
	setTimeout(function(){ 
		if (confirm("You Won! Press 'OK' or refresh the page to restart.")) {
			location.reload()
		}
	}, 500);
}

function checkWin() {
	if (minesFound == TOTAL_MINES_COUNT && minesFound + tilesFound == 900)
		displayWin()
}

function revealMines(tile) {
	MINE_POSITIONS.forEach(pos => {
		gameboard[pos[0]][pos[1]].buttonElement.innerHTML = 'X'
		gameboard[pos[0]][pos[1]].buttonElement.style.background = "#ffa5a1"
	})
	tile.buttonElement.style.background = "red"
}

function disableBoard() {
	gameboard.forEach(row => {
		row.forEach(tile => {
			if (tile.status === 'button') {
				oldButton = tile.buttonElement
				newButton = document.createElement("button")
				newButton.classList.add('button')
				newButton.style.border = "outset"
				oldButton.parentNode.replaceChild(newButton, oldButton);
			}
		})
	})
}

