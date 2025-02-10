export function RegisterComponent() {
    return `
      <div class="register-popup hidden">
        <div class="register-container">
          <p class="close-button">X</p>
          <h1>Register</h1>
          <form id="registerForm">
            <input type="email" id="register_email" placeholder="Email" required>
            <p id="error-register-email" class="error-message"></p>
            <input type="password" id="register_password" placeholder="Password" required>
            <p id="error-register-password" class="error-message"></p>
            <input type="text" id="full-name" placeholder="Full Name" required>
            <p id="error-register-name" class="error-message"></p>
            <button class="submit-register">Register</button>
          </form>
          <div class="footer">Already have an account? <span class="back-to-login">Log in</span></div>
        </div>
      </div>
    `;
  }  
  