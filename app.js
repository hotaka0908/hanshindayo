// Tokyo Tigers Fan Community App - Complete Rebuild
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

    // Safe icon component
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

    // Tokyo areas data
    const TOKYO_AREAS = {
      '23区': [
        '千代田区', '中央区', '港区', '新宿区', '文京区', '台東区', '墨田区', '江東区',
        '品川区', '目黒区', '大田区', '世田谷区', '渋谷区', '中野区', '杉並区', '豊島区',
        '北区', '荒川区', '板橋区', '練馬区', '足立区', '葛飾区', '江戸川区'
      ],
      '多摩地域': [
        '八王子市', '立川市', '武蔵野市', '三鷹市', '青梅市', '府中市', '昭島市', '調布市',
        '町田市', '小金井市', '小平市', '日野市', '東村山市', '国分寺市', '国立市', '福生市',
        '狛江市', '東大和市', '清瀬市', '東久留米市', '武蔵村山市', '多摩市', '稲城市', '羽村市',
        'あきる野市', '西東京市'
      ]
    };

    // Main App Component
    const App = () => {
      // Core State
      const [currentScreen, setCurrentScreen] = useState('home');
      const [user, setUser] = useState(null);
      const [showAuthModal, setShowAuthModal] = useState(false);
      const [authMode, setAuthMode] = useState('login');
      const [authData, setAuthData] = useState({ 
        email: '', 
        password: '', 
        nickname: '', 
        area: '',
        region: '',
        fanHistory: '',
        favoritePlayer: '',
        residencyProof: null
      });

      // Community State
      const [selectedArea, setSelectedArea] = useState('全体');
      const [posts, setPosts] = useState([
        {
          id: 1,
          user: '新宿の虎太郎',
          area: '新宿区',
          region: '23区',
          content: '今日の試合、佐藤輝明のホームランすごかった！新宿で一緒に観戦した皆さんお疲れ様でした🐯',
          image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400',
          likes: 23,
          comments: 8,
          timestamp: '2時間前',
          category: 'game'
        },
        {
          id: 2,
          user: '渋谷Tigers Girl',
          area: '渋谷区',
          region: '23区',
          content: '明日神宮球場で阪神戦観に行く人いませんか？渋谷から一緒に行きましょう！',
          image: null,
          likes: 15,
          comments: 12,
          timestamp: '4時間前',
          category: 'event'
        },
        {
          id: 3,
          user: '池袋阪神一筋',
          area: '豊島区',
          region: '23区',
          content: '甲子園の土を持って帰ってきました！池袋のファンの皆さんにもお裾分けしたいです🏟️',
          image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
          likes: 41,
          comments: 15,
          timestamp: '6時間前',
          category: 'general'
        }
      ]);

      // Event State
      const [events, setEvents] = useState([
        {
          id: 1,
          title: '神宮球場観戦会',
          date: '8/5(土)',
          time: '17:00',
          location: '明治神宮野球場',
          meetingPoint: 'JR新宿駅東口',
          participants: 12,
          maxParticipants: 20,
          organizer: '渋谷Tigers Girl',
          organizerArea: '渋谷区',
          category: 'game',
          description: '阪神vs巨人戦を一緒に応援しましょう！新宿駅から一緒に向かいます。',
          requirements: '東京都内居住者限定',
          fee: '交通費各自負担'
        },
        {
          id: 2,
          title: '新宿スポーツバー観戦',
          date: '8/8(火)',
          time: '19:00',
          location: 'スポーツバー GOAL新宿店',
          meetingPoint: '店舗直接',
          participants: 6,
          maxParticipants: 15,
          organizer: '新宿の虎太郎',
          organizerArea: '新宿区',
          category: 'watch',
          description: '平日夜の試合をスポーツバーで観戦！仕事帰りに気軽にどうぞ。',
          requirements: '20歳以上',
          fee: '飲食代各自負担'
        },
        {
          id: 3,
          title: '甲子園遠征ツアー',
          date: '8/15(火)〜8/16(水)',
          time: '6:00出発',
          location: '阪神甲子園球場',
          meetingPoint: '東京駅八重洲口',
          participants: 8,
          maxParticipants: 25,
          organizer: '池袋阪神一筋',
          organizerArea: '豊島区',
          category: 'tour',
          description: '1泊2日の甲子園遠征！本場で阪神を応援しよう！宿泊・移動手段込み。',
          requirements: '東京都内居住確認必須',
          fee: '35,000円（交通費・宿泊費込み）'
        }
      ]);

      // Chat State
      const [chatRooms, setChatRooms] = useState([
        { id: 1, name: '🔴 試合実況', area: '全体', lastMessage: 'サヨナラ勝ち最高〜！', unread: 5, category: 'game' },
        { id: 2, name: '📍 新宿エリア', area: '新宿区', lastMessage: '明日飲み会どうですか？', unread: 2, category: 'area' },
        { id: 3, name: '📍 渋谷エリア', area: '渋谷区', lastMessage: 'よろしくお願いします', unread: 0, category: 'area' },
        { id: 4, name: '⚾ 佐藤輝明ファン', area: '全体', lastMessage: 'ホームラン王狙えるね！', unread: 3, category: 'player' },
        { id: 5, name: '🚌 甲子園遠征', area: '全体', lastMessage: '来月のツアー楽しみ！', unread: 1, category: 'event' }
      ]);

      // Game State
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
          score: { hanshin: 4, opponent: 2 },
          isLive: true,
          lastUpdate: '21:15'
        },
        recentGames: [
          { date: '7/30', opponent: 'ヤクルト', result: '勝', score: '5-3' },
          { date: '7/29', opponent: 'ヤクルト', result: '勝', score: '4-1' },
          { date: '7/28', opponent: 'ヤクルト', result: '負', score: '2-6' }
        ]
      });

      // Notification State
      const [notifications, setNotifications] = useState([
        {
          id: 1,
          type: 'game',
          title: '⚾ 試合開始通知',
          message: '阪神 vs 巨人戦が18:00から開始します！',
          timestamp: '2分前',
          read: false
        },
        {
          id: 2,
          type: 'event',
          title: '📅 新しいイベント',
          message: '渋谷Tigers Girlさんが神宮球場観戦会を企画しました',
          timestamp: '1時間前',
          read: false
        },
        {
          id: 3,
          type: 'community',
          title: '🏠 エリア通知',
          message: 'お住まいの新宿区に新しいファンが参加しました',
          timestamp: '3時間前',
          read: true
        }
      ]);
      const [showNotifications, setShowNotifications] = useState(false);

      // Sports Bar State
      const [sportsBars, setSportsBars] = useState([
        { 
          id: 1, 
          name: 'スポーツバー GOAL新宿店', 
          area: '新宿区',
          address: '新宿区新宿3-1-1',
          distance: '0.3km',
          rating: 4.5,
          hasTV: true,
          isOpen: true,
          nextGame: '8/1 18:00',
          tigersEvents: 3,
          capacity: 50,
          reservationRequired: false
        },
        { 
          id: 2, 
          name: 'HUB 渋谷店', 
          area: '渋谷区',
          address: '渋谷区渋谷2-1-1',
          distance: '2.1km',
          rating: 4.2,
          hasTV: true,
          isOpen: true,
          nextGame: '8/1 18:00',
          tigersEvents: 1,
          capacity: 80,
          reservationRequired: true
        },
        { 
          id: 3, 
          name: 'Tigers Cafe 池袋', 
          area: '豊島区',
          address: '豊島区池袋2-1-1',
          distance: '3.5km',
          rating: 4.8,
          hasTV: true,
          isOpen: false,
          nextGame: '8/1 18:00',
          tigersEvents: 5,
          capacity: 30,
          reservationRequired: true
        }
      ]);

      // Authentication Functions
      const handleAuth = () => {
        if (!authData.email || !authData.password) {
          alert('メールアドレスとパスワードを入力してください');
          return;
        }

        if (authMode === 'register') {
          if (!authData.nickname || !authData.area) {
            alert('ニックネームと居住エリアを選択してください');
            return;
          }
        }
        
        const userData = {
          id: Date.now(),
          nickname: authData.nickname || 'Tigers Fan',
          email: authData.email,
          area: authData.area,
          region: authData.region,
          fanHistory: authData.fanHistory || '新米ファン',
          favoritePlayer: authData.favoritePlayer || '佐藤輝明',
          verified: authMode === 'register', // 新規登録時は確認必要
          joinDate: new Date().toLocaleDateString('ja-JP')
        };
        
        setUser(userData);
        setShowAuthModal(false);
        setAuthData({ 
          email: '', password: '', nickname: '', area: '', region: '', 
          fanHistory: '', favoritePlayer: '', residencyProof: null 
        });
      };

      // Area selection handler
      const handleAreaChange = (area, region) => {
        setAuthData({ ...authData, area, region });
      };

      // Post creation
      const createPost = (content, category = 'general') => {
        if (!content.trim() || !user) return;
        
        const post = {
          id: Date.now(),
          user: user.nickname,
          area: user.area,
          region: user.region,
          content: content,
          image: null,
          likes: 0,
          comments: 0,
          timestamp: '今',
          category: category
        };
        setPosts([post, ...posts]);
      };

      // Event creation
      const createEvent = (eventData) => {
        if (!user) return;
        
        const event = {
          id: Date.now(),
          ...eventData,
          organizer: user.nickname,
          organizerArea: user.area,
          participants: 1,
          createdAt: new Date().toLocaleDateString('ja-JP')
        };
        setEvents([event, ...events]);
      };

      // Filter posts by area
      const getFilteredPosts = () => {
        if (selectedArea === '全体') return posts;
        return posts.filter(post => post.area === selectedArea);
      };

      // Filter events by area
      const getFilteredEvents = () => {
        if (selectedArea === '全体') return events;
        return events.filter(event => event.organizerArea === selectedArea);
      };

      // Get unread notifications count
      const unreadCount = notifications.filter(n => !n.read).length;

      // Main render function
      return e('div', { className: 'max-w-md mx-auto bg-gray-50 min-h-screen' },
        // Header
        e('div', { className: 'bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-black sticky top-0 z-10' },
          e('div', { className: 'flex items-center justify-between' },
            e('div', { className: 'flex items-center' },
              e('h1', { className: 'text-lg font-bold mr-2' }, '🐯'),
              e('div', null,
                e('h1', { className: 'text-lg font-bold' }, 'Tokyo Tigers Fan'),
                e('p', { className: 'text-xs opacity-90' }, '東京の阪神ファンコミュニティ')
              )
            ),
            e('div', { className: 'flex items-center space-x-2' },
              user && e('span', { className: 'text-xs bg-black bg-opacity-20 px-2 py-1 rounded' }, user.area),
              e('button', { 
                onClick: () => setShowNotifications(true),
                className: 'relative p-1'
              },
                e(SafeIcon, { icon: getIcon('Bell'), className: 'w-5 h-5', fallback: '🔔' }),
                unreadCount > 0 && e('span', {
                  className: 'absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full min-w-4 h-4 flex items-center justify-center'
                }, unreadCount)
              )
            )
          )
        ),
        
        // Main content
        e('div', { className: 'pb-16' },
          // Render current screen
          currentScreen === 'home' && e(HomeScreen, { 
            gameInfo, getFilteredPosts, selectedArea, setSelectedArea, 
            TOKYO_AREAS, user, createPost 
          }),
          currentScreen === 'events' && e(EventsScreen, { 
            getFilteredEvents, selectedArea, setSelectedArea, 
            TOKYO_AREAS, user, createEvent 
          }),
          currentScreen === 'chat' && e(ChatScreen, { chatRooms, user }),
          currentScreen === 'spots' && e(SpotsScreen, { 
            sportsBars, selectedArea, setSelectedArea, TOKYO_AREAS 
          }),
          currentScreen === 'profile' && e(ProfileScreen, { 
            user, setUser, setShowAuthModal 
          })
        ),
        
        // Bottom navigation
        e('div', { className: 'fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t shadow-lg' },
          e('div', { className: 'flex justify-around py-1' },
            [
              { id: 'home', icon: 'Home', label: 'ホーム', fallback: '🏠' },
              { id: 'events', icon: 'Calendar', label: 'イベント', fallback: '📅' },
              { id: 'chat', icon: 'MessageCircle', label: 'チャット', fallback: '💬' },
              { id: 'spots', icon: 'MapPin', label: 'スポット', fallback: '🏪' },
              { id: 'profile', icon: 'User', label: 'マイページ', fallback: '👤' }
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
                e(SafeIcon, { icon: getIcon(nav.icon), className: 'w-4 h-4', fallback: nav.fallback }),
                e('span', { className: 'text-xs mt-1' }, nav.label)
              )
            )
          )
        ),
        
        // Auth Modal
        showAuthModal && e(AuthModal, { 
          authMode, setAuthMode, authData, setAuthData, 
          handleAuth, setShowAuthModal, TOKYO_AREAS, handleAreaChange 
        }),
        
        // Notifications Modal
        showNotifications && e(NotificationsModal, { 
          notifications, setNotifications, setShowNotifications 
        })
      );
    };

    // Screen Components
    const HomeScreen = ({ gameInfo, getFilteredPosts, selectedArea, setSelectedArea, TOKYO_AREAS, user, createPost }) => {
      const [newPost, setNewPost] = useState('');
      
      return e('div', { className: 'space-y-4 p-4' },
        // Area filter
        e('div', { className: 'bg-white p-3 rounded-lg shadow-sm' },
          e('div', { className: 'flex items-center space-x-2 overflow-x-auto' },
            e('button', {
              onClick: () => setSelectedArea('全体'),
              className: `px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedArea === '全体' ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-700'
              }`
            }, '全体'),
            ...Object.entries(TOKYO_AREAS).flatMap(([region, areas]) =>
              areas.map(area =>
                e('button', {
                  key: area,
                  onClick: () => setSelectedArea(area),
                  className: `px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedArea === area ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-700'
                  }`
                }, area)
              )
            )
          )
        ),
        
        // Game info
        gameInfo.currentGame.isLive 
          ? e('div', { className: 'bg-gradient-to-r from-green-400 to-green-500 p-4 rounded-lg text-white shadow' },
              e('div', { className: 'flex items-center justify-between' },
                e('div', null,
                  e('h3', { className: 'font-bold text-lg' }, '🔴 LIVE'),
                  e('p', { className: 'text-lg font-bold' }, `阪神 ${gameInfo.currentGame.score.hanshin} - ${gameInfo.currentGame.score.opponent} 巨人`),
                  e('p', { className: 'text-sm' }, gameInfo.currentGame.inning),
                  e('p', { className: 'text-xs opacity-90' }, `最終更新: ${gameInfo.currentGame.lastUpdate}`)
                ),
                e(SafeIcon, { icon: getIcon('Trophy'), className: 'w-8 h-8', fallback: '🏆' })
              )
            )
          : e('div', { className: 'bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-lg text-black shadow' },
              e('div', { className: 'flex items-center justify-between' },
                e('div', null,
                  e('h3', { className: 'font-bold' }, '次の試合'),
                  e('p', { className: 'font-semibold' }, `${gameInfo.nextGame.date} ${gameInfo.nextGame.time} vs ${gameInfo.nextGame.opponent}`),
                  e('p', { className: 'text-sm' }, gameInfo.nextGame.venue)
                ),
                e(SafeIcon, { icon: getIcon('Trophy'), className: 'w-8 h-8', fallback: '🏆' })
              )
            ),
        
        // Post creation (if logged in)
        user && e('div', { className: 'bg-white p-4 rounded-lg shadow-sm' },
          e('div', { className: 'flex items-start space-x-3' },
            e('div', { className: 'w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm' }, '🐯'),
            e('div', { className: 'flex-1' },
              e('textarea', {
                value: newPost,
                onChange: (e) => setNewPost(e.target.value),
                placeholder: `${user.area}のファンとして何か投稿しよう！🐯`,
                className: 'w-full p-2 border rounded resize-none',
                rows: 2
              }),
              e('div', { className: 'flex justify-between items-center mt-2' },
                e('span', { className: 'text-xs text-gray-500' }, `投稿エリア: ${user.area}`),
                e('button', {
                  onClick: () => {
                    createPost(newPost);
                    setNewPost('');
                  },
                  disabled: !newPost.trim(),
                  className: 'bg-yellow-500 text-black px-3 py-1 rounded text-sm font-medium disabled:opacity-50'
                }, '投稿')
              )
            )
          )
        ),
        
        // Posts feed
        e('div', { className: 'space-y-3' },
          getFilteredPosts().map(post => 
            e('div', { key: post.id, className: 'bg-white rounded-lg shadow-sm overflow-hidden' },
              e('div', { className: 'p-4' },
                e('div', { className: 'flex items-center mb-3' },
                  e('div', { className: 'w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3 text-sm' }, '🐯'),
                  e('div', { className: 'flex-1' },
                    e('p', { className: 'font-semibold text-sm' }, post.user),
                    e('div', { className: 'flex items-center text-xs text-gray-500' },
                      e('span', null, post.area),
                      e('span', { className: 'mx-1' }, '•'),
                      e('span', null, post.timestamp),
                      post.category !== 'general' && e('span', {
                        className: `ml-2 px-2 py-0.5 rounded text-xs ${
                          post.category === 'game' ? 'bg-green-100 text-green-800' :
                          post.category === 'event' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`
                      }, post.category === 'game' ? '試合' : post.category === 'event' ? 'イベント' : '一般')
                    )
                  )
                ),
                e('p', { className: 'mb-3 text-sm leading-relaxed' }, post.content),
                post.image && e('div', { className: 'mb-3' },
                  e('img', { src: post.image, alt: '投稿画像', className: 'w-full h-48 object-cover rounded' })
                )
              ),
              e('div', { className: 'px-4 py-2 bg-gray-50 flex items-center justify-between' },
                e('div', { className: 'flex items-center space-x-4' },
                  e('button', { className: 'flex items-center space-x-1 text-gray-600 hover:text-red-500 text-sm' },
                    e(SafeIcon, { icon: getIcon('Heart'), className: 'w-4 h-4', fallback: '♥' }),
                    e('span', null, post.likes)
                  ),
                  e('button', { className: 'flex items-center space-x-1 text-gray-600 hover:text-blue-500 text-sm' },
                    e(SafeIcon, { icon: getIcon('MessageCircle'), className: 'w-4 h-4', fallback: '💬' }),
                    e('span', null, post.comments)
                  )
                ),
                e('button', { className: 'text-gray-600 hover:text-gray-800' },
                  e(SafeIcon, { icon: getIcon('Share'), className: 'w-4 h-4', fallback: '📤' })
                )
              )
            )
          )
        )
      );
    };

    const EventsScreen = ({ getFilteredEvents, selectedArea, setSelectedArea, TOKYO_AREAS, user, createEvent }) => {
      return e('div', { className: 'space-y-4 p-4' },
        // Header
        e('div', { className: 'flex justify-between items-center' },
          e('h2', { className: 'text-xl font-bold' }, '🎉 イベント'),
          user && e('button', { 
            className: 'bg-yellow-500 text-black p-2 rounded-full shadow',
            onClick: () => alert('イベント作成機能（実装予定）')
          },
            e(SafeIcon, { icon: getIcon('Plus'), className: 'w-5 h-5', fallback: '+' })
          )
        ),
        
        // Area filter
        e('div', { className: 'bg-white p-3 rounded-lg shadow-sm' },
          e('div', { className: 'flex items-center space-x-2 overflow-x-auto' },
            e('button', {
              onClick: () => setSelectedArea('全体'),
              className: `px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedArea === '全体' ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-700'
              }`
            }, '全体'),
            ...Object.entries(TOKYO_AREAS).flatMap(([region, areas]) =>
              areas.map(area =>
                e('button', {
                  key: area,
                  onClick: () => setSelectedArea(area),
                  className: `px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedArea === area ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-700'
                  }`
                }, area)
              )
            )
          )
        ),
        
        // Events list
        e('div', { className: 'space-y-3' },
          getFilteredEvents().map(event => 
            e('div', { key: event.id, className: 'bg-white rounded-lg shadow-sm p-4' },
              e('div', { className: 'flex items-start justify-between mb-3' },
                e('div', { className: 'flex-1' },
                  e('h3', { className: 'font-bold text-lg mb-1' }, event.title),
                  e('div', { className: 'flex items-center text-sm text-gray-600 mb-1' },
                    e('span', {
                      className: `px-2 py-0.5 rounded text-xs mr-2 ${
                        event.category === 'game' ? 'bg-green-100 text-green-800' :
                        event.category === 'watch' ? 'bg-blue-100 text-blue-800' :
                        event.category === 'tour' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`
                    }, 
                      event.category === 'game' ? '観戦' : 
                      event.category === 'watch' ? 'TV観戦' :
                      event.category === 'tour' ? 'ツアー' : 'その他'
                    ),
                    e('span', null, `by ${event.organizer}（${event.organizerArea}）`)
                  )
                ),
                e('div', { className: 'text-right' },
                  e('div', { className: 'text-lg font-bold text-yellow-600' }, `${event.participants}/${event.maxParticipants}`),
                  e('div', { className: 'text-xs text-gray-500' }, '参加者')
                )
              ),
              
              e('div', { className: 'space-y-2 mb-4' },
                e('div', { className: 'flex items-center text-sm' },
                  e(SafeIcon, { icon: getIcon('Calendar'), className: 'w-4 h-4 mr-2 text-gray-500', fallback: '📅' }),
                  e('span', null, `${event.date} ${event.time}`)
                ),
                e('div', { className: 'flex items-center text-sm' },
                  e(SafeIcon, { icon: getIcon('MapPin'), className: 'w-4 h-4 mr-2 text-gray-500', fallback: '📍' }),
                  e('span', null, event.location)
                ),
                event.meetingPoint && e('div', { className: 'flex items-center text-sm' },
                  e(SafeIcon, { icon: getIcon('Users'), className: 'w-4 h-4 mr-2 text-gray-500', fallback: '👥' }),
                  e('span', null, `集合: ${event.meetingPoint}`)
                )
              ),
              
              e('p', { className: 'text-sm text-gray-700 mb-3' }, event.description),
              
              e('div', { className: 'border-t pt-3 mt-3' },
                e('div', { className: 'flex items-center justify-between text-xs text-gray-500 mb-2' },
                  e('span', null, event.requirements),
                  e('span', null, event.fee)
                ),
                e('div', { className: 'flex items-center justify-between' },
                  e('div', { className: 'flex items-center space-x-2' },
                    event.participants < event.maxParticipants 
                      ? e('span', { className: 'text-green-600 text-sm font-medium' }, '参加募集中')
                      : e('span', { className: 'text-red-600 text-sm font-medium' }, '満員')
                  ),
                  user && e('button', { 
                    className: `px-4 py-2 rounded text-sm font-medium ${
                      event.participants < event.maxParticipants
                        ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`,
                    disabled: event.participants >= event.maxParticipants,
                    onClick: () => alert('参加申請機能（実装予定）')
                  }, event.participants < event.maxParticipants ? '参加する' : '満員')
                )
              )
            )
          )
        )
      );
    };

    const ChatScreen = ({ chatRooms, user }) => {
      return e('div', { className: 'space-y-2 p-4' },
        e('h2', { className: 'text-xl font-bold mb-4' }, '💬 チャット'),
        
        !user && e('div', { className: 'bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center' },
          e('p', { className: 'text-yellow-800' }, 'チャット機能を利用するにはログインしてください')
        ),
        
        chatRooms.map(room => 
          e('button', {
            key: room.id,
            onClick: () => alert('チャット機能（実装予定）'),
            className: 'w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between hover:bg-gray-50'
          },
            e('div', { className: 'flex items-center' },
              e('div', { className: 'w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-3' },
                room.category === 'game' ? '⚾' :
                room.category === 'area' ? '📍' :
                room.category === 'player' ? '⭐' :
                room.category === 'event' ? '🎉' : '💬'
              ),
              e('div', { className: 'text-left' },
                e('h3', { className: 'font-semibold text-sm' }, room.name),
                e('p', { className: 'text-sm text-gray-500' }, room.lastMessage),
                room.area !== '全体' && e('p', { className: 'text-xs text-gray-400' }, room.area)
              )
            ),
            e('div', { className: 'flex items-center space-x-2' },
              room.unread > 0 && e('div', { className: 'bg-red-500 text-white text-xs px-2 py-1 rounded-full' }, room.unread),
              e(SafeIcon, { icon: getIcon('ChevronRight'), className: 'w-4 h-4 text-gray-400', fallback: '→' })
            )
          )
        )
      );
    };

    const SpotsScreen = ({ sportsBars, selectedArea, setSelectedArea, TOKYO_AREAS }) => {
      return e('div', { className: 'space-y-4 p-4' },
        e('h2', { className: 'text-xl font-bold' }, '🏪 応援スポット'),
        
        // Area filter
        e('div', { className: 'bg-white p-3 rounded-lg shadow-sm' },
          e('div', { className: 'flex items-center space-x-2 overflow-x-auto' },
            e('button', {
              onClick: () => setSelectedArea('全体'),
              className: `px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedArea === '全体' ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-700'
              }`
            }, '全体'),
            ...Object.entries(TOKYO_AREAS).flatMap(([region, areas]) =>
              areas.map(area =>
                e('button', {
                  key: area,
                  onClick: () => setSelectedArea(area),
                  className: `px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedArea === area ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-700'
                  }`
                }, area)
              )
            )
          )
        ),
        
        // Sports bars list
        e('div', { className: 'space-y-3' },
          sportsBars
            .filter(bar => selectedArea === '全体' || bar.area === selectedArea)
            .map(bar => 
              e('div', { key: bar.id, className: 'bg-white rounded-lg shadow-sm p-4' },
                e('div', { className: 'flex items-start justify-between mb-3' },
                  e('div', { className: 'flex-1' },
                    e('h3', { className: 'font-bold text-lg' }, bar.name),
                    e('div', { className: 'flex items-center mt-1' },
                      e(SafeIcon, { icon: getIcon('Star'), className: 'w-4 h-4 text-yellow-500 mr-1', fallback: '⭐' }),
                      e('span', { className: 'text-sm font-medium' }, bar.rating),
                      e('span', { className: 'text-sm text-gray-500 ml-2' }, `${bar.distance} • ${bar.area}`)
                    )
                  ),
                  e('div', { className: 'text-right' },
                    e('span', {
                      className: `px-2 py-1 rounded text-xs font-medium ${
                        bar.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`
                    }, bar.isOpen ? '営業中' : '営業時間外'),
                    bar.tigersEvents > 0 && e('div', { className: 'text-xs text-yellow-600 mt-1' }, 
                      `阪神イベント${bar.tigersEvents}件`
                    )
                  )
                ),
                
                e('p', { className: 'text-sm text-gray-600 mb-3' }, bar.address),
                
                e('div', { className: 'grid grid-cols-2 gap-4 text-sm mb-3' },
                  e('div', { className: 'flex items-center' },
                    e('span', { className: 'font-medium mr-2' }, '📺'),
                    e('span', null, bar.hasTV ? '阪神戦中継あり' : '中継なし')
                  ),
                  e('div', { className: 'flex items-center' },
                    e('span', { className: 'font-medium mr-2' }, '👥'),
                    e('span', null, `定員${bar.capacity}名`)
                  ),
                  e('div', { className: 'flex items-center' },
                    e('span', { className: 'font-medium mr-2' }, '📅'),
                    e('span', null, `次の試合: ${bar.nextGame}`)
                  ),
                  e('div', { className: 'flex items-center' },
                    e('span', { className: 'font-medium mr-2' }, '📞'),
                    e('span', null, bar.reservationRequired ? '要予約' : '予約不要')
                  )
                ),
                
                e('div', { className: 'flex items-center justify-between pt-3 border-t' },
                  e('button', { 
                    className: 'text-blue-600 text-sm font-medium',
                    onClick: () => alert('詳細情報（実装予定）')
                  }, '詳細を見る'),
                  e('button', { 
                    className: 'bg-yellow-500 text-black px-4 py-2 rounded text-sm font-medium',
                    onClick: () => alert('予約・問い合わせ機能（実装予定）')
                  }, bar.reservationRequired ? '予約する' : '問い合わせ')
                )
              )
            )
        )
      );
    };

    const ProfileScreen = ({ user, setUser, setShowAuthModal }) => {
      return e('div', { className: 'space-y-4 p-4' },
        user ? e('div', null,
          // User profile
          e('div', { className: 'bg-white rounded-lg shadow-sm p-6 text-center' },
            e('div', { className: 'w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl' }, '🐯'),
            e('h2', { className: 'text-xl font-bold mb-2' }, user.nickname),
            e('div', { className: 'space-y-1 text-sm text-gray-600' },
              e('p', null, `📍 ${user.area}（${user.region}）`),
              e('p', null, `⚾ ファン歴: ${user.fanHistory}`),
              e('p', null, `⭐ 推し選手: ${user.favoritePlayer}`),
              e('p', null, `📅 参加日: ${user.joinDate}`)
            ),
            user.verified && e('div', { className: 'mt-3' },
              e('span', { className: 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium' }, '✓ 東京都内居住確認済み')
            )
          ),
          
          // Stats
          e('div', { className: 'bg-white rounded-lg shadow-sm p-4' },
            e('h3', { className: 'font-bold mb-3' }, '📊 活動統計'),
            e('div', { className: 'grid grid-cols-3 gap-4 text-center' },
              e('div', null,
                e('div', { className: 'text-lg font-bold text-yellow-600' }, '12'),
                e('div', { className: 'text-xs text-gray-500' }, '投稿数')
              ),
              e('div', null,
                e('div', { className: 'text-lg font-bold text-yellow-600' }, '3'),
                e('div', { className: 'text-xs text-gray-500' }, 'イベント参加')
              ),
              e('div', null,
                e('div', { className: 'text-lg font-bold text-yellow-600' }, '45'),
                e('div', { className: 'text-xs text-gray-500' }, 'いいね獲得')
              )
            )
          ),
          
          // Recent activity
          e('div', { className: 'bg-white rounded-lg shadow-sm p-4' },
            e('h3', { className: 'font-bold mb-3' }, '📈 最近の活動'),
            e('div', { className: 'space-y-2 text-sm' },
              e('div', { className: 'flex items-center justify-between' },
                e('span', null, '神宮球場観戦会に参加'),
                e('span', { className: 'text-gray-500' }, '2日前')
              ),
              e('div', { className: 'flex items-center justify-between' },
                e('span', null, '新宿エリアチャットに投稿'),
                e('span', { className: 'text-gray-500' }, '3日前')
              ),
              e('div', { className: 'flex items-center justify-between' },
                e('span', null, '甲子園遠征ツアーに申込'),
                e('span', { className: 'text-gray-500' }, '1週間前')
              )
            )
          ),
          
          // Settings
          e('div', { className: 'bg-white rounded-lg shadow-sm p-4' },
            e('h3', { className: 'font-bold mb-3' }, '⚙️ 設定'),
            e('div', { className: 'space-y-3' },
              e('button', { 
                className: 'w-full text-left py-2 px-3 rounded hover:bg-gray-50',
                onClick: () => alert('プロフィール編集（実装予定）')
              }, '📝 プロフィール編集'),
              e('button', { 
                className: 'w-full text-left py-2 px-3 rounded hover:bg-gray-50',
                onClick: () => alert('通知設定（実装予定）')
              }, '🔔 通知設定'),
              e('button', { 
                className: 'w-full text-left py-2 px-3 rounded hover:bg-gray-50',
                onClick: () => alert('プライバシー設定（実装予定）')
              }, '🔒 プライバシー設定')
            )
          ),
          
          // Logout
          e('button', {
            onClick: () => {
              setUser(null);
              alert('ログアウトしました');
            },
            className: 'w-full bg-red-500 text-white p-3 rounded-lg font-medium'
          }, 'ログアウト')
        ) : 
        // Not logged in
        e('div', { className: 'bg-white rounded-lg shadow-sm p-6 text-center' },
          e('div', { className: 'w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-xl' }, '🐯'),
          e('h2', { className: 'text-xl font-bold mb-4' }, 'ログインしてください'),
          e('p', { className: 'text-gray-600 mb-6 leading-relaxed' }, 
            '東京の阪神ファンと繋がって、一緒に応援しましょう！\nイベント参加やチャット機能を利用できます。'
          ),
          e('button', {
            onClick: () => setShowAuthModal(true),
            className: 'bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold'
          }, 'ログイン / 新規登録')
        )
      );
    };

    // Modal Components
    const AuthModal = ({ authMode, setAuthMode, authData, setAuthData, handleAuth, setShowAuthModal, TOKYO_AREAS, handleAreaChange }) => {
      return e('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4' },
        e('div', { className: 'bg-white rounded-lg w-full max-w-md max-h-screen overflow-y-auto' },
          e('div', { className: 'p-6' },
            e('div', { className: 'flex items-center justify-between mb-4' },
              e('h2', { className: 'text-xl font-bold' }, 
                authMode === 'login' ? 'ログイン' : '新規登録'
              ),
              e('button', {
                onClick: () => setShowAuthModal(false),
                className: 'text-gray-500 hover:text-gray-700'
              }, e(SafeIcon, { icon: getIcon('X'), className: 'w-5 h-5', fallback: '✕' }))
            ),
            
            e('div', { className: 'space-y-4' },
              e('input', {
                type: 'email',
                placeholder: 'メールアドレス',
                value: authData.email,
                onChange: (e) => setAuthData({...authData, email: e.target.value}),
                className: 'w-full p-3 border rounded-lg',
                required: true
              }),
              e('input', {
                type: 'password',
                placeholder: 'パスワード',
                value: authData.password,
                onChange: (e) => setAuthData({...authData, password: e.target.value}),
                className: 'w-full p-3 border rounded-lg',
                required: true
              }),
              
              authMode === 'register' && e('div', { className: 'space-y-4' },
                e('input', {
                  type: 'text',
                  placeholder: 'ニックネーム',
                  value: authData.nickname,
                  onChange: (e) => setAuthData({...authData, nickname: e.target.value}),
                  className: 'w-full p-3 border rounded-lg',
                  required: true
                }),
                
                // Region selection
                e('div', null,
                  e('label', { className: 'block text-sm font-medium mb-2' }, '居住地域'),
                  e('select', {
                    value: authData.region,
                    onChange: (e) => {
                      const region = e.target.value;
                      setAuthData({...authData, region, area: ''});
                    },
                    className: 'w-full p-3 border rounded-lg',
                    required: true
                  },
                    e('option', { value: '' }, '地域を選択'),
                    Object.keys(TOKYO_AREAS).map(region =>
                      e('option', { key: region, value: region }, region)
                    )
                  )
                ),
                
                // Area selection
                authData.region && e('div', null,
                  e('label', { className: 'block text-sm font-medium mb-2' }, '居住エリア'),
                  e('select', {
                    value: authData.area,
                    onChange: (e) => handleAreaChange(e.target.value, authData.region),
                    className: 'w-full p-3 border rounded-lg',
                    required: true
                  },
                    e('option', { value: '' }, 'エリアを選択'),
                    TOKYO_AREAS[authData.region].map(area =>
                      e('option', { key: area, value: area }, area)
                    )
                  )
                ),
                
                e('select', {
                  value: authData.fanHistory,
                  onChange: (e) => setAuthData({...authData, fanHistory: e.target.value}),
                  className: 'w-full p-3 border rounded-lg'
                },
                  e('option', { value: '' }, 'ファン歴を選択'),
                  e('option', { value: '新米ファン' }, '新米ファン（1年未満）'),
                  e('option', { value: '3年' }, '3年'),
                  e('option', { value: '5年' }, '5年'),
                  e('option', { value: '10年' }, '10年'),
                  e('option', { value: '15年以上' }, '15年以上'),
                  e('option', { value: '生まれた時から' }, '生まれた時から')
                ),
                
                e('input', {
                  type: 'text',
                  placeholder: '推し選手（例：佐藤輝明）',
                  value: authData.favoritePlayer,
                  onChange: (e) => setAuthData({...authData, favoritePlayer: e.target.value}),
                  className: 'w-full p-3 border rounded-lg'
                }),
                
                // Residency verification notice
                e('div', { className: 'bg-yellow-50 border border-yellow-200 rounded-lg p-3' },
                  e('div', { className: 'flex items-start' },
                    e('span', { className: 'text-yellow-600 mr-2' }, '⚠️'),
                    e('div', { className: 'text-sm' },
                      e('p', { className: 'font-medium text-yellow-800 mb-1' }, '東京都内居住確認について'),
                      e('p', { className: 'text-yellow-700' }, 
                        '本アプリは東京都内居住者限定です。登録後、居住確認のため住所証明書の提出をお願いする場合があります。'
                      )
                    )
                  )
                )
              ),
              
              e('button', {
                onClick: handleAuth,
                className: 'w-full bg-yellow-500 text-black p-3 rounded-lg font-bold hover:bg-yellow-600'
              }, authMode === 'login' ? 'ログイン' : '登録する'),
              
              e('div', { className: 'text-center' },
                e('button', {
                  onClick: () => setAuthMode(authMode === 'login' ? 'register' : 'login'),
                  className: 'text-blue-600 underline text-sm'
                }, authMode === 'login' ? '新規登録はこちら' : 'ログインはこちら')
              )
            )
          )
        )
      );
    };

    const NotificationsModal = ({ notifications, setNotifications, setShowNotifications }) => {
      const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        ));
      };

      return e('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4' },
        e('div', { className: 'bg-white rounded-lg w-full max-w-md max-h-96 overflow-hidden' },
          e('div', { className: 'p-4 border-b flex items-center justify-between' },
            e('h2', { className: 'text-lg font-bold' }, '🔔 通知'),
            e('button', { onClick: () => setShowNotifications(false) },
              e(SafeIcon, { icon: getIcon('X'), className: 'w-5 h-5', fallback: '✕' })
            )
          ),
          e('div', { className: 'overflow-y-auto max-h-80' },
            notifications.length === 0 
              ? e('div', { className: 'p-6 text-center text-gray-500' }, '通知はありません')
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
                        e('div', { className: 'flex items-center mb-1' },
                          e('span', {
                            className: `w-2 h-2 rounded-full mr-2 ${
                              notif.type === 'game' ? 'bg-green-500' :
                              notif.type === 'event' ? 'bg-blue-500' :
                              notif.type === 'community' ? 'bg-purple-500' : 'bg-yellow-500'
                            }`
                          }),
                          e('h3', { className: 'font-semibold text-sm' }, notif.title)
                        ),
                        e('p', { className: 'text-sm text-gray-600 mb-1' }, notif.message),
                        e('p', { className: 'text-xs text-gray-400' }, notif.timestamp)
                      ),
                      !notif.read && e('div', { className: 'w-2 h-2 bg-red-500 rounded-full ml-2' })
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
      
      console.log('Tokyo Tigers Fan Community App successfully rendered!');
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