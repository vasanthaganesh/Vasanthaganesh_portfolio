import fs from 'fs';

const html = fs.readFileSync('scripts/resume_template.html', 'utf-8');
const text = html.replace(/<[^>]+>/g, ' ').toLowerCase();

const flaggedWords = ['engineered', 'developed', 'automated', 'optimized'];
const powerVerbs = ['architected', 'spearheaded', 'constructed', 'tuned', 'systematized', 'deployed', 'formulated', 'refactored', 'benchmarked'];

console.log('=== VERB REPETITION CHECK (Target: <= 1 each) ===');
let hasRepetitionIssue = false;
for (const w of flaggedWords) {
  const regex = new RegExp('\\b' + w + '\\b', 'g');
  const count = (text.match(regex) || []).length;
  console.log(`${w}: ${count}x ${count <= 1 ? '[PASS]' : '[FAIL - TOO FREQUENT]'}`);
  if (count > 1) hasRepetitionIssue = true;
}

console.log('\n=== DIVERSIFIED POWER VERBS CHECK ===');
for (const w of powerVerbs) {
  const regex = new RegExp('\\b' + w + '\\b', 'g');
  const count = (text.match(regex) || []).length;
  console.log(`${w}: ${count}x`);
}

console.log('\n=== QUANTIFIABLE METRICS CHECK ===');
const metrics = [
  '15,000+',
  '99.99%',
  '38%',
  '85%',
  '25%',
  '0%',
  '90%',
  '20-second',
  '500+',
  '98+',
  'sub-800ms',
  '1,200+',
  '15–20%',
  '100%',
  '30+',
  '65%',
  '60 fps',
  '800+',
  '100+',
  '50+',
  '60%'
];

let missingMetrics = 0;
for (const m of metrics) {
  const found = text.includes(m.toLowerCase());
  if (!found) {
    console.log(`[MISSING METRIC] ${m}`);
    missingMetrics++;
  }
}
console.log(`Metrics verified: ${metrics.length - missingMetrics} / ${metrics.length}`);

if (hasRepetitionIssue || missingMetrics > 0) {
  console.error('\nFAIL: Issues found in verification');
  process.exit(1);
} else {
  console.log('\nSUCCESS: 100% of repetition issues eliminated and all metrics verified!');
}
