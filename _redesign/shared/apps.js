/* Shared mockup data: real apps, real icons and screens from the repo. Paths are relative to _redesign/NN-name/ */
window.R = '../../';          // repo root
window.A = '../assets/';      // mockup assets (Klein art, Pug art)
window.APPS = [
  { no:'SNS-001', id:'ssnd', name:'Szybciej Się Nie Da', short:'Szybciej', kind:'English words for Polish speakers',
    line:'The 500 most common English words in 50 days, 10 a day. No grammar.',
    tags:['No account','Works offline'], cat:'Education', c1:'#c9f23a', c2:'#1f5a2b',
    icon:R+'szybciej-sie-nie-da/img/icon-192.png',
    shots:[R+'szybciej-sie-nie-da/img/fiszka-przod.webp',R+'szybciej-sie-nie-da/img/quiz.webp',R+'szybciej-sie-nie-da/img/statystyki.webp'],
    play:'https://play.google.com/store/apps/details?id=pl.snoochiesoft.szybciej' },
  { no:'SNS-002', id:'mossy', name:'Mossy', short:'Mossy', kind:'Cosy ADHD games for adults',
    line:'Sixteen tiny cosy games for focus and calm. 1 to 3 minutes a round, no ads.',
    tags:['No ads','Works offline'], cat:'Games', c1:'#8fd34a', c2:'#46205c',
    icon:R+'mossy/img/icon-192.png',
    shots:[R+'mossy/img/shots/hub.webp',R+'mossy/img/shots/time-blind-holding.webp',R+'mossy/img/shots/new-brain-paper.webp'],
    play:'https://play.google.com/store/apps/details?id=com.mossyapp.mossy' },
  { no:'SNS-003', id:'fakechat', name:'Fake Chat Maker', short:'Fake Chat', kind:'Fake chats for jokes and stories',
    line:'Write a fake text conversation, style it and save it as a picture.',
    tags:['No account','Works offline'], cat:'Entertainment', c1:'#b9a8ff', c2:'#c8341c',
    icon:R+'fakechat/img/icon-192.png',
    shots:[R+'fakechat/img/screen-editor.webp',R+'fakechat/img/screen-style.webp',R+'fakechat/img/screen-home.webp'],
    play:'https://play.google.com/store/apps/details?id=pl.snoochiesoft.fakechat' },
  { no:'SNS-004', id:'loopclass', name:'Loopclass', short:'Loopclass', kind:'School timetable and grades',
    line:'Timetable, homework, exams and grades in one planner. Widgets, no account.',
    tags:['No account','No subscription'], cat:'Education', c1:'#ffc21a', c2:'#1d1a2b',
    icon:R+'loopclass/img/icon-192.png',
    shots:[R+'loopclass/img/screen-week.webp',R+'loopclass/img/screen-today-dark.webp',R+'loopclass/img/screen-tasks.webp'],
    play:'https://play.google.com/store/apps/details?id=app.loopclass.planner' },
  { no:'SNS-005', id:'transcriber', name:'Offline Audio Transcriber', short:'Transcriber', kind:'Speech to text on your phone',
    line:'Voice notes, lectures and MP3s into text. Nothing is uploaded.',
    tags:['Nothing uploaded','Works offline'], cat:'Productivity', c1:'#ffde4a', c2:'#17191f',
    icon:R+'audio-transcriber/img/icon-192.png',
    shots:[R+'audio-transcriber/img/screens/en/01.webp',R+'audio-transcriber/img/screens/en/02.webp',R+'audio-transcriber/img/screens/en/03.webp'],
    play:'https://play.google.com/store/apps/details?id=pl.snoochiesoft.transcriber' },
  { no:'SNS-006', id:'pray', name:'Christian Pray Everyday', short:'Pray', kind:'Daily Bible verse and prayer',
    line:'A verse read aloud, 25 recorded prayers and 215 Bible stories.',
    tags:['No ads','Verse of the day free'], cat:'Lifestyle', c1:'#5ec8ef', c2:'#14233f',
    icon:R+'christian-pray/img/icon-192.png',
    shots:[R+'christian-pray/img/screen-today.webp',R+'christian-pray/img/screen-verses.webp',R+'christian-pray/img/screen-prayers.webp'],
    play:'#' },
  { no:'SNS-007', id:'pug', name:'Pug Bubble Dig', short:'Pug Dig', kind:'Offline bubble shooter with Bigi the pug',
    line:'Shoot bubbles, dig through 50 eras and find treasure with Bigi.',
    tags:['Offline','50 eras'], cat:'Games', c1:'#ffc94a', c2:'#3b2a12',
    icon:A+'pug/icon.png',
    shots:[A+'pug/1_gra.jpg',A+'pug/2_podroz.jpg',A+'pug/3_wyscig.jpg'],
    play:'https://play.google.com/store/apps/details?id=pl.snoochiesoft.pugbubbledig' }
];
window.RULES = [
  ['No account','Open the app and use it. Nothing to sign up for.'],
  ['Works offline','Your data stays on your phone. Plane, train, no Wi-Fi: it still works.'],
  ['Honest pricing','You see what it costs before you pay. No surprise walls.']
];
window.EMAIL = 'SnoochieSoft@proton.me';
window.PLAY_BADGE = R+'img/badges/play-en.png';
