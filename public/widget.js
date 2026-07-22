(function() {
  // Config
  const scriptTag = document.currentScript;
  const agentId = scriptTag.getAttribute('data-agent-id') || 'default';
  const host = scriptTag.src ? new URL(scriptTag.src).origin : 'http://localhost:3000';

  // Inject Styles
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes embedly-pulse {
      0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
      70% { box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); }
      100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
    }
    
    #embedly-widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647; /* Max z-index to stay on top */
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    #embedly-widget-iframe-container {
      width: 400px;
      height: 650px;
      max-height: calc(100vh - 120px);
      max-width: calc(100vw - 48px);
      background: white;
      border-radius: 24px;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2), 0 0 30px rgba(0,0,0,0.1);
      overflow: hidden;
      display: none;
      opacity: 0;
      transform: translateY(30px) scale(0.95);
      transform-origin: bottom right;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      margin-bottom: 20px;
      border: 1px solid rgba(0,0,0,0.1);
    }

    #embedly-widget-iframe-container.embedly-open {
      display: block;
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    #embedly-widget-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
    }

    #embedly-widget-button {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.5);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      animation: embedly-pulse 2.5s infinite;
    }

    #embedly-widget-button:hover {
      transform: scale(1.08);
      box-shadow: 0 15px 35px -5px rgba(37, 99, 235, 0.6);
    }

    #embedly-widget-button.embedly-open {
      animation: none;
      transform: rotate(90deg) scale(0.9);
      background: #1e293b;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    #embedly-widget-button.embedly-open:hover {
      transform: rotate(90deg) scale(1);
    }

    #embedly-widget-button svg {
      width: 32px;
      height: 32px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: opacity 0.2s;
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const container = document.createElement('div');
  container.id = 'embedly-widget-container';
  
  container.innerHTML = `
    <div id="embedly-widget-iframe-container">
      <iframe id="embedly-widget-iframe" src="${host}/widget/${agentId}"></iframe>
    </div>
    <div id="embedly-widget-button">
      <svg id="embedly-icon-open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <svg id="embedly-icon-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="display: none;">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  `;
  
  document.body.appendChild(container);

  // Logic
  const button = document.getElementById('embedly-widget-button');
  const iframeContainer = document.getElementById('embedly-widget-iframe-container');
  const iconOpen = document.getElementById('embedly-icon-open');
  const iconClose = document.getElementById('embedly-icon-close');
  let isOpen = false;

  button.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      iframeContainer.style.display = 'block';
      setTimeout(() => {
        iframeContainer.classList.add('embedly-open');
        button.classList.add('embedly-open');
        iconOpen.style.display = 'none';
        iconClose.style.display = 'block';
      }, 10);
    } else {
      iframeContainer.classList.remove('embedly-open');
      button.classList.remove('embedly-open');
      setTimeout(() => {
        iframeContainer.style.display = 'none';
        iconOpen.style.display = 'block';
        iconClose.style.display = 'none';
      }, 300);
    }
  });
})();
