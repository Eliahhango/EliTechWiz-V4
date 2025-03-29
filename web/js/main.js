// Connect to Socket.io server
const socket = io();

// CSRF token handling
let csrfToken = '';

// Function to fetch CSRF token
async function fetchCsrfToken() {
  try {
    const response = await fetch('/api/csrf-token');
    const data = await response.json();
    csrfToken = data.csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
}

// Enhanced fetch function that adds CSRF token to all API requests
async function apiFetch(url, options = {}) {
  // Ensure options and headers exist
  options = options || {};
  options.headers = options.headers || {};
  
  // Add CSRF token to all non-GET requests
  if (options.method && options.method !== 'GET') {
    options.headers['X-CSRF-Token'] = csrfToken;
  }
  
  return fetch(url, options);
}

// DOM Elements - Main Containers
const sidebar = document.getElementById('sidebar');
const chatArea = document.getElementById('chat-area');
const chatsList = document.getElementById('chats-list');
const messagesContainer = document.getElementById('messages-container');
const chatContainer = document.getElementById('chat-container');
const welcomeScreen = document.getElementById('welcome-screen');

// DOM Elements - Chat Header
const chatName = document.getElementById('chat-name');
const chatStatus = document.getElementById('chat-status');
const chatAvatar = document.getElementById('chat-avatar');
const searchInChatBtn = document.getElementById('search-in-chat-btn');
const attachBtn = document.getElementById('attach-btn');
const chatMenuBtn = document.getElementById('chat-menu-btn');

// DOM Elements - Chat Menu
const chatMenuDropdown = document.getElementById('chat-menu-dropdown');
const contactInfoMenu = document.getElementById('contact-info-menu');
const selectMessagesMenu = document.getElementById('select-messages-menu');
const muteMenu = document.getElementById('mute-menu');
const clearChatMenu = document.getElementById('clear-chat-menu');
const deleteChatMenu = document.getElementById('delete-chat-menu');

// DOM Elements - Attachment Menu
const attachmentDropdown = document.getElementById('attachment-dropdown');
const attachPhoto = document.getElementById('attach-photo');
const attachDocument = document.getElementById('attach-document');
const attachCamera = document.getElementById('attach-camera');
const attachContact = document.getElementById('attach-contact');
const attachPoll = document.getElementById('attach-poll');

// DOM Elements - Message Input
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPickerContainer = document.getElementById('emoji-picker-container');

// DOM Elements - Sidebar Header
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const statusBtn = document.getElementById('status-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const menuBtn = document.getElementById('menu-btn');

// DOM Elements - Search
const searchInput = document.getElementById('search-input');
const filterBtn = document.getElementById('filter-btn');

// DOM Elements - Status Panel
const statusPanel = document.getElementById('status-panel');
const addStatusBtn = document.getElementById('add-status-btn');
const statusList = document.getElementById('status-list');

// DOM Elements - New Chat Panel
const newChatPanel = document.getElementById('new-chat-panel');
const backToChatBtn = document.getElementById('back-to-chats-btn');
const newGroupBtn = document.getElementById('new-group-btn');
const newContactBtn = document.getElementById('new-contact-btn');
const contactSearchInput = document.getElementById('contact-search-input');
const contactsList = document.getElementById('contacts-list');

// DOM Elements - Menu Panel
const menuPanel = document.getElementById('menu-panel');
const newGroupMenu = document.getElementById('new-group-menu');
const profileMenu = document.getElementById('profile-menu');
const archivedMenu = document.getElementById('archived-menu');
const starredMenu = document.getElementById('starred-menu');
const settingsMenu = document.getElementById('settings-menu');
const logoutMenu = document.getElementById('logout-menu');

// DOM Elements - Profile Panel
const profilePanel = document.getElementById('profile-panel');
const backFromProfileBtn = document.getElementById('back-from-profile-btn');
const profilePicture = document.getElementById('profile-picture');
const profilePictureInput = document.getElementById('profile-picture-input');
const profileName = document.getElementById('profile-name');
const profileAbout = document.getElementById('profile-about');
const editProfileName = document.querySelector('.edit-profile-name');
const editProfileAbout = document.querySelector('.edit-profile-about');

// DOM Elements - Contact Info Panel
const contactInfoPanel = document.getElementById('contact-info-panel');
const backFromContactInfoBtn = document.getElementById('back-from-contact-info-btn');
const infoProfilePicture = document.getElementById('info-profile-picture');
const infoName = document.getElementById('info-name');
const infoAbout = document.getElementById('info-about');
const sharedMediaPreview = document.getElementById('shared-media-preview');
const groupControls = document.getElementById('group-controls');
const contactControls = document.getElementById('contact-controls');
const groupDescription = document.getElementById('group-description');
const editGroupDescription = document.getElementById('edit-group-description');
const editGroupName = document.getElementById('edit-group-name');
const participantCount = document.getElementById('participant-count');
const addParticipantBtn = document.getElementById('add-participant-btn');
const participantsList = document.getElementById('participants-list');
const exitGroupBtn = document.getElementById('exit-group-btn');
const reportGroupBtn = document.getElementById('report-group-btn');
const blockContactBtn = document.getElementById('block-contact-btn');
const reportContactBtn = document.getElementById('report-contact-btn');

// DOM Elements - Search in Chat Panel
const searchInChatPanel = document.getElementById('search-in-chat-panel');
const backFromSearchBtn = document.getElementById('back-from-search-btn');
const searchInChatInput = document.getElementById('search-in-chat-input');
const searchResults = document.getElementById('search-results');

// DOM Elements - Modals
const modalOverlay = document.getElementById('modal-overlay');
const newGroupModal = document.getElementById('new-group-modal');
const groupParticipantsStep = document.getElementById('group-participants-step');
const groupInfoStep = document.getElementById('group-info-step');
const groupContactSearch = document.getElementById('group-contact-search');
const selectedContacts = document.getElementById('selected-contacts');
const groupContactsList = document.getElementById('group-contacts-list');
const groupPicture = document.getElementById('group-picture');
const groupPictureInput = document.getElementById('group-picture-input');
const groupNameInput = document.getElementById('group-name-input');
const groupDescriptionInput = document.getElementById('group-description-input');
const groupBackBtn = document.getElementById('group-back-btn');
const groupNextBtn = document.getElementById('group-next-btn');
const groupCreateBtn = document.getElementById('group-create-btn');
const mediaViewerModal = document.getElementById('media-viewer-modal');
const mediaViewerContent = document.getElementById('media-viewer-content');
const editTextModal = document.getElementById('edit-text-modal');
const editTextTitle = document.getElementById('edit-text-title');
const editTextInput = document.getElementById('edit-text-input');
const editTextareaInput = document.getElementById('edit-textarea-input');
const saveEditTextBtn = document.getElementById('save-edit-text-btn');

// Templates
const chatItemTemplate = document.getElementById('chat-item-template');
const messageTemplate = document.getElementById('message-template');
const messageOptionsMenuTemplate = document.getElementById('message-options-menu-template');
const contactItemTemplate = document.getElementById('contact-item-template');
const participantItemTemplate = document.getElementById('participant-item-template');
const participantOptionsMenuTemplate = document.getElementById('participant-options-menu-template');
const statusItemTemplate = document.getElementById('status-item-template');
const mediaMessageTemplate = document.getElementById('media-message-template');
const dateDividerTemplate = document.getElementById('date-divider-template');

// App state
let currentChat = null;
let chats = [];
let contacts = [];
let messages = {};
let user = null;
let statusMessages = [];
let selectedContactsForGroup = [];
let currentEditTarget = null;
let searchTimer = null;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let blockedContacts = [];

// Format time from timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Format date from timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

// Format file size
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
}

// Initialize emoji picker
function initEmojiPicker() {
  const picker = document.createElement('emoji-picker');
  emojiPickerContainer.appendChild(picker);
  
  picker.addEventListener('emoji-click', event => {
    messageInput.value += event.detail.unicode;
    messageInput.focus();
    toggleEmojiPicker(false);
  });
}

// Toggle emoji picker
function toggleEmojiPicker(show) {
  emojiPickerContainer.style.display = show ? 'block' : 'none';
}

// Load and display chats
function loadChats() {
  // Clear existing chats
  chatsList.innerHTML = '';
  
  if (chats.length === 0) {
    chatsList.innerHTML = '<div class="loading-message">No chats available</div>';
    return;
  }
  
  // Sort chats by most recent message
  chats.sort((a, b) => b.timestamp - a.timestamp);
  
  // Render each chat
  chats.forEach(chat => {
    const chatItem = chatItemTemplate.content.cloneNode(true);
    const chatItemElement = chatItem.querySelector('.chat-item');
    
    // Set data attributes and classes
    chatItemElement.dataset.chatId = chat.id;
    if (currentChat && currentChat.id === chat.id) {
      chatItemElement.classList.add('active');
    }
    
    // Set avatar
    const avatar = chatItemElement.querySelector('.chat-avatar img');
    if (chat.isGroup) {
      avatar.src = '/img/default-group.png';
    }
    
    // Set chat name
    const nameElement = chatItemElement.querySelector('.chat-name');
    nameElement.textContent = chat.name;
    
    // Set last message time
    const timeElement = chatItemElement.querySelector('.chat-time');
    timeElement.textContent = formatTime(chat.timestamp);
    
    // Set last message
    const lastMessageElement = chatItemElement.querySelector('.chat-last-message');
    lastMessageElement.textContent = chat.lastMessage;
    
    // Set unread count
    const unreadElement = chatItemElement.querySelector('.chat-unread');
    if (chat.unreadCount > 0) {
      unreadElement.textContent = chat.unreadCount;
    } else {
      unreadElement.style.display = 'none';
    }
    
    // Add click event
    chatItemElement.addEventListener('click', () => {
      selectChat(chat);
    });
    
    chatsList.appendChild(chatItemElement);
  });
}

// Load and display contacts
function loadContacts() {
  // Clear existing contacts
  contactsList.innerHTML = '';
  
  if (contacts.length === 0) {
    apiFetch('/api/contacts')
      .then(response => response.json())
      .then(data => {
        contacts = data;
        renderContacts();
      })
      .catch(error => {
        console.error('Error loading contacts:', error);
        contactsList.innerHTML = '<div class="loading-message">Error loading contacts</div>';
      });
  } else {
    renderContacts();
  }
}

// Render contacts
function renderContacts(searchTerm = '') {
  contactsList.innerHTML = '';
  
  if (contacts.length === 0) {
    contactsList.innerHTML = '<div class="loading-message">No contacts available</div>';
    return;
  }
  
  // Filter contacts if search term provided
  let filteredContacts = contacts;
  if (searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    filteredContacts = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm) || 
      contact.id.split('@')[0].includes(searchTerm)
    );
  }
  
  if (filteredContacts.length === 0) {
    contactsList.innerHTML = '<div class="loading-message">No contacts found</div>';
    return;
  }
  
  // Sort contacts alphabetically
  filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
  
  // Render each contact
  filteredContacts.forEach(contact => {
    const contactItem = contactItemTemplate.content.cloneNode(true);
    const contactItemElement = contactItem.querySelector('.contact-item');
    
    // Set data attributes
    contactItemElement.dataset.contactId = contact.id;
    
    // Set avatar
    const avatar = contactItemElement.querySelector('.contact-avatar img');
    
    // Set contact name
    const nameElement = contactItemElement.querySelector('.contact-name');
    nameElement.textContent = contact.name || contact.id.split('@')[0];
    
    // Set contact about
    const aboutElement = contactItemElement.querySelector('.contact-about');
    aboutElement.textContent = contact.status || 'Hey there! I am using WhatsApp.';
    
    // Add click event based on context
    if (document.getElementById('group-participants-step').style.display !== 'none') {
      // Group creation mode
      contactItemElement.addEventListener('click', () => {
        toggleContactSelection(contact);
      });
    } else {
      // Regular chat mode
      contactItemElement.addEventListener('click', () => {
        createOrOpenChat(contact);
      });
    }
    
    contactsList.appendChild(contactItemElement);
  });
}

