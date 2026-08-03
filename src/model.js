const defaultOptions = {
  alpha: 1,
  minTokenLength: 2
};

export class NaiveBayesTextModel {
  constructor(options = {}) {
    this.options = { ...defaultOptions, ...options };
    this.labels = [];
    this.labelCounts = new Map();
    this.tokenCounts = new Map();
    this.totalTokensByLabel = new Map();
    this.vocabulary = new Set();
    this.totalDocuments = 0;
  }

  train(examples) {
    for (const example of examples) {
      const label = example.label;
      if (!this.labelCounts.has(label)) {
        this.labels.push(label);
        this.labelCounts.set(label, 0);
        this.tokenCounts.set(label, new Map());
        this.totalTokensByLabel.set(label, 0);
      }

      this.labelCounts.set(label, this.labelCounts.get(label) + 1);
      this.totalDocuments += 1;

      for (const token of tokenize(example.text, this.options.minTokenLength)) {
        this.vocabulary.add(token);
        const counts = this.tokenCounts.get(label);
        counts.set(token, (counts.get(token) ?? 0) + 1);
        this.totalTokensByLabel.set(label, this.totalTokensByLabel.get(label) + 1);
      }
    }

    return this;
  }

  predict(text) {
    if (this.totalDocuments === 0) {
      throw new Error("Cannot predict before training the model.");
    }

    const tokens = tokenize(text, this.options.minTokenLength);
    const vocabularySize = Math.max(this.vocabulary.size, 1);
    const scores = this.labels.map((label) => {
      const prior = Math.log(this.labelCounts.get(label) / this.totalDocuments);
      const counts = this.tokenCounts.get(label);
      const totalTokens = this.totalTokensByLabel.get(label);
      const likelihood = tokens.reduce((score, token) => {
        const count = counts.get(token) ?? 0;
        return score + Math.log((count + this.options.alpha) / (totalTokens + this.options.alpha * vocabularySize));
      }, prior);

      return { label, logScore: likelihood };
    });

    scores.sort((left, right) => right.logScore - left.logScore);
    const probabilities = softmax(scores);
    const best = probabilities[0];

    return {
      label: best.label,
      confidence: best.probability,
      scores: probabilities
    };
  }
}

export function tokenize(text, minLength = 2) {
  return text
    .toLowerCase()
    .replace(/([a-z]+)-([a-z]+)/g, "$1 $2")
    .match(/[a-z0-9_]+/g)
    ?.filter((token) => token.length >= minLength) ?? [];
}

function softmax(scores) {
  const max = Math.max(...scores.map((score) => score.logScore));
  const weighted = scores.map((score) => ({
    label: score.label,
    weight: Math.exp(score.logScore - max)
  }));
  const total = weighted.reduce((sum, score) => sum + score.weight, 0);

  return weighted
    .map((score) => ({
      label: score.label,
      probability: score.weight / total
    }))
    .sort((left, right) => right.probability - left.probability);
}
