# Ken Burns slideshow

Strating from this nice example - https://codepen.io/SaijoGeorge/pen/LxeGgY - ended up in a small SPA, which allows you do drag your local images to the gallery with a ken burns effect. Enjoy!

## Keyboard shortcuts

    ArrowRight - Next Image
    ArrowLeft - Previous Image
    i - Show/Hide info and configuration box
    n - Show/Hide filename
    space - Start/Stop slideshow (animation continues)
    b - Black-And-White filter

## Create a site with autoplaying slideshow

1. Add class `autoplay` to body:

```html
<body class="autoplay">
```

2. Insert images in `#image-wrap`:

```html
<div id="image-wrap">
    <img src="1.jpg">
    <img src="2.jpg">
    …
</div>
```

3. Optional: Add audio file:

```html
<audio id="audio-music" controls loop src="music.mp3"></audio>
```

See the example `index.php` file for server side usage.

## License

MIT
