document.getElementById('themeChange').addEventListener('click', changeTheme)


let loader = document.querySelector(".loader")

function changeTheme() {
    let body = document.querySelector('body')
    body.classList.toggle('dark')
}

async function sendRequest(url, method, data) {
    if (method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        response = await response.json()
        return response
    } else if (method == "GET") {
        url = url + "?" + new URLSearchParams(data)
        let response = await fetch(url, {
            method: "GET",

        })
        response = await response.json()
        return response
    }
}

document.getElementById("searchBtn").addEventListener("click", findMovie)

async function findMovie() {
    let title = document.getElementById("search").value


    let movie = await sendRequest("http://www.omdbapi.com/", "GET", {
        "apikey": "1300b881",
        "t": title
    })

    loader.style.display = "block"
    if (movie.Response == "False") {
        alert(movie.Eror)
    } else {
        showMovie(movie)
        loader.style.display = "none"
        findSimilarMovie(title)
        document.getElementById('film').style.display = "block"
    }


}

function showMovie(movie) {


    document.querySelector("#film h2").innerHTML = movie.Title
    document.querySelector(".movieCover").style.backgroundImage = `url(${movie.Poster})`

    let array = ["Released", "Country", "Language", "Type", "Year", "Writer", "imdbVotes", "imdbRating", "Plot"]

    let movieInfos = document.querySelector('.movieInfos')
    movieInfos.innerHTML = ""

    for (let i = 0; i < array.length; i++) {
        let key = array[i]
        let line = `<div class="movieInfo bg-darkest">
        <div class="title">
            ${key}
        </div>
        <div class="value">
            ${movie[key]}
        </div>
    </div>`

        movieInfos.innerHTML = movieInfos.innerHTML + line


    }
}

// Похожие  

async function findSimilarMovie(title) {


    let similar = await sendRequest("http://www.omdbapi.com/", "GET", {
        "apikey": "1300b881",
        "s": title
    })


    if (similar.Response == "False") {
        alert(similar.Eror)
    } else {
        document.querySelector("#similarFilms h2").innerHTML = `Похожих фильмов ${similar.totalResults}`
        showSimilarMovies(similar.Search)
        document.getElementById('similarFilms').style.display = "block"

    }
}



let array = []



function showSimilarMovies(movies) {
    let similarMovies = document.querySelector('.similarMovies')
    similarMovies.innerHTML = "";

    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i]
        if (movie.Poster != "N/A") {
            let movieDiv = document.createElement("div");
            movieDiv.classList.add("similarMovie");
            movieDiv.style.backgroundImage = `url('${movie.Poster}')`;
            movieDiv.innerHTML = `
            <div class="fav bg-dark">
            </div>
        <div class="similarTitle">
            ${movie.Title}
        </div>`;
            similarMovies.appendChild(movieDiv);


            let favBtn = movieDiv.querySelector('.fav')

            favBtn.setAttribute('data-poster', movie.Poster)
            favBtn.setAttribute('data-title', movie.Title)
            favBtn.setAttribute('data-imdbID', movie.imdbID)


            let favs = localStorage.getItem('favs')
            if (!favs) {
                favs = []
            } else {
                favs = JSON.parse(favs)
            }

            let index = favs.findIndex(e => e.Title === movie.Title);

            if (index > -1) {
                favBtn.classList.add('active')
            }



            favBtn.addEventListener('click', addFavorite)


        }
    }

}

function addFavorite() {
    let btn = event.target

    let Title = btn.getAttribute('data-title')
    let Poster = btn.getAttribute('data-poster')
    let imdbID = btn.getAttribute('data-imdbID')

    let obj = { Title, Poster, imdbID }


    let favs = localStorage.getItem('favs')
    if (!favs) {
        favs = []
    } else {
        favs = JSON.parse(favs)
    }




    if (btn.classList.contains('active')) {
        // Удалить из избраного
        let index = favs.findIndex(e => e.Title === obj.Title);


        if (index > -1) {
            favs.splice(index, 1);
            localStorage.setItem('favs', JSON.stringify(favs))
            btn.classList.remove('active')
        }
    } else {

        let index = favs.findIndex(e => e.Title === obj.Title);

        if (index == -1) {
            favs.push(obj);
            localStorage.setItem('favs', JSON.stringify(favs))
            btn.classList.add('active')
        }
    }

}


function showFavorites() {
    let favs = localStorage.getItem('favs')
    if (!favs) {
        favs = []
    } else {
        favs = JSON.parse(favs)
    }


    let h2 = document.querySelector("#similarFilms h2");
    h2.innerHTML = `Фильмов в избранном ${favs.length}`

    
    let similarMovies = document.querySelector(".similarMovies")
    similarMovies.innerHTML = "";


    for (let i = 0; i < favs.length; i++) {
        let movie = favs[i];
        if (movie.Poster != "N/A") {
            let movieDiv = document.createElement("div");
            movieDiv.classList.add("similarMovie");
            movieDiv.style.backgroundImage = `url('${movie.Poster}')`;
            movieDiv.innerHTML = `
            <div class="fav bg-dark"></div>
            <div class="similarTitle">
            ${movie.Title}
            </div>`;
            similarMovies.appendChild(movieDiv);


            let favBtn = movieDiv.querySelector('.fav')
            favBtn.setAttribute('data-poster', movie.Poster)
            favBtn.setAttribute('data-title', movie.Title)
            favBtn.setAttribute('data-imdbID', movie.imdbID)
            favBtn.classList.add('active')



            favBtn.addEventListener('click', addFavorite)
        }
    }
}


















































// function addFavorites(movieDiv, movie) {
//     let favBtn = movieDiv.querySelector(".fav")
//     favBtn.addEventListener("click", addFavorites)

//     function addFavorites() {
//         favBtn.classList.toggle("favBtn")
//         let obj = {
//             Title: movie.Title,
//             Poster: movie.Poster
//         }
//         array.push(movieDiv)
//         console.log(array)
//         localStorage.setItem("favMovie", JSON.stringify(array))
//     }
// }






















// Конец



// Actors
// :
// "Heath Harper, Debra Lamb, Lexsy McKowen"
// Awards
// :
// "N/A"
// BoxOffice
// :
// "N/A"
// Country
// :
// "United States"
// DVD
// :
// "N/A"
// Director
// :
// "Chris R. Notarile"
// Genre
// :
// "Short, Crime"
// Language
// :
// "English"
// Metascore
// :
// "N/A"
// Plot
// :
// "N/A"
// Poster
// :
// "https://m.media-amazon.com/images/M/MV5BNTFkM2NiZDItNzY0MS00OWUyLWE1YTYtNjA4YThmOTFiMWNiXkEyXkFqcGdeQXVyMTg1MTc3MQ@@._V1_SX300.jpg"
// Production
// :
// "N/A"
// Rated
// :
// "N/A"
// Ratings
// :
// []
// Released
// :
// "30 Apr 2021"
// Response
// :
// "True"
// Runtime
// :
// "N/A"
// Title
// :
// "MIB"
// Type
// :
// "movie"
// Website
// :
// "N/A"
// Writer
// :
// "Chris R. Notarile"
// Year
// :
// "2021"
// imdbID
// :
// "tt14425962"
// imdbRating
// :
// "N/A"
// imdbVotes
// :
// "71"
