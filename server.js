const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const app = express();
const BOT_TOKEN = '8605383175:AAHqLHxcUBJPA6fLjW2ig1EQka5YV5Sr96k
'; // Thay Token của bạn vào
const bot = new Telegraf(BOT_TOKEN);

// Cấu hình để giấu file: Khách chỉ thấy giao diện, không thấy đường dẫn file
app.use(express.static('public'));

// Lệnh khi khách bấm Start
bot.start((ctx) => {
    ctx.reply('Chào mừng! Nhấn nút để mở Tool:', 
        Markup.keyboard([
            [Markup.button.webApp("🚀 MỞ TOOL PHÂN TÍCH", "https://bottpre.netlify.app/")]
        ]).resize()
    );
});

bot.launch();
const crypto = require('crypto');

// Cổng nhận lệnh xác thực từ HTML
app.post('/api/verify', express.json(), (req, res) => {
    const { _auth } = req.body;
    
    // Nếu không có dữ liệu Telegram gửi kèm
    if (!_auth) return res.json({ status: 'unauthorized' });

    // Kiểm tra "dấu vân tay" bằng Token Bot
    const isValid = verifyTelegramData(_auth, BOT_TOKEN);

    if (isValid) {
        res.json({ status: 'authorized' });
    } else {
        res.json({ status: 'unauthorized' });
    }
});

// HÀM QUAN TRỌNG: Kiểm tra xem có phải khách mở từ Telegram thật không
function verifyTelegramData(initData, token) {
    const encoded = decodeURIComponent(initData);
    const secret = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
    const arr = encoded.split('&').map(x => x.split('=')).filter(([k]) => k !== 'hash').sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => `${k}=${v}`).join('\n');
    const hash = encoded.split('&').find(x => x.startsWith('hash=')).split('=')[1];
    const _hash = crypto.createHmac('sha256', secret).update(arr).digest('hex');
    return _hash === hash;
}

app.listen(3000, () => console.log("Hệ thống đang chạy tại cổng 3000"));