// Create or open chat with a contact
function createOrOpenChat(contact) {
  // Find existing chat with contact
  const existingChat = chats.find(chat => !chat.isGroup && chat.id === contact.id);
  
  if (existingChat) {
    // Select existing chat
    selectChat(existingChat);
    
    // Close new chat panel
    newChatPanel.style.display = 'none';
  } else {
    // Create new chat object
    const newChat = {
      id: contact.id,
      name: contact.name || contact.id.split('@')[0],
      lastMessage: 'Start a conversation',
      timestamp: Math.floor(Date.now() / 1000),
      unreadCount: 0,
      isGroup: false
    };
    
    // Add to chats
    chats.push(newChat);
    
    // Reload chats list
    loadChats();
    
    // Select new chat
    selectChat(newChat);
    
    // Close new chat panel
    newChatPanel.style.display = 'none';
  }
}

// Toggle selection of a contact for group creation
function toggleContactSelection(contact) {
  const isSelected = selectedContactsForGroup.some(c => c.id === contact.id);
  
  if (isSelected) {
    // Remove from selection
    selectedContactsForGroup = selectedContactsForGroup.filter(c => c.id !== contact.id);
    
    // Remove from UI
    const selectedContact = document.querySelector(`.selected-contact[data-contact-id="${contact.id}"]`);
    if (selectedContact) {
      selectedContact.remove();
    }
    
    // Update contact item style
    const contactItem = document.querySelector(`.contact-item[data-contact-id="${contact.id}"]`);
    if (contactItem) {
      contactItem.style.backgroundColor = '';
    }
  } else {
    // Add to selection
    selectedContactsForGroup.push(contact);
    
    // Add to UI
    const selectedContact = document.createElement('div');
    selectedContact.className = 'selected-contact';
    selectedContact.dataset.contactId = contact.id;
    selectedContact.innerHTML = `
      <span class="selected-contact-name">${contact.name || contact.id.split('@')[0]}</span>
      <i class="fas fa-times remove-selected"></i>
    `;
    
    // Add click event to remove button
    selectedContact.querySelector('.remove-selected').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleContactSelection(contact);
    });
    
    selectedContacts.appendChild(selectedContact);
    
    // Update contact item style
    const contactItem = document.querySelector(`.contact-item[data-contact-id="${contact.id}"]`);
    if (contactItem) {
      contactItem.style.backgroundColor = 'var(--hover-bg)';
    }
  }
  
  // Update next button state
  groupNextBtn.disabled = selectedContactsForGroup.length === 0;
}

