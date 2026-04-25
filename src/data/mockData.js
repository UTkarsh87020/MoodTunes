export const mockSongs = [
  { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', durationMs: 200000, coverUrl: 'https://placehold.co/300x300/1a0033/ff006e?text=BL', audioUrl: null, mood: 'energetic', liked: true },
  { id: '2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23', durationMs: 203000, coverUrl: 'https://placehold.co/300x300/001a33/00d4ff?text=LV', audioUrl: null, mood: 'happy', liked: false },
  { id: '3', title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54', durationMs: 174000, coverUrl: 'https://placehold.co/300x300/331a00/ff8800?text=WS', audioUrl: null, mood: 'happy', liked: true },
  { id: '4', title: 'drivers license', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '4:02', durationMs: 242000, coverUrl: 'https://placehold.co/300x300/00001a/6666ff?text=DL', audioUrl: null, mood: 'sad', liked: false },
  { id: '5', title: 'INDUSTRY BABY', artist: 'Lil Nas X', album: 'MONTERO', duration: '3:32', durationMs: 212000, coverUrl: 'https://placehold.co/300x300/1a1a00/ffff00?text=IB', audioUrl: null, mood: 'energetic', liked: false },
  { id: '6', title: 'Stay', artist: 'Kid LAROI & Justin Bieber', album: 'Stay', duration: '2:21', durationMs: 141000, coverUrl: 'https://placehold.co/300x300/1a0020/dd00ff?text=ST', audioUrl: null, mood: 'calm', liked: true },
  { id: '7', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', duration: '3:18', durationMs: 198000, coverUrl: 'https://placehold.co/300x300/201000/ff6600?text=PC', audioUrl: null, mood: 'happy', liked: false },
  { id: '8', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58', durationMs: 178000, coverUrl: 'https://placehold.co/300x300/0a1500/66ff00?text=GU', audioUrl: null, mood: 'intense', liked: false },
  { id: '9', title: 'Montero', artist: 'Lil Nas X', album: 'MONTERO', duration: '2:17', durationMs: 137000, coverUrl: 'https://placehold.co/300x300/200020/ff00ff?text=MO', audioUrl: null, mood: 'energetic', liked: true },
  { id: '10', title: 'Astronaut in the Ocean', artist: 'Masked Wolf', album: 'Astronaut in the Ocean', duration: '2:18', durationMs: 138000, coverUrl: 'https://placehold.co/300x300/001020/0099ff?text=AO', audioUrl: null, mood: 'intense', liked: false },
  { id: '11', title: 'Permission to Dance', artist: 'BTS', album: 'Permission to Dance', duration: '3:05', durationMs: 185000, coverUrl: 'https://placehold.co/300x300/002020/00ffcc?text=PD', audioUrl: null, mood: 'happy', liked: false },
  { id: '12', title: 'Love Story (Taylor)', artist: 'Taylor Swift', album: 'Fearless (TV)', duration: '3:57', durationMs: 237000, coverUrl: 'https://placehold.co/300x300/200010/ff0066?text=LS', audioUrl: null, mood: 'happy', liked: true },
];

export const mockPlaylists = [
  { id: 'p1', name: 'Morning Energy', description: 'Start your day right', coverUrl: 'https://placehold.co/200x200/001a33/00d4ff?text=ME', songs: ['1','2','5'], owner: 'You' },
  { id: 'p2', name: 'Chill Vibes', description: 'Relax and unwind', coverUrl: 'https://placehold.co/200x200/1a0033/ff006e?text=CV', songs: ['4','6','12'], owner: 'You' },
  { id: 'p3', name: 'Workout Mix', description: 'Push your limits', coverUrl: 'https://placehold.co/200x200/1a1a00/ffcc00?text=WM', songs: ['1','8','9','10'], owner: 'You' },
  { id: 'p4', name: 'Party Hits', description: 'Dance the night away', coverUrl: 'https://placehold.co/200x200/200020/ff00ff?text=PH', songs: ['2','3','7','11'], owner: 'You' },
];

export const mockGenres = [
  { id: 'g1', name: 'Pop', color: '#ff006e', bg: '#200010' },
  { id: 'g2', name: 'Rock', color: '#ff6600', bg: '#201000' },
  { id: 'g3', name: 'Electronic', color: '#00d4ff', bg: '#001020' },
  { id: 'g4', name: 'Hip-Hop', color: '#ffcc00', bg: '#1a1a00' },
  { id: 'g5', name: 'R&B', color: '#cc00ff', bg: '#1a0020' },
  { id: 'g6', name: 'Chill', color: '#00ff99', bg: '#001a10' },
  { id: 'g7', name: 'Metal', color: '#ff3333', bg: '#1a0000' },
  { id: 'g8', name: 'Jazz', color: '#ffaa00', bg: '#1a1000' },
];

export const mockUser = {
  id: 'u1', name: 'Alex Rivera', username: 'alexr', email: 'alex@moodtunes.app',
  bio: 'Music is my therapy 🎵', avatarUrl: 'https://placehold.co/120x120/1a0033/ff006e?text=AR',
  stats: { totalHours: 284, topGenre: 'Electronic', songsLiked: 47, playlists: 4 },
  topArtists: ['The Weeknd', 'Dua Lipa', 'Olivia Rodrigo', 'Lil Nas X', 'BTS'],
};

export const mockTeam = [
  { name: 'Sarah Chen', role: 'Lead Developer', avatar: 'https://placehold.co/80x80/001020/00d4ff?text=SC' },
  { name: 'Marcus Reid', role: 'AI Engineer', avatar: 'https://placehold.co/80x80/200020/cc00ff?text=MR' },
  { name: 'Priya Patel', role: 'UX Designer', avatar: 'https://placehold.co/80x80/200010/ff006e?text=PP' },
  { name: 'James Wu', role: 'Backend Dev', avatar: 'https://placehold.co/80x80/201000/ff6600?text=JW' },
];
