/*
  GyuLab Music — Vertical Lyric Video Template
  Run in Adobe After Effects on Windows: File > Scripts > Run Script File...
*/
(function buildGyuLabLyricTemplate() {
    var W = 1080, H = 1920, FPS = 30, DURATION = 180;
    var MEDIA_W = 540, MEDIA_H = 600;
    var project, master, mediaComp, control;
    var DESKTOP_PATH = Folder.desktop.fsName.replace(/\\/g, "/");
    var SUPPLIED_AUDIO = DESKTOP_PATH + "/월급은 어디로 갔을까.wav";
    var SUPPLIED_ARTWORK = DESKTOP_PATH + "/월급을 빨아가는 지출의 호수.png";
    var SUPPLIED_SUBTITLES = DESKTOP_PATH + "/월급은 어디로 갔을까_sync.smi";

    function addSlider(layer, name, value) {
        var effect = layer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
        effect.name = name;
        effect.property(1).setValue(value);
        return effect;
    }

    function applyPreferredKoreanFont(doc) {
        // Ask AE for an actually registered PostScript font before assigning it.
        // This avoids the NULL font-instance error caused by an assumed name.
        try {
            if (app.fonts && app.fonts.getFontsByPostScriptName) {
                var candidates = ["NanumGothic", "MalgunGothic"];
                for (var i = 0; i < candidates.length; i++) {
                    var matches = app.fonts.getFontsByPostScriptName(candidates[i]);
                    if (matches && matches.length > 0) {
                        doc.font = matches[0].postScriptName;
                        break;
                    }
                }
            }
        } catch (ignore) {}
    }

    function addText(comp, name, value, y, size, color, bold) {
        var layer = comp.layers.addText(value);
        var docProp = layer.property("ADBE Text Properties").property("ADBE Text Document");
        var doc = docProp.value;
        doc.fontSize = size;
        doc.fillColor = color;
        doc.applyFill = true;
        doc.applyStroke = false;
        doc.justification = ParagraphJustification.CENTER_JUSTIFY;
        // Tracking is measured in 1/1000 em in AE. 25 is a restrained,
        // editorial title spacing; lyric styling below uses 35.
        doc.tracking = 25;
        // Don't force a font by PostScript name: a missing or differently
        // registered Windows font can trigger AE's NULL font-instance warning.
        // AE retains an available default/fallback Korean font instead.
        applyPreferredKoreanFont(doc);
        // Only title styling uses faux bold; lyric styling stays font-safe.
        try { if (name === "01_TITLE") { doc.fauxBold = true; } } catch (ignore) {}
        docProp.setValue(doc);
        layer.name = name;
        layer.property("ADBE Transform Group").property("ADBE Position").setValue([W / 2, y]);
        return layer;
    }

    function sliderExpression(controlName) {
        return 'thisComp.layer("00_CONTROL").effect("' + controlName + '")("Slider")';
    }

    function importFootageIfPresent(path) {
        var file = new File(path);
        if (!file.exists) { return null; }
        var options = new ImportOptions(file);
        return project.importFile(options);
    }

    function makePlaceholderMedia(artwork) {
        mediaComp = project.items.addComp("MAIN_MEDIA__REPLACE_SOURCE_HERE", MEDIA_W, MEDIA_H, 1, DURATION, FPS);
        mediaComp.bgColor = [0.03, 0.03, 0.03];
        var placeholder = mediaComp.layers.addSolid([0.12, 0.12, 0.12], "REPLACE_WITH_IMAGE_OR_VIDEO", MEDIA_W, MEDIA_H, 1, DURATION);
        if (artwork !== null) {
            var artworkLayer = mediaComp.layers.add(artwork);
            artworkLayer.name = "REPLACE_WITH_IMAGE_OR_VIDEO";
            var scale = Math.max(MEDIA_W / artwork.width, MEDIA_H / artwork.height) * 100;
            artworkLayer.property("ADBE Transform Group").property("ADBE Scale").setValue([scale, scale]);
            artworkLayer.property("ADBE Transform Group").property("ADBE Position").setValue([MEDIA_W / 2, MEDIA_H / 2]);
            artworkLayer.outPoint = DURATION;
            placeholder.remove();
        }
        return mediaComp;
    }

    function makeBackground() {
        // 13 is the visible blurred background. 11 remains a disabled source
        // reference, making the source relationship obvious to editors.
        var sourceReference = master.layers.add(mediaComp);
        sourceReference.name = "11_BACKGROUND_MEDIA (source reference)";
        sourceReference.enabled = false;

        var blurLayer = master.layers.add(mediaComp);
        blurLayer.name = "13_BACKGROUND_BLUR";
        blurLayer.property("ADBE Transform Group").property("ADBE Scale").expression = "[400, 400]";
        var blur = blurLayer.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
        blur.name = "Background Blur";
        blur.property(1).expression = sliderExpression("Background Blur");
        try { blur.property(2).setValue(1); } catch (ignore) {}
        blurLayer.moveToEnd();

        var dark = master.layers.addSolid([0, 0, 0], "12_BACKGROUND_DARK", W, H, 1, DURATION);
        dark.property("ADBE Transform Group").property("ADBE Opacity").expression = sliderExpression("Background Darkness");
        dark.moveBefore(blurLayer);
    }

    function addMainMedia() {
        var layer = master.layers.add(mediaComp);
        layer.name = "03_MAIN_MEDIA";
        layer.property("ADBE Transform Group").property("ADBE Scale").expression = "s=" + sliderExpression("Main Media Scale") + "; [s,s]";
        layer.property("ADBE Transform Group").property("ADBE Position").expression = "[thisComp.width/2," + sliderExpression("Main Media Y Position") + "]";
    }

    function addLyrics() {
        var section = addText(master, "04_SECTION", "", 1160, 34, [0.95, 0.95, 0.95], false);
        section.property("ADBE Transform Group").property("ADBE Position").expression = "[thisComp.width/2," + sliderExpression("Lyrics Y Position") + " - 100]";

        var samples = ["불을 끄면 보이는 것들", "천천히 눈에 들어오는 것들", "커튼 사이 스며든 달빛", "건너편의 작은 창 하나", ""];
        var layerNames = ["05_LYRIC_01", "06_LYRIC_02", "07_LYRIC_03", "08_LYRIC_04", "09_LYRIC_05"];
        var lyrics = [];
        for (var i = 0; i < 5; i++) {
            var lyric = addText(master, layerNames[i], samples[i], 1260 + i * 62, 36, [1, 1, 1], i === 0);
            lyric.property("ADBE Transform Group").property("ADBE Position").expression =
                "[thisComp.width/2," + sliderExpression("Lyrics Y Position") + " + " + i + " * " + sliderExpression("Lyrics Line Spacing") + "]";
            var targetOpacity = (i === 0) ? "100" : sliderExpression("Inactive Lyric Opacity");
            lyric.property("ADBE Transform Group").property("ADBE Opacity").expression =
                "fadeIn=linear(time,inPoint,inPoint+.25,0,1); fadeOut=linear(time,outPoint-.25,outPoint,1,0); (" + targetOpacity + ") * Math.min(fadeIn,fadeOut);";
            lyrics.push(lyric);
        }
        return lyrics;
    }

    function decodeSmiText(value) {
        return value.replace(/<br\s*\/?>/ig, "\r").replace(/<[^>]+>/g, "").replace(/&nbsp;/ig, "").replace(/&amp;/ig, "&").replace(/^\s+|\s+$/g, "");
    }

    function readSmiCues(path) {
        var file = new File(path);
        if (!file.exists || !file.open("r")) { return []; }
        var source = file.read();
        file.close();
        var syncs = [], match;
        var re = /<SYNC\s+Start\s*=\s*(\d+)[^>]*>\s*<P[^>]*>([\s\S]*?)(?=<SYNC|$)/ig;
        while ((match = re.exec(source)) !== null) {
            syncs.push({ start: parseInt(match[1], 10) / 1000, text: decodeSmiText(match[2]) });
        }
        var cues = [];
        for (var i = 0; i < syncs.length; i++) {
            if (syncs[i].text !== "") { cues.push({ start: syncs[i].start, end: (i + 1 < syncs.length) ? syncs[i + 1].start : DURATION, text: syncs[i].text }); }
        }
        return cues;
    }

    function setStyledTextAtTime(layer, time, value, active) {
        var textProp = layer.property("ADBE Text Properties").property("ADBE Text Document");
        var doc = textProp.value;
        doc.text = value;
        doc.fontSize = active ? 43 : 40; // active lyric is exactly 3px larger
        doc.fillColor = active ? [1, 1, 1] : [0.72, 0.72, 0.72];
        doc.tracking = 35;
        applyPreferredKoreanFont(doc);
        textProp.setValueAtTime(time, doc);
    }

    function applySmiLyrics(lyrics, smiPath) {
        var cues = readSmiCues(smiPath);
        if (cues.length === 0) { return false; }
        for (var line = 0; line < lyrics.length; line++) {
            var opacity = lyrics[line].property("ADBE Transform Group").property("ADBE Opacity");
            opacity.expression = "";
            opacity.setValueAtTime(0, 0);
            setStyledTextAtTime(lyrics[line], 0, "", false);
        }
        var previousActive = -1;
        for (var i = 0; i < cues.length; i++) {
            var pageStart = Math.floor(i / 5) * 5;
            var activeSlot = i % 5;
            var transitionStart = Math.max(0, cues[i].start - 0.12);
            for (var slot = 0; slot < lyrics.length; slot++) {
                var cue = cues[pageStart + slot];
                var layer = lyrics[slot];
                var opacityProp = layer.property("ADBE Transform Group").property("ADBE Opacity");
                var before = (slot === previousActive) ? 100 : (previousActive === -1 ? 0 : 48);
                var after = cue ? ((slot === activeSlot) ? 100 : 48) : 0;
                // Only the active emphasis cross-fades; the five-line page stays
                // visible until the next group of five replaces it.
                opacityProp.setValueAtTime(transitionStart, before);
                opacityProp.setValueAtTime(cues[i].start + 0.15, after);
                setStyledTextAtTime(layer, cues[i].start, cue ? cue.text : "", slot === activeSlot);
            }
            previousActive = activeSlot;
        }
        return true;
    }

    app.beginUndoGroup("Create GyuLab Lyric Video Template");
    try {
        if (app.project === null) { app.newProject(); }
        project = app.project;
        var artwork = importFootageIfPresent(SUPPLIED_ARTWORK);
        var audio = importFootageIfPresent(SUPPLIED_AUDIO);
        mediaComp = makePlaceholderMedia(artwork);
        // The generic template starts at 180 seconds. A supplied full song may
        // extend it, so the real track is never silently truncated.
        var timelineDuration = (audio !== null) ? Math.max(DURATION, audio.duration) : DURATION;
        mediaComp.duration = timelineDuration;
        master = project.items.addComp("GYULAB_LYRIC_VIDEO__1080x1920", W, H, 1, timelineDuration, FPS);
        master.bgColor = [0, 0, 0];

        control = master.layers.addNull(DURATION);
        control.name = "00_CONTROL";
        control.label = 9;
        addSlider(control, "Main Media Scale", 100);
        addSlider(control, "Main Media Y Position", 770);
        addSlider(control, "Lyrics Y Position", 1260);
        addSlider(control, "Lyrics Line Spacing", 82);
        addSlider(control, "Background Darkness", 72);
        addSlider(control, "Background Blur", 55);
        addSlider(control, "Inactive Lyric Opacity", 48);

        addText(master, "01_TITLE", "월급은 어디로 갔을까", 315, 54, [1, 1, 1], true);
        addText(master, "02_ARTIST", "by @gyulabs", 385, 25, [0.9, 0.9, 0.9], false);
        makeBackground();
        addMainMedia();
        var lyrics = addLyrics();
        addText(master, "10_BRANDING", "GYULAB MUSIC", 1754, 25, [0.92, 0.92, 0.92], false);
        if (audio !== null) {
            var audioLayer = master.layers.add(audio);
            audioLayer.name = "AUDIO__월급은 어디로 갔을까";
            audioLayer.outPoint = audio.duration;
            audioLayer.moveToEnd();
        }
        applySmiLyrics(lyrics, SUPPLIED_SUBTITLES);

        control.moveToBeginning();
        master.openInViewer();
        alert("GyuLab Lyric Video template created.\nReplace media inside MAIN_MEDIA__REPLACE_SOURCE_HERE.");
    } catch (err) {
        alert("Template creation failed:\n" + err.toString());
    } finally {
        app.endUndoGroup();
    }
}());
