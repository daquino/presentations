Reveal.initialize({
    // Full list of configuration options available here:
    // https://github.com/hakimel/reveal.js#configuration
    controls: true,
    progress: true,
    history: true,
    rollingLinks: false,

    // Optional libraries used to extend on reveal.js
    dependencies: [
        { src: 'vendor/reveal.js/lib/js/highlight.js', async: true, callback: function() { window.hljs.initHighlightingOnLoad(); } },
        { src: 'vendor/reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: 'vendor/reveal.js/lib/js/showdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'vendor/reveal.js/lib/js/data-markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'vendor/reveal.js/plugin/zoom-js/zoom.js', condition: function() { return !!document.body.classList; } }
    ]
});
