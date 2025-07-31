const { useState, useEffect } = React;
const { Heart, MessageCircle, Calendar, MapPin, Users, Plus, Send, Star, Trophy, Home, User, Bell, X, Camera } = lucide;

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: '虎太郎',
      area: '新宿区',
      content: '今日の試合、佐藤輝明のホームランすごかった！🐯',
      image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400',
      likes: 12,
      comments: 3,
      timestamp: '2時間前'
    },
    {
      id: 2,
      user: 'Tigers Girl',
      area: '渋谷区',
      content: '明日神宮球場で阪神戦観に行く人いませんか？一緒に応援しましょう！',
      image: null,
      likes: 8,
      comments: 5,
      timestamp: '4時間前'
    },
    {
      id: 3,
      user: '阪神一筋',
      area: '池袋',
      content: '甲子園の土を持って帰ってきました！🏟️',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
      likes: 25,
      comments: 8,
      timestamp: '6時間前'
    }
  ]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: '神宮球場観戦会',
      date: '8/5(土)',
      time: '17:00',
      location: '明治神宮野球場',
      participants: 8,
      maxParticipants: 15,
      organizer: 'Tigers Girl'
    },
    {
      id: 2,
      title: '新宿スポーツバー観戦',
      date: '8/8(火)',
      time: '19:00',
      location: 'スポーツバー GOAL新宿店',
      participants: 4,
      maxParticipants: 10,
      organizer: '虎次郎'
    }
  ]);
  const [chatRooms, setChatRooms] = useState([
    { id: 1, name: '試合実況', lastMessage: '今日も勝った〜！', unread: 3 },
    { id: 2, name: '新宿エリア', lastMessage: '明日飲み会どうですか？', unread: 1 },
    { id: 3, name: '渋谷エリア', lastMessage: 'よろしくお願いします', unread: 0 },
    { id: 4, name: '佐藤輝明ファン', lastMessage: 'ホームラン最高！', unread: 2 }
  ]);
  const [currentChatRoom, setCurrentChatRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState({
    1: [
      { id: 1, user: '虎太郎', message: '今日の試合最高だった！', timestamp: '19:30', isMe: false },
      { id: 2, user: 'Tigers Girl', message: '佐藤輝明のホームラン見た？', timestamp: '19:32', isMe: false },
      { id: 3, user: '阪神一筋', message: '見た見た！すごかった〜', timestamp: '19:33', isMe: false },
      { id: 4, user: 'Me', message: '今日も勝った〜！', timestamp: '19:35', isMe: true }
    ],
    2: [
      { id: 1, user: '新宿虎', message: 'お疲れ様です！', timestamp: '18:00', isMe: false },
      { id: 2, user: 'Tigers Girl', message: '明日飲み会どうですか？', timestamp: '18:30', isMe: false }
    ],
    3: [
      { id: 1, user: '渋谷ファン', message: 'よろしくお願いします', timestamp: '17:00', isMe: false }
    ],
    4: [
      { id: 1, user: '輝明LOVE', message: 'ホームラン最高！', timestamp: '20:00', isMe: false },
      { id: 2, user: '虎党', message: '今年は期待できそう！', timestamp: '20:05', isMe: false }
    ]
  });
  const [newMessage, setNewMessage] = useState('');
  const [nearbyFans] = useState([
    { id: 1, name: '虎太郎', area: '新宿区', distance: '0.5km', lastSeen: '2分前' },
    { id: 2, name: 'Tigers Girl', area: '新宿区', distance: '0.8km', lastSeen: '5分前' },
    { id: 3, name: '阪神一筋', area: '新宿区', distance: '1.2km', lastSeen: '10分前' }
  ]);
  const [sportsBars] = useState([
    { 
      id: 1, 
      name: 'スポーツバー GOAL新宿店', 
      area: '新宿区',
      distance: '0.3km',
      rating: 4.5,
      hasTV: true,
      isOpen: true,
      nextGame: '8/1 18:00'
    },
    { 
      id: 2, 
      name: 'HUB 渋谷店', 
      area: '渋谷区',
      distance: '2.1km',
      rating: 4.2,
      hasTV: true,
      isOpen: true,
      nextGame: '8/1 18:00'
    },
    { 
      id: 3, 
      name: 'Tigers Cafe 池袋', 
      area: '池袋',
      distance: '3.5km',
      rating: 4.8,
      hasTV: true,
      isOpen: false,
      nextGame: '8/1 18:00'
    }
  ]);
  const [newPost, setNewPost] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authData, setAuthData] = useState({ email: '', password: '', nickname: '', area: '' });
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'game',
      title: '試合開始通知',
      message: '阪神 vs 巨人戦が18:00から開始します！',
      timestamp: '2分前',
      read: false
    },
    {
      id: 2,
      type: 'event',
      title: '新しいイベント',
      message: 'Tigers Girlさんが神宮球場観戦会を企画しました',
      timestamp: '1時間前',
      read: false
    },
    {
      id: 3,
      type: 'chat',
      title: '新宿エリアチャット',
      message: '新宿虎さん: 明日飲み会どうですか？',
      timestamp: '3時間前',
      read: true
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [gameInfo, setGameInfo] = useState({
    nextGame: {
      date: '8/1 (火)',
      time: '18:00',
      opponent: '巨人',
      venue: '東京ドーム',
      status: 'scheduled'
    },
    currentGame: {
      inning: '7回表',
      score: { hanshin: 3, opponent: 2 },
      isLive: true,
      lastUpdate: '21:15'
    },
    recentGames: [
      { date: '7/30', opponent: 'ヤクルト', result: '勝', score: '5-3' },
      { date: '7/29', opponent: 'ヤクルト', result: '勝', score: '4-1' },
      { date: '7/28', opponent: 'ヤクルト', result: '負', score: '2-6' }
    ]
  });

  // Login/Register handler
  const handleAuth = () => {
    if (!authData.email || !authData.password) return;
    
    const userData = {
      id: 1,
      nickname: authData.nickname || 'Tigers Fan',
      email: authData.email,
      area: authData.area || '新宿区',
      fanHistory: '15年',
      favoritePlayer: '佐藤輝明'
    };
    setUser(userData);
    setShowAuthModal(false);
    setAuthData({ email: '', password: '', nickname: '', area: '' });
  };

  // Post creation
  const createPost = () => {
    if (!newPost.trim()) return;
    
    const post = {
      id: posts.length + 1,
      user: user?.nickname || 'ゲスト',
      area: user?.area || '東京都',
      content: newPost,
      image: selectedImage,
      likes: 0,
      comments: 0,
      timestamp: '今'
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedImage(null);
  };

  // Handle image selection (mock)
  const handleImageSelect = () => {
    const mockImages = [
      'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
      'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    setSelectedImage(randomImage);
  };

  // Send message function
  const sendMessage = () => {
    if (!newMessage.trim() || !currentChatRoom || !user) return;
    
    const message = {
      id: Date.now(),
      user: user.nickname,
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    setChatMessages(prev => ({
      ...prev,
      [currentChatRoom.id]: [...(prev[currentChatRoom.id] || []), message]
    }));
    
    setChatRooms(prev => prev.map(room => 
      room.id === currentChatRoom.id 
        ? { ...room, lastMessage: newMessage }
        : room
    ));
    
    setNewMessage('');
  };

  // Enter chat room
  const enterChatRoom = (room) => {
    setCurrentChatRoom(room);
    setChatRooms(prev => prev.map(r => 
      r.id === room.id ? { ...r, unread: 0 } : r
    ));
  };

  // Mark notification as read
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate real-time notifications and game updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update game score occasionally
      if (gameInfo.currentGame.isLive && Math.random() > 0.98) {
        setGameInfo(prev => ({
          ...prev,
          currentGame: {
            ...prev.currentGame,
            score: {
              hanshin: prev.currentGame.score.hanshin + (Math.random() > 0.5 ? 1 : 0),
              opponent: prev.currentGame.score.opponent + (Math.random() > 0.7 ? 1 : 0)
            },
            lastUpdate: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
          }
        }));
      }
      
      // Simulate random notifications
      if (Math.random() > 0.99) {
        const notificationTypes = [
          { type: 'game', title: 'スコア更新', message: '阪神が1点追加！' },
          { type: 'event', title: '新しいイベント', message: '明日の観戦会に参加者募集中！' },
          { type: 'chat', title: 'チャット', message: '新しいメッセージがあります' }
        ];
        const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        const newNotification = {
          id: Date.now(),
          ...randomNotif,
          timestamp: '今',
          read: false
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameInfo]);

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          {authMode === 'login' ? 'ログイン' : '新規登録'}
        </h2>
        <div>
          <input
            type="email"
            placeholder="メールアドレス"
            value={authData.email}
            onChange={(e) => setAuthData({...authData, email: e.target.value})}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={authData.password}
            onChange={(e) => setAuthData({...authData, password: e.target.value})}
            className="w-full p-2 border rounded mb-3"
            required
          />
          {authMode === 'register' && (
            <>
              <input
                type="text"
                placeholder="ニックネーム"
                value={authData.nickname}
                onChange={(e) => setAuthData({...authData, nickname: e.target.value})}
                className="w-full p-2 border rounded mb-3"
                required
              />
              <select 
                value={authData.area}
                onChange={(e) => setAuthData({...authData, area: e.target.value})}
                className="w-full p-2 border rounded mb-3" 
                required
              >
                <option value="">居住エリアを選択</option>
                <option value="新宿区">新宿区</option>
                <option value="渋谷区">渋谷区</option>
                <option value="池袋">池袋</option>
                <option value="品川区">品川区</option>
                <option value="港区">港区</option>
                <option value="中央区">中央区</option>
              </select>
            </>
          )}
          <button
            onClick={handleAuth}
            className="w-full bg-yellow-500 text-black p-2 rounded font-bold mb-3"
          >
            {authMode === 'login' ? 'ログイン' : '登録'}
          </button>
        </div>
        <div className="text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-blue-500 underline text-sm"
          >
            {authMode === 'login' ? '新規登録はこちら' : 'ログインはこちら'}
          </button>
        </div>
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-2 right-2 text-gray-500"
        >
          ×
        </button>
      </div>
    </div>
  );

  const NotificationsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-80 max-w-md max-h-96 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">通知</h2>
          <button onClick={() => setShowNotifications(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              通知はありません
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  !notif.read ? 'bg-yellow-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        notif.type === 'game' ? 'bg-green-500' :
                        notif.type === 'event' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></span>
                      <h3 className="font-semibold text-sm">{notif.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.timestamp}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="space-y-4">
      {/* Live Game Info */}
      {gameInfo.currentGame.isLive ? (
        <div className="bg-gradient-to-r from-green-400 to-green-500 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">🔴 LIVE</h3>
              <p className="text-lg">阪神 {gameInfo.currentGame.score.hanshin} - {gameInfo.currentGame.score.opponent} 巨人</p>
              <p className="text-sm">{gameInfo.currentGame.inning}</p>
              <p className="text-xs">最終更新: {gameInfo.currentGame.lastUpdate}</p>
            </div>
            <Trophy className="w-8 h-8" />
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-lg text-black">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">次の試合</h3>
              <p>{gameInfo.nextGame.date} {gameInfo.nextGame.time} vs {gameInfo.nextGame.opponent}</p>
              <p className="text-sm">{gameInfo.nextGame.venue}</p>
            </div>
            <Trophy className="w-8 h-8" />
          </div>
        </div>
      )}

      {/* Recent Games */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold mb-3">最近の試合結果</h3>
        <div className="space-y-2">
          {gameInfo.recentGames.map((game, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{game.date} vs {game.opponent}</span>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  game.result === '勝' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}>
                  {game.result}
                </span>
                <span className="ml-2 text-sm">{game.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Creation */}
      {user && (
        <div className="bg-white p-4 rounded-lg border">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="今日の阪神について何か投稿しよう！🐯"
            className="w-full p-2 border rounded resize-none"
            rows="3"
          />
          
          {/* Image Preview */}
          {selectedImage && (
            <div className="mt-3 relative">
              <img src={selectedImage} alt="選択した画像" className="w-full h-48 object-cover rounded" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={handleImageSelect}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded text-sm"
              >
                <Camera className="w-4 h-4" />
                <span>写真</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded text-sm">
                <MapPin className="w-4 h-4" />
                <span>位置情報</span>
              </button>
            </div>
            <button
              onClick={createPost}
              className="bg-yellow-500 text-black px-4 py-2 rounded font-bold"
            >
              投稿
            </button>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                🐯
              </div>
              <div>
                <p className="font-semibold">{post.user}</p>
                <p className="text-sm text-gray-500">{post.area} • {post.timestamp}</p>
              </div>
            </div>
            <p className="mb-3">{post.content}</p>
            {post.image && (
              <div className="mb-3">
                <img src={post.image} alt="投稿画像" className="w-full h-48 object-cover rounded" />
              </div>
            )}
            <div className="flex items-center space-x-4 text-gray-500">
              <button className="flex items-center space-x-1 hover:text-red-500">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-500">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EventsScreen = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">イベント</h2>
        {user && (
          <button className="bg-yellow-500 text-black p-2 rounded-full">
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {events.map(event => (
        <div key={event.id} className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold text-lg mb-2">{event.title}</h3>
          <div className="space-y-1 text-gray-600 mb-3">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{event.date} {event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>{event.participants}/{event.maxParticipants}人参加予定</span>
            </div>
            <p className="text-sm">主催: {event.organizer}</p>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            参加する
          </button>
        </div>
      ))}
    </div>
  );

  const ChatScreen = () => {
    if (currentChatRoom) {
      return (
        <div className="h-full flex flex-col">
          <div className="bg-white p-4 border-b flex items-center">
            <button 
              onClick={() => setCurrentChatRoom(null)}
              className="mr-3 text-blue-500"
            >
              ← 戻る
            </button>
            <h2 className="text-lg font-bold">{currentChatRoom.name}</h2>
          </div>
          
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-96">
            {(chatMessages[currentChatRoom.id] || []).map(message => (
              <div 
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs p-3 rounded-lg ${
                  message.isMe 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-white border'
                }`}>
                  {!message.isMe && (
                    <p className="text-xs text-gray-500 mb-1">{message.user}</p>
                  )}
                  <p>{message.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          
          {user && (
            <div className="p-4 bg-white border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="メッセージを入力..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={sendMessage}
                  className="bg-yellow-500 text-black p-2 rounded"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-bold mb-4">チャット</h2>
        {chatRooms.map(room => (
          <button
            key={room.id}
            onClick={() => enterChatRoom(room)}
            className="w-full bg-white p-4 rounded-lg border flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
              💬
            </div>
            <div className="text-left">
              <h3 className="font-semibold">{room.name}</h3>
              <p className="text-sm text-gray-500">{room.lastMessage}</p>
            </div>
          </div>
          {room.unread > 0 && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {room.unread}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

const MapScreen = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">マップ</h2>
    
    <div className="flex space-x-2">
      <button className="flex-1 bg-yellow-500 text-black p-2 rounded font-bold">
        近くのファン
      </button>
      <button className="flex-1 bg-gray-200 text-gray-700 p-2 rounded">
        スポーツバー
      </button>
    </div>
    
    <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-500" />
        <p className="text-gray-600">地図表示エリア</p>
        <p className="text-sm text-gray-500">あなたの現在地: 新宿区</p>
      </div>
    </div>
    
    <div>
      <h3 className="font-bold mb-3">近くの阪神ファン</h3>
      <div className="space-y-2">
        {nearbyFans.map(fan => (
          <div key={fan.id} className="bg-white p-3 rounded-lg border flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                🐯
              </div>
              <div>
                <p className="font-semibold">{fan.name}</p>
                <p className="text-sm text-gray-500">{fan.area} • {fan.distance}</p>
                <p className="text-xs text-gray-400">最終ログイン: {fan.lastSeen}</p>
              </div>
            </div>
            <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
              メッセージ
            </button>
          </div>
        ))}
      </div>
    </div>
    
    <div>
      <h3 className="font-bold mb-3">阪神戦が見れるスポーツバー</h3>
      <div className="space-y-2">
        {sportsBars.map(bar => (
          <div key={bar.id} className="bg-white p-3 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{bar.name}</h4>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm">{bar.rating}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{bar.area} • {bar.distance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>📺 阪神戦中継: {bar.hasTV ? 'あり' : 'なし'}</span>
                <span className={`px-2 py-1 rounded text-xs ${bar.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {bar.isOpen ? '営業中' : '営業時間外'}
                </span>
              </div>
              <p className="text-xs">次の阪神戦: {bar.nextGame}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProfileScreen = () => (
  <div className="space-y-4">
    {user ? (
      <>
        <div className="bg-white p-6 rounded-lg border text-center">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
            🐯
          </div>
          <h2 className="text-xl font-bold mb-2">{user.nickname}</h2>
          <p className="text-gray-600 mb-1">📍 {user.area}</p>
          <p className="text-gray-600 mb-1">⚾ ファン歴: {user.fanHistory}</p>
          <p className="text-gray-600">⭐ 推し選手: {user.favoritePlayer}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold mb-3">参加予定イベント</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>神宮球場観戦会</span>
              <span className="text-sm text-gray-500">8/5</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setUser(null)}
          className="w-full bg-gray-500 text-white p-3 rounded"
        >
          ログアウト
        </button>
      </>
    ) : (
      <div className="bg-white p-6 rounded-lg border text-center">
        <h2 className="text-xl font-bold mb-4">ログインしてください</h2>
        <p className="text-gray-600 mb-4">
          東京の阪神ファンと繋がって、一緒に応援しましょう！
        </p>
        <button
          onClick={() => setShowAuthModal(true)}
          className="bg-yellow-500 text-black px-6 py-3 rounded font-bold"
        >
          ログイン / 新規登録
        </button>
      </div>
    )}
  </div>
);

const renderScreen = () => {
  switch(currentScreen) {
    case 'home': return <HomeScreen />;
    case 'events': return <EventsScreen />;
    case 'chat': return <ChatScreen />;
    case 'map': return <MapScreen />;
    case 'profile': return <ProfileScreen />;
    default: return <HomeScreen />;
  }
};

return (
  <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-black">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">🐯 Tokyo Tigers Fan</h1>
        <button 
          onClick={() => setShowNotifications(true)}
          className="relative p-2"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full min-w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
      <p className="text-center text-sm">東京の阪神ファンコミュニティ</p>
    </div>

    <div className="p-4 pb-20">
      {renderScreen()}
    </div>

    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t">
      <div className="flex justify-around py-2">
        {[
          { id: 'home', icon: Home, label: 'ホーム' },
          { id: 'events', icon: Calendar, label: 'イベント' },
          { id: 'chat', icon: MessageCircle, label: 'チャット' },
          { id: 'map', icon: MapPin, label: 'マップ' },
          { id: 'profile', icon: User, label: 'プロフィール' }
        ].map(nav => (
          <button
            key={nav.id}
            onClick={() => setCurrentScreen(nav.id)}
            className={`flex flex-col items-center p-2 ${
              currentScreen === nav.id 
                ? 'text-yellow-600' 
                : 'text-gray-400'
            }`}
          >
            <nav.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{nav.label}</span>
          </button>
        ))}
      </div>
    </div>

    {showAuthModal && <AuthModal />}
    {showNotifications && <NotificationsModal />}
  </div>
);
};

ReactDOM.render(<App />, document.getElementById('root')); 