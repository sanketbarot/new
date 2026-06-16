'use strict';

const $ = id => document.getElementById(id);
const wcText = $('wcText');

function countWords() {
    const text = wcText.value;
    
    // Words
    const words = text.trim() ? text.trim().split(/\s+/).filter(w => w.length > 0) : [];
    const wordCount = words.length;
    
    // Characters
    const charsAll = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    
    // Sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const sentenceCount = sentences.length;
    
    // Paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paraCount = paragraphs.length;
    
    // Lines
    const lines = text.split(/\n/).filter(l => l.trim().length > 0);
    const lineCount = lines.length;
    
    // Reading time (225 wpm)
    const readMinutes = Math.ceil(wordCount / 225);
    const speakMinutes = Math.ceil(wordCount / 150);
    
    // Avg word length
    const avgWord = wordCount > 0 
        ? (words.reduce((sum, w) => sum + w.length, 0) / wordCount).toFixed(1) 
        : 0;
    
    // Avg sentence length
    const avgSentence = sentenceCount > 0 
        ? Math.round(wordCount / sentenceCount) 
        : 0;
    
    // Longest word
    const longest = wordCount > 0 
        ? words.reduce((a, b) => a.length > b.length ? a : b) 
        : '-';
    
    // Numbers
    const numbers = (text.match(/\d+/g) || []).length;
    
    $('wcWords').textContent = wordCount.toLocaleString('en-IN');
    $('wcCharsAll').textContent = charsAll.toLocaleString('en-IN');
    $('wcCharsNoSpace').textContent = charsNoSpace.toLocaleString('en-IN');
    $('wcSentences').textContent = sentenceCount.toLocaleString('en-IN');
    $('wcParagraphs').textContent = paraCount.toLocaleString('en-IN');
    $('wcLines').textContent = lineCount.toLocaleString('en-IN');
    $('wcReadTime').textContent = readMinutes + ' min';
    $('wcSpeakTime').textContent = speakMinutes + ' min';
    $('wcAvgWord').textContent = avgWord + ' chars';
    $('wcAvgSentence').textContent = avgSentence + ' words';
    $('wcLongest').textContent = longest.length > 20 ? longest.substring(0, 20) + '...' : longest;
    $('wcNumbers').textContent = numbers;
}

function pasteText() {
    navigator.clipboard.readText().then(text => {
        wcText.value = text;
        countWords();
        showToast('✅ Pasted!');
    }).catch(() => showToast('❌ Paste failed'));
}

function clearText() {
    wcText.value = '';
    countWords();
    showToast('🗑️ Cleared!');
}

function loadSample() {
    wcText.value = `The quick brown fox jumps over the lazy dog. This is a sample text for the word counter. It contains multiple sentences and paragraphs.

This is the second paragraph. It demonstrates how the counter handles different types of text.

You can use this tool for various purposes including counting words in essays, articles, social media posts, and more!`;
    countWords();
    showToast('📝 Sample loaded!');
}

function copyWcText() {
    copyToClipboard(wcText.value, '✅ Text copied!');
}

document.addEventListener('DOMContentLoaded', () => {
    countWords();
    renderRelatedTools('word-counter', 'utility', 6);
    console.log('✅ Word Counter Loaded');
});