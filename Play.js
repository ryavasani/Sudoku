// const easy = [
//     "6------7------5-2------1---362----81---6-----71--9-4-5-2---------7-----345-------",
//     "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
// ]
// const medium = [
//     "--9-------4----6-7-8-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
//     "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
// ]
// const hard = [
//     "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
//     "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
// ]

//Initialize variables
let selectedNum, selectedTile, disableSelect 

window.onload = function() {
    initializeGame(true)
}

function initializeGame(firstPlay) {
    startGame()
    //Run start game buttton when new game is clicked
    id("delete-btn").addEventListener("click", deleteTile)
    id("solve-btn").addEventListener("click", solveSudoku)
    id("clear-btn").addEventListener("click", clearBtn)
    id("go-front").addEventListener("click", nextSol)
    id("go-back").addEventListener("click", previousSol)
    if(firstPlay){
        //adding event listeners to each number container
        for(let i = 0; i < qsa("#number-container").length; i++){
            for(let j = 0; j < qsa("#number-container")[i].children.length; j++){
                qsa("#number-container")[i].children[j].addEventListener("click", function(){
                    //if selecting isnt disabled
                    if(!disableSelect){
                        if(this.classList.contains("selected")){
                            this.classList.remove("selected")
                            selectedNum = null
                        } else{
                            for(let i = 0; i < 9; i++){
                                id("number-container").children[i].classList.remove("selected")
                            }
                            this.classList.add("selected")
                            selectedNum = this
                            updateMove()
                        }
                    }
                })
            }
        }
    }
}

function startGame(){
    var board = ""
    for(let i = 0; i < 81; i++){
        board += "-"
    }

    generateBoard(board, "solve-board")
}

function updateMove(){
    if(selectedTile && selectedNum) {
        selectedTile.textContent = selectedNum.textContent

        if(checkDone() && checkCorrect(selectedTile)) {
            console.log("Ending Game")
            endGame()
        }

        selectedTile.classList.remove("selected")
        selectedNum.classList.remove("selected")
        selectedTile = null
        selectedNum  = null
    }
}

function checkDone(){
    let tiles = qsa(".tile")
    for(let i = 0; i < tiles.length; i++){
        if(tiles[i].textContent === "") return false
    }
    return true
}


function endGame(){
    disableSelect = true
}


function checkCorrect(tile){
    let solution
    for(let i = 0; i < 3; i++){
        if(id(Object.keys(settingOptions)[i]).checked) {
            solution = settingOptions[Object.keys(settingOptions)[i]][1]
        }
    }
    return solution.charAt(tile.id) === tile.textContent
}

