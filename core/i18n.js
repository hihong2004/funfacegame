/**
 * Fun Face Game - 多語言系統 (i18n)
 * @version 1.0.0
 * @date 2024-12-30
 * 支援 8 種語言：en, zh-TW, zh-CN, ja, de, es, id, vi
 */

const I18n = (function() {
  'use strict';
  let currentLanguage = null;

  const translations = {
    en: {_langName: 'English', 'app.title': 'Fun Face Game', 'app.tagline': 'Make Every Face Fun!', 'app.install': 'Install App', 'app.back': 'Back', 'app.close': 'Close', 'app.ok': 'OK', 'app.cancel': 'Cancel', 'app.save': 'Save', 'app.delete': 'Delete', 'app.loading': 'Loading...', 'app.error': 'Error', 'app.success': 'Success', 'game.faceCrush': 'Face Crush', 'game.faceSlicer': 'Face Slicer', 'game.whacAFace': 'Whac-A-Face', 'game.facePop': 'Face Pop', 'game.faceStack': 'Face Stack', 'game.faceMemory': 'Face Memory', 'game.comingSoon': 'Coming Soon', 'footer.aboutUs': 'About Us', 'footer.privacy': 'Privacy Policy', 'footer.terms': 'Terms of Service', 'footer.contact': 'Contact Us', 'footer.copyright': '© 2024 Fun Face Game. All rights reserved.', 'about.title': 'About Us', 'about.content': 'We leverage cutting-edge AI technology to create hilarious moments for families and friends.', 'privacy.title': 'Privacy Policy', 'privacy.content': 'Your privacy is our priority. All face photos are processed entirely within your browser and are never uploaded to our servers.', 'contact.title': 'Contact Us', 'contact.content': 'Got questions or feedback? We\'d love to hear from you!', 'contact.email': 'Email: support@funfacegame.com', 'photo.title': 'Upload Photos', 'photo.subtitle': 'Upload up to 6 photos', 'photo.mainCharacter': 'Main Character', 'photo.tapToUpload': 'Tap to upload', 'photo.uploadSuccess': 'Photo uploaded successfully!', 'photo.uploadError': 'Failed to upload photo', 'theme.title': 'Choose a Theme', 'theme.birthday': 'Birthday Party', 'theme.romance': 'Romance', 'theme.party': 'Party', 'theme.pet': 'Pet', 'theme.prank': 'Prank', 'theme.selected': 'Selected', 'theme.locked': 'Locked', 'game.start': 'Start Game', 'game.pause': 'Pause', 'game.resume': 'Resume', 'game.restart': 'Restart', 'game.quit': 'Quit', 'game.level': 'Level', 'game.score': 'Score', 'game.highScore': 'High Score', 'game.moves': 'Moves', 'game.time': 'Time', 'game.combo': 'Combo', 'game.perfect': 'Perfect!', 'game.gameover': 'Game Over', 'game.levelComplete': 'Level Complete!', 'game.nextLevel': 'Next Level', 'game.tryAgain': 'Try Again', 'share.title': 'Share Your Score', 'share.download': 'Download Image', 'share.copyLink': 'Copy Link', 'share.linkCopied': 'Link copied!', 'payment.removeAds': 'Remove Ads', 'payment.purchase': 'Purchase', 'error.networkError': 'Network error. Please check your connection.', 'error.loadFailed': 'Failed to load. Please try again.', 'language.select': 'Select Language', 'language.current': 'Current Language'},
    'zh-TW': {_langName: '繁體中文', 'app.title': '趣味臉部遊戲', 'app.tagline': '讓每張臉都變得有趣！', 'app.install': '安裝遊戲', 'app.back': '返回', 'app.close': '關閉', 'app.ok': '確定', 'app.cancel': '取消', 'app.save': '儲存', 'app.delete': '刪除', 'app.loading': '載入中...', 'app.error': '錯誤', 'app.success': '成功', 'game.faceCrush': '臉部粉碎', 'game.faceSlicer': '臉部切切樂', 'game.whacAFace': '打臉鼠', 'game.facePop': '臉部氣球', 'game.faceStack': '臉部疊疊樂', 'game.faceMemory': '臉部記憶', 'game.comingSoon': '敬請期待', 'footer.aboutUs': '關於我們', 'footer.privacy': '隱私權政策', 'footer.terms': '服務條款', 'footer.contact': '聯絡我們', 'footer.copyright': '© 2024 趣味臉部遊戲。版權所有。', 'about.title': '關於我們', 'about.content': '我們利用最先進的 AI 科技，為家人和朋友創造歡樂時刻。', 'privacy.title': '隱私權政策', 'privacy.content': '我們極度重視您的隱私。所有臉部照片均直接在您的瀏覽器中處理，絕不會上傳至我們的伺服器。', 'contact.title': '聯絡我們', 'contact.content': '有任何問題或建議嗎？我們很樂意聽取您的意見！', 'contact.email': '電子郵件：support@funfacegame.com', 'photo.title': '上傳照片', 'photo.subtitle': '最多可上傳 6 張照片', 'photo.mainCharacter': '主角', 'photo.tapToUpload': '點擊上傳', 'photo.uploadSuccess': '照片上傳成功！', 'photo.uploadError': '照片上傳失敗', 'theme.title': '選擇主題', 'theme.birthday': '生日派對', 'theme.romance': '浪漫告白', 'theme.party': '歡樂派對', 'theme.pet': '萌寵', 'theme.prank': '整人', 'theme.selected': '已選擇', 'theme.locked': '已鎖定', 'game.start': '開始遊戲', 'game.pause': '暫停', 'game.resume': '繼續', 'game.restart': '重新開始', 'game.quit': '離開', 'game.level': '關卡', 'game.score': '分數', 'game.highScore': '最高分', 'game.moves': '步數', 'game.time': '時間', 'game.combo': '連擊', 'game.perfect': '完美！', 'game.gameover': '遊戲結束', 'game.levelComplete': '過關了！', 'game.nextLevel': '下一關', 'game.tryAgain': '再試一次', 'share.title': '分享你的分數', 'share.download': '下載圖片', 'share.copyLink': '複製連結', 'share.linkCopied': '連結已複製！', 'payment.removeAds': '移除廣告', 'payment.purchase': '購買', 'error.networkError': '網路錯誤，請檢查您的連線。', 'error.loadFailed': '載入失敗，請再試一次。', 'language.select': '選擇語言', 'language.current': '目前語言'},
    'zh-CN': {_langName: '简体中文', 'app.title': '趣味脸部游戏', 'app.tagline': '让每张脸都变得有趣！', 'app.install': '安装游戏', 'app.back': '返回', 'app.close': '关闭', 'app.ok': '确定', 'app.cancel': '取消', 'app.save': '保存', 'app.delete': '删除', 'app.loading': '加载中...', 'app.error': '错误', 'app.success': '成功', 'game.faceCrush': '脸部粉碎', 'game.faceSlicer': '脸部切切乐', 'game.whacAFace': '打脸鼠', 'game.facePop': '脸部气球', 'game.faceStack': '脸部叠叠乐', 'game.faceMemory': '脸部记忆', 'game.comingSoon': '敬请期待', 'footer.aboutUs': '关于我们', 'footer.privacy': '隐私权政策', 'footer.terms': '服务条款', 'footer.contact': '联系我们', 'footer.copyright': '© 2024 趣味脸部游戏。版权所有。', 'about.title': '关于我们', 'about.content': '我们利用先进的 AI 科技，为家人和朋友创造欢乐时刻。', 'privacy.title': '隐私权政策', 'privacy.content': '我们极度重视您的隐私。所有脸部照片均直接在您的浏览器中处理，绝不会上传至我们的服务器。', 'contact.title': '联系我们', 'contact.content': '有任何问题或建议吗？我们很乐意听取您的意见！', 'contact.email': '电子邮件：support@funfacegame.com', 'photo.title': '上传照片', 'photo.subtitle': '最多可上传 6 张照片', 'photo.mainCharacter': '主角', 'photo.tapToUpload': '点击上传', 'photo.uploadSuccess': '照片上传成功！', 'photo.uploadError': '照片上传失败', 'theme.title': '选择主题', 'theme.birthday': '生日派对', 'theme.romance': '浪漫告白', 'theme.party': '欢乐派对', 'theme.pet': '萌宠', 'theme.prank': '整人', 'theme.selected': '已选择', 'theme.locked': '已锁定', 'game.start': '开始游戏', 'game.pause': '暂停', 'game.resume': '继续', 'game.restart': '重新开始', 'game.quit': '离开', 'game.level': '关卡', 'game.score': '分数', 'game.highScore': '最高分', 'game.moves': '步数', 'game.time': '时间', 'game.combo': '连击', 'game.perfect': '完美！', 'game.gameover': '游戏结束', 'game.levelComplete': '过关了！', 'game.nextLevel': '下一关', 'game.tryAgain': '再试一次', 'share.title': '分享你的分数', 'share.download': '下载图片', 'share.copyLink': '复制链接', 'share.linkCopied': '链接已复制！', 'payment.removeAds': '移除广告', 'payment.purchase': '购买', 'error.networkError': '网络错误，请检查您的连接。', 'error.loadFailed': '加载失败，请再试一次。', 'language.select': '选择语言', 'language.current': '当前语言'},
    ja: {_langName: '日本語', 'app.title': '変顔ゲーム', 'app.tagline': 'すべての顔を楽しく！', 'app.install': 'インストール', 'app.back': '戻る', 'app.close': '閉じる', 'app.ok': 'OK', 'app.cancel': 'キャンセル', 'app.save': '保存', 'app.delete': '削除', 'app.loading': '読み込み中...', 'app.error': 'エラー', 'app.success': '成功', 'game.faceCrush': 'フェイス・クラッシュ', 'game.faceSlicer': 'フェイス・スライサー', 'game.whacAFace': 'モグラたたき顔', 'game.facePop': 'フェイス・バルーン', 'game.faceStack': 'フェイス・スタック', 'game.faceMemory': '顔記憶', 'game.comingSoon': '近日公開', 'footer.aboutUs': '会社概要', 'footer.privacy': 'プライバシーポリシー', 'footer.terms': '利用規約', 'footer.contact': 'お問い合わせ', 'footer.copyright': '© 2024 変顔ゲーム。', 'about.title': '会社概要', 'about.content': '最新のAI技術を活用して、家族や友人に笑いを提供します。', 'privacy.title': 'プライバシーポリシー', 'privacy.content': 'お客様のプライバシーは私たちの最優先事項です。すべての顔写真はブラウザ内で完全に処理されます。', 'contact.title': 'お問い合わせ', 'contact.content': 'ご質問やフィードバックがございますか？', 'contact.email': 'メール：support@funfacegame.com', 'photo.title': '写真をアップロード', 'photo.subtitle': '最大6枚まで', 'photo.mainCharacter': '主役', 'photo.tapToUpload': 'タップしてアップロード', 'photo.uploadSuccess': '写真をアップロードしました！', 'photo.uploadError': 'アップロードに失敗しました', 'theme.title': 'テーマを選択', 'theme.birthday': '誕生日パーティー', 'theme.romance': 'ロマンス', 'theme.party': 'パーティー', 'theme.pet': 'ペット', 'theme.prank': 'いたずら', 'theme.selected': '選択済み', 'theme.locked': 'ロック中', 'game.start': 'ゲーム開始', 'game.pause': '一時停止', 'game.resume': '再開', 'game.restart': 'リスタート', 'game.quit': '終了', 'game.level': 'レベル', 'game.score': 'スコア', 'game.highScore': 'ハイスコア', 'game.moves': '手数', 'game.time': '時間', 'game.combo': 'コンボ', 'game.perfect': 'パーフェクト！', 'game.gameover': 'ゲームオーバー', 'game.levelComplete': 'レベルクリア！', 'game.nextLevel': '次のレベル', 'game.tryAgain': 'もう一度', 'share.title': 'スコアを共有', 'share.download': '画像をダウンロード', 'share.copyLink': 'リンクをコピー', 'share.linkCopied': 'リンクをコピーしました！', 'payment.removeAds': '広告を削除', 'payment.purchase': '購入', 'error.networkError': 'ネットワークエラー。接続を確認してください。', 'error.loadFailed': '読み込みに失敗しました。', 'language.select': '言語を選択', 'language.current': '現在の言語'},
    de: {_langName: 'Deutsch', 'app.title': 'Lustiges Gesichtsspiel', 'app.tagline': 'Mach jedes Gesicht lustig!', 'app.install': 'App installieren', 'app.back': 'Zurück', 'app.close': 'Schließen', 'app.ok': 'OK', 'app.cancel': 'Abbrechen', 'app.save': 'Speichern', 'app.delete': 'Löschen', 'app.loading': 'Lädt...', 'app.error': 'Fehler', 'app.success': 'Erfolg', 'game.faceCrush': 'Gesichts-Crush', 'game.faceSlicer': 'Gesichts-Schneider', 'game.whacAFace': 'Gesichts-Hammerspiel', 'game.facePop': 'Gesichts-Balloon', 'game.faceStack': 'Gesichts-Stapel', 'game.faceMemory': 'Gesichts-Memory', 'game.comingSoon': 'Demnächst', 'footer.aboutUs': 'Über uns', 'footer.privacy': 'Datenschutz', 'footer.terms': 'Nutzungsbedingungen', 'footer.contact': 'Kontakt', 'footer.copyright': '© 2024 Lustiges Gesichtsspiel.', 'about.title': 'Über uns', 'about.content': 'Wir nutzen modernste KI-Technologie.', 'privacy.title': 'Datenschutz', 'privacy.content': 'Ihre Privatsphäre ist unsere Priorität.', 'contact.title': 'Kontakt', 'contact.content': 'Haben Sie Fragen?', 'contact.email': 'E-Mail: support@funfacegame.com', 'photo.title': 'Fotos hochladen', 'photo.subtitle': 'Bis zu 6 Fotos', 'photo.mainCharacter': 'Hauptcharakter', 'photo.tapToUpload': 'Tippen zum Hochladen', 'photo.uploadSuccess': 'Foto hochgeladen!', 'photo.uploadError': 'Hochladen fehlgeschlagen', 'theme.title': 'Thema wählen', 'theme.birthday': 'Geburtstagsfeier', 'theme.romance': 'Romantik', 'theme.party': 'Party', 'theme.pet': 'Haustier', 'theme.prank': 'Streich', 'theme.selected': 'Ausgewählt', 'theme.locked': 'Gesperrt', 'game.start': 'Spiel starten', 'game.pause': 'Pause', 'game.resume': 'Fortsetzen', 'game.restart': 'Neu starten', 'game.quit': 'Beenden', 'game.level': 'Level', 'game.score': 'Punkte', 'game.highScore': 'Highscore', 'game.moves': 'Züge', 'game.time': 'Zeit', 'game.combo': 'Combo', 'game.perfect': 'Perfekt!', 'game.gameover': 'Spiel vorbei', 'game.levelComplete': 'Level abgeschlossen!', 'game.nextLevel': 'Nächstes Level', 'game.tryAgain': 'Nochmal', 'share.title': 'Punktzahl teilen', 'share.download': 'Bild herunterladen', 'share.copyLink': 'Link kopieren', 'share.linkCopied': 'Link kopiert!', 'payment.removeAds': 'Werbung entfernen', 'payment.purchase': 'Kaufen', 'error.networkError': 'Netzwerkfehler.', 'error.loadFailed': 'Laden fehlgeschlagen.', 'language.select': 'Sprache wählen', 'language.current': 'Aktuelle Sprache'},
    es: {_langName: 'Español', 'app.title': 'Juego de Caras Locas', 'app.tagline': '¡Haz que cada cara sea divertida!', 'app.install': 'Instalar App', 'app.back': 'Atrás', 'app.close': 'Cerrar', 'app.ok': 'OK', 'app.cancel': 'Cancelar', 'app.save': 'Guardar', 'app.delete': 'Eliminar', 'app.loading': 'Cargando...', 'app.error': 'Error', 'app.success': 'Éxito', 'game.faceCrush': 'Cara Aplastada', 'game.faceSlicer': 'Cortador de Caras', 'game.whacAFace': 'Golpea la Cara', 'game.facePop': 'Globo de Cara', 'game.faceStack': 'Apila Caras', 'game.faceMemory': 'Memoria de Caras', 'game.comingSoon': 'Próximamente', 'footer.aboutUs': 'Nosotros', 'footer.privacy': 'Privacidad', 'footer.terms': 'Términos', 'footer.contact': 'Contacto', 'footer.copyright': '© 2024 Juego de Caras Locas.', 'about.title': 'Nosotros', 'about.content': 'Aprovechamos la tecnología de IA.', 'privacy.title': 'Privacidad', 'privacy.content': 'Su privacidad es nuestra prioridad.', 'contact.title': 'Contacto', 'contact.content': '¿Tiene preguntas?', 'contact.email': 'Correo: support@funfacegame.com', 'photo.title': 'Subir fotos', 'photo.subtitle': 'Hasta 6 fotos', 'photo.mainCharacter': 'Personaje principal', 'photo.tapToUpload': 'Toca para subir', 'photo.uploadSuccess': '¡Foto subida!', 'photo.uploadError': 'Error al subir', 'theme.title': 'Elegir tema', 'theme.birthday': 'Cumpleaños', 'theme.romance': 'Romance', 'theme.party': 'Fiesta', 'theme.pet': 'Mascota', 'theme.prank': 'Broma', 'theme.selected': 'Seleccionado', 'theme.locked': 'Bloqueado', 'game.start': 'Iniciar juego', 'game.pause': 'Pausa', 'game.resume': 'Reanudar', 'game.restart': 'Reiniciar', 'game.quit': 'Salir', 'game.level': 'Nivel', 'game.score': 'Puntos', 'game.highScore': 'Puntuación máxima', 'game.moves': 'Movimientos', 'game.time': 'Tiempo', 'game.combo': 'Combo', 'game.perfect': '¡Perfecto!', 'game.gameover': 'Fin del juego', 'game.levelComplete': '¡Nivel completado!', 'game.nextLevel': 'Siguiente nivel', 'game.tryAgain': 'Intentar de nuevo', 'share.title': 'Compartir puntuación', 'share.download': 'Descargar imagen', 'share.copyLink': 'Copiar enlace', 'share.linkCopied': '¡Enlace copiado!', 'payment.removeAds': 'Eliminar anuncios', 'payment.purchase': 'Comprar', 'error.networkError': 'Error de red.', 'error.loadFailed': 'Error al cargar.', 'language.select': 'Seleccionar idioma', 'language.current': 'Idioma actual'},
    id: {_langName: 'Bahasa Indonesia', 'app.title': 'Game Wajah Lucu', 'app.tagline': 'Buat Setiap Wajah Jadi Lucu!', 'app.install': 'Instal Aplikasi', 'app.back': 'Kembali', 'app.close': 'Tutup', 'app.ok': 'OK', 'app.cancel': 'Batal', 'app.save': 'Simpan', 'app.delete': 'Hapus', 'app.loading': 'Memuat...', 'app.error': 'Kesalahan', 'app.success': 'Berhasil', 'game.faceCrush': 'Wajah Hancur', 'game.faceSlicer': 'Pemotong Wajah', 'game.whacAFace': 'Pukul Wajah', 'game.facePop': 'Balon Wajah', 'game.faceStack': 'Tumpuk Wajah', 'game.faceMemory': 'Memori Wajah', 'game.comingSoon': 'Segera Hadir', 'footer.aboutUs': 'Tentang Kami', 'footer.privacy': 'Privasi', 'footer.terms': 'Syarat Layanan', 'footer.contact': 'Kontak', 'footer.copyright': '© 2024 Game Wajah Lucu.', 'about.title': 'Tentang Kami', 'about.content': 'Kami memanfaatkan teknologi AI.', 'privacy.title': 'Privasi', 'privacy.content': 'Privasi Anda adalah prioritas kami.', 'contact.title': 'Kontak', 'contact.content': 'Ada pertanyaan?', 'contact.email': 'Email: support@funfacegame.com', 'photo.title': 'Unggah Foto', 'photo.subtitle': 'Hingga 6 foto', 'photo.mainCharacter': 'Karakter Utama', 'photo.tapToUpload': 'Ketuk untuk unggah', 'photo.uploadSuccess': 'Foto berhasil diunggah!', 'photo.uploadError': 'Gagal mengunggah', 'theme.title': 'Pilih Tema', 'theme.birthday': 'Pesta Ulang Tahun', 'theme.romance': 'Romansa', 'theme.party': 'Pesta', 'theme.pet': 'Hewan Peliharaan', 'theme.prank': 'Prank', 'theme.selected': 'Dipilih', 'theme.locked': 'Terkunci', 'game.start': 'Mulai Permainan', 'game.pause': 'Jeda', 'game.resume': 'Lanjutkan', 'game.restart': 'Mulai Ulang', 'game.quit': 'Keluar', 'game.level': 'Level', 'game.score': 'Skor', 'game.highScore': 'Skor Tertinggi', 'game.moves': 'Gerakan', 'game.time': 'Waktu', 'game.combo': 'Kombo', 'game.perfect': 'Sempurna!', 'game.gameover': 'Permainan Selesai', 'game.levelComplete': 'Level Selesai!', 'game.nextLevel': 'Level Berikutnya', 'game.tryAgain': 'Coba Lagi', 'share.title': 'Bagikan Skor', 'share.download': 'Unduh Gambar', 'share.copyLink': 'Salin Tautan', 'share.linkCopied': 'Tautan disalin!', 'payment.removeAds': 'Hapus Iklan', 'payment.purchase': 'Beli', 'error.networkError': 'Kesalahan jaringan.', 'error.loadFailed': 'Gagal memuat.', 'language.select': 'Pilih Bahasa', 'language.current': 'Bahasa Saat Ini'},
    vi: {_langName: 'Tiếng Việt', 'app.title': 'Trò Chơi Mặt Hài', 'app.tagline': 'Làm Mọi Khuôn Mặt Vui Nhộn!', 'app.install': 'Cài đặt ứng dụng', 'app.back': 'Quay lại', 'app.close': 'Đóng', 'app.ok': 'OK', 'app.cancel': 'Hủy', 'app.save': 'Lưu', 'app.delete': 'Xóa', 'app.loading': 'Đang tải...', 'app.error': 'Lỗi', 'app.success': 'Thành công', 'game.faceCrush': 'Nghiền Mặt', 'game.faceSlicer': 'Cắt Mặt', 'game.whacAFace': 'Đập Mặt', 'game.facePop': 'Bong Bóng Mặt', 'game.faceStack': 'Xếp Mặt', 'game.faceMemory': 'Ghi Nhớ Mặt', 'game.comingSoon': 'Sắp Ra Mắt', 'footer.aboutUs': 'Về Chúng Tôi', 'footer.privacy': 'Chính Sách', 'footer.terms': 'Điều Khoản', 'footer.contact': 'Liên Hệ', 'footer.copyright': '© 2024 Trò Chơi Mặt Hài.', 'about.title': 'Về Chúng Tôi', 'about.content': 'Chúng tôi tận dụng công nghệ AI.', 'privacy.title': 'Chính Sách', 'privacy.content': 'Quyền riêng tư là ưu tiên hàng đầu.', 'contact.title': 'Liên Hệ', 'contact.content': 'Có câu hỏi?', 'contact.email': 'Email: support@funfacegame.com', 'photo.title': 'Tải Lên Ảnh', 'photo.subtitle': 'Tối đa 6 ảnh', 'photo.mainCharacter': 'Nhân Vật Chính', 'photo.tapToUpload': 'Chạm để tải lên', 'photo.uploadSuccess': 'Tải lên thành công!', 'photo.uploadError': 'Tải lên thất bại', 'theme.title': 'Chọn Chủ Đề', 'theme.birthday': 'Tiệc Sinh Nhật', 'theme.romance': 'Lãng Mạn', 'theme.party': 'Tiệc Tùng', 'theme.pet': 'Thú Cưng', 'theme.prank': 'Chơi Khăm', 'theme.selected': 'Đã chọn', 'theme.locked': 'Đã khóa', 'game.start': 'Bắt Đầu Chơi', 'game.pause': 'Tạm dừng', 'game.resume': 'Tiếp tục', 'game.restart': 'Chơi lại', 'game.quit': 'Thoát', 'game.level': 'Cấp độ', 'game.score': 'Điểm', 'game.highScore': 'Điểm cao nhất', 'game.moves': 'Nước đi', 'game.time': 'Thời gian', 'game.combo': 'Combo', 'game.perfect': 'Hoàn hảo!', 'game.gameover': 'Kết thúc', 'game.levelComplete': 'Hoàn thành!', 'game.nextLevel': 'Cấp độ tiếp theo', 'game.tryAgain': 'Thử lại', 'share.title': 'Chia Sẻ Điểm', 'share.download': 'Tải xuống', 'share.copyLink': 'Sao chép liên kết', 'share.linkCopied': 'Đã sao chép!', 'payment.removeAds': 'Xóa quảng cáo', 'payment.purchase': 'Mua', 'error.networkError': 'Lỗi mạng.', 'error.loadFailed': 'Tải thất bại.', 'language.select': 'Chọn ngôn ngữ', 'language.current': 'Ngôn ngữ hiện tại'}
  };

  function init() {
    const defaultLang = (typeof Config !== 'undefined' && Config.site) ? Config.site.defaultLanguage : 'en';
    const saved = loadFromStorage();
    currentLanguage = (saved && translations[saved]) ? saved : (detectBrowser() || defaultLang);
    if (typeof Config !== 'undefined' && Config.log) Config.log('info', 'i18n initialized', {language: currentLanguage});
    return currentLanguage;
  }

  function loadFromStorage() {
    try {
      const prefix = (typeof Config !== 'undefined' && Config.storage) ? Config.storage.prefix : 'funfacegame_';
      return localStorage.getItem(prefix + 'language');
    } catch (e) { return null; }
  }

  function saveToStorage(lang) {
    try {
      const prefix = (typeof Config !== 'undefined' && Config.storage) ? Config.storage.prefix : 'funfacegame_';
      localStorage.setItem(prefix + 'language', lang);
    } catch (e) {}
  }

  function detectBrowser() {
    if (typeof navigator === 'undefined') return null;
    const langs = navigator.languages || [navigator.language || navigator.userLanguage];
    for (let i = 0; i < langs.length; i++) if (translations[langs[i]]) return langs[i];
    for (let i = 0; i < langs.length; i++) {
      const main = langs[i].split('-')[0];
      for (const k in translations) if (k.split('-')[0] === main) return k;
    }
    return null;
  }

  function t(key, params) {
    if (!currentLanguage) init();
    let text = translations[currentLanguage] && translations[currentLanguage][key];
    if (!text && currentLanguage !== 'en') text = translations.en[key];
    if (!text) return key;
    if (params) Object.keys(params).forEach(function(k) {
      text = text.replace(new RegExp('{' + k + '}', 'g'), params[k]);
    });
    return text;
  }

  function setLanguage(lang) {
    if (!translations[lang]) return false;
    currentLanguage = lang;
    saveToStorage(lang);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', {detail: {language: lang}}));
    }
    if (typeof Config !== 'undefined' && Config.log) Config.log('info', 'Language changed', {language: lang});
    return true;
  }

  function getCurrentLanguage() {
    if (!currentLanguage) init();
    return currentLanguage;
  }

  function getLanguageName(lang) {
    const code = lang || getCurrentLanguage();
    return translations[code] ? translations[code]._langName : code;
  }

  function getSupportedLanguages() {
    return Object.keys(translations).map(function(code) {
      return {code: code, name: translations[code]._langName};
    });
  }

  function isSupported(lang) {
    return !!translations[lang];
  }

  // 自動初始化（僅在瀏覽器環境）
  if (typeof window !== 'undefined') {
    if (typeof document !== 'undefined' && document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else if (typeof document !== 'undefined') {
      init();
    }
  }

  return {
    init: init,
    t: t,
    setLanguage: setLanguage,
    getCurrentLanguage: getCurrentLanguage,
    getLanguageName: getLanguageName,
    getSupportedLanguages: getSupportedLanguages,
    isSupported: isSupported
  };
})();

// 匯出模組
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}

// 掛載到 window（瀏覽器環境）
if (typeof window !== 'undefined') {
  window.I18n = I18n;
}
