// Centralized configuration for easy customization of all story copy and personal secret messages.

export const UNIVERSE_CONFIG = {
  recipientName: 'ORNI',

  scene1: {
    introLine1: 'Somewhere in this universe...',
    introLine2: 'Something special is waiting for you.',
    actionPrompt: 'Touch to discover ✨',
  },

  scene3: {
    tapHint: 'Tap to open the letter ✨',
    greeting: 'Hey Orni,',
    body: 'This little universe has a tiny surprise waiting for you. ✨',
    continueButton: 'Continue the Journey',
  },

  scene5: {
    title: 'One last surprise...',
    openGiftButton: 'Open your little gift 🎁',
  },

  scene6: {
    paragraphs: [
      'Some people make ordinary moments feel a little more special.',
      'I hope this little surprise brings a smile to your face.',
      'Keep Smiling, Orni. 💜',
    ],
    closingLine: 'Made with a little magic by Walid, especially for Orni. 💜',
    unlockSecretButton: 'Unlock One Last Secret 🔐',
    replayButton: 'Experience Again ↻',
  },

  // Easily customizable secret personal message revealed in Scene 6's secret letter interaction:
  PERSONAL_SECRET_MESSAGE:
    'You deserve all the little happiness this world has to offer. Never stop smiling. ✨',
} as const;
