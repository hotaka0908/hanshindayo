// Tokyo Tigers Fan Community App - JSX Version
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
  
  function initApp() {
    console.log('initApp called');
    
    // Wait for libraries with retry mechanism
    let retryCount = 0;
    const maxRetries = 20; // 10 seconds with 500ms intervals
    
    function waitForLibraries() {
      retryCount++;
      console.log(`Waiting for libraries attempt ${retryCount}/${maxRetries}`);
      
      if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        if (retryCount < maxRetries) {
          setTimeout(waitForLibraries, 500);
          return;
        } else {
          console.error('Required libraries not loaded after waiting');
          showError('必要なライブラリが読み込まれていません。ページを再読み込みしてください。');
          return;
        }
      }
      
      console.log('All libraries loaded, initializing app...');
      startApp();
    }
    
    waitForLibraries();
  }
  
  function startApp() {
    console.log('startApp function called');
    
    // Update debug info
    if (typeof updateDebugInfo === 'function') {
      updateDebugInfo('アプリコンポーネント初期化中...', true, true);
    }

    const { useState, useEffect } = React;

    // Safe icon component
    const SafeIcon = ({ icon: IconComponent, className = "w-5 h-5", fallback = "?" }) => {
      if (IconComponent && typeof IconComponent === 'function') {
        return React.createElement(IconComponent, { className });
      }
      return React.createElement('span', { 
        className: `${className} inline-flex items-center justify-center text-gray-400`,
        style: { fontSize: '0.75rem' }
      }, fallback);
    };

    // Get Lucide icons safely
    const getIcon = (iconName) => {
      const lucideIcons = window.lucide || {};
      return lucideIcons[iconName];
    };

    const HanshinFansApp = () => {
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
        React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
          React.createElement('div', { className: 'bg-white p-6 rounded-lg w-80 max-w-md' },
            React.createElement('h2', { className: 'text-xl font-bold mb-4 text-center' },
              authMode === 'login' ? 'ログイン' : '新規登録'
            ),
            React.createElement('div', null,
              React.createElement('input', {
                type: 'email',
                placeholder: 'メールアドレス',
                value: authData.email,
                onChange: (e) => setAuthData({...authData, email: e.target.value}),
                className: 'w-full p-2 border rounded mb-3',
                required: true
              }),
              React.createElement('input', {
                type: 'password',
                placeholder: 'パスワード',
                value: authData.password,
                onChange: (e) => setAuthData({...authData, password: e.target.value}),
                className: 'w-full p-2 border rounded mb-3',
                required: true
              }),
              authMode === 'register' && React.createElement('div', null,
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'ニックネーム',
                  value: authData.nickname,
                  onChange: (e) => setAuthData({...authData, nickname: e.target.value}),
                  className: 'w-full p-2 border rounded mb-3',
                  required: true
                }),
                React.createElement('select', {
                  value: authData.area,
                  onChange: (e) => setAuthData({...authData, area: e.target.value}),
                  className: 'w-full p-2 border rounded mb-3',
                  required: true
                },
                  React.createElement('option', { value: '' }, '居住エリアを選択'),
                  React.createElement('option', { value: '新宿区' }, '新宿区'),
                  React.createElement('option', { value: '渋谷区' }, '渋谷区'),
                  React.createElement('option', { value: '池袋' }, '池袋'),
                  React.createElement('option', { value: '品川区' }, '品川区'),
                  React.createElement('option', { value: '港区' }, '港区'),
                  React.createElement('option', { value: '中央区' }, '中央区')
                )
              ),
              React.createElement('button', {
                onClick: handleAuth,
                className: 'w-full bg-yellow-500 text-black p-2 rounded font-bold mb-3'
              }, authMode === 'login' ? 'ログイン' : '登録')
            ),
            React.createElement('div', { className: 'text-center' },
              React.createElement('button', {
                onClick: () => setAuthMode(authMode === 'login' ? 'register' : 'login'),
                className: 'text-blue-500 underline text-sm'
              }, authMode === 'login' ? '新規登録はこちら' : 'ログインはこちら')
            ),
            React.createElement('button', {
              onClick: () => setShowAuthModal(false),
              className: 'absolute top-2 right-2 text-gray-500'
            }, '×')
          )
        )
      );

      const NotificationsModal = () => (
        React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
          React.createElement('div', { className: 'bg-white rounded-lg w-80 max-w-md max-h-96 overflow-hidden' },
            React.createElement('div', { className: 'p-4 border-b flex items-center justify-between' },
              React.createElement('h2', { className: 'text-lg font-bold' }, '通知'),
              React.createElement('button', { onClick: () => setShowNotifications(false) },
                React.createElement(SafeIcon, { icon: getIcon('X'), className: 'w-5 h-5', fallback: '✕' })
              )
            ),
            React.createElement('div', { className: 'overflow-y-auto max-h-80' },
              notifications.length === 0 
                ? React.createElement('div', { className: 'p-4 text-center text-gray-500' }, '通知はありません')
                : notifications.map(notif =>
                    React.createElement('div', {
                      key: notif.id,
                      onClick: () => markNotificationRead(notif.id),
                      className: `p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        !notif.read ? 'bg-yellow-50' : ''
                      }`
                    },
                      React.createElement('div', { className: 'flex items-start justify-between' },
                        React.createElement('div', { className: 'flex-1' },
                          React.createElement('div', { className: 'flex items-center' },
                            React.createElement('span', {
                              className: `w-2 h-2 rounded-full mr-2 ${
                                notif.type === 'game' ? 'bg-green-500' :
                                notif.type === 'event' ? 'bg-blue-500' : 'bg-yellow-500'
                              }`
                            }),
                            React.createElement('h3', { className: 'font-semibold text-sm' }, notif.title)
                          ),
                          React.createElement('p', { className: 'text-sm text-gray-600 mt-1' }, notif.message),
                          React.createElement('p', { className: 'text-xs text-gray-400 mt-1' }, notif.timestamp)
                        ),
                        !notif.read && React.createElement('div', { className: 'w-2 h-2 bg-red-500 rounded-full ml-2' })
                      )
                    )
                  )
            )
          )
        )
      );

      const HomeScreen = () => (
        React.createElement('div', { className: 'space-y-4' },
          // Live Game Info
          gameInfo.currentGame.isLive 
            ? React.createElement('div', { className: 'bg-gradient-to-r from-green-400 to-green-500 p-4 rounded-lg text-white' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('div', null,
                    React.createElement('h3', { className: 'font-bold text-lg' }, '🔴 LIVE'),
                    React.createElement('p', { className: 'text-lg' }, `阪神 ${gameInfo.currentGame.score.hanshin} - ${gameInfo.currentGame.score.opponent} 巨人`),
                    React.createElement('p', { className: 'text-sm' }, gameInfo.currentGame.inning),
                    React.createElement('p', { className: 'text-xs' }, `最終更新: ${gameInfo.currentGame.lastUpdate}`)
                  ),
                  React.createElement(SafeIcon, { icon: getIcon('Trophy'), className: 'w-8 h-8', fallback: '🏆' })
                )
              )
            : React.createElement('div', { className: 'bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-lg text-black' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('div', null,
                    React.createElement('h3', { className: 'font-bold' }, '次の試合'),
                    React.createElement('p', null, `${gameInfo.nextGame.date} ${gameInfo.nextGame.time} vs ${gameInfo.nextGame.opponent}`),
                    React.createElement('p', { className: 'text-sm' }, gameInfo.nextGame.venue)
                  ),
                  React.createElement(SafeIcon, { icon: getIcon('Trophy'), className: 'w-8 h-8', fallback: '🏆' })
                )
              ),

          // Recent Games
          React.createElement('div', { className: 'bg-white p-4 rounded-lg border' },
            React.createElement('h3', { className: 'font-bold mb-3' }, '最近の試合結果'),
            React.createElement('div', { className: 'space-y-2' },
              gameInfo.recentGames.map((game, index) =>
                React.createElement('div', { key: index, className: 'flex items-center justify-between p-2 bg-gray-50 rounded' },
                  React.createElement('span', { className: 'text-sm' }, `${game.date} vs ${game.opponent}`),
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement('span', {
                      className: `px-2 py-1 rounded text-xs font-bold ${
                        game.result === '勝' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`
                    }, game.result),
                    React.createElement('span', { className: 'ml-2 text-sm' }, game.score)
                  )
                )
              )
            )
          ),

          // Post Creation
          user && React.createElement('div', { className: 'bg-white p-4 rounded-lg border' },
            React.createElement('textarea', {
              value: newPost,
              onChange: (e) => setNewPost(e.target.value),
              placeholder: '今日の阪神について何か投稿しよう！🐯',
              className: 'w-full p-2 border rounded resize-none',
              rows: 3
            }),
            
            // Image Preview
            selectedImage && React.createElement('div', { className: 'mt-3 relative' },
              React.createElement('img', { src: selectedImage, alt: '選択した画像', className: 'w-full h-48 object-cover rounded' }),
              React.createElement('button', {
                onClick: () => setSelectedImage(null),
                className: 'absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
              }, '×')
            ),
            
            React.createElement('div', { className: 'mt-3 flex items-center justify-between' },
              React.createElement('div', { className: 'flex space-x-2' },
                React.createElement('button', {
                  onClick: handleImageSelect,
                  className: 'flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded text-sm'
                },
                  React.createElement(SafeIcon, { icon: getIcon('Camera'), className: 'w-4 h-4', fallback: '📷' }),
                  React.createElement('span', null, '写真')
                ),
                React.createElement('button', { className: 'flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded text-sm' },
                  React.createElement(SafeIcon, { icon: getIcon('MapPin'), className: 'w-4 h-4', fallback: '📍' }),
                  React.createElement('span', null, '位置情報')
                )
              ),
              React.createElement('button', {
                onClick: createPost,
                className: 'bg-yellow-500 text-black px-4 py-2 rounded font-bold'
              }, '投稿')
            )
          ),

          // Posts Feed
          React.createElement('div', { className: 'space-y-4' },
            posts.map(post =>
              React.createElement('div', { key: post.id, className: 'bg-white p-4 rounded-lg border' },
                React.createElement('div', { className: 'flex items-center mb-2' },
                  React.createElement('div', { className: 'w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3' }, '🐯'),
                  React.createElement('div', null,
                    React.createElement('p', { className: 'font-semibold' }, post.user),
                    React.createElement('p', { className: 'text-sm text-gray-500' }, `${post.area} • ${post.timestamp}`)
                  )
                ),
                React.createElement('p', { className: 'mb-3' }, post.content),
                post.image && React.createElement('div', { className: 'mb-3' },
                  React.createElement('img', { src: post.image, alt: '投稿画像', className: 'w-full h-48 object-cover rounded' })
                ),
                React.createElement('div', { className: 'flex items-center space-x-4 text-gray-500' },
                  React.createElement('button', { className: 'flex items-center space-x-1 hover:text-red-500' },
                    React.createElement(SafeIcon, { icon: getIcon('Heart'), className: 'w-4 h-4', fallback: '♥' }),
                    React.createElement('span', null, post.likes)
                  ),
                  React.createElement('button', { className: 'flex items-center space-x-1 hover:text-blue-500' },
                    React.createElement(SafeIcon, { icon: getIcon('MessageCircle'), className: 'w-4 h-4', fallback: '💬' }),
                    React.createElement('span', null, post.comments)
                  )
                )
              )
            )
          )
        )
      );

      const EventsScreen = () => (
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('div', { className: 'flex justify-between items-center' },
            React.createElement('h2', { className: 'text-xl font-bold' }, 'イベント'),
            user && React.createElement('button', { className: 'bg-yellow-500 text-black p-2 rounded-full' },
              React.createElement(SafeIcon, { icon: getIcon('Plus'), className: 'w-5 h-5', fallback: '+' })
            )
          ),
          
          events.map(event =>
            React.createElement('div', { key: event.id, className: 'bg-white p-4 rounded-lg border' },
              React.createElement('h3', { className: 'font-bold text-lg mb-2' }, event.title),
              React.createElement('div', { className: 'space-y-1 text-gray-600 mb-3' },
                React.createElement('div', { className: 'flex items-center' },
                  React.createElement(SafeIcon, { icon: getIcon('Calendar'), className: 'w-4 h-4 mr-2', fallback: '📅' }),
                  React.createElement('span', null, `${event.date} ${event.time}`)
                ),
                React.createElement('div', { className: 'flex items-center' },
                  React.createElement(SafeIcon, { icon: getIcon('MapPin'), className: 'w-4 h-4 mr-2', fallback: '📍' }),
                  React.createElement('span', null, event.location)
                ),
                React.createElement('div', { className: 'flex items-center' },
                  React.createElement(SafeIcon, { icon: getIcon('Users'), className: 'w-4 h-4 mr-2', fallback: '👥' }),
                  React.createElement('span', null, `${event.participants}/${event.maxParticipants}人参加予定`)
                ),
                React.createElement('p', { className: 'text-sm' }, `主催: ${event.organizer}`)
              ),
              React.createElement('button', { className: 'bg-blue-500 text-white px-4 py-2 rounded' }, '参加する')
            )
          )
        )
      );

      const ChatScreen = () => {
        if (currentChatRoom) {
          return React.createElement('div', { className: 'h-full flex flex-col' },
            React.createElement('div', { className: 'bg-white p-4 border-b flex items-center' },
              React.createElement('button', { 
                onClick: () => setCurrentChatRoom(null),
                className: 'mr-3 text-blue-500'
              }, '← 戻る'),
              React.createElement('h2', { className: 'text-lg font-bold' }, currentChatRoom.name)
            ),
            
            React.createElement('div', { className: 'flex-1 p-4 space-y-3 overflow-y-auto max-h-96' },
              (chatMessages[currentChatRoom.id] || []).map(message =>
                React.createElement('div', { 
                  key: message.id,
                  className: `flex ${message.isMe ? 'justify-end' : 'justify-start'}`
                },
                  React.createElement('div', {
                    className: `max-w-xs p-3 rounded-lg ${
                      message.isMe 
                        ? 'bg-yellow-500 text-black' 
                        : 'bg-white border'
                    }`
                  },
                    !message.isMe && React.createElement('p', { className: 'text-xs text-gray-500 mb-1' }, message.user),
                    React.createElement('p', null, message.message),
                    React.createElement('p', { className: 'text-xs text-gray-500 mt-1' }, message.timestamp)
                  )
                )
              )
            ),
            
            user && React.createElement('div', { className: 'p-4 bg-white border-t' },
              React.createElement('div', { className: 'flex space-x-2' },
                React.createElement('input', {
                  type: 'text',
                  value: newMessage,
                  onChange: (e) => setNewMessage(e.target.value),
                  onKeyPress: (e) => e.key === 'Enter' && sendMessage(),
                  placeholder: 'メッセージを入力...',
                  className: 'flex-1 p-2 border rounded'
                }),
                React.createElement('button', {
                  onClick: sendMessage,
                  className: 'bg-yellow-500 text-black p-2 rounded'
                },
                  React.createElement(SafeIcon, { icon: getIcon('Send'), className: 'w-5 h-5', fallback: '→' })
                )
              )
            )
          );
        }
        
        return React.createElement('div', { className: 'space-y-2' },
          React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'チャット'),
          chatRooms.map(room =>
            React.createElement('button', {
              key: room.id,
              onClick: () => enterChatRoom(room),
              className: 'w-full bg-white p-4 rounded-lg border flex items-center justify-between hover:bg-gray-50'
            },
              React.createElement('div', { className: 'flex items-center' },
                React.createElement('div', { className: 'w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-3' }, '💬'),
                React.createElement('div', { className: 'text-left' },
                  React.createElement('h3', { className: 'font-semibold' }, room.name),
                  React.createElement('p', { className: 'text-sm text-gray-500' }, room.lastMessage)
                )
              ),
              room.unread > 0 && React.createElement('div', { className: 'bg-red-500 text-white text-xs px-2 py-1 rounded-full' }, room.unread)
            )
          )
        );
      };

      const MapScreen = () => (
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h2', { className: 'text-xl font-bold' }, 'マップ'),
          
          React.createElement('div', { className: 'flex space-x-2' },
            React.createElement('button', { className: 'flex-1 bg-yellow-500 text-black p-2 rounded font-bold' }, '近くのファン'),
            React.createElement('button', { className: 'flex-1 bg-gray-200 text-gray-700 p-2 rounded' }, 'スポーツバー')
          ),
          
          React.createElement('div', { className: 'bg-gray-200 h-48 rounded-lg flex items-center justify-center' },
            React.createElement('div', { className: 'text-center' },
              React.createElement(SafeIcon, { icon: getIcon('MapPin'), className: 'w-12 h-12 mx-auto mb-2 text-gray-500', fallback: '🗺' }),
              React.createElement('p', { className: 'text-gray-600' }, '地図表示エリア'),
              React.createElement('p', { className: 'text-sm text-gray-500' }, 'あなたの現在地: 新宿区')
            )
          ),
          
          React.createElement('div', null,
            React.createElement('h3', { className: 'font-bold mb-3' }, '近くの阪神ファン'),
            React.createElement('div', { className: 'space-y-2' },
              nearbyFans.map(fan =>
                React.createElement('div', { key: fan.id, className: 'bg-white p-3 rounded-lg border flex items-center justify-between' },
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement('div', { className: 'w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3' }, '🐯'),
                    React.createElement('div', null,
                      React.createElement('p', { className: 'font-semibold' }, fan.name),
                      React.createElement('p', { className: 'text-sm text-gray-500' }, `${fan.area} • ${fan.distance}`),
                      React.createElement('p', { className: 'text-xs text-gray-400' }, `最終ログイン: ${fan.lastSeen}`)
                    )
                  ),
                  React.createElement('button', { className: 'bg-blue-500 text-white px-3 py-1 rounded text-sm' }, 'メッセージ')
                )
              )
            )
          ),
          
          React.createElement('div', null,
            React.createElement('h3', { className: 'font-bold mb-3' }, '阪神戦が見れるスポーツバー'),
            React.createElement('div', { className: 'space-y-2' },
              sportsBars.map(bar =>
                React.createElement('div', { key: bar.id, className: 'bg-white p-3 rounded-lg border' },
                  React.createElement('div', { className: 'flex items-center justify-between mb-2' },
                    React.createElement('h4', { className: 'font-semibold' }, bar.name),
                    React.createElement('div', { className: 'flex items-center' },
                      React.createElement(SafeIcon, { icon: getIcon('Star'), className: 'w-4 h-4 text-yellow-500 mr-1', fallback: '⭐' }),
                      React.createElement('span', { className: 'text-sm' }, bar.rating)
                    )
                  ),
                  React.createElement('div', { className: 'text-sm text-gray-600 space-y-1' },
                    React.createElement('div', { className: 'flex items-center' },
                      React.createElement(SafeIcon, { icon: getIcon('MapPin'), className: 'w-3 h-3 mr-1', fallback: '📍' }),
                      React.createElement('span', null, `${bar.area} • ${bar.distance}`)
                    ),
                    React.createElement('div', { className: 'flex items-center justify-between' },
                      React.createElement('span', null, `📺 阪神戦中継: ${bar.hasTV ? 'あり' : 'なし'}`),
                      React.createElement('span', {
                        className: `px-2 py-1 rounded text-xs ${bar.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
                      }, bar.isOpen ? '営業中' : '営業時間外')
                    ),
                    React.createElement('p', { className: 'text-xs' }, `次の阪神戦: ${bar.nextGame}`)
                  )
                )
              )
            )
          )
        )
      );

      const ProfileScreen = () => (
        React.createElement('div', { className: 'space-y-4' },
          user ? React.createElement('div', null,
            React.createElement('div', { className: 'bg-white p-6 rounded-lg border text-center' },
              React.createElement('div', { className: 'w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4' }, '🐯'),
              React.createElement('h2', { className: 'text-xl font-bold mb-2' }, user.nickname),
              React.createElement('p', { className: 'text-gray-600 mb-1' }, `📍 ${user.area}`),
              React.createElement('p', { className: 'text-gray-600 mb-1' }, `⚾ ファン歴: ${user.fanHistory}`),
              React.createElement('p', { className: 'text-gray-600' }, `⭐ 推し選手: ${user.favoritePlayer}`)
            ),
            
            React.createElement('div', { className: 'bg-white p-4 rounded-lg border' },
              React.createElement('h3', { className: 'font-bold mb-3' }, '参加予定イベント'),
              React.createElement('div', { className: 'space-y-2' },
                React.createElement('div', { className: 'flex items-center justify-between p-2 bg-gray-50 rounded' },
                  React.createElement('span', null, '神宮球場観戦会'),
                  React.createElement('span', { className: 'text-sm text-gray-500' }, '8/5')
                )
              )
            ),
            
            React.createElement('button', {
              onClick: () => setUser(null),
              className: 'w-full bg-gray-500 text-white p-3 rounded'
            }, 'ログアウト')
          ) : React.createElement('div', { className: 'bg-white p-6 rounded-lg border text-center' },
            React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'ログインしてください'),
            React.createElement('p', { className: 'text-gray-600 mb-4' }, '東京の阪神ファンと繋がって、一緒に応援しましょう！'),
            React.createElement('button', {
              onClick: () => setShowAuthModal(true),
              className: 'bg-yellow-500 text-black px-6 py-3 rounded font-bold'
            }, 'ログイン / 新規登録')
          )
        )
      );

      const renderScreen = () => {
        switch(currentScreen) {
          case 'home': return React.createElement(HomeScreen);
          case 'events': return React.createElement(EventsScreen);
          case 'chat': return React.createElement(ChatScreen);
          case 'map': return React.createElement(MapScreen);
          case 'profile': return React.createElement(ProfileScreen);
          default: return React.createElement(HomeScreen);
        }
      };

      return React.createElement('div', { className: 'max-w-md mx-auto bg-gray-100 min-h-screen' },
        React.createElement('div', { className: 'bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-black' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('h1', { className: 'text-xl font-bold' }, '🐯 Tokyo Tigers Fan'),
            React.createElement('button', { 
              onClick: () => setShowNotifications(true),
              className: 'relative p-2'
            },
              React.createElement(SafeIcon, { icon: getIcon('Bell'), className: 'w-6 h-6', fallback: '🔔' }),
              unreadCount > 0 && React.createElement('span', {
                className: 'absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full min-w-4 h-4 flex items-center justify-center'
              }, unreadCount)
            )
          ),
          React.createElement('p', { className: 'text-center text-sm' }, '東京の阪神ファンコミュニティ')
        ),

        React.createElement('div', { className: 'p-4 pb-20' },
          renderScreen()
        ),

        React.createElement('div', { className: 'fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t' },
          React.createElement('div', { className: 'flex justify-around py-2' },
            [
              { id: 'home', icon: 'Home', label: 'ホーム', fallback: '🏠' },
              { id: 'events', icon: 'Calendar', label: 'イベント', fallback: '📅' },
              { id: 'chat', icon: 'MessageCircle', label: 'チャット', fallback: '💬' },
              { id: 'map', icon: 'MapPin', label: 'マップ', fallback: '🗺' },
              { id: 'profile', icon: 'User', label: 'プロフィール', fallback: '👤' }
            ].map(nav =>
              React.createElement('button', {
                key: nav.id,
                onClick: () => setCurrentScreen(nav.id),
                className: `flex flex-col items-center p-2 ${
                  currentScreen === nav.id 
                    ? 'text-yellow-600' 
                    : 'text-gray-400'
                }`
              },
                React.createElement(SafeIcon, { icon: getIcon(nav.icon), className: 'w-5 h-5', fallback: nav.fallback }),
                React.createElement('span', { className: 'text-xs mt-1' }, nav.label)
              )
            )
          )
        ),

        showAuthModal && React.createElement(AuthModal),
        showNotifications && React.createElement(NotificationsModal)
      );
    };

    // Render the app
    try {
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        throw new Error('Root element not found');
      }
      
      console.log('Rendering app...');
      
      // Update debug info before rendering
      if (typeof updateDebugInfo === 'function') {
        updateDebugInfo('アプリをレンダリング中...', true, true);
      }
      
      // Clear loading indicator
      rootElement.innerHTML = '';
      
      if (ReactDOM.createRoot) {
        // React 18
        console.log('Using React 18 createRoot');
        const root = ReactDOM.createRoot(rootElement);
        root.render(React.createElement(HanshinFansApp));
      } else {
        // Fallback to React 17 style
        console.log('Using React 17 render');
        ReactDOM.render(React.createElement(HanshinFansApp), rootElement);
      }
      
      console.log('HanshinFansApp successfully rendered!');
    } catch (error) {
      console.error('Failed to render app:', error);
      showError('アプリの読み込みに失敗しました: ' + error.message);
    }
  }
  
  function showError(message) {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `<div style="padding: 20px; text-align: center; color: #ef4444;">❌ ${message}</div>`;
    }
  }
})();