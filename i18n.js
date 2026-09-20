'use strict';
(function(root){
 const KEYS=('language|chooseLanguage|back|start|continue|map|levels|rules|pause|home|level|coins|lives|wallet|time|jump|left|right|soundOn|soundOff|game|menu|journey|intro|savedRoute|firstStep|completed|open|locked|checkpoint|saved|entry|exit|saveHint|livesHint|levelNo|stats|nextTip|understood|nextLevel|victory|exitFound|allComplete|doorOpen|timeUp|died|checkpointSaved|saveError|mapSummary|mapFooter|noLives|reviveText|buyLife|notEnough|retryLevel|retryNotice|livesAdded|exitQuestion|exitApp|stay|loadError|close|progressSaved|checkpointNo').split('|');
 const packs={};
 function add(code,name,ui,routes,rules){
  const values=ui.split('|').map(s=>s.trim());
  if(values.length!==KEYS.length)throw Error(code+': expected '+KEYS.length+' UI strings, got '+values.length);
  packs[code]={name,rtl:code==='ar',strings:Object.fromEntries(KEYS.map((key,i)=>[key,values[i]])),routes:routes.split('|'),rules:rules.split('|')};
 }
 add('en','English',`
 LANGUAGE|Choose a language|BACK|START|CONTINUE|MAP|100 LEVELS|RULES|PAUSE|MAIN MENU|
 LEVEL|COINS|LIVES|WALLET|TIME|JUMP|Move left|Move right|Enable sound|Mute sound|
 HellRun game|Game menu|100 STAIRS · ONE EXIT|Take your time. Watch the traps. Jump for every coin.|SAVED JOURNEY|FIRST STEP|completed|open|locked|CHECKPOINT|
 SAVED|ENTRANCE|EXIT|Your level, checkpoint and wallet save automatically.|{lives} lives · {cost} coins = +1 life.|LEVEL {n}|{coins} coins · {deaths} deaths.|The next staircase awaits.|GOT IT|NEXT LEVEL|
 VICTORY!|EXIT REACHED|You cleared all 100 levels.|ALL COINS COLLECTED · EXIT OPEN|TIME UP|YOU DIED|CHECKPOINT SAVED|Free up device storage to save your game.|{done} completed · {open} unlocked|Each exit leads to the next staircase.|
 NO LIVES LEFT|Buy one life to continue from your checkpoint with your level coins intact.|+1 LIFE · {cost} COINS|You need {n} more coins.|RESTART LEVEL · {lives} ♥|Restart this level with {lives} lives. Its checkpoint and level coins reset; your wallet and unlocked levels stay.|+1 LIFE|Exit the game?|EXIT|STAY|
 Cannot open the game. Update Android System WebView and try again.|Close|PROGRESS SAVED|CHECKPOINT {n} · SAVED`,
 'RED STAIRS|STEEP TOWER|LONG JUMPS|SAW GALLERY|CRUMBLING PATH|PAIRED STAIRS|HIGH TERRACES|LASER GATES|NEEDLE STEPS|MIXED TRIAL',
 'Move and jump together. Phone: hold a direction and tap jump. Keyboard: A/D or arrows and Space.|Collect every level coin, then reach the exit. Spending wallet coins does not close the exit.|Green flags save your checkpoint after you collect all earlier coins.|Watch the traps. Lasers warn before firing; cracked stairs collapse.|You have 3 lives. Each death costs one. One new life costs 5 wallet coins.|With no lives, buy one to keep your checkpoint, or restart this level with 3 lives. Replaying a level can earn coins again.');
 add('uz','O‘zbekcha',`
 TIL|Tilni tanlang|ORQAGA|BOSHLASH|DAVOM ETISH|XARITA|100 DARAJA|QOIDALAR|PAUZA|BOSH MENYU|
 DARAJA|TANGALAR|JON|HAMYON|VAQT|SAKRA|Chapga yurish|O‘ngga yurish|Ovozni yoqish|Ovozni o‘chirish|
 HellRun o‘yini|O‘yin menyusi|100 ZINA · BITTA CHIQISH|Shoshilmang. Tuzoqni kuzating. Har bir tanga uchun sakrang.|SAQLANGAN YO‘L|BIRINCHI QADAM|yakunlangan|ochiq|qulflangan|NAZORAT|
 SAQLANDI|KIRISH|CHIQISH|Daraja, nazorat nuqtasi va hamyon avtomatik saqlanadi.|{lives} ta jon · {cost} tanga = +1 jon.|{n}-DARAJA|{coins} ta tanga · {deaths} ta o‘lim.|Keyingi zina sizni kutmoqda.|TUSHUNARLI|KEYINGI DARAJA|
 G‘ALABA!|CHIQISH TOPILDI|Barcha 100 ta darajadan o‘tdingiz.|BARCHA TANGALAR OLINDI · CHIQISH OCHIQ|VAQT TUGADI|HALOK BO‘LDINGIZ|NAZORAT NUQTASI SAQLANDI|O‘yinni saqlash uchun qurilmada joy bo‘shating.|{done} ta yakunlangan · {open} ta ochiq|Har bir chiqish — keyingi zinaga yo‘l.|
 JONLAR TUGADI|Bir jon olib, nazorat nuqtasidan davom eting. Darajadagi yig‘ilgan tangalar saqlanadi.|+1 JON · {cost} TANGA|Yana {n} ta tanga kerak.|DARAJANI QAYTA BOSHLASH · {lives} ♥|Shu darajani {lives} jon bilan qayta boshlaysiz. Undagi nazorat nuqtasi va tangalar qaytadan boshlanadi; hamyon va ochilgan darajalar saqlanadi.|+1 JON|O‘yindan chiqish?|CHIQISH|QOLISH|
 O‘yinni ochib bo‘lmadi. Android System WebView’ni yangilang va qayta urining.|Yopish|YO‘LINGIZ SAQLANGAN|NAZORAT {n} · SAQLANGAN`,
 'QIZIL ZINALAR|TIK MINORA|UZUN SAKRASH|ARRALAR GALEREYASI|QULAYDIGAN YO‘L|JUFT ZINALAR|BALAND SUPALAR|LAZER DARVOZALARI|IGNADAY ZINALAR|ARALASH SINOV',
 'Yurish va sakrashni birga bosing. Telefonda yo‘nalishni ushlab, sakrashni bosing. Klaviaturada: A/D yoki strelkalar va Space.|Darajadagi barcha tangalarni yig‘ib, chiqishga yeting. Hamyondagi tangani sarflash chiqishni yopmaydi.|Oldingi barcha tangalar olingan bo‘lsa, yashil bayroq nazorat nuqtasini saqlaydi.|Tuzoqni kuzating. Lazer yonishidan oldin ogohlantiradi; darzli zinalar qulaydi.|Sizda 3 ta jon bor. Har o‘limda bittasi kamayadi. Yangi bitta jon 5 tanga turadi.|Jon tugasa, bir jon sotib olib nazoratdan davom eting yoki shu darajani 3 jon bilan qayta boshlang. Qayta o‘ynab yana tanga yig‘ish mumkin.');
 add('ru','Русский',`
 ЯЗЫК|Выберите язык|НАЗАД|НАЧАТЬ|ПРОДОЛЖИТЬ|КАРТА|100 УРОВНЕЙ|ПРАВИЛА|ПАУЗА|ГЛАВНОЕ МЕНЮ|
 УРОВЕНЬ|МОНЕТЫ|ЖИЗНИ|КОШЕЛЁК|ВРЕМЯ|ПРЫЖОК|Двигаться влево|Двигаться вправо|Включить звук|Выключить звук|
 Игра HellRun|Меню игры|100 ЛЕСТНИЦ · ОДИН ВЫХОД|Не спешите. Следите за ловушками. Прыгайте за каждой монетой.|СОХРАНЁННЫЙ ПУТЬ|ПЕРВЫЙ ШАГ|пройдено|открыто|закрыто|КОНТРОЛЬНАЯ ТОЧКА|
 СОХРАНЕНО|ВХОД|ВЫХОД|Уровень, контрольная точка и кошелёк сохраняются автоматически.|Жизни: {lives} · {cost} монет = +1 жизнь.|УРОВЕНЬ {n}|Монеты: {coins} · Смерти: {deaths}.|Следующая лестница ждёт.|ПОНЯТНО|СЛЕДУЮЩИЙ УРОВЕНЬ|
 ПОБЕДА!|ВЫХОД НАЙДЕН|Вы прошли все 100 уровней.|ВСЕ МОНЕТЫ СОБРАНЫ · ВЫХОД ОТКРЫТ|ВРЕМЯ ВЫШЛО|ВЫ ПОГИБЛИ|КОНТРОЛЬНАЯ ТОЧКА СОХРАНЕНА|Освободите место на устройстве для сохранения.|Пройдено: {done} · Открыто: {open}|Каждый выход ведёт к следующей лестнице.|
 ЖИЗНИ ЗАКОНЧИЛИСЬ|Купите жизнь и продолжите с контрольной точки. Собранные монеты уровня сохранятся.|+1 ЖИЗНЬ · {cost} МОНЕТ|Не хватает монет: {n}.|УРОВЕНЬ ЗАНОВО · {lives} ♥|Начните этот уровень заново. Жизни: {lives}. Его контрольная точка и монеты сбросятся; кошелёк и открытые уровни сохранятся.|+1 ЖИЗНЬ|Выйти из игры?|ВЫЙТИ|ОСТАТЬСЯ|
 Не удалось открыть игру. Обновите Android System WebView и повторите попытку.|Закрыть|ПРОГРЕСС СОХРАНЁН|ТОЧКА {n} · СОХРАНЕНО`,
 'КРАСНЫЕ СТУПЕНИ|КРУТАЯ БАШНЯ|ДАЛЬНИЕ ПРЫЖКИ|ГАЛЕРЕЯ ПИЛ|РУШАЩИЙСЯ ПУТЬ|ПАРНЫЕ СТУПЕНИ|ВЫСОКИЕ ТЕРРАСЫ|ЛАЗЕРНЫЕ ВОРОТА|УЗКИЕ СТУПЕНИ|СМЕШАННОЕ ИСПЫТАНИЕ',
 'Двигайтесь и прыгайте одновременно. На телефоне удерживайте направление и нажимайте прыжок. На клавиатуре: A/D или стрелки и пробел.|Соберите все монеты уровня и дойдите до выхода. Покупка жизни за монеты кошелька не закрывает выход.|Зелёный флаг сохраняет контрольную точку, когда собраны все предыдущие монеты.|Следите за ловушками. Лазеры предупреждают перед выстрелом, а треснувшие ступени рушатся.|У вас 3 жизни. Каждая смерть отнимает одну. Новая жизнь стоит 5 монет.|Если жизни закончились, купите одну для продолжения с контрольной точки или начните этот уровень заново с 3 жизнями. Повторное прохождение снова приносит монеты.');
 add('ar','العربية',`
 اللغة|اختر اللغة|رجوع|ابدأ|متابعة|الخريطة|١٠٠ مرحلة|القواعد|إيقاف مؤقت|القائمة الرئيسية|
 المرحلة|العملات|الأرواح|الرصيد|الوقت|اقفز|تحرك يسارًا|تحرك يمينًا|تشغيل الصوت|كتم الصوت|
 لعبة HellRun|قائمة اللعبة|١٠٠ درج · مخرج واحد|تمهّل. راقب الفخاخ. اقفز لجمع كل عملة.|المسار المحفوظ|الخطوة الأولى|مكتملة|مفتوحة|مقفلة|نقطة الحفظ|
 تم الحفظ|الدخول|الخروج|تُحفظ المرحلة ونقطة الحفظ ورصيدك تلقائيًا.|الأرواح: {lives} · {cost} عملات = روح إضافية.|المرحلة {n}|العملات: {coins} · مرات الموت: {deaths}.|الدرج التالي ينتظرك.|فهمت|المرحلة التالية|
 انتصار!|وصلت إلى المخرج|أكملت المراحل المئة كلها.|جُمعت كل العملات · المخرج مفتوح|انتهى الوقت|لقد متّ|حُفظت نقطة التقدم|أفرغ مساحة على الجهاز لحفظ اللعبة.|المكتملة: {done} · المفتوحة: {open}|كل مخرج يقود إلى الدرج التالي.|
 نفدت الأرواح|اشترِ روحًا للمتابعة من نقطة الحفظ مع الاحتفاظ بعملات المرحلة التي جمعتها.|روح إضافية · {cost} عملات|تحتاج إلى {n} عملات إضافية.|إعادة المرحلة · {lives} ♥|أعد هذه المرحلة بأرواح عددها {lives}. تُصفّر نقطة حفظها وعملاتها، ويبقى رصيدك والمراحل المفتوحة.|روح إضافية|هل تريد الخروج من اللعبة؟|خروج|البقاء|
 تعذّر فتح اللعبة. حدّث Android System WebView ثم حاول مجددًا.|إغلاق|تم حفظ التقدم|نقطة الحفظ {n} · محفوظة`,
 'الدرج الأحمر|البرج الشاهق|القفزات الطويلة|معرض المناشير|المسار المتداعي|الدرجات المزدوجة|المصاطب العالية|بوابات الليزر|الدرجات الرفيعة|التحدي المختلط',
 'تحرك واقفز معًا. على الهاتف اضغط باستمرار على الاتجاه واضغط القفز. على لوحة المفاتيح: A/D أو الأسهم ومفتاح المسافة.|اجمع كل عملات المرحلة ثم صِل إلى المخرج. إنفاق رصيدك لا يغلق المخرج.|تحفظ الراية الخضراء تقدمك بعد جمع كل العملات السابقة.|راقب الفخاخ. يصدر الليزر تحذيرًا قبل إطلاقه، وتنهار الدرجات المتشققة.|لديك ٣ أرواح. تفقد روحًا عند كل موت. شراء روح جديدة يكلف ٥ عملات.|عند نفاد الأرواح، اشترِ روحًا للمتابعة من نقطة الحفظ أو أعد هذه المرحلة بثلاث أرواح. يمكنك جمع العملات مجددًا عند إعادة اللعب.');
 add('ko','한국어',`
 언어|언어 선택|뒤로|시작|계속하기|지도|100개 스테이지|규칙|일시 정지|메인 메뉴|
 스테이지|동전|목숨|잔액|시간|점프|왼쪽으로 이동|오른쪽으로 이동|소리 켜기|소리 끄기|
 HellRun 게임|게임 메뉴|100개의 계단 · 하나의 출구|서두르지 마세요. 함정을 살피고 동전을 향해 점프하세요.|저장된 여정|첫걸음|완료|열림|잠김|체크포인트|
 저장됨|입구|출구|스테이지, 체크포인트, 잔액이 자동으로 저장됩니다.|목숨 {lives}개 · 동전 {cost}개 = 목숨 +1.|스테이지 {n}|동전 {coins}개 · 사망 {deaths}회.|다음 계단이 기다립니다.|확인|다음 스테이지|
 승리!|출구 도착|100개 스테이지를 모두 완료했습니다.|모든 동전 수집 · 출구 열림|시간 초과|사망했습니다|체크포인트 저장됨|게임을 저장하려면 기기 저장 공간을 확보하세요.|완료 {done}개 · 잠금 해제 {open}개|각 출구는 다음 계단으로 이어집니다.|
 목숨이 없습니다|목숨을 구매하면 모은 스테이지 동전을 유지한 채 체크포인트에서 계속합니다.|목숨 +1 · 동전 {cost}개|동전 {n}개가 더 필요합니다.|스테이지 재시작 · {lives} ♥|목숨 {lives}개로 현재 스테이지를 다시 시작합니다. 체크포인트와 스테이지 동전은 초기화되지만 잔액과 열린 스테이지는 유지됩니다.|목숨 +1|게임을 종료할까요?|종료|계속 머물기|
 게임을 열 수 없습니다. Android System WebView를 업데이트하고 다시 시도하세요.|닫기|진행 상황 저장됨|체크포인트 {n} · 저장됨`,
 '붉은 계단|가파른 탑|긴 점프|톱날 회랑|무너지는 길|짝 계단|높은 테라스|레이저 관문|바늘 계단|혼합 시련',
 '이동과 점프를 함께 사용하세요. 휴대폰에서는 방향 버튼을 누른 채 점프하세요. 키보드에서는 A/D 또는 방향키와 스페이스를 사용합니다.|스테이지 동전을 모두 모은 뒤 출구에 도착하세요. 잔액을 사용해도 출구는 닫히지 않습니다.|이전 동전을 모두 모으면 초록 깃발에서 체크포인트가 저장됩니다.|함정을 살피세요. 레이저는 발사 전 경고하며 금이 간 계단은 무너집니다.|목숨은 3개입니다. 사망할 때마다 하나를 잃습니다. 목숨 하나의 가격은 동전 5개입니다.|목숨이 없으면 하나를 구매해 체크포인트에서 계속하거나 목숨 3개로 현재 스테이지를 다시 시작하세요. 다시 플레이하면 동전을 또 얻을 수 있습니다.');
 add('it','Italiano',`
 LINGUA|Scegli la lingua|INDIETRO|INIZIA|CONTINUA|MAPPA|100 LIVELLI|REGOLE|PAUSA|MENU PRINCIPALE|
 LIVELLO|MONETE|VITE|SALDO|TEMPO|SALTA|Muovi a sinistra|Muovi a destra|Attiva audio|Disattiva audio|
 Gioco HellRun|Menu di gioco|100 SCALE · UNA SOLA USCITA|Non avere fretta. Osserva le trappole. Salta per ogni moneta.|PERCORSO SALVATO|PRIMO PASSO|completati|aperti|bloccati|CHECKPOINT|
 SALVATO|ENTRATA|USCITA|Livello, checkpoint e saldo si salvano automaticamente.|{lives} vite · {cost} monete = +1 vita.|LIVELLO {n}|{coins} monete · {deaths} morti.|La prossima scala ti aspetta.|CAPITO|LIVELLO SUCCESSIVO|
 VITTORIA!|USCITA RAGGIUNTA|Hai completato tutti i 100 livelli.|TUTTE LE MONETE RACCOLTE · USCITA APERTA|TEMPO SCADUTO|SEI MORTO|CHECKPOINT SALVATO|Libera spazio sul dispositivo per salvare la partita.|{done} completati · {open} sbloccati|Ogni uscita porta alla scala successiva.|
 VITE ESAURITE|Compra una vita per ripartire dal checkpoint conservando le monete raccolte nel livello.|+1 VITA · {cost} MONETE|Ti servono altre {n} monete.|RICOMINCIA IL LIVELLO · {lives} ♥|Ricomincia questo livello con {lives} vite. Checkpoint e monete del livello si azzerano; saldo e livelli sbloccati restano.|+1 VITA|Uscire dal gioco?|ESCI|RESTA|
 Impossibile aprire il gioco. Aggiorna Android System WebView e riprova.|Chiudi|PROGRESSI SALVATI|CHECKPOINT {n} · SALVATO`,
 'SCALE ROSSE|TORRE RIPIDA|SALTI LUNGHI|GALLERIA DELLE SEGHE|SENTIERO FRAGILE|GRADINI DOPPI|TERRAZZE ALTE|PORTE LASER|GRADINI SOTTILI|PROVA MISTA',
 'Muoviti e salta insieme. Sul telefono tieni premuta una direzione e tocca il salto. Tastiera: A/D o frecce e spazio.|Raccogli tutte le monete del livello e raggiungi l’uscita. Spendere il saldo non chiude l’uscita.|Le bandiere verdi salvano il checkpoint dopo aver raccolto tutte le monete precedenti.|Osserva le trappole. I laser avvisano prima di sparare; i gradini crepati crollano.|Hai 3 vite. Ogni morte ne consuma una. Una nuova vita costa 5 monete.|Senza vite, comprane una per mantenere il checkpoint oppure ricomincia questo livello con 3 vite. Puoi guadagnare di nuovo monete rigiocando.');
 add('de','Deutsch',`
 SPRACHE|Sprache auswählen|ZURÜCK|STARTEN|WEITER|KARTE|100 LEVEL|REGELN|PAUSE|HAUPTMENÜ|
 LEVEL|MÜNZEN|LEBEN|GUTHABEN|ZEIT|SPRINGEN|Nach links bewegen|Nach rechts bewegen|Ton einschalten|Ton ausschalten|
 HellRun-Spiel|Spielmenü|100 TREPPEN · EIN AUSGANG|Lass dir Zeit. Beobachte die Fallen. Springe nach jeder Münze.|GESPEICHERTER WEG|ERSTER SCHRITT|geschafft|offen|gesperrt|KONTROLLPUNKT|
 GESPEICHERT|EINGANG|AUSGANG|Level, Kontrollpunkt und Guthaben werden automatisch gespeichert.|{lives} Leben · {cost} Münzen = +1 Leben.|LEVEL {n}|{coins} Münzen · {deaths} Tode.|Die nächste Treppe wartet.|VERSTANDEN|NÄCHSTES LEVEL|
 SIEG!|AUSGANG ERREICHT|Du hast alle 100 Level geschafft.|ALLE MÜNZEN GESAMMELT · AUSGANG OFFEN|ZEIT ABGELAUFEN|DU BIST GESTORBEN|KONTROLLPUNKT GESPEICHERT|Schaffe Speicherplatz auf dem Gerät, um das Spiel zu speichern.|{done} geschafft · {open} freigeschaltet|Jeder Ausgang führt zur nächsten Treppe.|
 KEINE LEBEN MEHR|Kaufe ein Leben und starte am Kontrollpunkt. Gesammelte Level-Münzen bleiben erhalten.|+1 LEBEN · {cost} MÜNZEN|Dir fehlen {n} Münzen.|LEVEL NEU STARTEN · {lives} ♥|Starte dieses Level mit {lives} Leben neu. Sein Kontrollpunkt und seine Münzen werden zurückgesetzt; Guthaben und freigeschaltete Level bleiben.|+1 LEBEN|Spiel verlassen?|VERLASSEN|BLEIBEN|
 Das Spiel lässt sich nicht öffnen. Aktualisiere Android System WebView und versuche es erneut.|Schließen|FORTSCHRITT GESPEICHERT|KONTROLLPUNKT {n} · GESPEICHERT`,
 'ROTE TREPPEN|STEILER TURM|WEITE SPRÜNGE|SÄGENGALERIE|BRÜCHIGER PFAD|DOPPELSTUFEN|HOHE TERRASSEN|LASERTORE|NADELSTUFEN|GEMISCHTE PRÜFUNG',
 'Bewege dich und springe gleichzeitig. Halte auf dem Handy eine Richtung und tippe auf Springen. Tastatur: A/D oder Pfeile und Leertaste.|Sammle alle Level-Münzen und erreiche den Ausgang. Das Ausgeben deines Guthabens schließt den Ausgang nicht.|Grüne Flaggen speichern deinen Kontrollpunkt, sobald alle vorherigen Münzen gesammelt sind.|Beobachte die Fallen. Laser warnen vor dem Schuss; rissige Stufen brechen ein.|Du hast 3 Leben. Jeder Tod kostet eines. Ein neues Leben kostet 5 Münzen.|Ohne Leben kannst du eines kaufen und am Kontrollpunkt weitermachen oder dieses Level mit 3 Leben neu starten. Beim erneuten Spielen lassen sich wieder Münzen verdienen.');
 add('fr','Français',`
 LANGUE|Choisir une langue|RETOUR|COMMENCER|CONTINUER|CARTE|100 NIVEAUX|RÈGLES|PAUSE|MENU PRINCIPAL|
 NIVEAU|PIÈCES|VIES|SOLDE|TEMPS|SAUTER|Aller à gauche|Aller à droite|Activer le son|Couper le son|
 Jeu HellRun|Menu du jeu|100 ESCALIERS · UNE SORTIE|Prenez votre temps. Observez les pièges. Sautez pour chaque pièce.|PARCOURS SAUVEGARDÉ|PREMIER PAS|terminés|ouverts|verrouillés|POINT DE CONTRÔLE|
 SAUVEGARDÉ|ENTRÉE|SORTIE|Le niveau, le point de contrôle et le solde sont sauvegardés automatiquement.|{lives} vies · {cost} pièces = +1 vie.|NIVEAU {n}|{coins} pièces · {deaths} morts.|Le prochain escalier vous attend.|COMPRIS|NIVEAU SUIVANT|
 VICTOIRE !|SORTIE ATTEINTE|Vous avez terminé les 100 niveaux.|TOUTES LES PIÈCES RAMASSÉES · SORTIE OUVERTE|TEMPS ÉCOULÉ|VOUS ÊTES MORT|POINT DE CONTRÔLE SAUVEGARDÉ|Libérez de l’espace sur l’appareil pour sauvegarder.|{done} terminés · {open} débloqués|Chaque sortie mène à l’escalier suivant.|
 PLUS DE VIES|Achetez une vie pour repartir du point de contrôle en conservant les pièces du niveau.|+1 VIE · {cost} PIÈCES|Il vous manque {n} pièces.|RECOMMENCER LE NIVEAU · {lives} ♥|Recommencez ce niveau avec {lives} vies. Son point de contrôle et ses pièces sont réinitialisés ; le solde et les niveaux débloqués restent.|+1 VIE|Quitter le jeu ?|QUITTER|RESTER|
 Impossible d’ouvrir le jeu. Mettez à jour Android System WebView et réessayez.|Fermer|PROGRESSION SAUVEGARDÉE|POINT {n} · SAUVEGARDÉ`,
 'ESCALIERS ROUGES|TOUR ABRUPTE|LONGS SAUTS|GALERIE DES SCIES|CHEMIN FRAGILE|MARCHES DOUBLES|HAUTES TERRASSES|PORTES LASER|MARCHES ÉTROITES|ÉPREUVE MIXTE',
 'Déplacez-vous et sautez en même temps. Sur téléphone, maintenez une direction et touchez Sauter. Clavier : A/D ou flèches et espace.|Ramassez toutes les pièces du niveau, puis rejoignez la sortie. Dépenser votre solde ne ferme pas la sortie.|Les drapeaux verts sauvegardent le point de contrôle une fois toutes les pièces précédentes ramassées.|Observez les pièges. Les lasers préviennent avant de tirer ; les marches fissurées s’effondrent.|Vous avez 3 vies. Chaque mort en coûte une. Une nouvelle vie coûte 5 pièces.|Sans vies, achetez-en une pour garder votre point de contrôle ou recommencez ce niveau avec 3 vies. Rejouer permet de gagner à nouveau des pièces.');
 add('es','Español',`
 IDIOMA|Elige un idioma|VOLVER|EMPEZAR|CONTINUAR|MAPA|100 NIVELES|REGLAS|PAUSA|MENÚ PRINCIPAL|
 NIVEL|MONEDAS|VIDAS|SALDO|TIEMPO|SALTAR|Mover a la izquierda|Mover a la derecha|Activar sonido|Silenciar|
 Juego HellRun|Menú del juego|100 ESCALERAS · UNA SALIDA|Sin prisas. Observa las trampas. Salta por cada moneda.|RECORRIDO GUARDADO|PRIMER PASO|completados|abiertos|bloqueados|PUNTO DE CONTROL|
 GUARDADO|ENTRADA|SALIDA|El nivel, el punto de control y el saldo se guardan automáticamente.|{lives} vidas · {cost} monedas = +1 vida.|NIVEL {n}|{coins} monedas · {deaths} muertes.|Te espera la siguiente escalera.|ENTENDIDO|SIGUIENTE NIVEL|
 ¡VICTORIA!|SALIDA ALCANZADA|Has superado los 100 niveles.|TODAS LAS MONEDAS RECOGIDAS · SALIDA ABIERTA|TIEMPO AGOTADO|HAS MUERTO|PUNTO DE CONTROL GUARDADO|Libera espacio en el dispositivo para guardar la partida.|{done} completados · {open} desbloqueados|Cada salida lleva a la siguiente escalera.|
 NO QUEDAN VIDAS|Compra una vida para continuar desde el punto de control conservando las monedas del nivel.|+1 VIDA · {cost} MONEDAS|Te faltan {n} monedas.|REINICIAR NIVEL · {lives} ♥|Reinicia este nivel con {lives} vidas. Se reinician su punto de control y sus monedas; conservas el saldo y los niveles desbloqueados.|+1 VIDA|¿Salir del juego?|SALIR|QUEDARSE|
 No se puede abrir el juego. Actualiza Android System WebView e inténtalo de nuevo.|Cerrar|PROGRESO GUARDADO|PUNTO {n} · GUARDADO`,
 'ESCALERAS ROJAS|TORRE EMPINADA|SALTOS LARGOS|GALERÍA DE SIERRAS|CAMINO FRÁGIL|PELDAÑOS DOBLES|TERRAZAS ALTAS|PUERTAS LÁSER|PELDAÑOS ESTRECHOS|PRUEBA MIXTA',
 'Muévete y salta a la vez. En el teléfono, mantén una dirección y toca saltar. Teclado: A/D o flechas y espacio.|Recoge todas las monedas del nivel y llega a la salida. Gastar el saldo no cierra la salida.|Las banderas verdes guardan el punto de control tras recoger todas las monedas anteriores.|Observa las trampas. Los láseres avisan antes de disparar; los peldaños agrietados se derrumban.|Tienes 3 vidas. Cada muerte cuesta una. Una vida nueva cuesta 5 monedas.|Sin vidas, compra una para mantener el punto de control o reinicia este nivel con 3 vidas. Al repetir un nivel puedes volver a ganar monedas.');
 add('pt','Português',`
 IDIOMA|Escolha um idioma|VOLTAR|COMEÇAR|CONTINUAR|MAPA|100 FASES|REGRAS|PAUSA|MENU PRINCIPAL|
 FASE|MOEDAS|VIDAS|SALDO|TEMPO|PULAR|Mover para a esquerda|Mover para a direita|Ativar som|Desativar som|
 Jogo HellRun|Menu do jogo|100 ESCADAS · UMA SAÍDA|Não tenha pressa. Observe as armadilhas. Pule por cada moeda.|CAMINHO SALVO|PRIMEIRO PASSO|concluídas|abertas|bloqueadas|PONTO DE CONTROLE|
 SALVO|ENTRADA|SAÍDA|A fase, o ponto de controle e o saldo são salvos automaticamente.|{lives} vidas · {cost} moedas = +1 vida.|FASE {n}|{coins} moedas · {deaths} mortes.|A próxima escada espera por você.|ENTENDI|PRÓXIMA FASE|
 VITÓRIA!|SAÍDA ALCANÇADA|Você concluiu todas as 100 fases.|TODAS AS MOEDAS COLETADAS · SAÍDA ABERTA|TEMPO ESGOTADO|VOCÊ MORREU|PONTO DE CONTROLE SALVO|Libere espaço no dispositivo para salvar o jogo.|{done} concluídas · {open} desbloqueadas|Cada saída leva à próxima escada.|
 AS VIDAS ACABARAM|Compre uma vida para continuar do ponto de controle mantendo as moedas da fase.|+1 VIDA · {cost} MOEDAS|Faltam {n} moedas.|RECOMEÇAR FASE · {lives} ♥|Recomece esta fase com {lives} vidas. O ponto de controle e as moedas da fase são reiniciados; o saldo e as fases desbloqueadas ficam.|+1 VIDA|Sair do jogo?|SAIR|FICAR|
 Não foi possível abrir o jogo. Atualize o Android System WebView e tente novamente.|Fechar|PROGRESSO SALVO|PONTO {n} · SALVO`,
 'ESCADAS VERMELHAS|TORRE ÍNGREME|SALTOS LONGOS|GALERIA DE SERRAS|CAMINHO FRÁGIL|DEGRAUS DUPLOS|TERRAÇOS ALTOS|PORTÕES LASER|DEGRAUS ESTREITOS|DESAFIO MISTO',
 'Mova-se e pule ao mesmo tempo. No celular, segure uma direção e toque em pular. Teclado: A/D ou setas e espaço.|Colete todas as moedas da fase e alcance a saída. Gastar o saldo não fecha a saída.|As bandeiras verdes salvam o ponto de controle após você coletar todas as moedas anteriores.|Observe as armadilhas. Os lasers avisam antes de disparar; os degraus rachados desabam.|Você tem 3 vidas. Cada morte custa uma. Uma nova vida custa 5 moedas.|Sem vidas, compre uma para manter o ponto de controle ou recomece esta fase com 3 vidas. Jogar novamente permite ganhar moedas de novo.');
 add('zh','中文',`
 语言|选择语言|返回|开始|继续|地图|100个关卡|规则|暂停|主菜单|
 关卡|金币|生命|余额|时间|跳跃|向左移动|向右移动|开启声音|关闭声音|
 HellRun 游戏|游戏菜单|100道阶梯 · 一个出口|不要着急。观察陷阱，跳跃收集每一枚金币。|已保存的旅程|第一步|已完成|已开放|未解锁|检查点|
 已保存|入口|出口|关卡、检查点和金币余额会自动保存。|{lives}条生命 · {cost}枚金币 = +1条生命。|第{n}关|金币：{coins} · 死亡：{deaths}次。|下一道阶梯在等你。|明白了|下一关|
 胜利！|到达出口|你已完成全部100个关卡。|金币全部收集 · 出口已开启|时间到|你已死亡|检查点已保存|请释放设备存储空间以保存游戏。|已完成{done}关 · 已解锁{open}关|每个出口都通向下一道阶梯。|
 生命已耗尽|购买一条生命，从检查点继续，并保留本关已收集的金币。|+1条生命 · {cost}枚金币|还需要{n}枚金币。|重新开始本关 · {lives} ♥|以{lives}条生命重新开始本关。本关检查点和金币进度将重置，余额与已解锁关卡保留。|+1条生命|退出游戏？|退出|留下|
 无法打开游戏。请更新 Android System WebView 后重试。|关闭|进度已保存|检查点{n} · 已保存`,
 '红色阶梯|陡峭高塔|远距离跳跃|锯刃回廊|崩塌之路|双层台阶|高台|激光之门|针尖台阶|混合试炼',
 '同时移动和跳跃。手机上按住方向键并点击跳跃；键盘使用 A/D 或方向键加空格。|收集本关所有金币，然后到达出口。花费余额不会关闭出口。|收集前面所有金币后，绿色旗帜会保存检查点。|注意陷阱。激光发射前会预警，开裂的台阶会崩塌。|你有3条生命，每次死亡消耗一条。购买一条新生命需要5枚金币。|生命耗尽后，可购买一条生命从检查点继续，或以3条生命重新开始本关。重新游玩可以再次赚取金币。');
 add('ja','日本語',`
 言語|言語を選択|戻る|開始|続ける|マップ|100ステージ|ルール|一時停止|メインメニュー|
 ステージ|コイン|残機|残高|時間|ジャンプ|左に移動|右に移動|音をオン|音をオフ|
 HellRun ゲーム|ゲームメニュー|100の階段 · ひとつの出口|焦らず、罠を観察しよう。コインを目指してジャンプ。|保存された旅|最初の一歩|クリア済み|解放済み|未解放|チェックポイント|
 保存済み|入口|出口|ステージ、チェックポイント、残高は自動保存されます。|残機{lives} · コイン{cost}枚 = 残機+1。|ステージ{n}|コイン{coins}枚 · 死亡{deaths}回。|次の階段が待っています。|了解|次のステージ|
 勝利！|出口に到達|全100ステージをクリアしました。|全コイン獲得 · 出口が開きました|時間切れ|倒れました|チェックポイントを保存|保存するには端末の空き容量を増やしてください。|クリア{done} · 解放{open}|各出口は次の階段につながります。|
 残機がありません|残機を1つ購入すると、集めたステージのコインを保ったままチェックポイントから続けられます。|残機+1 · コイン{cost}枚|コインがあと{n}枚必要です。|ステージをやり直す · {lives} ♥|残機{lives}でこのステージをやり直します。チェックポイントとステージのコインはリセットされますが、残高と解放済みステージは残ります。|残機+1|ゲームを終了しますか？|終了|戻る|
 ゲームを開けません。Android System WebViewを更新して再試行してください。|閉じる|進行状況を保存|チェックポイント{n} · 保存済み`,
 '赤い階段|急な塔|ロングジャンプ|ノコギリの回廊|崩れる道|二段の階段|高いテラス|レーザーゲート|針の階段|複合試練',
 '移動とジャンプを同時に使います。スマホでは方向を押しながらジャンプ。キーボードはA/Dまたは矢印とスペースです。|ステージのコインをすべて集めて出口に到達しましょう。残高を使っても出口は閉じません。|それ以前のコインをすべて集めると、緑の旗でチェックポイントが保存されます。|罠を観察しましょう。レーザーは発射前に警告し、ひびの入った階段は崩れます。|残機は3つです。倒れるたびに1つ減ります。残機1つの購入にはコイン5枚が必要です。|残機がなくなったら、1つ購入してチェックポイントから続けるか、残機3つでこのステージをやり直せます。再プレイでもコインを獲得できます。');
 add('tr','Türkçe',`
 DİL|Dil seçin|GERİ|BAŞLA|DEVAM ET|HARİTA|100 BÖLÜM|KURALLAR|DURAKLAT|ANA MENÜ|
 BÖLÜM|PARA|CAN|BAKİYE|SÜRE|ZIPLA|Sola git|Sağa git|Sesi aç|Sesi kapat|
 HellRun oyunu|Oyun menüsü|100 MERDİVEN · TEK ÇIKIŞ|Acele etme. Tuzakları izle. Her para için zıpla.|KAYITLI YOLCULUK|İLK ADIM|tamamlandı|açık|kilitli|KONTROL NOKTASI|
 KAYDEDİLDİ|GİRİŞ|ÇIKIŞ|Bölüm, kontrol noktası ve bakiye otomatik kaydedilir.|{lives} can · {cost} para = +1 can.|BÖLÜM {n}|{coins} para · {deaths} ölüm.|Sıradaki merdiven seni bekliyor.|ANLADIM|SONRAKİ BÖLÜM|
 ZAFER!|ÇIKIŞA ULAŞILDI|100 bölümün tamamını bitirdin.|TÜM PARALAR TOPLANDI · ÇIKIŞ AÇIK|SÜRE DOLDU|ÖLDÜN|KONTROL NOKTASI KAYDEDİLDİ|Oyunu kaydetmek için cihazda yer aç.|{done} tamamlandı · {open} bölüm açık|Her çıkış bir sonraki merdivene gider.|
 CAN KALMADI|Bir can satın alıp bölümde topladığın paraları koruyarak kontrol noktasından devam et.|+1 CAN · {cost} PARA|{n} para daha gerekiyor.|BÖLÜMÜ YENİDEN BAŞLAT · {lives} ♥|Bu bölüme {lives} canla yeniden başla. Bölümün kontrol noktası ve paraları sıfırlanır; bakiye ve açık bölümler korunur.|+1 CAN|Oyundan çıkılsın mı?|ÇIK|KAL|
 Oyun açılamadı. Android System WebView uygulamasını güncelleyip tekrar dene.|Kapat|İLERLEME KAYDEDİLDİ|KONTROL {n} · KAYITLI`,
 'KIRMIZI BASAMAKLAR|DİK KULE|UZUN ATLAMALAR|TESTERE GALERİSİ|ÇÖKEN YOL|ÇİFT BASAMAKLAR|YÜKSEK TERASLAR|LAZER KAPILARI|İNCE BASAMAKLAR|KARMA SINAV',
 'Aynı anda hareket et ve zıpla. Telefonda bir yönü basılı tutup zıplamaya dokun. Klavyede A/D veya oklar ve boşluk kullanılır.|Bölümdeki tüm paraları toplayıp çıkışa ulaş. Bakiyeni harcamak çıkışı kapatmaz.|Önceki tüm paralar toplandığında yeşil bayraklar kontrol noktasını kaydeder.|Tuzakları izle. Lazerler ateşlemeden önce uyarır; çatlak basamaklar çöker.|3 canın var. Her ölüm bir can götürür. Yeni bir can 5 para tutar.|Can kalmadığında kontrol noktasını korumak için bir can satın al veya bu bölüme 3 canla yeniden başla. Tekrar oynayarak yeniden para kazanabilirsin.');
 add('hi','हिन्दी',`
 भाषा|भाषा चुनें|वापस|शुरू करें|जारी रखें|नक्शा|100 स्तर|नियम|विराम|मुख्य मेनू|
 स्तर|सिक्के|जीवन|शेष|समय|कूदें|बाईं ओर चलें|दाईं ओर चलें|आवाज़ चालू करें|आवाज़ बंद करें|
 HellRun खेल|खेल का मेनू|100 सीढ़ियाँ · एक निकास|जल्दी न करें। जाल देखें। हर सिक्के के लिए कूदें।|सहेजा गया सफ़र|पहला कदम|पूरे|खुले|बंद|चेकपॉइंट|
 सहेजा गया|प्रवेश|निकास|स्तर, चेकपॉइंट और सिक्कों का शेष अपने आप सहेजा जाता है।|{lives} जीवन · {cost} सिक्के = +1 जीवन।|स्तर {n}|{coins} सिक्के · {deaths} बार मृत्यु।|अगली सीढ़ी आपका इंतज़ार कर रही है।|समझ गया|अगला स्तर|
 जीत!|निकास मिल गया|आपने सभी 100 स्तर पूरे कर लिए।|सभी सिक्के मिले · निकास खुला|समय समाप्त|आप मारे गए|चेकपॉइंट सहेजा गया|खेल सहेजने के लिए डिवाइस में जगह खाली करें।|{done} पूरे · {open} खुले|हर निकास अगली सीढ़ी तक ले जाता है।|
 जीवन समाप्त|एक जीवन खरीदकर चेकपॉइंट से जारी रखें। स्तर में जुटाए गए सिक्के बने रहेंगे।|+1 जीवन · {cost} सिक्के|अभी {n} और सिक्के चाहिए।|स्तर फिर शुरू करें · {lives} ♥|यह स्तर {lives} जीवन के साथ फिर शुरू करें। इसका चेकपॉइंट और स्तर के सिक्के रीसेट होंगे; शेष सिक्के और खुले स्तर बने रहेंगे।|+1 जीवन|खेल से बाहर निकलें?|बाहर निकलें|रुकें|
 खेल नहीं खुल सका। Android System WebView अपडेट करके फिर कोशिश करें।|बंद करें|प्रगति सहेजी गई|चेकपॉइंट {n} · सहेजा गया`,
 'लाल सीढ़ियाँ|खड़ी मीनार|लंबी छलाँगें|आरों की गैलरी|ढहता रास्ता|जोड़ीदार सीढ़ियाँ|ऊँचे चबूतरे|लेज़र द्वार|पतली सीढ़ियाँ|मिश्रित चुनौती',
 'चलना और कूदना साथ में करें। फ़ोन पर दिशा दबाए रखें और कूदें दबाएँ। कीबोर्ड पर A/D या तीर और स्पेस दबाएँ।|स्तर के सभी सिक्के जुटाएँ और निकास तक पहुँचें। अपने शेष सिक्के खर्च करने से निकास बंद नहीं होता।|पिछले सभी सिक्के जुटाने के बाद हरा झंडा आपका चेकपॉइंट सहेजता है।|जाल देखें। लेज़र चलने से पहले चेतावनी देता है और दरार वाली सीढ़ियाँ ढह जाती हैं।|आपके पास 3 जीवन हैं। हर मृत्यु पर एक घटता है। नया जीवन 5 सिक्कों का है।|जीवन समाप्त होने पर चेकपॉइंट से जारी रखने के लिए एक जीवन खरीदें या यही स्तर 3 जीवन के साथ फिर शुरू करें। दोबारा खेलने पर सिक्के फिर मिलते हैं।');
 add('id','Bahasa Indonesia',`
 BAHASA|Pilih bahasa|KEMBALI|MULAI|LANJUTKAN|PETA|100 LEVEL|ATURAN|JEDA|MENU UTAMA|
 LEVEL|KOIN|NYAWA|SALDO|WAKTU|LOMPAT|Bergerak ke kiri|Bergerak ke kanan|Nyalakan suara|Matikan suara|
 Permainan HellRun|Menu permainan|100 TANGGA · SATU PINTU KELUAR|Jangan terburu-buru. Amati jebakan. Lompat untuk setiap koin.|PERJALANAN TERSIMPAN|LANGKAH PERTAMA|selesai|terbuka|terkunci|TITIK SIMPAN|
 TERSIMPAN|MASUK|KELUAR|Level, titik simpan, dan saldo tersimpan otomatis.|{lives} nyawa · {cost} koin = +1 nyawa.|LEVEL {n}|{coins} koin · {deaths} kematian.|Tangga berikutnya menunggu.|MENGERTI|LEVEL BERIKUTNYA|
 MENANG!|PINTU KELUAR TERCAPAI|Kamu menyelesaikan seluruh 100 level.|SEMUA KOIN TERKUMPUL · PINTU KELUAR TERBUKA|WAKTU HABIS|KAMU MATI|TITIK SIMPAN TERSIMPAN|Kosongkan ruang perangkat untuk menyimpan permainan.|{done} selesai · {open} terbuka|Setiap pintu keluar menuju tangga berikutnya.|
 NYAWA HABIS|Beli satu nyawa untuk lanjut dari titik simpan dengan koin level tetap terkumpul.|+1 NYAWA · {cost} KOIN|Perlu {n} koin lagi.|ULANGI LEVEL · {lives} ♥|Ulangi level ini dengan {lives} nyawa. Titik simpan dan koin level direset; saldo dan level terbuka tetap tersimpan.|+1 NYAWA|Keluar dari permainan?|KELUAR|TETAP DI SINI|
 Permainan tidak dapat dibuka. Perbarui Android System WebView dan coba lagi.|Tutup|KEMAJUAN TERSIMPAN|TITIK {n} · TERSIMPAN`,
 'TANGGA MERAH|MENARA CURAM|LOMPATAN JAUH|GALERI GERGAJI|JALUR RUNTUH|TANGGA BERPASANGAN|TERAS TINGGI|GERBANG LASER|TANGGA JARUM|UJIAN CAMPURAN',
 'Bergerak dan melompat bersamaan. Di ponsel, tahan arah dan ketuk lompat. Papan ketik: A/D atau panah dan spasi.|Kumpulkan semua koin level lalu capai pintu keluar. Membelanjakan saldo tidak menutup pintu keluar.|Bendera hijau menyimpan titik lanjut setelah semua koin sebelumnya terkumpul.|Amati jebakan. Laser memberi peringatan sebelum menembak; tangga retak akan runtuh.|Kamu punya 3 nyawa. Setiap kematian menghabiskan satu. Nyawa baru seharga 5 koin.|Saat nyawa habis, beli satu untuk lanjut dari titik simpan atau ulangi level ini dengan 3 nyawa. Bermain ulang bisa menghasilkan koin lagi.');
 add('nl','Nederlands',`
 TAAL|Kies een taal|TERUG|STARTEN|DOORGAAN|KAART|100 LEVELS|REGELS|PAUZE|HOOFDMENU|
 LEVEL|MUNTEN|LEVENS|SALDO|TIJD|SPRING|Naar links bewegen|Naar rechts bewegen|Geluid aan|Geluid uit|
 HellRun-spel|Spelmenu|100 TRAPPEN · ÉÉN UITGANG|Neem je tijd. Bekijk de vallen. Spring voor elke munt.|OPGESLAGEN ROUTE|EERSTE STAP|voltooid|open|vergrendeld|CONTROLEPUNT|
 OPGESLAGEN|INGANG|UITGANG|Je level, controlepunt en saldo worden automatisch opgeslagen.|{lives} levens · {cost} munten = +1 leven.|LEVEL {n}|{coins} munten · {deaths} keer gestorven.|De volgende trap wacht.|BEGREPEN|VOLGENDE LEVEL|
 GEWONNEN!|UITGANG BEREIKT|Je hebt alle 100 levels voltooid.|ALLE MUNTEN VERZAMELD · UITGANG OPEN|TIJD OM|JE BENT GESTORVEN|CONTROLEPUNT OPGESLAGEN|Maak opslagruimte vrij om je spel op te slaan.|{done} voltooid · {open} ontgrendeld|Elke uitgang leidt naar de volgende trap.|
 GEEN LEVENS MEER|Koop een leven en ga verder vanaf je controlepunt. Je verzamelde levelmunten blijven behouden.|+1 LEVEN · {cost} MUNTEN|Je hebt nog {n} munten nodig.|LEVEL OPNIEUW · {lives} ♥|Begin dit level opnieuw met {lives} levens. Het controlepunt en de levelmunten worden gewist; je saldo en ontgrendelde levels blijven.|+1 LEVEN|Het spel verlaten?|VERLATEN|BLIJVEN|
 Het spel kan niet worden geopend. Werk Android System WebView bij en probeer opnieuw.|Sluiten|VOORTGANG OPGESLAGEN|CONTROLEPUNT {n} · OPGESLAGEN`,
 'RODE TRAPPEN|STEILE TOREN|VERRE SPRONGEN|ZAGENGALERIJ|INSTORTEND PAD|DUBBELE TREDEN|HOGE TERRASSEN|LASERPOORTEN|NAALDTREDEN|GEMENGDE PROEF',
 'Beweeg en spring tegelijk. Houd op je telefoon een richting vast en tik op springen. Toetsenbord: A/D of pijlen en spatie.|Verzamel alle levelmunten en bereik de uitgang. Je saldo uitgeven sluit de uitgang niet.|Groene vlaggen slaan je controlepunt op zodra alle eerdere munten zijn verzameld.|Let op de vallen. Lasers waarschuwen voor ze schieten; gebarsten treden storten in.|Je hebt 3 levens. Elke dood kost er één. Een nieuw leven kost 5 munten.|Zonder levens kun je er één kopen om je controlepunt te behouden of dit level opnieuw beginnen met 3 levens. Opnieuw spelen levert opnieuw munten op.');
 add('pl','Polski',`
 JĘZYK|Wybierz język|WRÓĆ|START|KONTYNUUJ|MAPA|100 POZIOMÓW|ZASADY|PAUZA|MENU GŁÓWNE|
 POZIOM|MONETY|ŻYCIA|SALDO|CZAS|SKOK|Ruch w lewo|Ruch w prawo|Włącz dźwięk|Wyłącz dźwięk|
 Gra HellRun|Menu gry|100 SCHODÓW · JEDNO WYJŚCIE|Nie spiesz się. Obserwuj pułapki. Skacz po każdą monetę.|ZAPISANA DROGA|PIERWSZY KROK|ukończone|otwarte|zablokowane|PUNKT KONTROLNY|
 ZAPISANO|WEJŚCIE|WYJŚCIE|Poziom, punkt kontrolny i saldo zapisują się automatycznie.|Życia: {lives} · {cost} monet = +1 życie.|POZIOM {n}|Monety: {coins} · Zgony: {deaths}.|Kolejne schody czekają.|ROZUMIEM|NASTĘPNY POZIOM|
 ZWYCIĘSTWO!|WYJŚCIE OSIĄGNIĘTE|Ukończono wszystkie 100 poziomów.|WSZYSTKIE MONETY ZEBRANE · WYJŚCIE OTWARTE|KONIEC CZASU|GINIESZ|PUNKT KONTROLNY ZAPISANY|Zwolnij miejsce na urządzeniu, aby zapisać grę.|Ukończone: {done} · Odblokowane: {open}|Każde wyjście prowadzi do następnych schodów.|
 BRAK ŻYĆ|Kup życie, aby kontynuować od punktu kontrolnego i zachować zebrane monety poziomu.|+1 ŻYCIE · {cost} MONET|Brakujące monety: {n}.|POWTÓRZ POZIOM · {lives} ♥|Rozpocznij ten poziom od nowa. Liczba żyć: {lives}. Punkt kontrolny i monety poziomu zostaną wyzerowane; saldo i odblokowane poziomy pozostaną.|+1 ŻYCIE|Wyjść z gry?|WYJDŹ|ZOSTAŃ|
 Nie można otworzyć gry. Zaktualizuj Android System WebView i spróbuj ponownie.|Zamknij|POSTĘP ZAPISANY|PUNKT {n} · ZAPISANO`,
 'CZERWONE SCHODY|STROMA WIEŻA|DŁUGIE SKOKI|GALERIA PIŁ|KRUSZĄCA SIĘ ŚCIEŻKA|PODWÓJNE STOPNIE|WYSOKIE TARASY|BRAMY LASEROWE|WĄSKIE STOPNIE|PRÓBA MIESZANA',
 'Poruszaj się i skacz jednocześnie. Na telefonie przytrzymaj kierunek i dotknij skoku. Klawiatura: A/D lub strzałki i spacja.|Zbierz wszystkie monety poziomu, a następnie dotrzyj do wyjścia. Wydawanie salda nie zamyka wyjścia.|Zielona flaga zapisuje punkt kontrolny po zebraniu wszystkich wcześniejszych monet.|Obserwuj pułapki. Lasery ostrzegają przed strzałem, a popękane stopnie się zapadają.|Masz 3 życia. Każda śmierć zabiera jedno. Nowe życie kosztuje 5 monet.|Bez żyć kup jedno, by zachować punkt kontrolny, albo rozpocznij ten poziom od nowa z 3 życiami. Powtórne przejście pozwala znów zdobywać monety.');
 add('sv','Svenska',`
 SPRÅK|Välj språk|TILLBAKA|STARTA|FORTSÄTT|KARTA|100 NIVÅER|REGLER|PAUS|HUVUDMENY|
 NIVÅ|MYNT|LIV|SALDO|TID|HOPPA|Gå åt vänster|Gå åt höger|Slå på ljud|Stäng av ljud|
 Spelet HellRun|Spelmeny|100 TRAPPOR · EN UTGÅNG|Ta det lugnt. Se upp för fällor. Hoppa efter varje mynt.|SPARAD RESA|FÖRSTA STEGET|klarade|öppna|låsta|KONTROLLPUNKT|
 SPARAT|INGÅNG|UTGÅNG|Nivå, kontrollpunkt och saldo sparas automatiskt.|{lives} liv · {cost} mynt = +1 liv.|NIVÅ {n}|{coins} mynt · {deaths} dödsfall.|Nästa trappa väntar.|FÖRSTÅTT|NÄSTA NIVÅ|
 SEGER!|UTGÅNGEN NÅDD|Du har klarat alla 100 nivåer.|ALLA MYNT SAMLADES · UTGÅNGEN ÖPPEN|TIDEN ÄR UTE|DU DOG|KONTROLLPUNKT SPARAD|Frigör lagringsutrymme på enheten för att spara spelet.|{done} klarade · {open} upplåsta|Varje utgång leder till nästa trappa.|
 INGA LIV KVAR|Köp ett liv och fortsätt från kontrollpunkten med nivåns insamlade mynt kvar.|+1 LIV · {cost} MYNT|Du behöver {n} mynt till.|STARTA OM NIVÅN · {lives} ♥|Starta om denna nivå med {lives} liv. Kontrollpunkten och nivåns mynt återställs; saldot och upplåsta nivåer finns kvar.|+1 LIV|Lämna spelet?|LÄMNA|STANNA|
 Spelet kunde inte öppnas. Uppdatera Android System WebView och försök igen.|Stäng|FRAMSTEG SPARADE|KONTROLLPUNKT {n} · SPARAD`,
 'RÖDA TRAPPOR|BRANT TORN|LÅNGA HOPP|SÅGGALLERI|RASANDE STIG|DUBBLA STEG|HÖGA TERRASSER|LASERPORTAR|SMALA STEG|BLANDAD PRÖVNING',
 'Rör dig och hoppa samtidigt. På telefonen håller du en riktning och trycker på hopp. Tangentbord: A/D eller pilar och mellanslag.|Samla alla mynt på nivån och nå utgången. Att spendera saldot stänger inte utgången.|Gröna flaggor sparar kontrollpunkten när alla tidigare mynt har samlats.|Se upp för fällor. Lasrar varnar innan de skjuter; spruckna steg rasar.|Du har 3 liv. Varje dödsfall kostar ett. Ett nytt liv kostar 5 mynt.|Utan liv kan du köpa ett för att behålla kontrollpunkten eller starta om denna nivå med 3 liv. Omspelning kan ge nya mynt.');
 const SHOP_KEYS='shop|allSkins|ownedSkins|buySkin|equipSkin|equippedSkin|ownedSkin|skinPurchased|skinEquipped|cosmeticOnly|legendary|rank|confirmSkin|buyConfirm|cancel|freeSkin|collection|skinShopHint'.split('|');
 const SHOP={
  uz:`SKINLAR DO‘KONI|BARCHASI|MENIKI|SOTIB OLISH|KIYISH|KIYILGAN|SIZNIKI|{name} sotib olindi va kiyildi.|{name} kiyildi.|Skin faqat ko‘rinishni o‘zgartiradi. Tezlik, sakrash va jon bir xil qoladi.|AFSONAVIY|{rank} RANK|{name} skinini {price} tangaga sotib olasizmi?|XARIDNI TASDIQLASH|BEKOR QILISH|BEPUL|Kolleksiya · {owned}/{total}|O‘ynab tanga to‘plang. Xarid qilingan skinlar saqlanadi.`,
  en:`SKIN SHOP|ALL|OWNED|BUY SKIN|EQUIP|EQUIPPED|OWNED|{name} purchased and equipped.|{name} equipped.|Skins change appearance only. Speed, jumping and lives stay the same.|LEGENDARY|RANK {rank}|Buy the {name} skin for {price} coins?|CONFIRM PURCHASE|CANCEL|FREE|Collection · {owned}/{total}|Earn coins by playing. Purchased skins are saved.`,
  ru:`МАГАЗИН СКИНОВ|ВСЕ|МОИ|КУПИТЬ|НАДЕТЬ|НАДЕТО|КУПЛЕНО|Скин {name} куплен и надет.|Скин {name} надет.|Скины меняют только внешность. Скорость, прыжки и жизни остаются прежними.|ЛЕГЕНДАРНЫЙ|РАНГ {rank}|Купить скин {name} за {price} монет?|ПОДТВЕРДИТЬ ПОКУПКУ|ОТМЕНА|БЕСПЛАТНО|Коллекция · {owned}/{total}|Зарабатывайте монеты в игре. Купленные скины сохраняются.`,
  ar:`متجر المظاهر|الكل|مملوكة|شراء المظهر|استخدام|مستخدم|مملوك|تم شراء مظهر {name} واستخدامه.|تم استخدام مظهر {name}.|المظاهر تغيّر الشكل فقط. السرعة والقفز والأرواح لا تتغير.|أسطوري|الرتبة {rank}|شراء مظهر {name} مقابل {price} عملة؟|تأكيد الشراء|إلغاء|مجاني|المجموعة · {owned}/{total}|اجمع العملات باللعب. تُحفظ المظاهر التي تشتريها.`,
  ko:`스킨 상점|전체|보유|구매|착용|착용 중|보유 중|{name} 스킨을 구매하고 착용했습니다.|{name} 스킨을 착용했습니다.|스킨은 외형만 바꿉니다. 속도, 점프, 목숨은 그대로입니다.|전설|{rank} 등급|{price}코인으로 {name} 스킨을 구매할까요?|구매 확인|취소|무료|컬렉션 · {owned}/{total}|플레이하며 코인을 모으세요. 구매한 스킨은 저장됩니다.`,
  it:`NEGOZIO SKIN|TUTTE|POSSEDUTE|ACQUISTA|INDOSSA|IN USO|POSSEDUTA|Skin {name} acquistata e indossata.|Skin {name} indossata.|Le skin cambiano solo l’aspetto. Velocità, salti e vite restano uguali.|LEGGENDARIA|RANGO {rank}|Acquistare la skin {name} per {price} monete?|CONFERMA ACQUISTO|ANNULLA|GRATIS|Collezione · {owned}/{total}|Guadagna monete giocando. Le skin acquistate vengono salvate.`,
  de:`SKIN-SHOP|ALLE|MEINE|KAUFEN|ANLEGEN|ANGELEGT|GEKAUFT|Skin {name} gekauft und angelegt.|Skin {name} angelegt.|Skins ändern nur das Aussehen. Tempo, Sprünge und Leben bleiben gleich.|LEGENDÄR|RANG {rank}|Skin {name} für {price} Münzen kaufen?|KAUF BESTÄTIGEN|ABBRECHEN|KOSTENLOS|Sammlung · {owned}/{total}|Verdiene Münzen beim Spielen. Gekaufte Skins werden gespeichert.`,
  fr:`BOUTIQUE DE SKINS|TOUS|POSSÉDÉS|ACHETER|ÉQUIPER|ÉQUIPÉ|POSSÉDÉ|Skin {name} acheté et équipé.|Skin {name} équipé.|Les skins changent seulement l’apparence. Vitesse, sauts et vies restent identiques.|LÉGENDAIRE|RANG {rank}|Acheter le skin {name} pour {price} pièces ?|CONFIRMER L’ACHAT|ANNULER|GRATUIT|Collection · {owned}/{total}|Gagnez des pièces en jouant. Les skins achetés sont sauvegardés.`,
  es:`TIENDA DE SKINS|TODOS|EN PROPIEDAD|COMPRAR|EQUIPAR|EQUIPADO|EN PROPIEDAD|Skin {name} comprado y equipado.|Skin {name} equipado.|Los skins solo cambian el aspecto. La velocidad, los saltos y las vidas no cambian.|LEGENDARIO|RANGO {rank}|¿Comprar el skin {name} por {price} monedas?|CONFIRMAR COMPRA|CANCELAR|GRATIS|Colección · {owned}/{total}|Gana monedas jugando. Los skins comprados se guardan.`,
  pt:`LOJA DE SKINS|TODAS|ADQUIRIDAS|COMPRAR|EQUIPAR|EQUIPADA|ADQUIRIDA|Skin {name} comprada e equipada.|Skin {name} equipada.|As skins só mudam a aparência. Velocidade, saltos e vidas continuam iguais.|LENDÁRIA|RANK {rank}|Comprar a skin {name} por {price} moedas?|CONFIRMAR COMPRA|CANCELAR|GRÁTIS|Coleção · {owned}/{total}|Ganhe moedas jogando. As skins compradas ficam salvas.`,
  zh:`皮肤商店|全部|已拥有|购买|装备|已装备|已拥有|已购买并装备{name}皮肤。|已装备{name}皮肤。|皮肤只改变外观，速度、跳跃和生命值保持不变。|传说|{rank}级|花费{price}金币购买{name}皮肤？|确认购买|取消|免费|收藏 · {owned}/{total}|游玩收集金币，购买的皮肤会自动保存。`,
  ja:`スキンショップ|すべて|所持|購入|装備|装備中|所持済み|{name}を購入して装備しました。|{name}を装備しました。|スキンは見た目だけを変えます。速度・ジャンプ・ライフは変わりません。|レジェンダリー|{rank}ランク|{price}コインで{name}を購入しますか？|購入を確定|キャンセル|無料|コレクション · {owned}/{total}|プレイしてコインを集めよう。購入したスキンは保存されます。`,
  tr:`KOSTÜM MAĞAZASI|TÜMÜ|BENİMKİLER|SATIN AL|KUŞAN|KUŞANILDI|ALINDI|{name} satın alındı ve kuşanıldı.|{name} kuşanıldı.|Kostümler yalnızca görünümü değiştirir. Hız, zıplama ve canlar aynı kalır.|EFSANEVİ|{rank} RÜTBESİ|{name} kostümü {price} paraya satın alınsın mı?|SATIN ALMAYI ONAYLA|İPTAL|ÜCRETSİZ|Koleksiyon · {owned}/{total}|Oynayarak para biriktir. Satın alınan kostümler kaydedilir.`,
  hi:`स्किन की दुकान|सभी|मेरी स्किन|खरीदें|पहनें|पहनी हुई|खरीदी हुई|{name} स्किन खरीदकर पहन ली गई।|{name} स्किन पहन ली गई।|स्किन केवल रूप बदलती है। गति, छलांग और जीवन नहीं बदलते।|लेजेंडरी|{rank} रैंक|{price} सिक्कों में {name} स्किन खरीदें?|खरीद की पुष्टि करें|रद्द करें|मुफ़्त|संग्रह · {owned}/{total}|खेलकर सिक्के कमाएँ। खरीदी गई स्किन सेव रहती हैं।`,
  id:`TOKO SKIN|SEMUA|DIMILIKI|BELI|PAKAI|DIPAKAI|DIMILIKI|Skin {name} dibeli dan dipakai.|Skin {name} dipakai.|Skin hanya mengubah penampilan. Kecepatan, lompatan, dan nyawa tetap sama.|LEGENDARIS|PERINGKAT {rank}|Beli skin {name} seharga {price} koin?|KONFIRMASI PEMBELIAN|BATAL|GRATIS|Koleksi · {owned}/{total}|Kumpulkan koin dengan bermain. Skin yang dibeli akan tersimpan.`,
  nl:`SKINWINKEL|ALLES|IN BEZIT|KOPEN|AANTREKKEN|GEDRAGEN|IN BEZIT|Skin {name} gekocht en aangetrokken.|Skin {name} aangetrokken.|Skins veranderen alleen het uiterlijk. Snelheid, sprongen en levens blijven gelijk.|LEGENDARIS|RANG {rank}|Skin {name} kopen voor {price} munten?|AANKOOP BEVESTIGEN|ANNULEREN|GRATIS|Collectie · {owned}/{total}|Verdien munten door te spelen. Gekochte skins worden opgeslagen.`,
  pl:`SKLEP ZE SKÓRKAMI|WSZYSTKIE|POSIADANE|KUP|ZAŁÓŻ|ZAŁOŻONA|POSIADANA|Skórka {name} kupiona i założona.|Skórka {name} założona.|Skórki zmieniają tylko wygląd. Szybkość, skoki i życia pozostają bez zmian.|LEGENDARNA|RANGA {rank}|Kupić skórkę {name} za {price} monet?|POTWIERDŹ ZAKUP|ANULUJ|ZA DARMO|Kolekcja · {owned}/{total}|Zdobywaj monety podczas gry. Kupione skórki są zapisywane.`,
  sv:`SKINBUTIK|ALLA|ÄGDA|KÖP|ANVÄND|ANVÄNDS|ÄGD|Skin {name} köpt och används nu.|Skin {name} används nu.|Skins ändrar bara utseendet. Hastighet, hopp och liv är oförändrade.|LEGENDARISK|RANG {rank}|Köp skin {name} för {price} mynt?|BEKRÄFTA KÖP|AVBRYT|GRATIS|Samling · {owned}/{total}|Samla mynt genom att spela. Köpta skins sparas.`
 };
 for(const [code,ui] of Object.entries(SHOP)){
  const values=ui.split('|');if(values.length!==SHOP_KEYS.length)throw Error(code+': incomplete shop translations');
  Object.assign(packs[code].strings,Object.fromEntries(SHOP_KEYS.map((key,i)=>[key,values[i]])));
 }
 KEYS.push(...SHOP_KEYS);
 const api={packs,keys:KEYS,lang:'uz',get locales(){return Object.entries(packs).map(([code,p])=>({code,name:p.name,rtl:p.rtl}));},
  t(key,params={}){const value=packs[this.lang]?.strings[key]??packs.en.strings[key]??key;return value.replace(/\{(\w+)\}/g,(_,name)=>String(params[name]??'{'+name+'}'));},
  route(index){return packs[this.lang].routes[index]||packs.en.routes[index];},
  rules(){return packs[this.lang].rules;},
  set(code){if(!packs[code])return false;this.lang=code;if(typeof document!=='undefined'){document.documentElement.lang=code;document.documentElement.dir=packs[code].rtl?'rtl':'ltr';}try{if(typeof localStorage!=='undefined')localStorage.setItem('hellrun-language',code);}catch{}return true;},
  nativeDialog(){return{title:this.t('exitQuestion'),exit:this.t('exitApp'),stay:this.t('stay')};}
 };
 let preferred='uz';try{if(typeof localStorage!=='undefined')preferred=localStorage.getItem('hellrun-language')||'uz';}catch{}
 api.set(packs[preferred]?preferred:'uz');
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.I18n=api;
})(typeof globalThis!=='undefined'?globalThis:this);
