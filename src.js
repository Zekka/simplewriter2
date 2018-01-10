// source: https://gist.github.com/raisch/1018823
// tokenize(str)
// extracts semantically useful tokens from a string containing English-language sentences
// @param {String}    the string to tokenize
// @returns {Array}   contains extracted tokens

var tokenize = function(str) {

   var punct='\\['+ '\\!'+ '\\"'+ '\\#'+ '\\$'+              // since javascript does not
             '\\%'+ '\\&'+ '\\\''+ '\\('+ '\\)'+             // support POSIX character
             '\\*'+ '\\+'+ '\\,'+ '\\\\'+ '\\-'+             // classes, we'll need our
             '\\.'+ '\\/'+ '\\:'+ '\\;'+ '\\<'+              // own version of [:punct:]
             '\\='+ '\\>'+ '\\?'+ '\\@'+ '\\['+
             '\\]'+ '\\^'+ '\\_'+ '\\`'+ '\\{'+
             '\\|'+ '\\}'+ '\\~'+ '\\]',

       re=new RegExp(                                        // tokenizer
          // '\\s*'+            // discard possible leading whitespace
          '('+               // start capture group #1
            '\\.{3}'+            // ellipsis (must appear before punct)
          '|'+               // alternator
            '\\w+\\-\\w+'+       // hyphenated words (must appear before punct)
          '|'+               // alternator
            '\\w+\'(?:\\w+)?'+   // compound words (must appear before punct)
          '|'+               // alternator
            '\\w+'+              // other words
          '|'+               // alternator
            '['+punct+']'+        // punct
          ')'                // end capture group
        );

   // grep(ary[,filt]) - filters an array
   //   note: could use jQuery.grep() instead
   // @param {Array}    ary    array of members to filter
   // @param {Function} filt   function to test truthiness of member,
   //   if omitted, "function(member){ if(member) return member; }" is assumed
   // @returns {Array}  all members of ary where result of filter is truthy

   function grep(ary,filt) {
     var result=[];
     for(var i=0,len=ary.length;i++<len;) {
       var member=ary[i]||'';
       if(filt && (typeof filt === 'Function') ? filt(member) : member) {
         result.push(member);
       }
     }
     return result;
   }

   return grep( str.split(re) );   // note: filter function omitted
                                   //       since all we need to test
                                   //       for is truthiness
} // end tokenize()

var render = function(input) {
  var words = tokenize(input);
  var sentence = [];
  var all = [];

  var i;
  for (i = 0; i < words.length; i++) {
    var word = words[i];
    sentence.push(renderWord(word))
    if (word == "." || word == "!" || word == "?" || word == "...") {
      all.push(renderSentence(sentence));
      sentence = [];
    }
  }
  if (sentence.length > 0) { all.push(renderSentence(sentence)); }

  return renderAll(all);
}

var renderWord = function(word) {
  var baseText = document.createTextNode(word);
  var classes = ""

  if (wordIsApproved(word)) {
    classes = "preApproved"
  } else if (word.length < 6) {
    classes = "probablyOk";
  } else if (word.length < 10) {
    classes = "toolong" + word.length;
  } else {
    classes = "wtf";
  }

  var el = document.createElement("span");
  el.appendChild(baseText);
  el.className = classes;
  return el;
}

var renderSentence = function(sentence) {
  var sentenceEl = document.createElement("span");
  var i;
  for (i = 0; i < sentence.length; i++) {
    sentenceEl.appendChild(sentence[i]);
  }
  var wordCount = sentence.length/2;
  var maxOKWords = 7;
  var maxExtraWords = 10;
  var lengthAbove = wordCount - maxOKWords;
  if (lengthAbove >= 0) {
    if (lengthAbove >= maxExtraWords) {
      sentenceEl.style.fontSize = "30%";
    } else {
      sentenceEl.style.fontSize = "" + (20 + ((maxExtraWords - lengthAbove)/maxExtraWords) * 80) + "%";
    }
  }

  return sentenceEl;
}

var renderAll = function(all) {
  var allEl = document.createElement("span");
  var i;
  for (i = 0; i < all.length; i++) {
    allEl.appendChild(all[i]);
  }
  return allEl;
}

document.getElementById("words").addEventListener('input', function() {
  document.getElementById("wordsbox").innerHTML = '';
  document.getElementById("wordsbox").appendChild(render(document.getElementById("words").value));
}, false);

HOMEMADEWORDS = [
  "let's", "you're", "that's", "they're", "she's", "it's", "what's", "you'll", "he'll", "they'll", "we'll", "she'll",
  "thousand", "million", "billion", "trillion",
  "welcome",
  "favorite",
  "?", ".", "!", "(", ")", ",", "...",
  "syntax"
]

var wordIsApproved = function(word) {
  word = word.toLowerCase();
  return XKCDWORDS.indexOf(word) != -1 || HOMEMADEWORDS.indexOf(word) != -1;
}
