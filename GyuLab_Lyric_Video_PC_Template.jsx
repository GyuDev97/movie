/* GyuLab Music — Desktop Lyric Video Template (1920 x 1080) */
(function buildDesktopLyricTemplate() {
    var W = 1920, H = 1080, FPS = 30, DEFAULT_DURATION = 180;
    var MEDIA_W = 840, MEDIA_H = 840, MEDIA_X = 510, MEDIA_Y = 540;
    var AUDIO_PATH = "C:/Users/gyu/Desktop/별 보러 가는 밤.wav";
    var ARTWORK_PATH = "C:/Users/gyu/Desktop/DSC08809.jpg";
    var SMI_PATH = "C:/Users/gyu/Desktop/별 보러 가는 밤_sync.smi";
    var project, comp, mediaComp;

    function importIfPresent(path) {
        var file = new File(path);
        return file.exists ? project.importFile(new ImportOptions(file)) : null;
    }
    function setNanum(doc, bold) {
        try { doc.font = "NanumGothic"; } catch (ignore) {}
        try { doc.fauxBold = bold; } catch (ignore2) {}
    }
    function addText(name, text, x, y, size, color, bold) {
        var layer = comp.layers.addText(text);
        var prop = layer.property("ADBE Text Properties").property("ADBE Text Document");
        var doc = prop.value;
        doc.fontSize = size;
        doc.fillColor = color;
        doc.applyFill = true;
        doc.applyStroke = false;
        doc.justification = ParagraphJustification.LEFT_JUSTIFY;
        doc.tracking = 25;
        setNanum(doc, bold);
        prop.setValue(doc);
        layer.name = name;
        layer.property("ADBE Transform Group").property("ADBE Position").setValue([x, y]);
        return layer;
    }
    function createMediaComp(artwork, duration) {
        mediaComp = project.items.addComp("PC_MAIN_MEDIA__REPLACE_SOURCE_HERE", MEDIA_W, MEDIA_H, 1, duration, FPS);
        mediaComp.bgColor = [0.02, 0.02, 0.02];
        if (artwork === null) {
            mediaComp.layers.addSolid([0.10, 0.10, 0.10], "REPLACE_WITH_IMAGE_OR_VIDEO", MEDIA_W, MEDIA_H, 1, duration);
        } else {
            var layer = mediaComp.layers.add(artwork);
            layer.name = "REPLACE_WITH_IMAGE_OR_VIDEO";
            var scale = Math.max(MEDIA_W / artwork.width, MEDIA_H / artwork.height) * 100;
            layer.property("ADBE Transform Group").property("ADBE Scale").setValue([scale, scale]);
            layer.property("ADBE Transform Group").property("ADBE Position").setValue([MEDIA_W / 2, MEDIA_H / 2]);
            layer.outPoint = duration;
        }
    }
    function createRoundedMatte(mediaLayer) {
        var matte = comp.layers.addShape();
        matte.name = "03_MEDIA_ROUNDED_MATTE";
        var group = matte.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        var contents = group.property("ADBE Vectors Group");
        var rect = contents.addProperty("ADBE Vector Shape - Rect");
        rect.property("ADBE Vector Rect Size").setValue([MEDIA_W, MEDIA_H]);
        rect.property("ADBE Vector Rect Roundness").setValue(68);
        var fill = contents.addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([1, 1, 1]);
        matte.property("ADBE Transform Group").property("ADBE Position").setValue([MEDIA_X, MEDIA_Y]);
        // The matte is above its media source, as required by classic AE track mattes.
        mediaLayer.trackMatteType = TrackMatteType.ALPHA;
        return matte;
    }
    function addBackground() {
        var blur = comp.layers.add(mediaComp);
        blur.name = "12_BACKGROUND_BLUR";
        blur.property("ADBE Transform Group").property("ADBE Scale").setValue([260, 260]);
        blur.property("ADBE Transform Group").property("ADBE Position").setValue([W / 2, H / 2]);
        var effect = blur.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
        effect.property(1).setValue(75);
        try { effect.property(2).setValue(1); } catch (ignore) {}
        blur.moveToEnd();
        var dark = comp.layers.addSolid([0, 0, 0], "11_BACKGROUND_DARK", W, H, 1, comp.duration);
        dark.property("ADBE Transform Group").property("ADBE Opacity").setValue(63);
        dark.moveBefore(blur);
    }
    function decodeSmi(value) {
        return value.replace(/<br\s*\/?>/ig, "\r").replace(/<[^>]+>/g, "").replace(/&nbsp;/ig, "").replace(/&amp;/ig, "&").replace(/^\s+|\s+$/g, "");
    }
    function readSmi() {
        var file = new File(SMI_PATH), result = [];
        if (!file.exists || !file.open("r")) { return result; }
        var source = file.read(); file.close();
        var syncs = [], re = /<SYNC\s+Start\s*=\s*(\d+)[^>]*>\s*<P[^>]*>([\s\S]*?)(?=<SYNC|$)/ig, m;
        while ((m = re.exec(source)) !== null) { syncs.push({ t: parseInt(m[1], 10) / 1000, text: decodeSmi(m[2]) }); }
        for (var i = 0; i < syncs.length; i++) { if (syncs[i].text !== "") { result.push(syncs[i]); } }
        return result;
    }
    function styleTextAt(layer, time, text, active) {
        var prop = layer.property("ADBE Text Properties").property("ADBE Text Document");
        var doc = prop.value;
        doc.text = text;
        doc.fontSize = active ? 43 : 40;
        doc.fillColor = active ? [1, 1, 1] : [0.65, 0.65, 0.65];
        doc.tracking = 35;
        setNanum(doc, active);
        prop.setValueAtTime(time, doc);
    }
    function addRollingLyrics() {
        var lines = [], cues = readSmi(), previous = -1;
        for (var slot = 0; slot < 5; slot++) {
            var line = addText("0" + (5 + slot) + "_LYRIC_0" + (slot + 1), "", 1085, 470 + slot * 78, 40, [0.65, 0.65, 0.65], false);
            line.property("ADBE Transform Group").property("ADBE Opacity").setValueAtTime(0, 0);
            styleTextAt(line, 0, "", false);
            lines.push(line);
        }
        for (var i = 0; i < cues.length; i++) {
            var page = Math.floor(i / 5) * 5, active = i % 5, start = cues[i].t;
            for (var j = 0; j < 5; j++) {
                var cue = cues[page + j], opacity = lines[j].property("ADBE Transform Group").property("ADBE Opacity");
                var before = (j === previous) ? 100 : (previous === -1 ? 0 : 48);
                var after = cue ? (j === active ? 100 : 48) : 0;
                opacity.setValueAtTime(Math.max(0, start - 0.12), before);
                opacity.setValueAtTime(start + 0.15, after);
                styleTextAt(lines[j], start, cue ? cue.text : "", j === active);
            }
            previous = active;
        }
    }

    app.beginUndoGroup("Create GyuLab Desktop Lyric Template");
    try {
        if (app.project === null) { app.newProject(); }
        project = app.project;
        var artwork = importIfPresent(ARTWORK_PATH), audio = importIfPresent(AUDIO_PATH);
        var duration = audio ? Math.max(DEFAULT_DURATION, audio.duration) : DEFAULT_DURATION;
        createMediaComp(artwork, duration);
        comp = project.items.addComp("GYULAB_DESKTOP_LYRIC__1920x1080", W, H, 1, duration, FPS);
        comp.bgColor = [0, 0, 0];
        addBackground();
        var media = comp.layers.add(mediaComp);
        media.name = "04_MAIN_MEDIA";
        media.property("ADBE Transform Group").property("ADBE Position").setValue([MEDIA_X, MEDIA_Y]);
        createRoundedMatte(media);
        addText("01_TITLE", "별 보러 가는 밤", 1085, 315, 58, [0.95, 0.95, 0.95], false);
        addText("02_ARTIST", "by @gyulabs", 1085, 370, 24, [0.70, 0.70, 0.70], false);
        addRollingLyrics();
        addText("10_BRANDING", "GYULAB MUSIC", 1085, 875, 20, [0.68, 0.68, 0.68], false);
        if (audio !== null) {
            var audioLayer = comp.layers.add(audio);
            audioLayer.name = "AUDIO__별 보러 가는 밤";
            audioLayer.outPoint = audio.duration;
            audioLayer.moveToEnd();
        }
        comp.openInViewer();
        alert("GyuLab Desktop lyric template created.");
    } catch (err) {
        alert("Desktop template creation failed:\n" + err.toString());
    } finally { app.endUndoGroup(); }
}());