function generateBoard(board, typeBoard){
    //Clearing previous boards
    clearPrevious()
    let idCount = 0
    for(let i = 0; i < 81; i++){
        //Create a new paragraph element
        let tile = document.createElement("p")
        if(board.charAt(i) !== "-"){
            tile.textContent = board.charAt(i)
        } else{
            tile.addEventListener("click", function(){
                if(!disableSelect){
                    if(tile.classList.contains("selected")){
                        tile.classList.remove("selected")
                        selectedTile = null
                    } else {
                        for(let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected")
                        }
                        tile.classList.add("selected")
                        selectedTile = tile
                        updateMove() 
                    }
                }
            })
        }
        //Assign tile Id
        tile.id = idCount
        idCount++
        //bottom border is added to two seperate rows
        tile.classList.add("tile")
        if(tile.id > 17 && tile.id < 27 || tile.id > 44 && tile.id < 54){
            tile.classList.add("bottom-border")
        }
        //if the tiles are in rows divisible by 3, but not 9, then they get right border
        if((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6){
            tile.classList.add("right-border")
        }
        //add tile to board
        id(typeBoard).appendChild(tile)
    }
}

function clearPrevious(){
    let tiles = qsa(".tile")
    for(let i = 0; i < tiles.length; i++){
        tiles[i].remove()
    }

    //Deselecting any numbers
    for(let i = 0; i < id("number-container").children.length; i++){
        id("number-container").children[i].classList.remove("selected")
    }

    //Clear all selected variables
    selectedTile = null
    selectedNum = null
}

function clearBtn() {
    clearPrevious()
    initializeGame(false)
    disableSelect = false
    id("sol-counter").textContent = "n/a"
}

function deleteTile() {
    if(selectedTile == null) {
        alert("Please Select a Tile to Delete")
    } else {
        if(!disableSelect){
            selectedTile.classList.remove("selected")
            selectedTile.textContent = null
            selectedTile = null
        }
    }
}

//Helper functions
function id(id){
    return document.getElementById(id)
}
function qs(selector){
    return document.querySelector(selector)
}
function qsa(selector){
    return document.querySelectorAll(selector)
}

function solveSudoku(){
    id("solutions-amount")
    let tiles = qsa(".tile")
    let solvingBoard = []
    for(let i = 0; i < tiles.length; i += 9){
        row = []
        for(let j = 0; j < 9; j++){
            if(tiles[i + j].textContent === "") row.push("-")
            else row.push(tiles[i + j].textContent)
        }
        solvingBoard.push(row)
    }

    if(validSudoku(solvingBoard)){
        allSolutions = []
        shouldSolve = true
        solutionsAmount = 0

        solve(solvingBoard)

        currentSol = 0
        id("sol-counter").textContent = (currentSol + 1) + "/" + solutionsAmount

        displayBoard(currentSol)
    } else {
        alert("Please enter a valid Sudoku")
    }

}

function validSudoku(solvingBoard){
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            if(solvingBoard[i][j] !== "-"){ 
                originalN = solvingBoard[i][j]
                solvingBoard[i][j] = "-"
                if(!isPossible(i, j, originalN, solvingBoard)) {
                    solvingBoard[i][j] = originalN
                    return false
                }
                solvingBoard[i][j] = originalN
            }
        }
    }
    return true
}

function solve(solvingBoard){
    if(shouldSolve){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(solvingBoard[i][j] == "-"){
                    for(let n = 1; n < 10; n++){
                        if(isPossible(i, j, n, solvingBoard)) {
                            solvingBoard[i][j] = n
                            solve(solvingBoard)
                            solvingBoard[i][j] = "-"
                        }
                    }
                    return
                }
            }
        }
        solvedBoard = solvingBoard.toString().split(",")
        solutionsAmount += 1
        if(solutionsAmount > 98){
            shouldSolve = false
        }
        allSolutions.push(solvedBoard)
        return
    } else {
        return
    }
}

function isPossible(y, x, n, board){
    for(let i = 0; i < 9; i++){
        if(board[y][i] == n) { 
            return false
        } else if(board[i][x] == n) return false
    }

    boundaries = ""
    cords = [y, x]
    for(let i = 0; i < 2; i++){
        if(cords[i] < 3) boundaries += "03"
        else if(cords[i] < 6) boundaries += "36"
        else boundaries += "69"
    }

    for(let i = boundaries[0]; i < boundaries[1]; i++){
        for(let j = boundaries[2]; j < boundaries[3]; j++) {
            if(board[i][j] == n) return false
        }
    }
    return true
}

function nextSol(){
    if((currentSol + 1) !== solutionsAmount) {
        currentSol += 1
        displayBoard(currentSol)
        id("sol-counter").textContent = (currentSol + 1) + "/" + solutionsAmount
    }
}

function previousSol(){
    if(currentSol !== 0) {
        currentSol -= 1
        displayBoard(currentSol)
        id("sol-counter").textContent = (currentSol + 1) + "/" + solutionsAmount
    }
}

function displayBoard (solutionIndex) {
    let tiles = qsa(".tile")
    for(let i = 0; i < tiles.length; i++){
        tiles[i].textContent = allSolutions[solutionIndex][i]
    }
}

