// Simple React app without Babel - using React.createElement
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
  
  function initApp() {
    // Check if required libraries are loaded
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
      console.error('Required libraries not loaded');
      showError('必要なライブラリが読み込まれていません');
      return;
    }

    const { useState, useEffect, createElement: e } = React;

    // Safe icon component that handles missing lucide icons
    const SafeIcon = ({ icon: IconComponent, className = "w-5 h-5", fallback = "?" }) => {
      if (IconComponent && typeof IconComponent === 'function') {
        return e(IconComponent, { className });
      }
      return e('span', { 
        className: `${className} inline-flex items-center justify-center text-gray-400`,
        style: { fontSize: '0.75rem' }
      }, fallback);
    };

    // Get Lucide icons safely
    const getIcon = (iconName) => {
      const lucideIcons = window.lucide || {};
      return lucideIcons[iconName];
    };

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

      // Simple post creation
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

      // Get unread notifications count
      const unreadCount = notifications.filter(n => !n.read).length;

      // Mark notification as read
      const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        ));
      };

      // Main app component
      return e('div', { className: 'max-w-md mx-auto bg-gray-100 min-h-screen' },
        // Header
        e('div', { className: 'bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-black' },
          e('div', { className: 'flex items-center justify-between' },
            e('h1', { className: 'text-xl font-bold' }, '🐯 Tokyo Tigers Fan'),
            e('button', { 
              onClick: () => setShowNotifications(true),
              className: 'relative p-2'
            },
              e(SafeIcon, { icon: getIcon('Bell'), className: 'w-6 h-6', fallback: '🔔' }),
              unreadCount > 0 && e('span', {
                className: 'absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full min-w-4 h-4 flex items-center justify-center'
              }, unreadCount)
            )
          ),
          e('p', { className: 'text-center text-sm' }, '東京の阪神ファンコミュニティ')
        ),
        
        // Main content area
        e('div', { className: 'p-4 pb-20' },
          // Game info
          gameInfo.currentGame.isLive 
            ? e('div', { className: 'bg-gradient-to-r from-green-400 to-green-500 p-4 rounded-lg text-white mb-4' },
                e('div', { className: 'flex items-center justify-between' },
                  e('div', null,
                    e('h3', { className: 'font-bold text-lg' }, '🔴 LIVE'),
                    e('p', { className: 'text-lg' }, `阪神 ${gameInfo.currentGame.score.hanshin} - ${gameInfo.currentGame.score.opponent} 巨人`),
                    e('p', { className: 'text-sm' }, gameInfo.currentGame.inning),
                    e('p', { className: 'text-xs' }, `最終更新: ${gameInfo.currentGame.lastUpdate}`)
                  ),
                  e(SafeIcon, { icon: getIcon('Trophy'), className: 'w-8 h-8', fallback: '🏆' })
                )
              )
            : e('div', { className: 'bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-lg text-black mb-4' },
                e('div', { className: 'flex items-center justify-between' },
                  e('div', null,
                    e('h3', { className: 'font-bold' }, '次の試合'),
                    e('p', null, `${gameInfo.nextGame.date} ${gameInfo.nextGame.time} vs ${gameInfo.nextGame.opponent}`),
                    e('p', { className: 'text-sm' }, gameInfo.nextGame.venue)
                  ),
                  e(SafeIcon, { icon: getIcon('Trophy'), className: 'w-8 h-8', fallback: '🏆' })
                )
              ),
          
          // Posts feed
          e('div', { className: 'space-y-4' },
            posts.map(post => 
              e('div', { key: post.id, className: 'bg-white p-4 rounded-lg border' },
                e('div', { className: 'flex items-center mb-2' },
                  e('div', { className: 'w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3' }, '🐯'),
                  e('div', null,
                    e('p', { className: 'font-semibold' }, post.user),
                    e('p', { className: 'text-sm text-gray-500' }, `${post.area} • ${post.timestamp}`)
                  )
                ),
                e('p', { className: 'mb-3' }, post.content),
                post.image && e('div', { className: 'mb-3' },
                  e('img', { src: post.image, alt: '投稿画像', className: 'w-full h-48 object-cover rounded' })
                ),
                e('div', { className: 'flex items-center space-x-4 text-gray-500' },
                  e('button', { className: 'flex items-center space-x-1 hover:text-red-500' },
                    e(SafeIcon, { icon: getIcon('Heart'), className: 'w-4 h-4', fallback: '♥' }),
                    e('span', null, post.likes)
                  ),
                  e('button', { className: 'flex items-center space-x-1 hover:text-blue-500' },
                    e(SafeIcon, { icon: getIcon('MessageCircle'), className: 'w-4 h-4', fallback: '💬' }),
                    e('span', null, post.comments)
                  )
                )
              )
            )
          )
        ),
        
        // Bottom navigation
        e('div', { className: 'fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t' },
          e('div', { className: 'flex justify-around py-2' },
            [
              { id: 'home', icon: 'Home', label: 'ホーム', fallback: '🏠' },
              { id: 'events', icon: 'Calendar', label: 'イベント', fallback: '📅' },
              { id: 'chat', icon: 'MessageCircle', label: 'チャット', fallback: '💬' },
              { id: 'map', icon: 'MapPin', label: 'マップ', fallback: '🗺' },
              { id: 'profile', icon: 'User', label: 'プロフィール', fallback: '👤' }
            ].map(nav =>
              e('button', {
                key: nav.id,
                onClick: () => setCurrentScreen(nav.id),
                className: `flex flex-col items-center p-2 ${
                  currentScreen === nav.id 
                    ? 'text-yellow-600' 
                    : 'text-gray-400'
                }`
              },
                e(SafeIcon, { icon: getIcon(nav.icon), className: 'w-5 h-5', fallback: nav.fallback }),
                e('span', { className: 'text-xs mt-1' }, nav.label)
              )
            )
          )
        ),
        
        // Modals
        showNotifications && e('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
          e('div', { className: 'bg-white rounded-lg w-80 max-w-md max-h-96 overflow-hidden' },
            e('div', { className: 'p-4 border-b flex items-center justify-between' },
              e('h2', { className: 'text-lg font-bold' }, '通知'),
              e('button', { onClick: () => setShowNotifications(false) },
                e(SafeIcon, { icon: getIcon('X'), className: 'w-5 h-5', fallback: '✕' })
              )
            ),
            e('div', { className: 'overflow-y-auto max-h-80' },
              notifications.length === 0 
                ? e('div', { className: 'p-4 text-center text-gray-500' }, '通知はありません')
                : notifications.map(notif =>
                    e('div', {
                      key: notif.id,
                      onClick: () => markNotificationRead(notif.id),
                      className: `p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        !notif.read ? 'bg-yellow-50' : ''
                      }`
                    },
                      e('div', { className: 'flex items-start justify-between' },
                        e('div', { className: 'flex-1' },
                          e('div', { className: 'flex items-center' },
                            e('span', {
                              className: `w-2 h-2 rounded-full mr-2 ${
                                notif.type === 'game' ? 'bg-green-500' :
                                notif.type === 'event' ? 'bg-blue-500' : 'bg-yellow-500'
                              }`
                            }),
                            e('h3', { className: 'font-semibold text-sm' }, notif.title)
                          ),
                          e('p', { className: 'text-sm text-gray-600 mt-1' }, notif.message),
                          e('p', { className: 'text-xs text-gray-400 mt-1' }, notif.timestamp)
                        ),
                        !notif.read && e('div', { className: 'w-2 h-2 bg-red-500 rounded-full ml-2' })
                      )
                    )
                  )
            )
          )
        )
      );
    };

    // Render the app
    try {
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        throw new Error('Root element not found');
      }
      
      // Clear loading indicator
      rootElement.innerHTML = '';
      
      if (ReactDOM.createRoot) {
        // React 18
        const root = ReactDOM.createRoot(rootElement);
        root.render(e(App));
      } else {
        // Fallback to React 17 style
        ReactDOM.render(e(App), rootElement);
      }
      
      console.log('App successfully rendered!');
    } catch (error) {
      console.error('Failed to render app:', error);
      showError('アプリの読み込みに失敗しました。ページを再読み込みしてください。');
    }
  }
  
  function showError(message) {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `<div style="padding: 20px; text-align: center; color: #ef4444;">❌ ${message}</div>`;
    }
  }
})();