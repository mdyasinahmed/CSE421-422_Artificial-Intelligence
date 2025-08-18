// Updated tokenizer
function tokenize(input) {
  return input
    .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '')
    .toLowerCase()
    .split(/\s+/);
}

function sentiment(phrase) {
  const negationWords = [
    'not', "don't", "didn't", "no", "never",
    "can't", "won't", "isn't", "wasn't", "aren't", "couldn't", "shouldn't", "wouldn't"
  ];

  const tokens = tokenize(phrase);
  let score = 0;
  let words = [];
  let positive = [];
  let negative = [];

  let negateNext = false;

  for (let i = 0; i < tokens.length; i++) {
    let word = tokens[i];

    if (negationWords.includes(word)) {
      negateNext = true;
      continue;
    }

    if (!afinn.hasOwnProperty(word)) {
      negateNext = false; 
      continue;
    }

    let value = afinn[word];
    words.push(word);

    if (negateNext) {
      value *= -1;
      negateNext = false;
    }

    if (value > 0) {
      positive.push(word);
    } else if (value < 0) {
      negative.push(word);
    }

    score += value;
  }

  const verdict = score === 0 ? "NEUTRAL" : score < 0 ? "NEGATIVE" : "POSITIVE";

  return {
    verdict: verdict,
    score: score,
    comparative: score / tokens.length,
    positive: [...new Set(positive)],
    negative: [...new Set(negative)],
  };
}
