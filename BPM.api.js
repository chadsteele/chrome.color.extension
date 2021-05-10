const config = { rgb: { red: 220, green: 150, blue: 150 } };

var rgb = config.rgb;
function getColorFromBPM() {

    // randomly change color
    function adjust(color) {
        const delta = 50 * Math.random();
        if (color < 200) color = Math.min(255, color + delta);
        else color = Math.max(50, color - delta);
        return color;
    }

    function randomColor(rgb) {
        var { red, green, blue } = rgb || config.rgb;
        return { red: adjust(red), green: adjust(green), blue: adjust(blue) };
    }

    return randomColor(rgb);  //evolve random color using the last as a seed
}
