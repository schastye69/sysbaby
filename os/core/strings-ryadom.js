/* sys.baby OS — core/strings-ryadom.js · СЛОВА ШЁПОТА «РЯДОМ» (D-1435…D-1439, архив H4e5)
 * Вливаются в общий словарь через window.sbAddStrings (D-800). Здесь — то, что говорит комната «Рядом»
 * (утверждённое демо К3а): строка присутствия, голосовое письмо, смайлики, «позвать в разговор» и честная
 * заглушка там, где нужен разговор на троих (общего ключа на троих у Шёпота ещё нет). Слова прежнего
 * Шёпота — в core/strings-shepot.js, их этот файл не трогает. */
(function () {
  "use strict";
  if (typeof window.sbAddStrings !== "function") return;
  window.sbAddStrings({
    en: {
      "home.voiceOffHint": "One more thing: if my voice ever gets in the way, you can turn it off in Settings → Sound.",
      "set.voiceOff": "turn the home voice off",
      "set.voiceOffSub": "Phrases at the bottom of the screen stop appearing; quiet news goes to the bell. Questions and warnings still speak — without them the home cannot ask or warn.",
      "shr.voice.coming": "a voice letter is arriving in parts…",
      "shr.attach": "Attach a file ({files})",
      "shr.delLetter": "Delete the letter",
      "shr.start.note": "Such a conversation lives only in this browser. To talk to a person, invite them with Whisper — the conversation starts when they accept the invitation.",
      "shr.pres.near": "near · a letter has just come",
      "shr.smile": "Smileys",
      "shr.mic": "Record a voice letter",
      "shr.rec.stop": "Send the voice letter",
      "shr.rec.cancel": "Do not send",
      "shr.rec.hint": "recording · tap to send",
      "shr.rec.local": "The voice stays on this device until it is sealed and sent like any letter.",
      "shr.rec.none": "This browser cannot record a voice here.",
      "shr.rec.denied": "The microphone was not allowed — nothing was recorded.",
      "shr.rec.long": "A voice letter travels in parts, one per beat: it takes longer than a text letter.",
      "shr.voice": "voice letter · {d}",
      "shr.voice.play": "Play the voice letter, {d}",
      "shr.invite": "Invite into the conversation",
      "shr.inv.title": "Invite into the conversation",
      "shr.inv.three": "A conversation for three is not ready yet: Whisper has no shared key for three people. It will come in a separate release.",
      "shr.inv.new": "New invitation for one person",
      "shr.inv.close": "Close"
    },
    ru: {
      "home.voiceOffHint": "{V:И ещё: если мой голос будет мешать — выключи его в Настройках, в «Звуке».|И ещё: если мой голос будет мешать — выключите его в Настройках, в «Звуке».}",
      "set.voiceOff": "выключить голос дома",
      "set.voiceOffSub": "Фразы внизу экрана больше не появляются, тихие новости ложатся в колокольчик. Вопросы и предупреждения остаются — без них дом не может спросить и предупредить.",
      "shr.voice.coming": "голосовое идёт частями…",
      "shr.attach": "Прикрепить файл ({files})",
      "shr.delLetter": "Удалить письмо",
      "shr.start.note": "Такая переписка живёт только в этом браузере. Чтобы говорить с человеком, позовите его через Шёпот — переписка начнётся, когда он примет приглашение.",
      "shr.pres.near": "рядом · письмо пришло только что",
      "shr.smile": "Смайлики",
      "shr.mic": "Записать голосовое",
      "shr.rec.stop": "Отправить голосовое",
      "shr.rec.cancel": "Не отправлять",
      "shr.rec.hint": "запись · коснитесь, чтобы отправить",
      "shr.rec.local": "Голос остаётся на этом устройстве, пока не запечатан и не отправлен, как письмо.",
      "shr.rec.none": "Этот браузер не умеет записывать голос здесь.",
      "shr.rec.denied": "Микрофон не разрешён — ничего не записано.",
      "shr.rec.long": "Голосовое идёт частями, по одной за такт: дольше, чем письмо словами.",
      "shr.voice": "голосовое · {d}",
      "shr.voice.play": "Послушать голосовое, {d}",
      "shr.invite": "Позвать в разговор",
      "shr.inv.title": "Позвать в разговор",
      "shr.inv.three": "Разговор втроём ещё не готов: у Шёпота пока нет общего ключа на троих. Он придёт отдельным архивом.",
      "shr.inv.new": "Новое приглашение — для одного человека",
      "shr.inv.close": "Закрыть"
    },
    ee: {
      "home.voiceOffHint": "{V:Veel üks asi: kui mu hääl segab, lülita see välja — Seaded, „Heli“.|Veel üks asi: kui mu hääl segab, lülitage see välja — Seaded, „Heli“.}",
      "set.voiceOff": "lülita kodu hääl välja",
      "set.voiceOffSub": "Laused ekraani all enam ei ilmu, vaiksed uudised lähevad kellukesse. Küsimused ja hoiatused jäävad — ilma nendeta ei saa kodu küsida ega hoiatada.",
      "shr.voice.coming": "häälkiri saabub osade kaupa…",
      "shr.attach": "Lisa fail ({files})",
      "shr.delLetter": "Kustuta kiri",
      "shr.start.note": "Selline vestlus elab ainult selles brauseris. Inimesega rääkimiseks kutsu ta Sosina kaudu — vestlus algab, kui ta kutse vastu võtab.",
      "shr.pres.near": "lähedal · kiri tuli just praegu",
      "shr.smile": "Emotikonid",
      "shr.mic": "Salvesta häälkiri",
      "shr.rec.stop": "Saada häälkiri",
      "shr.rec.cancel": "Ära saada",
      "shr.rec.hint": "salvestan · puuduta, et saata",
      "shr.rec.local": "Hääl jääb sellesse seadmesse, kuni see pitseeritakse ja saadetakse nagu kiri.",
      "shr.rec.none": "See brauser ei oska siin häält salvestada.",
      "shr.rec.denied": "Mikrofoni ei lubatud — midagi ei salvestatud.",
      "shr.rec.long": "Häälkiri liigub osade kaupa, üks takti kohta: kauem kui sõnadega kiri.",
      "shr.voice": "häälkiri · {d}",
      "shr.voice.play": "Kuula häälkirja, {d}",
      "shr.invite": "Kutsu vestlusesse",
      "shr.inv.title": "Kutsu vestlusesse",
      "shr.inv.three": "Kolmekesi vestlus pole veel valmis: Sosinal pole veel kolme inimese ühist võtit. See tuleb eraldi väljalaskega.",
      "shr.inv.new": "Uus kutse — ühele inimesele",
      "shr.inv.close": "Sulge"
    }
  });
})();