// Select a chat
function selectChat(chat) {
  // Remove active class from current chat
  if (currentChat) {
    const currentChatElement = document.querySelector(`.chat-item[data-chat-id="${currentChat.id}"]`);
    if (currentChatElement) {
      currentChatElement.classList.remove('active');
    }
  }
  
  // Set current chat
  currentChat = chat;
  
  // Update UI
  chatName.textContent = chat.name;
  chatStatus.textContent = chat.isGroup ? 
    `${chat.participants ? chat.participants.length : 0} participants` : 
    'online';
  
  if (chat.isGroup) {
    chatAvatar.src = '/img/default-group.png';
  } else {
    chatAvatar.src = '/img/default-avatar.png';
  }
  
  // Show chat container, hide welcome screen
  welcomeScreen.style.display = 'none';
  chatContainer.style.display = 'flex';
  
  // Add active class to selected chat
  const chatElement = document.querySelector(`.chat-item[data-chat-id="${chat.id}"]`);
  if (chatElement) {
    chatElement.classList.add('active');
    
    // Clear unread count
    const unreadElement = chatElement.querySelector('.chat-unread');
    unreadElement.textContent = '';
    unreadElement.style.display = 'none';
  }
  
  // Load messages
  loadMessages(chat.id);
  
  // Notify server that chat is read
  socket.emit('read-messages', { chatId: chat.id });
}

// Load and display messages
function loadMessages(chatId) {
  // Clear messages container
  messagesContainer.innerHTML = '';
  
  // If no messages, fetch from server
  if (!messages[chatId] || messages[chatId].length === 0) {
    apiFetch(`/api/messages/${chatId}`)
      .then(response => response.json())
      .then(data => {
        messages[chatId] = data;
        renderMessages(chatId);
      })
      .catch(error => {
        console.error('Error loading messages:', error);
        messagesContainer.innerHTML = '<div class="loading-message">No messages</div>';
      });
  } else {
    renderMessages(chatId);
  }
}

// Render messages
function renderMessages(chatId) {
  if (!messages[chatId] || messages[chatId].length === 0) {
    messagesContainer.innerHTML = '<div class="loading-message">No messages</div>';
    return;
  }
  
  // Clear messages container
  messagesContainer.innerHTML = '';
  
  // Group messages by date
  let currentDate = null;
  
  // Sort messages by timestamp
  messages[chatId].sort((a, b) => a.timestamp - b.timestamp);
  
  // Render each message
  messages[chatId].forEach(message => {
    const messageDate = formatDate(message.timestamp);
    
    // Add date separator if new date
    if (messageDate !== currentDate) {
      const dateDivider = dateDividerTemplate.content.cloneNode(true);
      const dateText = dateDivider.querySelector('.date-text');
      dateText.textContent = messageDate;
      messagesContainer.appendChild(dateDivider);
      currentDate = messageDate;
    }
    
    // Handle media messages
    if (message.hasMedia) {
      renderMediaMessage(message);
      return;
    }
    
    // Clone message template
    const messageElement = messageTemplate.content.cloneNode(true);
    const messageDiv = messageElement.querySelector('.message');
    
    // Set message class based on sender
    if (message.fromMe) {
      messageDiv.classList.add('outgoing');
    } else {
      messageDiv.classList.add('incoming');
    }
    
    // Set sender name for group chats
    if (currentChat.isGroup && !message.fromMe) {
      const senderElement = messageDiv.querySelector('.message-sender');
      senderElement.textContent = message.sender;
      senderElement.classList.add('show');
    }
    
    // Set message content
    const contentElement = messageDiv.querySelector('.message-content');
    contentElement.textContent = message.message;
    
    // Set message time
    const timeElement = messageDiv.querySelector('.message-time');
    timeElement.textContent = formatTime(message.timestamp);
    
    // Set message status (for outgoing messages)
    const statusElement = messageDiv.querySelector('.message-status');
    if (message.fromMe) {
      statusElement.classList.add('delivered');
    } else {
      statusElement.style.display = 'none';
    }
    
    // Add message options button event
    const optionsBtn = messageDiv.querySelector('.message-options-btn');
    optionsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showMessageOptions(messageDiv, message);
    });
    
    // Set data attributes
    messageDiv.dataset.messageId = message.id;
    
    messagesContainer.appendChild(messageDiv);
  });
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Render media message
function renderMediaMessage(message) {
  const mediaMessage = mediaMessageTemplate.content.cloneNode(true);
  const mediaMessageDiv = mediaMessage.querySelector('.media-message');
  const mediaContainer = mediaMessageDiv.querySelector('.media-container');
  
  // Set message class based on sender
  if (message.fromMe) {
    mediaMessageDiv.classList.add('outgoing');
  } else {
    mediaMessageDiv.classList.add('incoming');
  }
  
  // Create media element based on type
  switch (message.mediaType) {
    case 'image':
      const img = document.createElement('img');
      img.src = message.mediaUrl || '/img/placeholder-image.jpg';
      img.alt = 'Photo';
      img.addEventListener('click', () => showMediaViewer(message));
      mediaContainer.appendChild(img);
      break;
      
    case 'video':
      const video = document.createElement('video');
      video.src = message.mediaUrl || '/img/placeholder-video.mp4';
      video.controls = false;
      
      const playButton = document.createElement('div');
      playButton.className = 'play-button';
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      
      mediaContainer.appendChild(video);
      mediaContainer.appendChild(playButton);
      
      mediaContainer.addEventListener('click', () => showMediaViewer(message));
      break;
      
    case 'audio':
      const audio = document.createElement('audio');
      audio.src = message.mediaUrl || '/audio/placeholder-audio.mp3';
      audio.controls = true;
      mediaContainer.appendChild(audio);
      break;
      
    case 'document':
      const doc = document.createElement('div');
      doc.className = 'document';
      
      const docIcon = document.createElement('div');
      docIcon.className = 'document-icon document-icon';
      docIcon.innerHTML = '<i class="fas fa-file"></i>';
      
      const docInfo = document.createElement('div');
      docInfo.className = 'document-info';
      
      const docName = document.createElement('div');
      docName.className = 'document-name';
      docName.textContent = message.fileName || 'Document';
      
      const docSize = document.createElement('div');
      docSize.className = 'document-size';
      docSize.textContent = message.fileSize ? formatFileSize(message.fileSize) : 'Unknown size';
      
      docInfo.appendChild(docName);
      docInfo.appendChild(docSize);
      doc.appendChild(docIcon);
      doc.appendChild(docInfo);
      
      mediaContainer.appendChild(doc);
      break;
  }
  
  // Set caption if available
  if (message.caption) {
    const captionElement = mediaMessageDiv.querySelector('.media-caption');
    captionElement.textContent = message.caption;
  }
  
  // Set message time
  const timeElement = mediaMessageDiv.querySelector('.message-time');
  timeElement.textContent = formatTime(message.timestamp);
  
  // Set message status (for outgoing messages)
  const statusElement = mediaMessageDiv.querySelector('.message-status');
  if (message.fromMe) {
    statusElement.classList.add('delivered');
  } else {
    statusElement.style.display = 'none';
  }
  
  // Set data attributes
  mediaMessageDiv.dataset.messageId = message.id;
  
  messagesContainer.appendChild(mediaMessageDiv);
}

