document.addEventListener('DOMContentLoaded', () => {
const input = document.getElementById('text');
const generateBtn = document.getElementById('generate-btn');
const qrResult = document.getElementById('qr-result');
const qrImage = document.getElementById('qrcode');
const downloadBtn = document.getElementById('download-btn');

let currentQrUrl = '';

function generateQRCode() {
    const text = input.value.trim();

    if (!text) {
        input.style.borderColor = '#ef4444';

        setTimeout(() => {
            input.style.borderColor = '';
        }, 2000);

        return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = 'Oluşturuluyor...';

    const size = 300;

    currentQrUrl =
        `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;

    const img = new Image();

    img.onload = () => {
        qrImage.src = currentQrUrl;

        qrResult.classList.add('active');

        generateBtn.disabled = false;
        generateBtn.textContent = 'QR Kod Oluştur';
    };

    img.onerror = () => {
        alert('QR kod oluşturulurken bir hata oluştu.');

        generateBtn.disabled = false;
        generateBtn.textContent = 'QR Kod Oluştur';

        currentQrUrl = '';
    };

    img.src = currentQrUrl;
}

generateBtn.addEventListener('click', generateQRCode);

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        generateQRCode();
    }
});

downloadBtn.addEventListener('click', async () => {
    if (!currentQrUrl) {
        alert('Önce bir QR kod oluşturmalısın.');
        return;
    }

    try {
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'İndiriliyor...';

        const response = await fetch(currentQrUrl, {
            method: 'GET',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(
                `Sunucu hatası: ${response.status}`
            );
        }

        const blob = await response.blob();

        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = blobUrl;
        link.download = 'qrcode.png';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 1000);

    } catch (error) {
        console.error('QR indirme hatası:', error);

        alert(
            'QR kod indirilemedi.\n\n' +
            'Tarayıcı API sunucusundan dosya indirmeye izin vermedi.'
        );

    } finally {
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'İndir (PNG)';
    }
});


});
