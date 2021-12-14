const restaurantsElem = document.querySelector('.restaurants');
const inputBox = document.getElementById('search');
const errorMessage = document.querySelector('.errorNotify');


let hotelLists = [];

// fetch api to get list of restaurants
let getData = () => fetch("./data/api.json").then(data => data.json());


const getHotelCard = hotel => {
    let a = JSON.parse(localStorage.getItem('favourites'));
    let favIconClass;
    if (a !== null) {
        favIconClass = (a.find(fav => fav.id == hotel.id)) ? "fav-id-red" : "fav-id";
    } else {
        favIconClass = "fav-id"
    }

    return `
        <div class='hotel-card'>
            <button onclick="markAsFavourite(this, ${hotel.id})" id=${favIconClass} class="favourite"></button>
            <div class='hotel-image'>
                <img src= ${hotel.img} />
            </div>
            <div class="hotel-description">
                <div class="hotel-name">${hotel.name}</div>
                <div class="hotel-tags">${hotel.tags}</div>
                <div style="padding: 0 10px;">
                    <span class="hotel-location fa fa-star checked">${hotel.rating}</span>
                    <span class="hotel-eta">${hotel.eta} Mins</span>
                </div>
            </div>
        </div>
    `
}

const generateRestaurantList = data => data.map(hotel => getHotelCard(hotel));

// display hotels

const displayAllHotels = () => {
    getData()
    .then(resp => {
        hotelLists = resp;
        restaurantsElem.innerHTML = generateRestaurantList(resp).join('');
    })
    .catch(error => errorMessage.innerHTML = 'Something bad happened!! We are working on it');
};

displayAllHotels();

const searchResult = () => {
    let filteredList = hotelLists.filter(hotel => {
        return hotel.tags.toString().toLowerCase().indexOf(inputBox.value.toLowerCase()) > -1 || hotel.name.toString().toLowerCase().indexOf(inputBox.value.toLowerCase()) > -1;
    });
    restaurantsElem.innerHTML = (filteredList.length == 0)? "No Results Found !!" : generateRestaurantList(filteredList).join('');
}

// debouncing
let debounce = (fn, delay) => {
    let timeout;
    return function () {
       clearTimeout(timeout);
       timeout = setTimeout(()=> fn(), delay)
    }
}
let search = debounce(searchResult, 400);