// Show message options menu
function showMessageOptions(messageElement, message) {
  // Remove any existing options menu
  const existingMenu = document.querySelector('.message-options-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Clone options menu template
  const optionsMenu = messageOptionsMenuTemplate.content.cloneNode(true);
  const optionsMenuElement = optionsMenu.querySelector('.message-options-menu');
  
  // Set up options based on message type
  const replyOption = optionsMenuElement.querySelector('.reply-option');
  const forwardOption = optionsMenuElement.querySelector('.forward-option');
  const starOption = optionsMenuElement.querySelector('.star-option');
  const deleteOption = optionsMenuElement.querySelector('.delete-option');
  
  // Add event listeners
  replyOption.addEventListener('click', () => {
    // Implement reply functionality
    console.log('Reply to message:', message.id);
  });
  
  forwardOption.addEventListener('click', () => {
    // Implement forward functionality
    console.log('Forward message:', message.id);
  });
  
  starOption.addEventListener('click', () => {
    // Implement star functionality
    console.log('Star message:', message.id);
  });
  
  deleteOption.addEventListener('click', () => {
    deleteMessage(message);
  });
  
  // Append menu to message
  messageElement.appendChild(optionsMenuElement);
  
  // Close menu when clicking outside
  document.addEventListener('click', function closeMenu(e) {
    if (!optionsMenuElement.contains(e.target) && 
        !messageElement.querySelector('.message-options').contains(e.target)) {
      optionsMenuElement.remove();
      document.removeEventListener('click', closeMenu);
    }
  });
}

// Event listeners

// Message input events
messageInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    sendMessage();
  }
  
  // Toggle send button based on input
  if (messageInput.value.trim()) {
    voiceBtn.style.display = 'none';
    sendBtn.style.display = 'inline-block';
  } else {
    voiceBtn.style.display = 'inline-block';
    sendBtn.style.display = 'none';
  }
});

messageInput.addEventListener('input', () => {
  // Toggle send button based on input
  if (messageInput.value.trim()) {
    voiceBtn.style.display = 'none';
    sendBtn.style.display = 'inline-block';
  } else {
    voiceBtn.style.display = 'inline-block';
    sendBtn.style.display = 'none';
  }
});

// Send button
sendBtn.addEventListener('click', sendMessage);

// Voice button
voiceBtn.addEventListener('click', () => {
  if (isRecording) {
    // Stop recording
    stopRecording();
  } else {
    // Start recording
    startRecording();
  }
});

// Start recording voice message
function startRecording() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // Update UI
        voiceBtn.style.color = 'red';
        voiceBtn.classList.add('recording');
        isRecording = true;
        
        // Create media recorder
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        // Handle data
        mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data);
        });
        
        // Handle stop
        mediaRecorder.addEventListener('stop', () => {
          // Create blob
          const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
          
          // Send audio message
          sendMediaMessage(audioBlob, '', 'voice');
          
          // Reset
          stream.getTracks().forEach(track => track.stop());
        });
        
        // Start recording
        mediaRecorder.start();
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        alert('Could not access microphone');
      });
  } else {
    alert('Voice messages are not supported in this browser');
  }
}

// Stop recording voice message
function stopRecording() {
  if (mediaRecorder && isRecording) {
    // Update UI
    voiceBtn.style.color = '';
    voiceBtn.classList.remove('recording');
    isRecording = false;
    
    // Stop recording
    mediaRecorder.stop();
  }
}

// Emoji button
emojiBtn.addEventListener('click', () => {
  toggleEmojiPicker(emojiPickerContainer.style.display !== 'block');
});

// Search input
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchChats(searchInput.value.trim());
  }, 500);
});

// Search in chat input
searchInChatInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchInChat(searchInChatInput.value.trim());
  }, 500);
});

// Sidebar header buttons
statusBtn.addEventListener('click', () => {
  statusPanel.style.display = statusPanel.style.display === 'none' ? 'flex' : 'none';
  newChatPanel.style.display = 'none';
  menuPanel.style.display = 'none';
  profilePanel.style.display = 'none';
});

