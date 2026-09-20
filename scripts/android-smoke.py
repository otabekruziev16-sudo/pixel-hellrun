import pathlib, re, struct, subprocess, time, xml.etree.ElementTree as ET
OUT = pathlib.Path("verification")
OUT.mkdir(exist_ok=True)
APP = "uz.otabekruziev.pixelhellrun.hardcore"
def adb(*args):
    return subprocess.check_output(["adb", *args], timeout=30)
def ui():
    try:
        adb("shell", "rm", "-f", "/sdcard/hellrun-window.xml")
        adb("shell", "uiautomator", "dump", "/sdcard/hellrun-window.xml")
        data = adb("exec-out", "cat", "/sdcard/hellrun-window.xml")
        root = ET.fromstring(data)
        (OUT / "android-window.xml").write_bytes(data)
        return root
    except (ET.ParseError, subprocess.CalledProcessError, subprocess.TimeoutExpired):
        # The accessibility helper may restart during boot/rotation. The bounded
        # wait_for still fails if the requested application UI never appears.
        return ET.Element("hierarchy")
def find(root, texts):
    for node in root.iter("node"):
        label = node.get("text", "") + " " + node.get("content-desc", "")
        if any(text in label for text in texts):
            values = list(map(int, re.findall(r"\d+", node.get("bounds", ""))))
            if len(values) == 4 and values[2] > values[0] and values[3] > values[1]:
                return [(values[0] + values[2]) // 2, (values[1] + values[3]) // 2]
    return None
def tap(point):
    adb("shell", "input", "tap", str(point[0]), str(point[1]))
def rotate(rotation):
    # Update the active display through WindowManager, which also refreshes
    # the orientation immediately; a Settings database write alone may not.
    print(adb("shell", "wm", "user-rotation", "lock", str(rotation)).decode(), flush=True)
    print("Display rotation: " + adb("shell", "wm", "user-rotation").decode(), flush=True)
def screenshot(name, landscape=None):
    for _ in range(10):
        data = adb("exec-out", "screencap", "-p")
        width, height = struct.unpack(">II", data[16:24])
        if landscape is None or (width > height) == landscape:
            (OUT / name).write_bytes(data)
            return
        time.sleep(1)
    raise AssertionError("Screen did not rotate: " + name)
def launch():
    # Use the launcher intent and flags to resume the same application task.
    output = adb("shell", "am", "start", "-W", "-a", "android.intent.action.MAIN",
                 "-c", "android.intent.category.LAUNCHER", "-f", "0x10200000",
                 "-n", APP + "/.MainActivity")
    print(output.decode(), flush=True)
def wait_for(texts, message):
    deadline = time.monotonic() + 60
    while time.monotonic() < deadline:
        tree = ui()
        # A fresh Android emulator shows this one-time fullscreen tutorial.
        if find(tree, ["Viewing full screen"]):
            acknowledgement = find(tree, ["Got it"])
            if acknowledgement:
                tap(acknowledgement)
                time.sleep(1)
                continue
        point = find(tree, texts)
        if point:
            return point
        time.sleep(1)
    raise AssertionError(message)

try:
    rotate(0)
    print(adb("install", "-r", "release/HellRun-Android.apk").decode())
    adb("logcat", "-c")
    launch()
    start = wait_for(["BOSHLASH"], "Start button did not render in the Android WebView")
    screenshot("android-portrait-menu.png", False)
    tap(start)
    time.sleep(1)
    screenshot("android-portrait-game.png", False)
    pause = wait_for(["PAUZA", "Pauza"], "Pause control missing after starting")
    tap(pause)
    wait_for(["DAVOM ETISH"], "Pause overlay did not appear")
    adb("shell", "input", "keyevent", "3")
    wait_for(["Home"], "Android launcher did not appear")
    # Android briefly suppresses app switches after the Home button is pressed.
    time.sleep(5)
    launch()
    wait_for(["DAVOM ETISH"], "Pause state lost across background/resume")
    rotate(1)
    screenshot("android-landscape-pause.png", True)
    tap(wait_for(["DAVOM ETISH"], "Resume button missing after rotation"))
    time.sleep(1)
    screenshot("android-landscape-game.png", True)
    tap(wait_for(["Pauza", "PAUZA"], "Pause button missing in landscape"))
    wait_for(["DAVOM ETISH"], "Pause did not save the game")
    adb("shell", "am", "force-stop", APP)
    launch()
    wait_for(["DAVOM ETISH"], "Saved game unavailable after terminating the process")
    tap(wait_for(["◎ TIL"], "Language menu missing from the main menu"))
    tap(wait_for(["Русский"], "Russian missing from language choices"))
    wait_for(["ПРОДОЛЖИТЬ"], "Main menu did not translate to Russian")
    adb("shell", "input", "keyevent", "4")
    wait_for(["Выйти из игры?"], "Native exit dialog was not translated")
    tap(wait_for(["ОСТАТЬСЯ"], "Translated stay button missing"))
    adb("shell", "am", "force-stop", APP)
    launch()
    wait_for(["ПРОДОЛЖИТЬ"], "Language preference lost on process restart")
    logs = adb("logcat", "-d", "-b", "crash").decode("utf-8", "replace")
    assert ("Process: " + APP) not in logs, logs
    (OUT / "android-smoke.txt").write_text("PASS: install, portrait and landscape, start, pause, background/resume, saved progress, language menu, translated native exit dialog, locale after process restart, no Java crash.\n")
    print("Android emulator smoke check passed.")
finally:
    (OUT / "android-display.txt").write_bytes(adb("shell", "dumpsys", "window", "displays"))
    (OUT / "android-final.png").write_bytes(adb("exec-out", "screencap", "-p"))
    (OUT / "android-logcat.txt").write_bytes(adb("logcat", "-d", "-t", "500"))
    (OUT / "android-lifecycle.txt").write_bytes(adb("logcat", "-d", "-s", "ActivityTaskManager:I", "ActivityManager:I", "AndroidRuntime:E", "chromium:E"))
