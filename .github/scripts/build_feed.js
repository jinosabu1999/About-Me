#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   BUILD FEED — generates feed.xml, the RSS feed of the site's changelog.

   Why: "Recent Updates" is already a live, dated, versioned feed, but it was
   only readable in a browser. A portfolio that gets rebuilt is something
   people want to follow, not visit, so the same notes are published as RSS:
   feed.xml, linked from the page head so browsers and feed readers can find
   it on their own.

   The feed is generated from index.html — the single source of truth. The
   extractor below is the same one the page uses to read the changelog out of
   the deployed file (jclExtractChangelog), so the feed can never drift from
   what a visitor actually sees.

   Usage:
     node tools/build_feed.js           write feed.xml
     node tools/build_feed.js --check   exit 1 if feed.xml is out of date

   Output is deterministic: no "now" timestamps, so rebuilding an unchanged
   page produces a byte-identical file and the workflow only commits when the
   feed really changed.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const path = require('path');

/* The repository root is wherever index.html lives, so this script keeps
   working no matter which folder it is parked in. */
function findRoot(from) {
  let dir = from;
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, 'index.html'))) return dir;
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return path.resolve(from, '..');
}

const ROOT = findRoot(__dirname);
const SRC = path.join(ROOT, 'index.html');
const OUT = path.join(ROOT, 'feed.xml');

const SITE_URL = 'https://jinosabu1999.github.io/About-Me/';
const FEED_URL = SITE_URL + 'feed.xml';
const ITEM_LINK = SITE_URL + '#recent-updates';
const CHANNEL_TITLE = 'Jino Sabu — Recent Updates';
const CHANNEL_DESC = 'Release notes for the portfolio and the in-browser toolkit — every update, dated and versioned.';

/* ── 1. Read the changelog out of index.html ───────────────────────────────
   Same tolerant walk as the page: the array may use any key order, single or
   double quotes, any number of lines. */

