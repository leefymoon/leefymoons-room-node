class LastFmWidget extends HTMLElement {
  #USERNAME = 'leefymoon';
  #API_KEY = '1bcf6f9f2134bb32df90f70cc1dfc5cf';
  // Constants

  #API_URL = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks';
  #FALLBACK_IMG = 'https://lastfm.freetls.fastly.net/i/u/64s/c6f59c1e5e7240a4c0d427abd71f3dbb.jpg';

  // Local State
  #shadow;
  #track_info;
  #controller;
  #interval_id;

  // Attributes
  #auto_update;
  #polling_rate // in seconds;

  constructor() {
    super();
    this.#shadow = this.attachShadow({
      mode: 'closed'
    });

    this.#setStyles();

    this.#auto_update = this.hasAttribute("auto-update");
    this.#polling_rate = Number(this.getAttribute("polling-rate")) || 15;

    this.#render();
  }

  async connectedCallback() {
    await this.#loadTrack();

    if (this.#auto_update) {
      this.#startAutoUpdate();
    }
  }

  async disconnectedCallback() {
    this.#controller?.abort();
    this.#stopAutoUpdate();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.isConnected) return;

    if (name === 'auto-update') {
      const should_auto_update = newValue !== null;

      if (should_auto_update !== this.#auto_update) {
        this.#auto_update = should_auto_update;
        should_auto_update
          ? this.#startAutoUpdate()
          : this.#stopAutoUpdate();
      }
    } else if (name === 'polling-rate') {
      const new_polling_rate = Number(newValue) || 15;

      if (new_polling_rate !== this.#polling_rate) {
        this.#polling_rate = new_polling_rate;
        if (this.#auto_update) {
          this.#stopAutoUpdate();
          this.#startAutoUpdate();
        }
      }
    }
  }

  static get observedAttributes() {
    return ['auto-update', 'polling-rate'];
  }

  #setStyles() {
    const styles = `
    span, pre, p {
		font-family: monospace;
		font-size: 16px;
		background-color: none;
		color: #fff;
		padding: 0.25rem .5rem;
	}

	.wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		min-width: 178px!important;
    max-width: 300px!important;
	}

	wrapper.image {
		
	}

	p {
		margin: 0;
		overflow-x: wrap;
	}

    @keyframes loading {
        25%  { content: '';    }
        50%  { content: '.';   }
        75%  { content: '..';  }
        100% { content: '...'; }
    }
    `;

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);

    this.#shadow.adoptedStyleSheets = [sheet];
  }

  async #loadTrack() {
    this.#track_info = await this.#getRecentTrack();
    this.#render();
  }

  #startAutoUpdate() {
    this.#interval_id = setInterval(async () => {
      await this.#loadTrack();
    }, this.#polling_rate * 1000);
  }

  #stopAutoUpdate() {
    if (this.#interval_id) {
      clearInterval(this.#interval_id);
      this.#interval_id = null;
    }
  }

  async #getRecentTrack() {
    try {
      this.#controller = new AbortController();
      const signal = this.#controller.signal;

      const apiUrl = `${this.#API_URL}&user=${this.#USERNAME}&api_key=${this.#API_KEY}&format=json&limit=1`;
      const res = await fetch(apiUrl, {
        signal
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json()
      const track = json?.recenttracks?.track?.[0];

      if (!track) {
        throw new Error("No Recent Track Found...")
      }

      const image = track.image?.find(i => i.size === 'medium');
      const cover = image?.['#text'] || this.#FALLBACK_IMG;

      return {
        artist: track.artist?.['#text'] || 'Unknown Artist',
        name: track.name || 'Unknown Track',
        cover
      };
    } catch (e) {
      console.error('Last.fm API Error', e)

      if (e.name === 'AbortError') {
        return {
          error: 'the request was cancelled'
        };
      }

      if (e.message.includes('HTTP 404')) {
        return {
          error: 'the requested user was not found.'
        };
      }

      if (e.message.includes('HTTP 429')) {
        return {
          error: 'you are being rate limited. try again later.'
        };
      }

      return {
        error: 'some error occurred while fetching recent track.'
      };
    }
  }

  #render() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper")

    if (this.#track_info?.hasOwnProperty('name')) {
      const {
        name,
        artist,
        cover
      } = this.#track_info;

      const divTrackInfo = document.createElement("div");
      const img = document.createElement("img");
      const pName = document.createElement("p");
      const pArtist = document.createElement("p");

      divTrackInfo.classList.add("track-info")

      img.setAttribute("src", cover);
      img.setAttribute("alt", `${name} by ${artist}`)

      pName.textContent = name;
      pArtist.textContent = artist;

      divTrackInfo.append(pName, pArtist);

      wrapper.append(img, divTrackInfo)
    } else if (this.#track_info?.hasOwnProperty('error')) {
      const pError = document.createElement("p");

      pError.classList.add("error")
      pError.textContent = this.#track_info.error;

      wrapper.appendChild(pError);
    } else {
      const pLoading = document.createElement("p");

      pLoading.classList.add("loading")
      pLoading.textContent = "loading";

      wrapper.appendChild(pLoading);
    }

    this.#shadow.innerHTML = '';
    this.#shadow.appendChild(wrapper);
  }
}

window.customElements.define('last-fm-widget', LastFmWidget)