async function getTopAlbums() {
    try {
        //calls endpoint that has lastfm data
        const response = await fetch('/lastfm/recenttrack');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        //await = function pauses until data is received
        const data = await response.json();
        const recentTrack = data.recenttracks.track;

        for (let i = 0; i < topAlbums.length; i++) {
            const albumElement = document.createElement('div');
            const album = document.createElement('p');
            const artist = document.createElement('p');
            const albumCover = document.createElement('img');

            albumElement.classList.add('album-item');

            albumCover.setAttribute("src", topAlbums[i].image.find(img => img.size === "large")?.['#text']);
            albumCover.style.width = '150px';

            album.textContent = topAlbums[i].name;
            artist.textContent = topAlbums[i].artist.name;

            albumElement.append(albumCover, album, artist);

            document.getElementById('album-container').append(albumElement);
        }


    } catch (error) {
        console.error('Error fetching data from your backend:', error);
    }


}

getTopAlbums();