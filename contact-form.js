// İletişim Formu Otomatik Email Gönderimi - FormSubmit
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // KVKK rızası kontrolü
            const kvkkConsent = document.getElementById('kvkk-consent');
            if (kvkkConsent && !kvkkConsent.checked) {
                showPopup('Lütfen KVKK Aydınlatma Metni\'ni okuyarak kişisel verilerinizin işlenmesine rıza gösteriyorum.', 'error');
                return;
            }
            
            // Sayfa dondurucu overlay oluştur
            const overlay = createLoadingOverlay();
            document.body.appendChild(overlay);
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Form verilerini al
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Loading animasyonu
            submitBtn.textContent = 'Gönderiliyor...';
            submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            submitBtn.disabled = true;
            
            // FormData hazırla
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);
            formData.append('_subject', `🥞 Minipan İletişim Formu - ${name}`);
            formData.append('_template', 'table');
            formData.append('_captcha', 'false');
            formData.append('_next', 'https://minipan.web.app/tesekkurler');
            formData.append('tarih', new Date().toLocaleString('tr-TR'));
            formData.append('website', 'Minipan Web Sitesi');
            formData.append('kvkk_onay', 'Kabul edildi');
            formData.append('mesaj_turu', 'İletişim Formu');
            formData.append('ad_soyad', name);
            formData.append('eposta', email);
            formData.append('mesaj_icerigi', message);
            
            try {
                // FormSubmit ile gönder
                const response = await fetch('https://formsubmit.co/h.agdas04@gmail.com', {
                    method: 'POST',
                    body: formData
                });
                
                console.log('Response status:', response.status);
                
                // Overlay'i kaldır
                document.body.removeChild(overlay);
                
                // FormSubmit her zaman 200 döner, bu yüzden status kontrolü yapalım
                if (response.status === 200 || response.ok) {
                    // Başarı durumu
                    submitBtn.textContent = 'Gönderildi! ✓';
                    submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                    
                    // Başarı popup'ı göster
                    showPopup('✅ Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
                    
                    setTimeout(() => {
                        contactForm.reset();
                        if (kvkkConsent) {
                            kvkkConsent.checked = false;
                        }
                        
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = 'var(--gradient-pink)';
                        submitBtn.disabled = false;
                    }, 2000);
                } else {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                
            } catch (error) {
                console.error('Form gönderim hatası:', error);
                
                // Overlay'i kaldır
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
                
                // Hata popup'ı göster
                showPopup('❌ Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.', 'error');
                
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'var(--gradient-pink)';
                submitBtn.disabled = false;
            }
        });
    }
    
    // KVKK checkbox ile gönder butonunu kontrol et
    const kvkkCheckbox = document.getElementById('kvkk-consent');
    const submitBtn = document.querySelector('.submit-btn');
    if (kvkkCheckbox && submitBtn) {
        function toggleSubmitBtn() {
            submitBtn.disabled = !kvkkCheckbox.checked;
        }
        kvkkCheckbox.addEventListener('change', toggleSubmitBtn);
        toggleSubmitBtn();

        // KVKK onaylanmadıysa uyarı göster
        submitBtn.addEventListener('click', function(e) {
            if (!kvkkCheckbox.checked) {
                e.preventDefault();
                // Uyarı popup veya alert
                showPopup('KVKK’yı onaylamadınız. Lütfen devam etmek için KVKK onay kutusunu işaretleyin.');
            }
        });
    }
    
    // Loading overlay oluştur
    function createLoadingOverlay(text = 'Email gönderiliyor...') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;
        
        overlay.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-width: 300px;
            ">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 4px solid #ff6b9d;
                    border-top: 4px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px auto;
                "></div>
                <h3 style="margin: 0 0 10px 0; color: #333; font-family: 'Poppins', sans-serif;">${text}</h3>
                <p style="margin: 0; color: #666; font-size: 14px;">Lütfen bekleyin...</p>
            </div>
        `;
        
        // CSS animation ekle
        if (!document.querySelector('#loading-animation-style')) {
            const style = document.createElement('style');
            style.id = 'loading-animation-style';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        return overlay;
    }
    
    // Popup göster
    function showPopup(message, type = 'info') {
        const popup = document.createElement('div');
        popup.className = 'custom-popup';
        
        const bgColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8';
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            text-align: center;
            border-top: 5px solid ${bgColor};
            animation: popupFadeIn 0.3s ease;
        `;
        
        popup.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 15px;">${icon}</div>
            <p style="margin: 0 0 20px 0; color: #333; font-family: 'Poppins', sans-serif; line-height: 1.5;">${message}</p>
            <button onclick="this.parentElement.remove()" style="
                background: ${bgColor};
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-family: 'Poppins', sans-serif;
                font-weight: 600;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Tamam</button>
        `;
        
        // CSS animation ekle
        if (!document.querySelector('#popup-animation-style')) {
            const style = document.createElement('style');
            style.id = 'popup-animation-style';
            style.textContent = `
                @keyframes popupFadeIn {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(popup);
        
        // 5 saniye sonra otomatik kapat
        setTimeout(() => {
            if (document.body.contains(popup)) {
                popup.remove();
            }
        }, 5000);
    }
});