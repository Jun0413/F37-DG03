/*
1. save showtimes in front end
2. get cinema and movie from URL
3. get cinemas once
4. get movies depending on cinema 
5. display showtimes depending on cinema + movie
*/

let showtimes; // const
const rgx = /cinema=(\d+)&movie=(\d+)/;

let cinemaId;
let movieId;

let cinemas; // const
let movies;

async function fetchShowtimes() {
    const req = await fetch('api/rest/showtime.php');
    showtimes = await req.json();

    getIdFromURL();

    getCinemas();

    // if (cinemaId === '0') {
    //     cinemaId = cinemas[0]['cid'];
    // }
    if (cinemaId === '0') { // movieId must be valid this time!
        randCinemaId();
    }

    getMovies();

    if (movieId === '0') {
        movieId = movies[0]['mid'];
    }

    displayTable();

    displayTabs();

    displayShowtimes();

    loadMovie();
}

function getIdFromURL() {
    let matcher = document.URL.match(rgx);
    cinemaId = matcher[1];
    movieId = matcher[2];
}

function getCinemas() {
    let _cinemaIds = new Set();
    cinemas = [];
    for (let st of showtimes) {
        if (_cinemaIds.has(st['cid'])) {
            continue;
        }
        _cinemaIds.add(st['cid']);
        cinemas.push({
            cid: st['cid'],
            cinema: st['cinema']
        });
    }
    // console.log(cinemas);
}

function getMovies() {
    let _movieIds = new Set();
    movies = [];
    for (let st of showtimes) {
        if (st['cid'] === cinemaId) {
            if (_movieIds.has(st['mid'])) {
                continue;
            }
            _movieIds.add(st['mid']);
            movies.push({
                mid: st['mid'],
                movie: st['movie'],
                length: st['length'],
                genre: st['genre']
            });
        }
    }
    // console.log(movies);
}

function randCinemaId() {
    if (movieId === '0') {
        console.error("Illegal url");
        cinemaId = cinemas[0]['cid'];
        return;
    }
    for (let st of showtimes) {
        if (st['mid'] === movieId) {
            cinemaId = st['cid'];
            return;
        }
    }
}

function displayTable() {
    let horContainer =
    `<div class="ver_tab">
    </div>
    <div class="ver_container">
    <div class="hor_tab">
    </div>    
    <div id="showtime_table">
    </div>
    </div>`;

    document.getElementsByClassName('hor_container')[0].innerHTML = horContainer;
}

function displayCinemaTabs() {
    let horTab = "";

    for (let c of cinemas) {
        if (c['cid'] === cinemaId) {
            horTab += `<button class='active' onclick='clickCinemaTab("${c['cid']}")'>${c['cinema']}</button>`;
        } else {
            horTab += `<button onclick='clickCinemaTab("${c['cid']}")'>${c['cinema']}</button>`;
        }
    }

    document.getElementsByClassName('hor_tab')[0].innerHTML = horTab;
}

function displayMovieTabs() {
    let verTab = `<button id="dead_top_left">&nbsp;</button>`;

    for (let m of movies) {
        if (m['mid'] === movieId) {
            verTab += `<button class='active' onclick='clickMovieTab("${m['mid']}")'>${m['movie']}</button>`;
        } else {
            verTab += `<button onclick='clickMovieTab("${m['mid']}")'>${m['movie']}</button>`;
        }
    }

    document.getElementsByClassName('ver_tab')[0].innerHTML = verTab;
}

function displayTabs() {

    // let horTab = "";

    // for (let c of cinemas) {
    //     if (c['cid'] === cinemaId) {
    //         horTab += `<button class='active' onclick='clickCinemaTab("${c['cid']}")'>${c['cinema']}</button>`;
    //     } else {
    //         horTab += `<button onclick='clickCinemaTab("${c['cid']}")'>${c['cinema']}</button>`;
    //     }
    // }
    displayCinemaTabs();

    // document.getElementsByClassName('hor_tab')[0].innerHTML = horTab;

    // let verTab = `<button id="dead_top_left">&nbsp;</button>`;

    // for (let m of movies) {
    //     if (m['mid'] === movieId) {
    //         verTab += `<button class='active' onclick='clickMovieTab("${m['mid']}")'>${m['movie']}</button>`;
    //     } else {
    //         verTab += `<button onclick='clickMovieTab("${m['mid']}")'>${m['movie']}</button>`;
    //     }
    // }

    // document.getElementsByClassName('ver_tab')[0].innerHTML = verTab;
    displayMovieTabs();
}