newChatBtn.addEventListener('click', () => {
  newChatPanel.style.display = newChatPanel.style.display === 'none' ? 'flex' : 'none';
  statusPanel.style.display = 'none';
  menuPanel.style.display = 'none';
  profilePanel.style.display = 'none';
  
  // Load contacts
  loadContacts();
});

menuBtn.addEventListener('click', () => {
  menuPanel.style.display = menuPanel.style.display === 'none' ? 'block' : 'none';
  statusPanel.style.display = 'none';
  newChatPanel.style.display = 'none';
  profilePanel.style.display = 'none';
});

// Back buttons
backToChatBtn.addEventListener('click', () => {
  newChatPanel.style.display = 'none';
});

backFromProfileBtn.addEventListener('click', () => {
  profilePanel.style.display = 'none';
});

backFromContactInfoBtn.addEventListener('click', () => {
  contactInfoPanel.style.display = 'none';
});

backFromSearchBtn.addEventListener('click', () => {
  searchInChatPanel.style.display = 'none';
});

// Chat header buttons
searchInChatBtn.addEventListener('click', () => {
  searchInChatPanel.style.display = searchInChatPanel.style.display === 'none' ? 'flex' : 'none';
  contactInfoPanel.style.display = 'none';
  chatMenuDropdown.style.display = 'none';
  attachmentDropdown.style.display = 'none';
});

attachBtn.addEventListener('click', () => {
  attachmentDropdown.style.display = attachmentDropdown.style.display === 'none' ? 'flex' : 'none';
  chatMenuDropdown.style.display = 'none';
});

chatMenuBtn.addEventListener('click', () => {
  chatMenuDropdown.style.display = chatMenuDropdown.style.display === 'none' ? 'block' : 'none';
  attachmentDropdown.style.display = 'none';
});

// Contact info button
chatInfo.addEventListener('click', () => {
  if (!currentChat) return;
  
  contactInfoPanel.style.display = 'flex';
  searchInChatPanel.style.display = 'none';
  
  // Update panel header
  const headerTitle = contactInfoPanel.querySelector('h3');
  headerTitle.textContent = currentChat.isGroup ? 'Group Info' : 'Contact Info';
  
  // Show/hide group and contact controls
  groupControls.style.display = currentChat.isGroup ? 'block' : 'none';
  contactControls.style.display = currentChat.isGroup ? 'none' : 'block';
  
  // Load contact info
  infoName.textContent = currentChat.name;
  
  if (currentChat.isGroup) {
    infoProfilePicture.src = '/img/default-group.png';
    loadGroupInfo(currentChat.id);
  } else {
    infoProfilePicture.src = '/img/default-avatar.png';
    infoAbout.textContent = 'Hey there! I am using WhatsApp.';
  }
});

// Menu panel options
profileMenu.addEventListener('click', () => {
  menuPanel.style.display = 'none';
  profilePanel.style.display = 'flex';
});

newGroupMenu.addEventListener('click', () => {
  menuPanel.style.display = 'none';
  showNewGroupModal();
});

// Chat menu options
contactInfoMenu.addEventListener('click', () => {
  chatMenuDropdown.style.display = 'none';
  contactInfoPanel.style.display = 'flex';
  
  // Update panel header
  const headerTitle = contactInfoPanel.querySelector('h3');
  headerTitle.textContent = currentChat.isGroup ? 'Group Info' : 'Contact Info';
  
  // Show/hide group and contact controls
  groupControls.style.display = currentChat.isGroup ? 'block' : 'none';
  contactControls.style.display = currentChat.isGroup ? 'none' : 'block';
  
  // Load contact info
  infoName.textContent = currentChat.name;
  
  if (currentChat.isGroup) {
    infoProfilePicture.src = '/img/default-group.png';
    loadGroupInfo(currentChat.id);
  } else {
    infoProfilePicture.src = '/img/default-avatar.png';
    infoAbout.textContent = 'Hey there! I am using WhatsApp.';
  }
});

// Attachment options
attachPhoto.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  
  input.addEventListener('change', () => {
    if (input.files && input.files[0]) {
      sendMediaMessage(input.files[0], prompt('Add a caption (optional):'));
    }
    document.body.removeChild(input);
  });
  
  document.body.appendChild(input);
  input.click();
  
  attachmentDropdown.style.display = 'none';
});

attachDocument.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.style.display = 'none';
  
  input.addEventListener('change', () => {
    if (input.files && input.files[0]) {
      sendMediaMessage(input.files[0]);
    }
    document.body.removeChild(input);
  });
  
  document.body.appendChild(input);
  input.click();
  
  attachmentDropdown.style.display = 'none';
});

// New group button
newGroupBtn.addEventListener('click', showNewGroupModal);

// Show new group modal
function showNewGroupModal() {
  // Reset state
  selectedContactsForGroup = [];
  selectedContacts.innerHTML = '';
  groupNameInput.value = '';
  groupDescriptionInput.value = '';
  
  // Show first step
  groupParticipantsStep.style.display = 'block';
  groupInfoStep.style.display = 'none';
  groupNextBtn.style.display = 'block';
  groupBackBtn.style.display = 'none';
  groupCreateBtn.style.display = 'none';
  
  // Show modal
  modalOverlay.style.display = 'flex';
  newGroupModal.style.display = 'flex';
  
  // Load contacts for group creation
  loadContacts();
}

// Group modal navigation
groupNextBtn.addEventListener('click', () => {
  if (selectedContactsForGroup.length === 0) {
    alert('Please select at least one contact');
    return;
  }
  
  // Switch to group info step
  groupParticipantsStep.style.display = 'none';
  groupInfoStep.style.display = 'block';
  groupNextBtn.style.display = 'none';
  groupBackBtn.style.display = 'block';
  groupCreateBtn.style.display = 'block';
});

groupBackBtn.addEventListener('click', () => {
  // Switch back to participants step
  groupParticipantsStep.style.display = 'block';
  groupInfoStep.style.display = 'none';
  groupNextBtn.style.display = 'block';
  groupBackBtn.style.display = 'none';
  groupCreateBtn.style.display = 'none';
});

groupCreateBtn.addEventListener('click', createGroup);

// Close modals
document.querySelectorAll('.close-modal').forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.dataset.modal;
    
    if (modalId === 'new-group-modal') {
      selectedContactsForGroup = [];
      selectedContacts.innerHTML = '';
    }
    
    document.getElementById(modalId).style.display = 'none';
    modalOverlay.style.display = 'none';
  });
});

