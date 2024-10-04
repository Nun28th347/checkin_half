document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageElement = document.getElementById('message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                // ถ้าล็อกอินสำเร็จ ให้เปลี่ยนเส้นทางตามบทบาทที่เซิร์ฟเวอร์ส่งมา
                window.location.href = result.redirectURL;
            } else {
                // ถ้าล็อกอินไม่สำเร็จ ให้แสดงข้อความข้อผิดพลาด
                messageElement.textContent = result.message;
            }
        } catch (error) {
            console.error('Error during login:', error);
            messageElement.textContent = 'An error occurred. Please try again.';
        }
    });
});
