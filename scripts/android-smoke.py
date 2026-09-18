import pathlib, re, subprocess, time, xml.etree.ElementTree as ET
OUT = pathlib.Path("verification")
OUT.mkdir(exist_ok=True)
APP = "uz.otabekruziev.pixelhellrun"
def adb(*args):
    return subprocess.check_output(["adb", *args], timeout=30)
def ui():
    adb("shell", "rm", "-f", "/sdcard/hellrun-window.xml")
    adb("shell", "uiautomator", "dump", "/sdcard/hellrun-window.xml")
    data = adb("exec-out", "cat", "/sdcard/hellrun-window.xml")
    try:
        root = ET.fromstring(data)
        (OUT / "android-window.xml").write_bytes(data)
        return root
    except ET.ParseError:
        # Accessibility can be briefly unavailable during first launch/rotation.
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
def wait_for(texts, message):
    deadline = time.monotonic() + 60
    while time.monotonic() < deadline:
        point = find(ui(), texts)
        if point:
            return point
        time.sleep(1)
    raise AssertionError(message)

try:
    print(adb("install", "-r", "release/HellRun-Android.apk").decode())
    adb("logcat", "-c")
    print(adb("shell", "am", "start", "-W", "-n", APP + "/.MainActivity").decode())
    start = wait_for(["BOSHLASH"], "Start button did not render in the Android WebView")
    (OUT / "android-menu.png").write_bytes(adb("exec-out", "screencap", "-p"))
    tap(start)
    time.sleep(1)
    (OUT / "android-game.png").write_bytes(adb("exec-out", "screencap", "-p"))
    pause = wait_for(["PAUZA", "Pauza"], "Pause control missing after starting")
    tap(pause)
    wait_for(["DAVOM ETISH"], "Pause overlay did not appear")
    adb("shell", "input", "keyevent", "3")
    adb("shell", "am", "start", "-W", "-n", APP + "/.MainActivity")
    wait_for(["DAVOM ETISH"], "Pause state lost across background/resume")
    logs = adb("logcat", "-d", "-s", "AndroidRuntime:E").decode("utf-8", "replace")
    assert "FATAL EXCEPTION" not in logs, logs
    (OUT / "android-smoke.txt").write_text("PASS: install, launch, WebView render, start, pause, background/resume, no Java crash.\n")
    print("Android emulator smoke check passed.")
finally:
    (OUT / "android-final.png").write_bytes(adb("exec-out", "screencap", "-p"))
    (OUT / "android-logcat.txt").write_bytes(adb("logcat", "-d", "-t", "500"))
