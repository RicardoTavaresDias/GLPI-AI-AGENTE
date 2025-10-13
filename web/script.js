const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
let isLoading = false;

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function clearChat() {
    chatContainer.innerHTML = `
        <div class="empty-state">
            <h2>Como posso ajudar você hoje?</h2>
            <p>Digite sua mensagem abaixo para começar</p>
        </div>
    `;
    messageInput.value = '';
    autoResize(messageInput);
}

function addMessage(content, isUser) {
    const emptyState = chatContainer.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    
    messageDiv.innerHTML = `
        <div class="message-content user-message">
            ${marked.parse(content)}
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant';
    loadingDiv.id = 'loadingMessage';
    loadingDiv.innerHTML = `
        <div class="avatar assistant">AI</div>
        <div class="message-content">
            <div class="loading">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatContainer.appendChild(loadingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeLoading() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message assistant';
    errorDiv.innerHTML = `
        <img class="avatar assistant" src="./assets/logo.png" alt="Logo da AI"/>
        <div class="message-content">
            <div class="error-message">
                ❌ Erro: ${escapeHtml(message)}
            </div>
        </div>
    `;
    chatContainer.appendChild(errorDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const message = messageInput.value.trim();
  
  if (!message || isLoading) return;

  isLoading = true;
  sendBtn.disabled = true;
  
  addMessage(message, true);
  messageInput.value = '';
  autoResize(messageInput);
  
  // Cria a mensagem da AI vazia para ir preenchendo
  const emptyState = chatContainer.querySelector('.empty-state');
  if (emptyState) {
      emptyState.remove();
  }

  // Gera um ID único para esta mensagem
  const uniqueId = 'streaming_' + Date.now();
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message assistant';
  messageDiv.id = uniqueId;
  
  messageDiv.innerHTML = `
      <img class="avatar assistant" src="./assets/logo.png" alt="Logo da AI"/>
      <div class="message-content">
          <div class="loading">
              <span></span>
              <span></span>
              <span></span>
          </div>
      </div>
  `;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const response = await fetch('http://localhost:3333', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
    });

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    // Busca o elemento específico desta mensagem
    const currentMessage = document.getElementById(uniqueId);
    if (!currentMessage) return;
    
    const streamingContent = currentMessage.querySelector('.message-content');
    let accumulatedText = '';

    // Remove loading
    streamingContent.innerHTML = '';

    while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        
        // Atualiza o conteúdo em tempo real
        streamingContent.innerHTML = marked.parse(accumulatedText);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Remove o ID após completar o stream
    currentMessage.removeAttribute('id');

  } catch (error) {
      const streamingMessage = document.getElementById(uniqueId);
      if (streamingMessage) {
          streamingMessage.remove();
      }
      console.error('Erro:', error);
      showError(error.message || 'Não foi possível conectar com a API');
  } finally {
      isLoading = false;
      sendBtn.disabled = false;
      messageInput.focus();
  }
}

// Foco automático no input ao carregar
messageInput.focus();