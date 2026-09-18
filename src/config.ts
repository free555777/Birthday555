import { SiteConfig } from './types';

export const INITIAL_CONFIG: SiteConfig = {
  partnerName: 'Maya',
  nickname: 'My Love',
  heroTitle: 'OUR\nSTORY',
  heroSubtitle: 'A little universe created for us.',
  birthdayHeadline: 'Happy Birthday, My Whole World',
  birthdayMessage: 'May every star in this sky remind you of how deeply and endlessly you are loved.',
  storyIntroPart1: 'Some people enter your life...',
  storyIntroPart2: '...and somehow make ordinary moments unforgettable.',
  fluidTypographyText: 'You are my favorite chapter.',
  loveLetters: [
    {
      id: 'letter-birthday',
      category: 'Open On Your Birthday',
      badge: 'Letter No. 01 • Birthday Special',
      stampName: 'ROYAL AIR MAIL • 09.18',
      stampIcon: 'Cake',
      previewSubtitle: 'The day the universe made its greatest masterpiece.',
      sealColor: '#E11D48',
      salutation: 'Dearest Maya,',
      body: [
        'Happy Birthday to the girl who made my entire universe stop spinning and start feeling like home.',
        'If someone had told me years ago that an ordinary day could turn into starlight just because of a single person’s smile, I wouldn’t have believed them. Until you walked into my life.',
        'Your laughter is my favorite song, your kindness is the anchor of my world, and watching you grow into everything you dream of is the greatest honor I’ve ever had.',
        'Blow out every candle today knowing that every wish you make has already become my life’s mission to help come true.'
      ],
      postscript: 'P.S. You look breathtaking today. Just like you do every single day.',
      signoff: 'Forever & Always Yours,',
      dateTag: 'A Starlit Birthday'
    },
    {
      id: 'letter-miss-you',
      category: 'Open When You Miss Me',
      badge: 'Letter No. 02 • Distance & Heart',
      stampName: 'MIDNIGHT ORBIT • 528HZ',
      stampIcon: 'Moon',
      previewSubtitle: 'For when the room is too quiet and my hands aren’t there.',
      sealColor: '#7C3AED',
      salutation: 'My Sweetest Girl,',
      body: [
        'Whenever the distance feels a little too wide, or the night feels a little too long, I want you to close your eyes and place your hand over your heart.',
        'Feel that steady rhythm? That’s me, holding onto you across every mile. Time zones, busy days, and silence cannot dim what we share.',
        'Wrap yourself in my oversized hoodie, put on our favorite songs, and remember: no matter where I am on this planet, my thoughts are sitting right beside you, gently holding your hand.'
      ],
      postscript: 'P.S. Counting down every second until I can wrap my arms around you and not let go.',
      signoff: 'Endlessly loving you,',
      dateTag: 'Under The Same Sky'
    },
    {
      id: 'letter-smile',
      category: 'Open When You Need A Smile',
      badge: 'Letter No. 03 • Sunshine Capsule',
      stampName: 'PURE RADIANCE • GOLDEN',
      stampIcon: 'Sparkles',
      previewSubtitle: 'The silly, priceless, completely adorable things you do.',
      sealColor: '#D97706',
      salutation: 'To My Little Ray of Sunshine,',
      body: [
        'In case you forgot today: you have the kind of smile that genuinely makes people’s day brighter. And by people, I mean mostly me, who turns into a complete puddle every time you look in my direction.',
        'I adore the funny little squint your eyes make when you’re laughing so hard no sound comes out. I love how you get intensely excited about small treats, cozy sweaters, and fresh blankets.',
        'The world can be noisy and clumsy, but you bring pure magic wherever you step. Take a deep breath, drop your shoulders, and smile—because you are deeply, unconditionally cherished.'
      ],
      postscript: 'P.S. You owe me one long hug when we next meet. Interest is accumulating daily!',
      signoff: 'With all my silly love,',
      dateTag: 'Guaranteed Sunshine'
    },
    {
      id: 'letter-heavy',
      category: 'Open When The World Feels Heavy',
      badge: 'Letter No. 04 • Safe Haven',
      stampName: 'SANCTUARY • CALM WAVES',
      stampIcon: 'CloudRain',
      previewSubtitle: 'You do not have to carry the storm alone.',
      sealColor: '#0284C7',
      salutation: 'My Strong, Beautiful Love,',
      body: [
        'First, take a deep breath. Inhale gently... and let it all out.',
        'You spend so much of your life being kind, thoughtful, and strong for everyone around you. But today, you are allowed to just rest. You are allowed to be tired, or quiet, or sad without having to explain yourself.',
        'You do not have to conquer the world every single day. My love for you isn’t based on how productive you are or how bright your energy is—it is unconditional. I am your safe harbor whenever the ocean gets rough.'
      ],
      postscript: 'P.S. Let the tasks wait. You matter most. I’ve got your back, always.',
      signoff: 'Your permanent sanctuary,',
      dateTag: 'A Warm Blanket & Tea'
    },
    {
      id: 'letter-secret',
      category: 'Open For A Midnight Secret',
      badge: 'Letter No. 05 • Whispered Truth',
      stampName: 'SECRET VOW • CONSTELLATION',
      stampIcon: 'Flame',
      previewSubtitle: 'Words I whisper to the stars right before sleep.',
      sealColor: '#BE123C',
      salutation: 'My Everything,',
      body: [
        'Do you want to know a secret? There are moments when you’re simply reading, or sipping tea, or humming without noticing, and I look at you and wonder what incredible deed I did in a past life to deserve you.',
        'Loving you isn’t a decision I made once—it’s an involuntary truth that renews every time you breathe. You are woven into my dreams, my plans, and the way I see beauty in this life.',
        'If I had a thousand lives across a thousand universes, I would spend every single one searching through the galaxies until I found you all over again.'
      ],
      postscript: 'P.S. You are the easiest person to love in the entire universe.',
      signoff: 'Forever your biggest admirer,',
      dateTag: 'Late Night Whispers'
    },
    {
      id: 'letter-future',
      category: 'Open When You Dream Of Tomorrow',
      badge: 'Letter No. 06 • The Unwritten Pages',
      stampName: 'HORIZON & STARS • FOREVER',
      stampIcon: 'Compass',
      previewSubtitle: 'Road trips, cozy mornings, and all the chapters ahead.',
      sealColor: '#059669',
      salutation: 'My Partner in Everything,',
      body: [
        'When I close my eyes and imagine ten, twenty, fifty years from now, it is never about where we are—it is only about being with you.',
        'I picture lazy Sunday mornings where sunlight hits our kitchen table, messy recipes, packed bags by the door ready for spontaneous road trips, and slow evenings where we laugh about the memories we’re making right now.',
        'Today is a celebration of your birth, but it’s also a celebration of every tomorrow we get to share together. The best chapters of our story haven’t even been written yet.'
      ],
      postscript: 'P.S. Can’t wait to grow old with you and still tell everyone you’re the prettiest girl in the room.',
      signoff: 'With all my heart & future,',
      dateTag: 'To Infinity & Beyond'
    }
  ],
  loveLetterTitle: "There's something I never said...",
  loveLetterSalutation: 'Dearest Maya,',
  loveLetterBody: [
    'If I had to choose my favorite memory with you, I genuinely wouldn’t know where to begin.',
    'Was it that quiet rainy evening when we talked until three in the morning? Or the way your eyes crinkle when you laugh at the silliest things? Or just the gentle feeling of your hand resting in mine?',
    'Because somehow, effortlessly and beautifully, you became the best part of every single day.',
    'Happy Birthday to the girl who brings wonder, kindness, and light everywhere she goes. You deserve the entire cosmos.',
  ],
  loveLetterSignoff: 'Forever & Always, Yours ❤️',
  musicTitle: 'Our Song ♡',
  musicArtist: 'Acoustic Piano & Melancholy Chords',
  musicUrl: '', // Web Audio synthesized ambient acoustic piano by default, or provide custom mp3 URL
  memories: [
    {
      id: 'm1',
      title: 'The Evening by the Ocean',
      date: 'Summer Glow',
      location: 'Sunset Beach',
      description: 'The golden hour light caught in your hair. We watched the waves crash until the stars came out.',
      imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=720&q=75',
      tag: 'Sunset'
    },
    {
      id: 'm2',
      title: 'Our First Secret Cafe',
      date: 'Autumn Afternoon',
      location: 'Corner Table by the Glass',
      description: 'Hot cocoa, rainy windows, and laughing until our stomachs hurt over stories no one else would understand.',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=720&q=75',
      tag: 'Cozy'
    },
    {
      id: 'm3',
      title: 'Stargazing Under Midnight Skies',
      date: 'Late August',
      location: 'The Mountain Lookout',
      description: 'We wrapped ourselves in a wool blanket and named constellations that existed only for us.',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=720&q=75',
      tag: 'Night'
    },
    {
      id: 'm4',
      title: 'A Field of Wildflowers',
      date: 'Spring Blossom',
      location: 'The Lavender Valley',
      description: 'You ran ahead through the blossoms, turning back with that smile that stops time in its tracks.',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=720&q=75',
      tag: 'Bloom'
    },
    {
      id: 'm5',
      title: 'Spontaneous City Lights',
      date: 'Winter Twilight',
      location: 'Downtown Promenade',
      description: 'Cold hands, warm hearts, streetlights reflecting on wet pavement, and slow dancing without any music.',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=720&q=75',
      tag: 'Magic'
    },
    {
      id: 'm6',
      title: 'The Road Trip We Planned',
      date: 'Endless Horizon',
      location: 'Pacific Highway',
      description: 'Windows rolled all the way down, singing along loudly to our favorite songs with zero shame.',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=720&q=75',
      tag: 'Adventure'
    },
    {
      id: 'm7',
      title: 'That Rainy Sunday Morning',
      date: 'Lazy Daylight',
      location: 'Our Cozy Sanctuary',
      description: 'Pancakes, the smell of fresh coffee brewing, and reading books with your head on my shoulder.',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=720&q=75',
      tag: 'Peace'
    },
    {
      id: 'm8',
      title: 'The Lantern Festival',
      date: 'Celebration Night',
      location: 'Riverside Harbor',
      description: 'We wrote our secret wishes onto paper lanterns and released them into the starry night.',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=720&q=75',
      tag: 'Wishes'
    },
    {
      id: 'm9',
      title: 'Everyday Little Moments',
      date: 'Always',
      location: 'Wherever We Are',
      description: 'The in-between seconds: your sudden hugs, sleepy morning greetings, and knowing looks across crowded rooms.',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=720&q=75',
      tag: 'Love'
    }
  ],
  timeline: [
    {
      year: '2022',
      title: 'Where It All Began',
      subtitle: 'The first chapter',
      description: 'The first time we spoke, time felt like it hesitated. What started as simple hello turned into hours of shared thoughts.',
      date: 'September 2022',
      location: 'City Library steps',
      imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80'
    },
    {
      year: '2023',
      title: 'Endless Conversations',
      subtitle: 'Falling without realizing',
      description: 'Midnight voice notes, sharing our wildest dreams and deepest fears. The moment I realized you were truly one of a kind.',
      date: 'Spring 2023',
      location: 'Rooftop bench',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
    },
    {
      year: '2024',
      title: 'Unbreakable Bonds',
      subtitle: 'Through every storm and sunshine',
      description: 'Celebrating milestones, holding each other through rough weeks, and discovering that home isn’t a place—it’s a person.',
      date: 'Summer 2024',
      location: 'The Coastline',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
    },
    {
      year: '2025',
      title: 'Still Choosing You',
      subtitle: 'With every breath',
      description: 'Every morning I wake up feeling like the luckiest human alive. Building memories that will outshine the stars.',
      date: 'Autumn 2025',
      location: 'Everywhere with you',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80'
    },
    {
      year: '2026',
      title: 'And The Story Continues...',
      subtitle: 'To infinity and beyond',
      description: 'A new year of your beautiful existence. Here is to making a thousand more wishes come true together.',
      date: 'Present Day & Future',
      location: 'In the stars',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80'
    }
  ],
  reasons: [
    {
      id: 'r1',
      number: '01',
      title: 'Your Smile',
      subtitle: 'The sun after a long winter',
      description: 'The genuine, unreserved grin that lights up an entire room. It disarms any worry and turns the grayest day into poetry.',
      iconName: 'Sparkles',
      accentColor: '#FF7EB6'
    },
    {
      id: 'r2',
      number: '02',
      title: 'Your Heart',
      subtitle: 'Pure, patient and deep',
      description: 'The boundless compassion you extend to animals, strangers, and the people you love. You love with an intensity that heals.',
      iconName: 'Heart',
      accentColor: '#FFB6D9'
    },
    {
      id: 'r3',
      number: '03',
      title: 'Your Kindness',
      subtitle: 'Quiet grace in action',
      description: 'How you remember the smallest details, check in when no one else notices, and always choose gentleness.',
      iconName: 'HandHeart',
      accentColor: '#A78BFA'
    },
    {
      id: 'r4',
      number: '04',
      title: 'Your Laugh',
      subtitle: 'My favorite symphony',
      description: 'The sudden burst of laughter that escapes when you hear something genuinely hilarious. I would spend a lifetime just trying to hear it.',
      iconName: 'Music',
      accentColor: '#FF7EB6'
    },
    {
      id: 'r5',
      number: '05',
      title: 'Your Little Habits',
      subtitle: 'The nuances only I know',
      description: 'The way you tuck your hair behind your ear when concentrating, or the adorable excited dance you do when good food arrives.',
      iconName: 'Coffee',
      accentColor: '#FDE047'
    },
    {
      id: 'r6',
      number: '06',
      title: 'You Make Everything Better',
      subtitle: 'The greatest gift',
      description: 'A simple grocery run feels like an adventure with you. You make mundane life feel like a movie soundtrack is playing in the background.',
      iconName: 'Flame',
      accentColor: '#A78BFA'
    }
  ],
  finalQuote: 'And if I had to choose again...',
  finalSubquote: "I'd still choose you."
};