// Contact search
contactSearchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    renderContacts(contactSearchInput.value.trim());
  }, 500);
});

// Group contact search
groupContactSearch.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    renderContacts(groupContactSearch.value.trim());
  }, 500);
});

// Profile picture upload
profilePictureInput.addEventListener('change', () => {
  if (profilePictureInput.files && profilePictureInput.files[0]) {
    updateProfilePicture(profilePictureInput.files[0]);
  }
});

document.querySelector('.edit-overlay').addEventListener('click', () => {
  profilePictureInput.click();
});

// Edit profile name
editProfileName.addEventListener('click', () => {
  // Set up edit text modal
  editTextTitle.textContent = 'Edit Name';
  editTextInput.style.display = 'block';
  editTextareaInput.style.display = 'none';
  editTextInput.value = profileName.textContent;
  
  // Set current edit target
  currentEditTarget = 'name';
  
  // Show modal
  modalOverlay.style.display = 'flex';
  editTextModal.style.display = 'flex';
  
  // Focus input
  editTextInput.focus();
});

// Edit profile about
editProfileAbout.addEventListener('click', () => {
  // Set up edit text modal
  editTextTitle.textContent = 'Edit About';
  editTextInput.style.display = 'block';
  editTextareaInput.style.display = 'none';
  editTextInput.value = profileAbout.textContent;
  
  // Set current edit target
  currentEditTarget = 'about';
  
  // Show modal
  modalOverlay.style.display = 'flex';
  editTextModal.style.display = 'flex';
  
  // Focus input
  editTextInput.focus();
});

// Edit group name
editGroupName.addEventListener('click', () => {
  if (!currentChat || !currentChat.isGroup) return;
  
  // Set up edit text modal
  editTextTitle.textContent = 'Edit Group Subject';
  editTextInput.style.display = 'block';
  editTextareaInput.style.display = 'none';
  editTextInput.value = currentChat.name;
  
  // Set current edit target
  currentEditTarget = 'group-name';
  
  // Show modal
  modalOverlay.style.display = 'flex';
  editTextModal.style.display = 'flex';
  
  // Focus input
  editTextInput.focus();
});

// Edit group description
editGroupDescription.addEventListener('click', () => {
  if (!currentChat || !currentChat.isGroup) return;
  
  // Set up edit text modal
  editTextTitle.textContent = 'Edit Group Description';
  editTextInput.style.display = 'none';
  editTextareaInput.style.display = 'block';
  editTextareaInput.value = groupDescription.textContent === 'No description' ? '' : groupDescription.textContent;
  
  // Set current edit target
  currentEditTarget = 'group-description';
  
  // Show modal
  modalOverlay.style.display = 'flex';
  editTextModal.style.display = 'flex';
  
  // Focus input
  editTextareaInput.focus();
});

// Save edited text
saveEditTextBtn.addEventListener('click', () => {
  const value = editTextInput.style.display === 'none' ? 
    editTextareaInput.value.trim() : 
    editTextInput.value.trim();
  
  if (!value && currentEditTarget !== 'group-description') {
    alert('This field cannot be empty');
    return;
  }
  
  switch (currentEditTarget) {
    case 'name':
      updateProfileName(value);
      break;
      
    case 'about':
      updateProfileStatus(value);
      break;
      
    case 'group-name':
      updateGroupSetting('subject', value);
      break;
      
    case 'group-description':
      updateGroupSetting('description', value);
      break;
  }
  
  // Close modal
  editTextModal.style.display = 'none';
  modalOverlay.style.display = 'none';
});

// Update group setting
function updateGroupSetting(setting, value) {
  if (!currentChat || !currentChat.isGroup) return;
  
  apiFetch('/api/group/settings/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      groupId: currentChat.id,
      setting: setting,
      value: value
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        if (setting === 'subject') {
          // Update local chat name
          currentChat.name = value;
          chatName.textContent = value;
          infoName.textContent = value;
          
          // Update in chats list
          const chatElement = document.querySelector(`.chat-item[data-chat-id="${currentChat.id}"]`);
          if (chatElement) {
            chatElement.querySelector('.chat-name').textContent = value;
          }
        } else if (setting === 'description') {
          groupDescription.textContent = value || 'No description';
        }
      } else {
        alert(`Failed to update group ${setting}: ${data.error}`);
      }
    })
    .catch(error => {
      console.error(`Error updating group ${setting}:`, error);
      alert(`Failed to update group ${setting}`);
    });
}

// Exit group
exitGroupBtn.addEventListener('click', () => {
  if (!currentChat || !currentChat.isGroup) return;
  
  if (!confirm('Are you sure you want to exit this group?')) {
    return;
  }
  
  apiFetch('/api/group/leave', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      groupId: currentChat.id
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Remove group from chats
        chats = chats.filter(chat => chat.id !== currentChat.id);
        
        // Close panels
        contactInfoPanel.style.display = 'none';
        
        // Clear current chat
        currentChat = null;
        
        // Show welcome screen
        welcomeScreen.style.display = 'flex';
        chatContainer.style.display = 'none';
        
        // Reload chats
        loadChats();
      } else {
        alert('Failed to exit group: ' + data.error);
      }
    })
    .catch(error => {
      console.error('Error exiting group:', error);
      alert('Failed to exit group');
    });
});

// Add participant to group
addParticipantBtn.addEventListener('click', () => {
  // TODO: Implement adding participants to group
  alert('Feature coming soon');
});

// Block contact
blockContactBtn.addEventListener('click', () => {
  if (!currentChat || currentChat.isGroup) return;
  
  if (!confirm(`Are you sure you want to block ${currentChat.name}?`)) {
    return;
  }
  
  apiFetch('/api/contacts/block', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jid: currentChat.id
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(`${currentChat.name} has been blocked`);
        
        // Close panels
        contactInfoPanel.style.display = 'none';
        
        // Reload chats
        loadChats();
      } else {
        alert('Failed to block contact: ' + data.error);
      }
    })
    .catch(error => {
      console.error('Error blocking contact:', error);
      alert('Failed to block contact');
    });
});

// Detect clicks outside dropdowns and panels
document.addEventListener('click', (e) => {
  // Chat menu dropdown
  if (!chatMenuBtn.contains(e.target) && !chatMenuDropdown.contains(e.target)) {
    chatMenuDropdown.style.display = 'none';
  }
  
  // Attachment dropdown
  if (!attachBtn.contains(e.target) && !attachmentDropdown.contains(e.target)) {
    attachmentDropdown.style.display = 'none';
  }
  
  // Menu panel
  if (!menuBtn.contains(e.target) && !menuPanel.contains(e.target)) {
    menuPanel.style.display = 'none';
  }
  
  // Emoji picker
  if (!emojiBtn.contains(e.target) && !emojiPickerContainer.contains(e.target)) {
    emojiPickerContainer.style.display = 'none';
  }
});

