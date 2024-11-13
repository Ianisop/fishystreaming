import React, { useState, useRef } from 'react';
import './App.css';
import fetch from 'node-fetch';
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

// Class to serialize fetched songs
class Song {
    constructor(song_url, song_name, song_runtime, song_artists = [], thumbnail, videoId) {
        this.song_url = song_url;
        this.song_name = song_name;
        this.song_artists = song_artists;
        this.song_runtime = song_runtime;
        this.thumbnail = thumbnail;
        this.videoId = videoId; // For streaming with ytdl
    }
}

function App() {
    const [query, setQueryValue] = useState('');
    const [fetched_songs, setSongs] = useState([]);
    const audioRef = useRef(null);

    // Update the search query
    const handleInputChange = (event) => {
        setQueryValue(event.target.value);
        setSongs([]); // clear the songs list when user types
    };

    // Search and fetch top 5 songs
    const findSongs = async () => {
        if (!query) return;
        const songs = await searchApiForSongs(query);
        setSongs(songs);
    };

    // Search for songs via YouTube API
    const searchApiForSongs = async (searchQuery) => {
        const queryWithLyrics = `${searchQuery} lyrics`;
        const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&q=${queryWithLyrics}&maxResults=5`;
        const response = await fetch(url);
        const data = await response.json();

        return data.items.map((item) => {
            const { videoId } = item.id;
            const { title, channelTitle, thumbnails } = item.snippet;
            return new Song(
                `https://www.youtube.com/watch?v=${videoId}`,
                title,
                "N/A",
                [channelTitle],
                thumbnails.high.url,
                videoId // Video ID for downloading
            );
        });
    };

    const playSong = async (videoId) => {
        if (audioRef.current) {
            const response = await fetch(`http://localhost:5555/api/download?videoId=${videoId}`);
            alert("Failed to download audio");
            if (!response.ok) {
                alert("Failed to download audio");
                console.error("Failed to download audio");
                return;
            }
            const audioUrl = URL.createObjectURL(await response.blob());
            audioRef.current.src = audioUrl;
            audioRef.current.play();
        }
    };

    // Handle both click and touch start events
    const handleClickOrTouch = (videoId) => {
        
    
        playSong(videoId);   // Trigger the song to play
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="App-search-bar">
                    <input
                        type="text"
                        className="input"
                        placeholder="Search for a song..."
                        value={query}
                        onChange={handleInputChange}
                        onKeyUp={(e) => e.key === 'Enter' && findSongs()}
                    />
                </div>
            </header>

            <table className="search-results">
                <tbody>
                    {fetched_songs.map((song, index) => (
                        <tr key={index}>
                            <td>
                                {/* Make thumbnail clickable */}
                                <a
                                    //onTouchTap={(e) => handleClickOrTouch(e, song.videoId)}  // Handle touch start
                                    onClick={(e) => handleClickOrTouch(e, song.videoId)}  // Handle click
                                    style={{ border: 'none', background: 'none' }} // Optional: Remove button styling
                                >
                                    <img
                                        src={song.thumbnail}
                                        alt="Thumbnail"
                                        style={{
                                            width: 100, height: 100, cursor: 'pointer',
                                            pointerEvents: 'auto', // Make sure pointer events are enabled
                                        }}
                                    />
                                </a>
                            </td>
                            <td>
                                <a
                                    className="song-result"
                                    onTouchStart={(e) => handleClickOrTouch(e, song.videoId)}  // Handle touch start
                                   //onTouchTap={(e) => handleClickOrTouch(e, song.videoId)}
                                   // onClick={(e) =>handleClickOrTouch(e, song.videoId)}// Handle click
                               
                                >
                                    {song.song_artists.join(", ")} - {song.song_name}
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <footer className="audio-footer">
                <audio ref={audioRef} controls className="audio-player" />
            </footer>
        </div>
    );
}

export default App;
