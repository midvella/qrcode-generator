document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('text');
    const generateBtn = document.getElementById('generate-btn');
    const qrResult = document.getElementById('qr-result');
    const qrImage = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('download-btn');

    function generateQRCode() {
        const text = input.value.trim();

        if (!text) {
            input.style.borderColor = '#ef4444';
            setTimeout(() => input.style.borderColor = '', 2000);
            return;
        }

        // Show loading state
        generateBtn.disabled = true;
        generateBtn.textContent = 'Oluşturuluyor...';

        const size = 300;
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;

        // Preload image
        const img = new Image();
        img.onload = () => {
            qrImage.src = apiUrl;
            qrResult.classList.add('active');
            generateBtn.disabled = false;
            generateBtn.textContent = 'QR Kod Oluştur';
        };
        img.onerror = () => {
            alert('QR kod oluşturulurken bir hata oluştu.');
            generateBtn.disabled = false;
            generateBtn.textContent = 'QR Kod Oluştur';
        };
        img.src = apiUrl;
    }

    generateBtn.addEventListener('click', generateQRCode);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateQRCode();
        }
    });

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = qrImage.src;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
