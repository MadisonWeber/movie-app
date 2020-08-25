/* Selects all seats that dont have class of null */

const seats = document.querySelectorAll('.seat:not(.null)');
const seeMovies = document.querySelector('.fa-angle-down');
const movieOptions = document.querySelector('.movie-options');
const movies = document.querySelectorAll('li');
const activeMovie = document.querySelector('.active-movie');
const totalCost = document.querySelector('.total');
const taxTotal = document.querySelector('.taxTotal');
const mainContainer = document.querySelector('.main-container');
const buyBtn = document.querySelector('.buy-button');
const modal = document.querySelector('.modal');


/* Update Available Seats */
for(let seat of seats){
    seat.addEventListener('click', changeSeat)
}

function changeSeat(e){
    if(e.target.classList.length ===1){
        e.target.classList.add('selected')
    }else if(e.target.classList[1]=== 'selected'){
        e.target.classList.remove('selected')
    }
    updatePrice()
}

/* Toggle Dropdown Menu */

seeMovies.addEventListener('click', toggleMenu)

function toggleMenu(e){
    if( movieOptions.classList.contains('hide')){
        movieOptions.classList.remove('hide');
    }else{
        movieOptions.classList.add('hide');
    }
}


/* Add the Movie */

for(let movie of movies){
    movie.addEventListener('click', addMovie)
}

function addMovie(e){
    let name = e.target.innerText.split('$')[0]
    let parsedName = name.slice(0, name.length-1)
    if(localStorage.getItem(parsedName) === null){
        assignOccupied(parsedName)
    }else{
        let seatArray = JSON.parse(localStorage.getItem(parsedName))

        for(let i = 0; i < seats.length; i++){
            if(seatArray[i]==='occupied'){
                seats[i].classList.add('occupied')
            }else{
                seats[i].classList = 'seat'
            }
        }

    }
    toggleMenu()
    let price = e.target.innerText.split('$')[1]
    activeMovie.innerHTML = `${name} $${price}`
    activeMovie.style = 'color:palegreen;'
    updatePrice()
}


/*Randomly Assign Unavailable Seats Depending On Movie */

function assignOccupied (parsedName){

    // let currentMovie = e.target.innerText.split('$')[0]
    const occupiedArray = Array(48).fill('not-occupied')
    
    for(let seat of seats){
        seat.classList = 'seat';
    }

    for(let i = 0; i < seats.length; i++){
        if(i % (Math.random()*10).toFixed(0) === 0){
            seats[i].classList.add('occupied')
            occupiedArray[i] = 'occupied'
        }
    }
    localStorage.setItem(parsedName, JSON.stringify(occupiedArray))

}



/*  Update The Price */

function updatePrice (){
    let movieInfo = activeMovie.innerText;
    let price = Number(movieInfo.slice(movieInfo.length-2, movieInfo.length));
    let count = countSeatsSelected();
    if(movieInfo !== 'No Movie Selected'){
        totalCost.innerText = ` $ ${(count * price).toFixed(2)}`
        taxTotal.innerText = ` $ ${((count * price)*1.15).toFixed(2)}`
        totalCost.style.color = 'palegreen';
        taxTotal.style.color = 'palegreen';
    };
    
}

/* Function to Count Number of Seats Selected */

function countSeatsSelected(){
    let count = 0
    for(let seat of seats){
        if(seat.classList.contains('selected')){
            count ++
        }
}
    return count
}

/* Open The Confirmation Page */

buyBtn.addEventListener('click', confirmPopUp);

function confirmPopUp (){
    if(activeMovie.innerText === "No Movie Selected" || countSeatsSelected() < 1){
        let errorMessage = 'You Must Select A Movie And Choose Your Seats'
        let costContainer = document.querySelector('.cost-container');
        let errorholder =  document.createElement('p');
        errorholder.classList.add('error-message');
        errorholder.innerText = errorMessage
        costContainer.appendChild(errorholder)
        setTimeout(()=> costContainer.removeChild(costContainer.lastChild) ,3000)

    }else {

        mainContainer.classList.add('grey-out');
        modal.style.display = 'flex'
        document.querySelector('.num-seats').innerText = " "+ countSeatsSelected();
        document.querySelector('.confirm-price').innerText = taxTotal.innerText;
        let exitBtn = document.querySelector('.exit-button');
        let confirmBtn = document.querySelector('.confirm-btn')
        let changeBtn= document.querySelector('.change-btn')
        exitBtn.addEventListener('click', returnToSelection)
        confirmBtn.addEventListener('click', goToConfirmPage)
        changeBtn.addEventListener('click', returnToSelection)
    }

}



function returnToSelection() {
    modal.style.display = 'none';
    mainContainer.classList.remove('grey-out')
}

function goToConfirmPage() {
    let name = activeMovie.innerText.split('$')[0]
    let parsedName = name.slice(0, name.length-1)
    let updatedSeats = JSON.parse(localStorage.getItem(parsedName))
    for(let i = 0; i < seats.length; i++){
        if(seats[i].classList.contains('selected')){
            updatedSeats[i] = 'occupied'
        }
    }
    localStorage.setItem(parsedName, JSON.stringify(updatedSeats))
    modal.innerHTML = `<div><h1>Thank You For Your Purchase</h1><p>Enjoy: <span class = 'num-seats'> ${activeMovie.innerText.split('$')[0]}</span> </div>`
    setTimeout(()=> resetApp(), 2500)
}

function resetApp(){
    modal.style.display = 'none';
    mainContainer.classList.remove('grey-out')
    for(let seat of seats){
        if(seat.classList.length >1){
            seat.classList = 'seat'
        }
    }
    activeMovie.innerHTML= "<small>No Movie Selected</small>"
    activeMovie.style = 'color:white;'
    totalCost.innerText = ''
    taxTotal.innerText = ''

    modal.innerHTML = "<div class='header-modal'> <h1>Confirm Your Purchase</h1><button class = 'btn exit-button'>&times;</button></div><div class='body-modal'><p>Number Of Seats:<span class = 'num-seats'></span></p><p>Total Price:<span class= 'confirm-price'></span></p></div><div class='bottom-modal'><button class = 'btn confirm-btn'>Confirm</button><button class = 'btn change-btn'>Change</button></div>"
    

}

