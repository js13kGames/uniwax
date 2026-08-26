'use strict';

/* ============================================================
   RAINBOW UNICORN audio — ZzFX SFX + ZzFXM background music
   Depends on: zzfx_micro.js (zzfx, zzfxG, zzfxR, zzfxX, zzfxV)
               zzfxm.js     (zzfxM)
   ============================================================ */

// comfortable master volume
zzfxV = .4;

// muted flag (read by game.js to draw the icon)
let mt2 = false;

// current music source node
let musSource = null;

// ensure the shared audio context is running (must be triggered by a user gesture)
function ia() {
  if (zzfxX && zzfxX.state === 'suspended') zzfxX.resume();
}

// RAINBOW UNICORN theme (ZzFXM format: [instruments, patterns, sequence, BPM])
const unicornTheme = [
  [
    [.5,0,400,,,.20,1],
    [.42,0,200,,,.25,2],
    [.3,0,800,,,.12,3],
    [.24,0,1600,,,.08,1]
  ],
  [
    [
      [0,0,12,0,16,0,19,0,24,0,19,0,16,0,12,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [2,0,24,0,28,0,31,0,36,0,31,0,28,0,24,0]
    ],
    [
      [0,0,7,0,11,0,14,0,19,0,14,0,11,0,7,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [2,0,19,0,23,0,26,0,31,0,26,0,23,0,19,0]
    ],
    [
      [0,0,5,0,9,0,12,0,17,0,12,0,9,0,5,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [2,0,17,0,21,0,24,0,29,0,24,0,21,0,17,0]
    ],
    [
      [0,0,0,0,7,0,12,0,19,0,24,0,19,0,12,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [2,0,12,0,19,0,24,0,31,0,36,0,31,0,24,0]
    ]
  ],
  [0,1,2,3,0,1,2,3],
  138
];

// start looping background music (idempotent)
function startMus() {
  ia();
  if (mt2 || musSource) return;
  stopMus();
  try {
    const [L, R] = zzfxM(unicornTheme[0], unicornTheme[1], unicornTheme[2], unicornTheme[3]);
    const buf = zzfxX.createBuffer(2, L.length, zzfxR);
    buf.getChannelData(0).set(L);
    buf.getChannelData(1).set(R);
    musSource = zzfxX.createBufferSource();
    musSource.buffer = buf;
    musSource.loop = true;
    const gain = zzfxX.createGain();
    gain.gain.value = .8;
    musSource.connect(gain).connect(zzfxX.destination);
    musSource.start();
  } catch (e) {
    musSource = null;
  }
}

function stopMus() {
  if (musSource) {
    try { musSource.stop(); } catch (e) {}
    musSource = null;
  }
}

function toggleMute() {
  ia();
  mt2 = !mt2;
  if (mt2) stopMus();
  else startMus();
  ps('click');
}

// play a sound effect by name
function ps(type) {
  ia();
  if (mt2) return;
  switch (type) {
    case 'move':   zzfx(.3,0,300,0,.03,.06,0,1.5,120); break;                       // soft hoof step
    case 'block':  zzfx(.4,0,180,0,.04,.16,3); break;                               // placing a wall
    case 'gem':    zzfx(.35,0,1400,0,.02,.10);
                   setTimeout(()=>zzfx(.3,0,1900,0,.02,.12),70); break;             // crystal sparkle
    case 'key':    zzfx(.35,0,880,0,.03,.12);
                   setTimeout(()=>zzfx(.3,0,1320,0,.03,.12),80); break;             // key chime
    case 'lock':   zzfx(.35,0,523,0,.02,.12);
                   setTimeout(()=>zzfx(.35,0,659,0,.02,.12),90);
                   setTimeout(()=>zzfx(.35,0,784,0,.02,.16),180);
                   setTimeout(()=>zzfx(.35,0,1047,0,.02,.22),270); break;           // opening seal
    case 'item':   zzfx(.35,0,1500,0,.02,.10,0,1,300); break;                       // magic sparkle
    case 'attack': zzfx(.45,0,700,0,.02,.12,-200,0,3); break;                       // shadow shatters a block
    case 'tele':   zzfx(.3,0,220,0,.06,.18,4); break;                               // teleport whoosh
    case 'shield': zzfx(.4,0,620,0,.02,.10);
                   setTimeout(()=>zzfx(.3,0,930,0,.02,.10),60); break;
    case 'win':    // rainbow explosion + unicorn neigh
      zzfx(.5,0,110,0,.4,.5,0,2);
      setTimeout(()=>zzfx(.4,0,500,0,.15,.4,0,1,120,0,0,0,0,0,0,0,0,12),60);
      setTimeout(()=>zzfx(.35,0,660,0,.02,.1),100);
      setTimeout(()=>zzfx(.35,0,880,0,.02,.12),170);
      setTimeout(()=>zzfx(.3,0,1320,0,.02,.2),240);
      break;
    case 'lose':   zzfx(.4,0,320,0,.1,.5,-90,0,3,20); break;                        // low shadow fall
    case 'click':  zzfx(.25,0,900,0,.005,.03); break;
    case 'select': zzfx(.3,0,660,0,.02,.08); break;
    case 'pick':   zzfx(.35,0,1100,0,.02,.09); break;
  }
}
