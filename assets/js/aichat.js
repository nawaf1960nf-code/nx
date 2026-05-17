// Smart English conversation coach using pattern matching + topic templates.
// No external API. Responds in English with optional Arabic translation.
window.AppAiChat = (() => {
  const STORE = "enc1_chat_log";

  const topics = [
    {
      id: "intro",
      patterns: [/^(hi|hello|hey)/i, /good (morning|evening|afternoon)/i],
      reply: () => [
        "Hi there! I'm your English coach. How are you today?",
        "Hey! Ready to practise some English? Tell me what's on your mind.",
        "Hello! Let's chat. What did you do today?"
      ]
    },
    {
      id: "how-are-you",
      patterns: [/how (are|r) (you|u)/i, /how's it going/i, /what's up/i],
      reply: () => [
        "I'm doing great, thanks for asking! How about you?",
        "Pretty good! What about yourself? Anything interesting happening?",
        "Couldn't be better. What's new with you?"
      ]
    },
    {
      id: "good",
      patterns: [/^(i'm |i am )?(good|great|fine|ok|okay|well|alright)/i, /\bgood\b/i, /\bgreat\b/i, /\bfine\b/i],
      reply: () => [
        "Glad to hear it! Try to use a richer word: 'fantastic', 'pretty decent', or 'on top of the world'. 🌟",
        "Nice. What made today good?",
        "Wonderful! Tell me more — what made it a good day for you?"
      ]
    },
    {
      id: "bad",
      patterns: [/^(i'm |i am )?(bad|sad|tired|exhausted|stressed|down|terrible|awful)/i, /not (good|well|great)/i],
      reply: () => [
        "I'm sorry to hear that. Want to vent a bit? Talking helps. 💬",
        "That's tough. Do you want to talk about it, or shall we do something fun instead?",
        "Hang in there. What's been weighing on you?"
      ]
    },
    {
      id: "study",
      patterns: [/study|learn|practice|practise/i],
      reply: () => [
        "Great mindset! What part of English do you find hardest — speaking, listening, or writing?",
        "Studying daily is the secret. Try a 15-minute focused session — quality beats quantity.",
        "Awesome. Pick one specific weakness today and attack it. What is it?"
      ]
    },
    {
      id: "weather",
      patterns: [/weather|rain|sunny|cold|hot|snow|cloud/i],
      reply: () => [
        "Weather talk is classic in English! Try: 'It's been pretty miserable, hasn't it?' or 'Lovely day today!'",
        "In English, we love small-talk about weather. Useful phrase: 'It's pouring outside!' (= raining heavily).",
        "Cool topic! Try saying: 'I can't stand this heat.' or 'I'm freezing!'"
      ]
    },
    {
      id: "food",
      patterns: [/food|eat|hungry|breakfast|lunch|dinner|cook|restaurant/i],
      reply: () => [
        "I love food talk! What's your favourite dish? Try: 'My go-to comfort food is…'",
        "Yum. A useful expression: 'I'm starving!' (very hungry). Or 'I'm absolutely stuffed' (very full).",
        "Tell me about your last great meal. Was it home-cooked or eaten out?"
      ]
    },
    {
      id: "work",
      patterns: [/work|job|office|boss|career|colleague|meeting/i],
      reply: () => [
        "Work talk! Useful phrase: 'I'm swamped today' (= very busy). What's your job like?",
        "Professional English is key at C1. Try: 'Could we touch base later?' or 'Let's circle back to that.'",
        "Work can be intense. How's yours treating you lately?"
      ]
    },
    {
      id: "travel",
      patterns: [/travel|trip|holiday|vacation|country|city|flight|hotel/i],
      reply: () => [
        "Travel! Where have you been recently? Try: 'I'm itching to travel again.' (= eager to).",
        "Love travel talk. Useful: 'The flight was a nightmare!' or 'The hotel was a real gem.'",
        "Where would you go if you could fly anywhere tomorrow?"
      ]
    },
    {
      id: "yes",
      patterns: [/^(yes|yeah|yep|sure|of course|absolutely)/i],
      reply: () => [
        "Great! Tell me more then.",
        "Nice. Continue — I'm listening.",
        "Alright. What's next?"
      ]
    },
    {
      id: "no",
      patterns: [/^(no|nope|not really|nah)/i],
      reply: () => [
        "No worries. What would you rather chat about?",
        "Fair enough. Pick another topic — books, films, hobbies, future plans?",
        "Okay. Let's go a different direction. What interests you?"
      ]
    },
    {
      id: "thanks",
      patterns: [/thanks|thank you|thx|appreciate/i],
      reply: () => [
        "You're very welcome! 😊",
        "Anytime! That's what I'm here for.",
        "My pleasure. Keep going, you're doing great."
      ]
    },
    {
      id: "bye",
      patterns: [/^(bye|goodbye|see ya|see you|cya|gtg|got to go)/i],
      reply: () => [
        "See you later! Keep practising — you're making real progress. 👋",
        "Bye! Try to use one new word today in a real conversation.",
        "Take care! Come back soon — daily reps are gold."
      ]
    }
  ];

  // Fallbacks if nothing matches.
  const fallbacks = [
    "Interesting! Could you tell me more about that?",
    "Nice. Try expanding that sentence with 'because' or 'although'.",
    "Got it. How does that make you feel?",
    "I see. What happened next?",
    "Cool. Can you give me an example?",
    "That's a great topic for English practice. Why is it important to you?",
    "Hmm, I want to understand better. Could you rephrase that?",
    "Try saying it again using a different connector: however, moreover, or consequently.",
    "If you had to summarise that in one sentence, what would you say?"
  ];

  // Light grammar feedback heuristic
  function quickTips(text) {
    const tips = [];
    if (/^\s*[a-z]/.test(text)) tips.push("Start sentences with a capital letter.");
    if (/\bi\b/.test(text)) tips.push("'i' should be capital → 'I'.");
    if (/\b(dont|cant|wont|isnt|arent|wouldnt|couldnt|didnt|doesnt)\b/i.test(text))
      tips.push("Add apostrophes: don't, can't, won't, isn't, etc.");
    if (text.length > 10 && !/[.!?]$/.test(text.trim())) tips.push("Don't forget the punctuation at the end.");
    return tips.slice(0, 2);
  }

  function reply(userText) {
    const t = userText.trim();
    if (!t) return { reply: "Type something to start chatting!", tips: [] };
    for (const topic of topics) {
      if (topic.patterns.some(p => p.test(t))) {
        const opts = topic.reply();
        return { reply: opts[Math.floor(Math.random() * opts.length)], tips: quickTips(t), topic: topic.id };
      }
    }
    return { reply: fallbacks[Math.floor(Math.random() * fallbacks.length)], tips: quickTips(t) };
  }

  function loadLog() { try { return JSON.parse(localStorage.getItem(STORE) || "[]"); } catch { return []; } }
  function saveLog(log) { localStorage.setItem(STORE, JSON.stringify(log.slice(-60))); }
  function clear() { localStorage.removeItem(STORE); }

  return { reply, loadLog, saveLog, clear };
})();
