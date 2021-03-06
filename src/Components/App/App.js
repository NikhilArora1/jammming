import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    Spotify.getAccessToken();
  }

  addTrack(track) {
    const playlistTracks = this.state.playlistTracks;
    const index = playlistTracks.indexOf(item => item.id === track.id);
    if (index === -1) {
      playlistTracks.push(track);
      this.setState({ playlistTracks: playlistTracks });
    }
  }

  removeTrack(track) {
    const filteredPlaylistTrack = this.state.playlistTracks.filter(item => item.id !== track.id);
    this.setState({ playlistTracks: filteredPlaylistTrack });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackURIs = [];
    this.state.playlistTracks.forEach(track => trackURIs.push(track.uri));
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  search(term) {
    Spotify.search(term).then(res => this.setState({ searchResults: res }));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              tracks={this.state.searchResults}
              onAdd={this.addTrack} />
            <Playlist
              name={this.state.playlistName}
              tracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
