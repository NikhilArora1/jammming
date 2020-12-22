const clientID = 'a7887fbb5e094b1cb979bd51362e6ee1';
const redirectURI = 'http://localhost:3000/';
let accessToken;
export const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        } else {
            const url = window.location.href;
            const token = url.match(/access_token=([^&]*)/);
            const expiresIn = url.match(/expires_in=([^&]*)/);
            if (token && expiresIn) {
                accessToken = token[1];
                window.setTimeout(() => accessToken = '', expiresIn[1] * 1000);
                window.history.pushState('Access Token', null, '/');
            } else {
                // access token is empty and not in url
                window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            }
        }
    },

    async search(term) {
        const fetchPromise = fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const response = await fetchPromise;
        const response_1 = await response.json();
        const tracks = response_1.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
        return tracks;
    },

    // search(term) {
    //     const fetchPromise = fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
    //         headers: { Authorization: `Bearer ${accessToken}` }
    //     });
    //     return fetchPromise.then(response => {
    //         return response.json();
    //     }).then(response => {
    //         const tracks = response.tracks.items.map(track => ({
    //             id: track.id,
    //             name: track.name,
    //             artist: track.artists[0].name,
    //             album: track.album.name,
    //             uri: track.uri
    //         }));
    //         return tracks;
    //     });
    // }

    savePlaylist(name, tracks) {
        if (!name || !tracks) {
            return;
        }
        const token = accessToken;
        const headers = { Authorization: 'Bearer ' + token };

        // get user id
        fetch(`https://api.spotify.com/v1/me`, { headers: headers })
            .then(response => response.json())
            .then(user => {
                const user_id = user.id;
                const requestOptions = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ name: name })
                };
                // create playlist
                fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        const playlist_id = data.id;
                        const requestOptions = {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify({ uris: tracks })
                        };
                        // add songs to playlist
                        fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`, requestOptions)
                            .then(response => response.json());
                    });
            });
    }

};