// Socket.io events
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('user-info', (data) => {
  user = data;
  
  // Update UI
  if (user.name) {
    userName.textContent = user.name;
  }
  
  if (user.imgUrl) {
    userAvatar.src = user.imgUrl;
    profilePicture.src = user.imgUrl;
  }
  
  if (user.status) {
    profileAbout.textContent = user.status;
  }
});

socket.on('chats-update', (data) => {
  chats = data;
  loadChats();
});

socket.on('new-message', (message) => {
  // Add message to local store
  if (!messages[message.chatId]) {
    messages[message.chatId] = [];
  }
  
  // Check if message already exists
  const existingMessageIndex = messages[message.chatId].findIndex(m => m.id === message.id);
  
  if (existingMessageIndex !== -1) {
    // Update existing message
    messages[message.chatId][existingMessageIndex] = message;
  } else {
    // Add new message
    messages[message.chatId].push(message);
  }
  
  // If this is the current chat, render messages
  if (currentChat && currentChat.id === message.chatId) {
    renderMessages(message.chatId);
  }
});

socket.on('message-status', (data) => {
  // Find and update message status
  if (messages[data.chatId]) {
    const messageIndex = messages[data.chatId].findIndex(m => m.id === data.id);
    
    if (messageIndex !== -1) {
      messages[data.chatId][messageIndex].status = data.status;
      
      // If this is the current chat, update UI
      if (currentChat && currentChat.id === data.chatId) {
        const messageElement = document.querySelector(`.message[data-message-id="${data.id}"]`);
        if (messageElement) {
          const statusElement = messageElement.querySelector('.message-status');
          statusElement.className = `message-status ${data.status}`;
        }
      }
    }
  }
});

socket.on('messages-read', (data) => {
  // Update UI for read messages
  if (currentChat && currentChat.id === data.chatId) {
    document.querySelectorAll('.message.outgoing .message-status').forEach(statusElement => {
      statusElement.classList.remove('delivered');
      statusElement.classList.add('read');
    });
  }
});

socket.on('contacts-update', (data) => {
  contacts = data;
});

socket.on('group-update', (data) => {
  // If this is the current chat and group info panel is open, reload
  if (currentChat && currentChat.id === data.groupId && contactInfoPanel.style.display !== 'none') {
    loadGroupInfo(data.groupId);
  }
});

socket.on('status-update', (status) => {
  statusMessages.push(status);
});

socket.on('connection-status', (data) => {
  if (data.status === 'open') {
    console.log('WhatsApp connection is open');
  } else if (data.status === 'connecting') {
    console.log('Connecting to WhatsApp...');
  } else if (data.status === 'close') {
    console.log('WhatsApp connection closed');
    
    if (data.statusCode === 401) {
      alert('WhatsApp session expired. Please reload the page.');
    }
  }
});

// Initialize app
function init() {
  // Initialize emoji picker
  initEmojiPicker();
  
  // Load user info
  loadUserInfo();
  
  // Show welcome screen initially
  welcomeScreen.style.display = 'flex';
  chatContainer.style.display = 'none';
  
  // Hide dropdowns and panels
  chatMenuDropdown.style.display = 'none';
  attachmentDropdown.style.display = 'none';
  statusPanel.style.display = 'none';
  newChatPanel.style.display = 'none';
  menuPanel.style.display = 'none';
  profilePanel.style.display = 'none';
  contactInfoPanel.style.display = 'none';
  searchInChatPanel.style.display = 'none';
  
  // Hide send button, show voice button initially
  sendBtn.style.display = 'none';
  voiceBtn.style.display = 'inline-block';
}

// On page load
document.addEventListener('DOMContentLoaded', async () => {
  await fetchCsrfToken();
  init();
});

function fetchUserProfile() {
  apiFetch('/api/user')
    .then(response => response.json())
    .then(data => {
      // Update user profile information
      userProfile = data;
      
      // Update UI elements with user info
      if (data.name) {
        document.getElementById('profile-name').textContent = data.name;
      }
      
      if (data.status) {
        document.getElementById('profile-status').textContent = data.status;
      }
      
      if (data.picture) {
        document.getElementById('sidebar-profile-pic').src = data.picture;
        document.getElementById('profile-picture').src = data.picture;
      }
    })
    .catch(error => {
      console.error('Error fetching user profile:', error);
    });
}

function fetchContacts() {
  apiFetch('/api/contacts')
    .then(response => response.json())
    .then(data => {
      // Store contacts data
      contacts = data;
      
      // Update UI with contacts
      renderContacts(data);
    })
    .catch(error => {
      console.error('Error fetching contacts:', error);
    });
}

// Security Settings Functions
function openSecuritySettings() {
  // Load current security settings
  apiFetch('/api/security/ip-access', { action: 'getConfig' }, 'POST')
    .then(response => {
      if (response.success && response.config) {
        const { enabled, allowedIPs, allowLocalAccess } = response.config;
        
        // Update UI
        document.getElementById('ipAccessEnabled').checked = enabled;
        document.getElementById('allowLocalAccess').checked = allowLocalAccess;
        
        // Populate allowed IPs
        const ipList = document.getElementById('allowedIpList');
        ipList.innerHTML = '';
        
        if (allowedIPs && allowedIPs.length > 0) {
          allowedIPs.forEach(ip => {
            const ipItem = document.createElement('div');
            ipItem.className = 'ip-item';
            ipItem.innerHTML = `
              <span class="ip-address">${ip}</span>
              <i class="fas fa-times ip-remove" data-ip="${ip}"></i>
            `;
            ipList.appendChild(ipItem);
          });
          
          // Add event listeners for remove buttons
          document.querySelectorAll('.ip-remove').forEach(btn => {
            btn.addEventListener('click', function() {
              const ip = this.getAttribute('data-ip');
              removeAllowedIP(ip);
            });
          });
        } else {
          ipList.innerHTML = '<div class="empty-state">No IP addresses added yet.</div>';
        }
      } else {
        showToast('Failed to load security settings', 'error');
      }
    })
    .catch(error => {
      console.error('Error loading IP access settings:', error);
      showToast('Failed to load security settings', 'error');
    });
  
  // Show modal
  document.getElementById('securitySettingsModal').style.display = 'flex';
}

