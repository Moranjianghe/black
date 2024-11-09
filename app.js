let alarmTimeout;
const timeDisplay = document.getElementById("timeDisplay");
const toggleTimeButton = document.getElementById("toggleTime");
const alarmTimeInput = document.getElementById("alarmTime");
const setAlarmButton = document.getElementById("setAlarm");
const alarmSound = document.getElementById("alarmSound");
const fullscreenToggleButton = document.getElementById("fullscreenToggle");

// 控制按钮和鼠标指针的显示状态
let controlsVisible = true;
const controls = [toggleTimeButton, alarmTimeInput, setAlarmButton, fullscreenToggleButton];

// 更新时间显示
function updateTime() {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString();
}

// 显示或隐藏控制
function toggleControls(visible) {
    controls.forEach(control => {
        control.style.display = visible ? "block" : "none";
    });
}

// 切换时间显示
toggleTimeButton.addEventListener("click", () => {
    timeDisplay.classList.toggle("hidden");
});

// 设置闹钟
setAlarmButton.addEventListener("click", () => {
    const alarmTime = new Date(alarmTimeInput.value);
    const now = new Date();
    
    if (alarmTime > now) {
        const timeToAlarm = alarmTime.getTime() - now.getTime();
        alarmTimeout = setTimeout(() => {
            alert("闹钟时间到！");
            alarmSound.play();
            new Notification("闹钟提醒", {
                body: "您的闹钟时间到啦！"
            });
        }, timeToAlarm);
    } else {
        alert("请选择一个未来的时间！");
    }
});

// 全屏模式
fullscreenToggleButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// 请求通知权限
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// 防止系统休眠
function preventSleep() {
    // 这里使用了Wake Lock API来阻止设备进入睡眠模式
    if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen').then(() => {
            console.log('Screen Wake Lock active');
        }).catch(err => {
            console.error(`${err.name}, ${err.message}`);
        });
    } else {
        console.warn('Screen Wake Lock API not supported');
    }
}

// 每秒更新时间
setInterval(updateTime, 1000);
preventSleep(); // 页面加载时请求防止睡眠

// 鼠标移动时显示控制
let mouseTimer;
document.addEventListener('mousemove', () => {
    clearTimeout(mouseTimer);
    controlsVisible = true;
    toggleControls(true); // 显示控件
    document.body.classList.remove('cursor-hidden'); // 显示光标
    
    mouseTimer = setTimeout(() => {
        controlsVisible = false;
        toggleControls(false); // 隐藏控件
        document.body.classList.add('cursor-hidden'); // 隐藏光标
    }, 3000); // 3秒后隐藏
});

// 当时间选择框获得焦点时，保持按钮可见
alarmTimeInput.addEventListener('focus', () => {
    clearTimeout(mouseTimer);
    toggleControls(true);
    document.body.classList.remove('cursor-hidden'); // 显示光标
});

// 当时间选择框失去焦点时，开始隐藏按钮计时
alarmTimeInput.addEventListener('blur', () => {
    mouseTimer = setTimeout(() => {
        controlsVisible = false;
        toggleControls(false);
        document.body.classList.add('cursor-hidden'); // 隐藏光标
    }, 3000); // 3秒后隐藏
});

// 初始显示控件
toggleControls(true);
