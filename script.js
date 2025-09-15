document.addEventListener('DOMContentLoaded', function() {
    const chatOutput = document.getElementById('chat-output');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const loading = document.getElementById('loading');
    const visitorCount = document.getElementById('visitor-count');
    const questionCount = document.getElementById('question-count');
    
    const API_KEY = 'ag:9aca5309:20250914:oporupa-v1:77f094a7';
    const API_URL = 'https://api.mistral.ai/v1/chat/completions';
    
    // Initialize counters
    let questionsAsked = localStorage.getItem('oporupa_questions') || 0;
    questionCount.textContent = questionsAsked;
    
    // Update visitor count
    updateVisitorCount();
    
    // Initial welcome message
    addMessage('Oporupa_v1: Hello! I am Oporupa_v1, your AI legal assistant. Do you have any questions about Bangladeshi laws and government services? I can help you in simple English and Bengali.', 'bot');
    
    sendBtn.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    function handleSendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(`You: ${message}`, 'user');
            userInput.value = '';
            
            // Update question counter
            questionsAsked++;
            localStorage.setItem('oporupa_questions', questionsAsked);
            questionCount.textContent = questionsAsked;
            
            getAIResponse(message);
        }
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender + '-message');
        messageDiv.textContent = text;
        chatOutput.appendChild(messageDiv);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
    
    async function getAIResponse(userMessage) {
        loading.classList.remove('hidden');
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'oporupa-v1',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are Oporupa_v1, an AI legal assistant for Bangladesh. You explain legal concepts in simple English and Bengali. Provide clear, step-by-step guidance on legal procedures and government services. Your goal is to democratize access to legal information, combat corruption by promoting transparency, and help users navigate bureaucratic processes without harassment.'
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            addMessage(`Oporupa_v1: ${aiResponse}`, 'bot');
        } catch (error) {
            console.error('Error:', error);
            addMessage('Oporupa_v1: Sorry, I am unable to answer your question right now. Please try again in a few moments.', 'bot');
        } finally {
            loading.classList.add('hidden');
        }
    }
    
    function updateVisitorCount() {
        // Visitor counter using localStorage
        let count = localStorage.getItem('oporupa_visitors') || 0;
        
        if (!sessionStorage.getItem('oporupa_visited')) {
            count++;
            localStorage.setItem('oporupa_visitors', count);
            sessionStorage.setItem('oporupa_visited', 'true');
        }
        
        visitorCount.textContent = count;
    }
});
