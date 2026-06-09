async function getRecentTrack() {
    try {
        //calls endpoint that has lastfm data
        const response = await fetch('/lastfm/recenttrack');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        //await = function pauses until data is received
        const data = await response.json();
        const recentTrack = data.recenttracks.track;

        console.log(recentTrack);

        const artist = document.createElement('p');
        const song = document.createElement('p');
        const albumCover = document.createElement('img');
        const infoSpan = document.createElement('span');
        const dateEle = document.createElement('small');

        console.log(recentTrack.hasOwnProperty('nowplaying'));
        
        let date;
        if (recentTrack[0]["@attr"]) {
            date = 'track is now playing!';
        }
        else {
            date = 'track listened to at ' + recentTrack[0].date['#text'];
        }

        albumCover.setAttribute("src", recentTrack[0].image.find(img => img.size === "large")?.['#text']);
        albumCover.style.width = '75px';
        song.textContent = recentTrack[0].name;
        artist.textContent = recentTrack[0].artist['#text'];
        infoSpan.append(artist, song);
        document.getElementById('track-info').append(albumCover, infoSpan);
        dateEle.textContent = date;
        document.getElementById('lastfm').append(dateEle);
        
    } catch (error) {
        console.error('Error fetching data from your backend:', error);
    }
}

getRecentTrack();