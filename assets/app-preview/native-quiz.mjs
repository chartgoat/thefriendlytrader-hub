// Questions and routing ported verbatim from iOS Sources/QuizData.swift.
export const QUIZ = {
  "q1": {
    "prompt": "How long have you been actively trading?",
    "answers": [
      {
        "text": "Under 1 year",
        "type": "question",
        "to": "n3"
      },
      {
        "text": "1-2 years",
        "type": "question",
        "to": "q2"
      },
      {
        "text": "2-5 years",
        "type": "question",
        "to": "q2"
      },
      {
        "text": "5+ years",
        "type": "question",
        "to": "q2"
      }
    ]
  },
  "q2": {
    "prompt": "What trading tools do you currently use?",
    "answers": [
      {
        "text": "Just my broker's basic app (Robinhood, etc.)",
        "type": "question",
        "to": "n3"
      },
      {
        "text": "TradingView with basic charts",
        "type": "question",
        "to": "e3"
      },
      {
        "text": "TradingView with multiple indicators",
        "type": "question",
        "to": "e3"
      },
      {
        "text": "Multiple advanced platforms",
        "type": "question",
        "to": "e3"
      }
    ]
  },
  "n3": {
    "prompt": "What's your biggest challenge right now?",
    "answers": [
      {
        "text": "Understanding basic chart patterns",
        "type": "question",
        "to": "n4"
      },
      {
        "text": "Learning what all the trading terms mean",
        "type": "question",
        "to": "n4"
      },
      {
        "text": "Figuring out which stocks to buy",
        "type": "question",
        "to": "n4"
      },
      {
        "text": "Not losing money on every trade",
        "type": "question",
        "to": "n4"
      }
    ]
  },
  "n4": {
    "prompt": "How do you currently find trading ideas?",
    "answers": [
      {
        "text": "Social media tips",
        "type": "outcome",
        "to": "marketNewbie"
      },
      {
        "text": "I subscribe to multiple alert services",
        "type": "outcome",
        "to": "marketNewbie"
      },
      {
        "text": "Headline news",
        "type": "outcome",
        "to": "marketNewbie"
      },
      {
        "text": "I honestly don't know where to start",
        "type": "outcome",
        "to": "marketNewbie"
      }
    ]
  },
  "e3": {
    "prompt": "What percentage of your account do you risk per trade?",
    "answers": [
      {
        "text": "10% or more",
        "type": "outcome",
        "to": "riskRoulettePlayer"
      },
      {
        "text": "5-10%",
        "type": "question",
        "to": "e4"
      },
      {
        "text": "1-5%",
        "type": "question",
        "to": "e4"
      },
      {
        "text": "I use proper position sizing",
        "type": "question",
        "to": "e4"
      }
    ]
  },
  "e4": {
    "prompt": "When a trade goes against you, what do you do?",
    "answers": [
      {
        "text": "Add more to average down",
        "type": "outcome",
        "to": "riskRoulettePlayer"
      },
      {
        "text": "Panic and sell immediately",
        "type": "outcome",
        "to": "emotionalRollerCoaster"
      },
      {
        "text": "Stick to my stop loss",
        "type": "question",
        "to": "e5"
      },
      {
        "text": "HODL, hope it comes back",
        "type": "outcome",
        "to": "emotionalRollerCoaster"
      }
    ]
  },
  "e5": {
    "prompt": "What's your biggest trading obstacle?",
    "answers": [
      {
        "text": "Controlling my emotions",
        "type": "outcome",
        "to": "emotionalRollerCoaster"
      },
      {
        "text": "Taking too much risk",
        "type": "outcome",
        "to": "riskRoulettePlayer"
      },
      {
        "text": "Not having enough time",
        "type": "outcome",
        "to": "timeCruncher"
      },
      {
        "text": "Staying disciplined",
        "type": "question",
        "to": "e6"
      },
      {
        "text": "I don't have a plan",
        "type": "outcome",
        "to": "emotionalRollerCoaster"
      }
    ]
  },
  "e6": {
    "prompt": "How often can you actively monitor your trades?",
    "answers": [
      {
        "text": "All day, I'm always watching",
        "type": "outcome",
        "to": "riskRoulettePlayer"
      },
      {
        "text": "Between work meetings and breaks",
        "type": "outcome",
        "to": "timeCruncher"
      },
      {
        "text": "Constantly, and it stresses me out",
        "type": "outcome",
        "to": "emotionalRollerCoaster"
      }
    ]
  }
};