function saveSecuritySettings() {
  const ipAccessEnabled = document.getElementById('ipAccessEnabled').checked;
  const allowLocalAccess = document.getElementById('allowLocalAccess').checked;
  
  // Save IP access settings
  apiFetch('/api/security/ip-access', {
    action: 'setEnabled',
    enabled: ipAccessEnabled
  }, 'POST')
    .then(response => {
      if (!response.success) {
        throw new Error('Failed to update IP access status');
      }
      
      return apiFetch('/api/security/ip-access', {
        action: 'setLocalAccess',
        allowLocal: allowLocalAccess
      }, 'POST');
    })
    .then(response => {
      if (response.success) {
        showToast('Security settings saved successfully', 'success');
        closeModal('securitySettingsModal');
      } else {
        showToast('Failed to save some settings', 'error');
      }
    })
    .catch(error => {
      console.error('Error saving security settings:', error);
      showToast('Failed to save security settings', 'error');
    });
}

function addAllowedIP() {
  const ipInput = document.getElementById('newIpAddress');
  const ip = ipInput.value.trim();
  
  if (!ip) {
    showToast('Please enter an IP address', 'error');
    return;
  }
  
  // Simple IP validation
  const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!ipPattern.test(ip)) {
    showToast('Please enter a valid IP address', 'error');
    return;
  }
  
  apiFetch('/api/security/ip-access', {
    action: 'add',
    ip: ip
  }, 'POST')
    .then(response => {
      if (response.success) {
        // Clear input
        ipInput.value = '';
        
        // Refresh the IP list
        openSecuritySettings();
        
        showToast('IP address added to allowed list', 'success');
      } else {
        showToast(response.message || 'Failed to add IP address', 'error');
      }
    })
    .catch(error => {
      console.error('Error adding IP address:', error);
      showToast('Failed to add IP address', 'error');
    });
}

function removeAllowedIP(ip) {
  apiFetch('/api/security/ip-access', {
    action: 'remove',
    ip: ip
  }, 'POST')
    .then(response => {
      if (response.success) {
        // Refresh the IP list
        openSecuritySettings();
        
        showToast('IP address removed from allowed list', 'success');
      } else {
        showToast(response.message || 'Failed to remove IP address', 'error');
      }
    })
    .catch(error => {
      console.error('Error removing IP address:', error);
      showToast('Failed to remove IP address', 'error');
    });
}

// Password change functionality
function openChangePasswordModal() {
  // Reset form
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
  
  // Reset strength indicators
  document.getElementById('passwordStrengthProgress').className = '';
  document.getElementById('passwordStrengthProgress').style.width = '0';
  document.getElementById('passwordStrengthText').innerText = 'Password strength: Not set';
  
  document.querySelectorAll('.password-requirements li').forEach(li => {
    li.classList.remove('valid');
  });
  
  // Show modal
  closeModal('securitySettingsModal');
  document.getElementById('changePasswordModal').style.display = 'flex';
}

function checkPasswordStrength(password) {
  // Reset all requirements
  document.querySelectorAll('.password-requirements li').forEach(li => {
    li.classList.remove('valid');
  });
  
  if (!password) {
    document.getElementById('passwordStrengthProgress').className = '';
    document.getElementById('passwordStrengthProgress').style.width = '0';
    document.getElementById('passwordStrengthText').innerText = 'Password strength: Not set';
    return 0;
  }
  
  let strength = 0;
  
  // Check length
  if (password.length >= 12) {
    strength += 25;
    document.getElementById('req-length').classList.add('valid');
  }
  
  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    strength += 25;
    document.getElementById('req-uppercase').classList.add('valid');
  }
  
  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    strength += 25;
    document.getElementById('req-lowercase').classList.add('valid');
  }
  
  // Check for numbers
  if (/[0-9]/.test(password)) {
    strength += 25;
    document.getElementById('req-number').classList.add('valid');
  }
  
  // Check for special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 25;
    document.getElementById('req-special').classList.add('valid');
  }
  
  // Normalize strength to 100%
  strength = Math.min(100, strength);
  
  // Update UI
  const strengthProgress = document.getElementById('passwordStrengthProgress');
  const strengthText = document.getElementById('passwordStrengthText');
  
  strengthProgress.className = '';
  
  if (strength <= 25) {
    strengthProgress.classList.add('weak');
    strengthText.innerText = 'Password strength: Weak';
  } else if (strength <= 50) {
    strengthProgress.classList.add('fair');
    strengthText.innerText = 'Password strength: Fair';
  } else if (strength <= 75) {
    strengthProgress.classList.add('good');
    strengthText.innerText = 'Password strength: Good';
  } else {
    strengthProgress.classList.add('strong');
    strengthText.innerText = 'Password strength: Strong';
  }
  
  return strength;
}

function changeAdminPassword() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Validate inputs
  if (!currentPassword) {
    showToast('Please enter your current password', 'error');
    return;
  }
  
  if (!newPassword) {
    showToast('Please enter a new password', 'error');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showToast('New passwords do not match', 'error');
    return;
  }
  
  // Check password strength
  const strength = checkPasswordStrength(newPassword);
  if (strength < 75) {
    showToast('Please create a stronger password', 'error');
    return;
  }
  
  // Submit password change
  apiFetch('/api/account/change-password', {
    currentPassword,
    newPassword
  }, 'POST')
    .then(response => {
      if (response.success) {
        showToast('Password changed successfully', 'success');
        closeModal('changePasswordModal');
      } else {
        showToast(response.message || 'Failed to change password', 'error');
      }
    })
    .catch(error => {
      console.error('Error changing password:', error);
      showToast('Failed to change password', 'error');
    });
}

// Set up event listeners for security settings
document.addEventListener('DOMContentLoaded', function() {
  // Events for IP access control
  document.getElementById('addIpButton')?.addEventListener('click', addAllowedIP);
  document.getElementById('saveSecuritySettings')?.addEventListener('click', saveSecuritySettings);
  
  // Events for password change
  document.getElementById('changePasswordBtn')?.addEventListener('click', openChangePasswordModal);
  document.getElementById('savePasswordButton')?.addEventListener('click', changeAdminPassword);
  
  // Password strength checker
  document.getElementById('newPassword')?.addEventListener('input', function() {
    checkPasswordStrength(this.value);
  });
  
  // Allow pressing Enter in the IP input to add IP
  document.getElementById('newIpAddress')?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      addAllowedIP();
    }
  });
});

// More functions with apiFetch... 