function displayShowtimes() {
    history.pushState(null, document.title, `${location.pathname}?cinema=${cinemaId}&movie=${movieId}`);
    loadMovie();
    let showTimeTable = '<p>Available showtimes</p>';

    let _showtimes = {};

    for (let st of showtimes) {
        if (st['cid'] === cinemaId && st['mid'] === movieId) {
            if (!_showtimes[st['day']]) {
                _showtimes[st['day']] = [];
            }
            _showtimes[st['day']].push({
                sid: st['id'],
                slot: st['time']
            });
            _showtimes[st['day']].sort((_stA, _stB) => {
                return _stA.slot - _stB.slot;
            });
        }
    }

    // console.log(_showtimes);

    let today = new Date();
    let options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
    
    for (let i = 0; i < 7; i++) {
        
        let index = addDays(today, i).getDay();
        if (index === 0) {
            index = 7;
        }
        // console.log(_showtimes[index.toString()]);
        if (!_showtimes[index.toString()]) {
            showTimeTable += `<div class="day_showtime no_showtime">`
        } else {
            showTimeTable += `<div class="day_showtime">`;
        }
        showTimeTable += `<p>${(addDays(today, i)).toLocaleDateString("en-US", options)}</p>`
        
        showTimeTable += `<div>`;
        if (_showtimes[index.toString()]) {
            for (let _st of _showtimes[index.toString()]) {
                showTimeTable += `<button onclick='selectSlot("${_st['sid']}")'>${_st['slot']}</button>`;
            }
        }
        showTimeTable += `</div></div>`;
    }

    document.getElementById('showtime_table').innerHTML = showTimeTable;
}

function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function clickCinemaTab(newId) {
    console.log(newId);
    cinemaId = newId;
    getMovies();
    // console.log(movies);
    movieId = movies[0]['mid'];
    displayTabs();
    displayShowtimes();
}

function clickMovieTab(newId) {
    movieId = newId;
    displayMovieTabs();
    displayShowtimes();
}

function selectSlot(showtimeId) {
    location.href = `booking.php?showtime=${showtimeId}`;
}

function loadMovie() {
    const movie = movies.find(m => m.mid == movieId);
    const content = `<div class="wrapper" onclick="location.href='movie.php?movie=${movieId}'">
                    <img src="./images/posters/${movieId}.jpg" alt="${movie.movie}>">
                    </div>
                    <h2>${movie.movie}</h2>
                    <p>${movie.length} min</p>
                    <p>${movie.genre}</p>`;
    document.querySelector('.movie').innerHTML = content;
}

/* main entry */
fetchShowtimes();

/*
<div class="ver_tab">
    <!-- <button id="dead_top_left">&nbsp;</button>
    <button>movie 1</button>
    <button>movie 2</button>
    <button>Thomas & Friends: Big World! Big Adventures!</button>
    <button>movie 4</button> -->
</div>

<div class="ver_container">
    <div class="hor_tab">
        <!-- <button>cinema 1</button>
        <button>cinema 2</button>
        <button>cinema 3</button>
        <button>cinema 4</button> -->
    </div>    

    <div id="showtime_table">
        <!-- <p>Available showtimes</p>
        <div class="day_showtime">
            <p>Saturday, 06/10</p>
            <div>
                <button>0900</button>
                <button>1200</button>
                <button>1500</button>
            </div>
        </div>
        <div class="day_showtime">
            <p>Sunday, 07/10</p>
            <div>
                <button>0900</button>
                <button>1500</button>
            </div>
        </div>
        <div class="day_showtime">
            <p>Monday, 08/10</p>
            <div>
                <button>0900</button>
                <button>1200</button>
                <button>1500</button>
            </div>
        </div>
        <div class="day_showtime no_showtime">
            <p>Tuesday, 09/10</p>
            <div>
            </div>
        </div>
        <div class="day_showtime">
            <p>Wednesday, 10/10</p>
            <div>
                <button>1500</button>
            </div>
        </div>
        <div class="day_showtime">
            <p>Thursday, 11/10</p>
            <div>
                <button>0900</button>
                <button>1200</button>
            </div>
        </div>
        <div class="day_showtime">
            <p>Friday, 12/10</p>
            <div>
                <button>0900</button>
                <button>1200</button>
                <button>1500</button>
                <button>1800</button>
                <button>2100</button>
            </div>
        </div> -->
    </div>

</div>*/