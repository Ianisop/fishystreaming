import React, { useState, useRef } from 'react';
import './App.css';



// Class to serialize fetched songs into
class Song {
    constructor(song_url, song_name,song_runtime, song_artists = []) {
        this.song_url = song_url;
        this.song_name = song_name;
        this.song_artists = song_artists;
        this.song_runtime = song_runtime;
    }
        

}


function App() {
    const [fetched_songs, setSongs] = useState([]);
    const audioRef = useRef('audio-player'); // Reference to the audio element
    const [volume, setVolume] = useState(0.5); // Initial volume (0.5 = 50%)
    const max_num_of_songs_in_results = 4;

    // Simulate adding a song
    const findSongs = () => {
        if (fetched_songs.length < max_num_of_songs_in_results) {
            const newSong = new Song("https://example.com/song", "Despasito", "3:00", ["This guy", "Another Guy", "Third guy"]);
            setSongs([...fetched_songs, newSong]);
        } else {
            
        }
    };


    // This does all the magic
    const fetchSongsFromBackend = () => {

    }
    

    // HTML
    return (
        <div className="App">
            <header className="App-header">
                <div className="App-search-bar">
                    <input
                        type="text"
                        className="input"
                        placeholder="Search for a song..."
                        onKeyUp={(e) => e.key === 'Enter' && findSongs()}
                    />
                    <div className="search-results-container"></div>
                </div>
            </header>
            <table className="search-results">
                <tbody>
                    {fetched_songs.map((song, index) => (
                        <tr key={index}>
                            <td>
                                <button className="song-result">
                                    {song.song_artists} - {song.song_name} ({song.song_runtime})
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <footer className="audio-footer">
                <audio ref={audioRef} controls className="audio-player">
                    <source src="path-to-audio-file.mp3" type="audio/mpeg" />
                    hahahaha youre poor and this shit wont load ahahaah
                </audio>
                <div className="volume-control">

                </div>

            </footer>
        </div>
    );
}

export default App;
