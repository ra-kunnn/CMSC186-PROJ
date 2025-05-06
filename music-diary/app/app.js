var redirect_uri = "http://127.0.0.1:3000";
 

var client_id = "48f8ba37a78a458a9a93fcb563b19ea7"; 
var client_secret = "30e066cff0484a75a03e74ab0a87bf9c";

const AUTHORIZE = "https://accounts.spotify.com/authorize"

export function requestAuthorization() {

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
}