function extractChangelog(source) {
  const src = String(source || '');
  const verMatch = /SITE_VERSION\s*=\s*['"]([^'"]+)['"]/.exec(src);
  const version = verMatch ? verMatch[1] : null;

  const anchor = /SITE_CHANGELOG_FALLBACK\s*=\s*\[/.exec(src);
  if (!anchor) return { version: version, entries: [] };
  const open = src.indexOf('[', anchor.index);

  let depth = 0, end = -1, quote = '', escaped = false;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  if (end === -1) return { version: version, entries: [] };

  const body = src.slice(open, end);
  const entries = [];
  const objRe = /\{([^{}]*)\}/g;
  let m;
  while ((m = objRe.exec(body)) !== null) {
    const chunk = m[1];
    const field = (key) => {
      const fm = new RegExp(key + "\\s*:\\s*('(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\")").exec(chunk);
      if (!fm) return '';
      return fm[1].slice(1, -1)
        .replace(/\\u([0-9a-fA-F]{4})/g, (u, h) => String.fromCharCode(parseInt(h, 16)))
        .replace(/\\n/g, ' ')
        .replace(/\\r/g, ' ')
        .replace(/\\t/g, ' ')
        .replace(/\\(['"`\\])/g, '$1');
    };
    const v = field('version'), d = field('date'), t = field('text');
    if (!v && !d && !t) continue;
    entries.push({ version: v, date: d, text: t });
  }
  return { version: version, entries: entries };
}

/* ── 2. Dates ──────────────────────────────────────────────────────────────
   The changelog writes dates the way a person does — "4th Nov 2026". RSS
   wants RFC 822, and a fixed offset keeps the output byte-stable. */

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseDate(str) {
  const m = /(\d{1,2})\s*(?:st|nd|rd|th)?\s+([A-Za-z]{3,9})\.?\s+(\d{4})/.exec(String(str || ''));
  if (!m) return null;
  const month = MONTHS[m[2].toLowerCase().slice(0, 3)];
  if (!month) return null;
  const d = new Date(Date.UTC(Number(m[3]), month - 1, Number(m[1])));
  if (isNaN(d.getTime())) return null;
  return d;
}

function rfc822(date) {
  const p = (n) => String(n).padStart(2, '0');
  return DAYS[date.getUTCDay()] + ', ' + p(date.getUTCDate()) + ' ' + MONTH_NAMES[date.getUTCMonth()] +
    ' ' + date.getUTCFullYear() + ' 00:00:00 +0000';
}

/* ── 3. XML helpers ─────────────────────────────────────────────────────── */

function xmlEscape(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function cdata(value) {
  return '<![CDATA[' + String(value == null ? '' : value).replace(/]]>/g, ']]]]><![CDATA[>') + ']]>';
}

/* ── 4. Items ───────────────────────────────────────────────────────────────
   The title is the version plus the first sentence of the note, so a reader
   shows something meaningful without opening the item. */

function itemTitle(entry) {
  const text = String(entry.text || '').replace(/\s+/g, ' ').trim();
  let first = text;
  const stop = text.indexOf('. ');
  if (stop > 0) first = text.slice(0, stop + 1);
  if (first.length > 120) first = first.slice(0, 116).replace(/\s+\S*$/, '') + '…';
  const version = String(entry.version || '').trim();
  return version ? version + ' — ' + first : first;
}

function buildFeed(entries, version) {
  const dated = entries.map((entry) => ({
    entry: entry,
    date: parseDate(entry.date)
  }));

  // Newest first, the same order the page renders them in.
  dated.sort((a, b) => {
    if (a.date && b.date) return b.date - a.date;
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  const newest = dated.find((d) => d.date);
  const lastBuildDate = newest ? rfc822(newest.date) : rfc822(new Date(Date.UTC(2026, 0, 1)));

  const items = dated.map(({ entry, date }) => {
    const v = String(entry.version || '').trim();
    const guid = FEED_URL + '#' + (v || 'entry');
    const text = String(entry.text || '').replace(/\s+/g, ' ').trim();
    return [
      '    <item>',
      '      <title>' + xmlEscape(itemTitle(entry)) + '</title>',
      '      <link>' + xmlEscape(ITEM_LINK) + '</link>',
      '      <guid isPermaLink="false">' + xmlEscape(guid) + '</guid>',
      date ? '      <pubDate>' + rfc822(date) + '</pubDate>' : null,
      '      <description>' + cdata('<p>' + text + '</p>') + '</description>',
      '    </item>'
    ].filter(Boolean).join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>' + xmlEscape(CHANNEL_TITLE) + '</title>',
    '    <link>' + xmlEscape(SITE_URL) + '</link>',
    '    <description>' + xmlEscape(CHANNEL_DESC) + '</description>',
    '    <language>en</language>',
    '    <lastBuildDate>' + lastBuildDate + '</lastBuildDate>',
    '    <generator>About-Me/tools/build_feed.js</generator>',
    '    <atom:link href="' + xmlEscape(FEED_URL) + '" rel="self" type="application/rss+xml" />',
    items,
    '  </channel>',
    '</rss>',
    ''
  ].join('\n');
}

/* ── 5. Run ─────────────────────────────────────────────────────────────── */

function main() {
  const check = process.argv.includes('--check');
  const html = fs.readFileSync(SRC, 'utf-8');
  const parsed = extractChangelog(html);
  if (!parsed.entries.length) {
    console.error('build_feed: no changelog entries found in index.html');
    process.exit(1);
  }
  const xml = buildFeed(parsed.entries, parsed.version);

  if (check) {
    const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf-8') : '';
    if (current !== xml) {
      console.error('build_feed: feed.xml is out of date — run `node tools/build_feed.js`');
      process.exit(1);
    }
    console.log('build_feed: feed.xml is up to date (' + parsed.entries.length + ' entries)');
    return;
  }

  fs.writeFileSync(OUT, xml, 'utf-8');
  console.log('build_feed: feed.xml written — ' + parsed.entries.length + ' entries, site version ' + (parsed.version || '?'));
}

main();
