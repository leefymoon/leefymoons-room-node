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

        for (let i = 0; i < recentTrack.length; i++) {
          
            console.log(data);
            console.log(recentTrack[i].name);
            console.log(recentTrack[i].artist['#text']);
            console.log(recentTrack[i].date['#text']);
            
            const artist = document.createElement('p');
            const song = document.createElement('p');
            const albumCover = document.createElement('img');
            const infoSpan = document.createElement('span');
            const date = document.createElement('small');

            albumCover.setAttribute("src", recentTrack[i].image.find(img => img.size === "large")?.['#text']);
            albumCover.style.width = '75px';
            song.textContent = recentTrack[i].name;
            artist.textContent = recentTrack[i].artist['#text'];
            date.textContent = 'listened to at ' + recentTrack[i].date['#text'];

            infoSpan.append(artist, song);
            document.getElementById('track-info').append(albumCover, infoSpan);
            document.getElementById('lastfm').append(date);
        }


    } catch (error) {
        console.error('Error fetching data from your backend:', error);
    }


}

getRecentTrack();