import { IO } from '../io.js';

const host = IO.api_url;
const game_details_el = document.getElementById("game_details");
const games_el = document.getElementById("all_games");

let profile = localStorage.getItem("selected_profile");
if (!profile) {
    window.location.href = "profile.html";     //redirect to index page
}

/** The act of loading this page resets any selected game so we can cleanly start index.html 
 * with a new game. */
localStorage.removeItem("selected_game");

let profile_el = document.getElementById("profile");
profile_el.innerHTML = profile;

async function getAllGames() {
    let response = await fetch(`${host}/player/${profile}/game`)
    let all_games = await response.json();
    games_el.innerHTML = ''; // JFD: Clear the "loading..." message
    for (let i = 0; i < all_games.length; i++) {
        let game = all_games[i];
        let game_el = document.createElement('li');
        game_el.innerHTML = `${game.player1} vs ${game.player2}`;
        game_el.addEventListener("click", function () {
            localStorage.setItem("selected_game", JSON.stringify(game));
            showGame(game);
        });
        games_el.appendChild(game_el);
    }
}
getAllGames();

function showGame(game) {
    console.log(game);
    game_details_el.innerHTML = "";
    let h2_el = document.createElement("h2");
    h2_el.innerHTML = `${game.player1} versus ${game.player2}`;
    let h3_el = document.createElement("h3");
    h3_el.innerHTML = `State: ${game.state}`;

    game_details_el.appendChild(h2_el);
    game_details_el.appendChild(h3_el);

    if (game.state == "finished") {
        let winner_el = document.createElement("p");
        winner_el.innerHTML = `Winner: ${game.winner}`;
        game_details_el.appendChild(winner_el);
    } else { // JFD: Always able to continue playing
        let button_el = document.createElement("button");
        button_el.innerHTML = "Play";
        button_el.addEventListener("click", function () {
            playGame(game);
        });
        game_details_el.appendChild(button_el);
    }
}

function playGame() {
    window.location.href = "index.html";
}