// Configuration de l'API
const API_BASE_URL = 'http://localhost:3000';

// État global de l'application
let currentUser = null;
let currentChannel = null;
let users = [];
let channels = [];
let currentTab = 'users';

// Éléments DOM
const elements = {
    // Boutons
    newUserBtn: document.getElementById('newUserBtn'),
    newChannelBtn: document.getElementById('newChannelBtn'),
    newUserBtnMobile: document.getElementById('newUserBtnMobile'),
    newChannelBtnMobile: document.getElementById('newChannelBtnMobile'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    closeSidebarBtn: document.getElementById('closeSidebarBtn'),
    backToSidebarBtn: document.getElementById('backToSidebarBtn'),
    usersTab: document.getElementById('usersTab'),
    channelsTab: document.getElementById('channelsTab'),
    sendMessageBtn: document.getElementById('sendMessageBtn'),
    
    // Modals
    newUserModal: document.getElementById('newUserModal'),
    newChannelModal: document.getElementById('newChannelModal'),
    closeUserModal: document.getElementById('closeUserModal'),
    closeChannelModal: document.getElementById('closeChannelModal'),
    cancelUserBtn: document.getElementById('cancelUserBtn'),
    cancelChannelBtn: document.getElementById('cancelChannelBtn'),
    
    // Formulaires
    newUserForm: document.getElementById('newUserForm'),
    newChannelForm: document.getElementById('newChannelForm'),
    
    // Listes
    usersList: document.getElementById('usersList'),
    channelsList: document.getElementById('channelsList'),
    usersCheckboxes: document.getElementById('usersCheckboxes'),
    
    // Chat
    chatHeader: document.getElementById('chatHeader'),
    chatTitle: document.getElementById('chatTitle'),
    chatSubtitle: document.getElementById('chatSubtitle'),
    chatArea: document.getElementById('chatArea'),
    messagesArea: document.getElementById('messagesArea'),
    welcomeMessage: document.getElementById('welcomeMessage'),
    messagesContainer: document.getElementById('messagesContainer'),
    messageInputArea: document.getElementById('messageInputArea'),
    messageInput: document.getElementById('messageInput'),
    
    // Mobile
    sidebar: document.getElementById('sidebar'),
    mobileOverlay: document.getElementById('mobileOverlay'),
    
    // About section
    aboutSection: document.getElementById('aboutSection'),
    aboutBtn: document.getElementById('aboutBtn'),
    closeAboutBtn: document.getElementById('closeAboutBtn'),
    closeAboutBtnBottom: document.getElementById('closeAboutBtnBottom'),
    
    // Recherche
    searchInput: document.getElementById('searchInput'),
    
    // Notifications
    notifications: document.getElementById('notifications')
};

// ==================== FONCTIONS UTILITAIRES ====================

// Afficher une notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `p-4 rounded-lg shadow-lg slide-in ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    elements.notifications.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Formater la date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Aujourd\'hui';
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return date.toLocaleDateString('fr-FR', { weekday: 'long' });
    return date.toLocaleDateString('fr-FR');
}

// ==================== GESTION DES UTILISATEURS ====================

// Charger tous les utilisateurs
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs');
        
        users = await response.json();
        renderUsers(users);
        updateUsersCheckboxes();
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement des utilisateurs', 'error');
    }
}

// Afficher les utilisateurs
function renderUsers(usersToRender) {
    if (currentTab !== 'users') return;
    
    elements.usersList.innerHTML = '';
    
    if (usersToRender.length === 0) {
        elements.usersList.innerHTML = `
            <div class="p-8 text-center text-gray-500">
                <i class="fas fa-users text-4xl mb-4"></i>
                <p>Aucun utilisateur trouvé</p>
            </div>
        `;
        return;
    }
    
    usersToRender.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'p-3 md:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors';
        userElement.innerHTML = `
            <div class="flex items-center space-x-2 md:space-x-3">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-whatsapp-green rounded-full flex items-center justify-center flex-shrink-0">
                    ${user.avatar ? 
                        `<img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover">` :
                        `<i class="fas fa-user text-white text-sm md:text-lg"></i>`
                    }
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-800 truncate text-sm md:text-base">${user.name || 'Utilisateur sans nom'}</h4>
                    <p class="text-xs md:text-sm text-gray-500 truncate">${user.email || user.phone || 'Aucun contact'}</p>
                    <p class="text-xs text-gray-400 hidden md:block">Créé le ${formatDate(user.createdAt)}</p>
                </div>
                <div class="flex space-x-1 md:space-x-2 flex-shrink-0">
                    <button onclick="editUser(${user.id})" class="text-blue-500 hover:text-blue-700 p-1">
                        <i class="fas fa-edit text-sm md:text-base"></i>
                    </button>
                    <button onclick="deleteUser(${user.id})" class="text-red-500 hover:text-red-700 p-1">
                        <i class="fas fa-trash text-sm md:text-base"></i>
                    </button>
                </div>
            </div>
        `;
        
        userElement.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                selectUser(user);
            }
        });
        
        elements.usersList.appendChild(userElement);
    });
}

// Créer un nouvel utilisateur
async function createUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) throw new Error('Erreur lors de la création de l\'utilisateur');
        
        const newUser = await response.json();
        users.push(newUser);
        renderUsers(users);
        updateUsersCheckboxes();
        showNotification('Utilisateur créé avec succès !');
        closeModal('user');
        
        return newUser;
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la création de l\'utilisateur', 'error');
        throw error;
    }
}

// Supprimer un utilisateur
async function deleteUser(userId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        users = users.filter(user => user.id !== userId);
        renderUsers(users);
        updateUsersCheckboxes();
        showNotification('Utilisateur supprimé avec succès !');
        
        // Si l'utilisateur supprimé était sélectionné, réinitialiser le chat
        if (currentUser && currentUser.id === userId) {
            resetChat();
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// Sélectionner un utilisateur pour le chat
function selectUser(user) {
    currentUser = user;
    currentChannel = null;
    
    // Mettre à jour l'interface
    elements.chatTitle.textContent = user.name || 'Utilisateur sans nom';
    elements.chatSubtitle.textContent = user.email || user.phone || 'Aucun contact';
    elements.chatHeader.classList.remove('hidden');
    elements.welcomeMessage.classList.add('hidden');
    elements.messagesContainer.classList.remove('hidden');
    elements.messageInputArea.classList.remove('hidden');
    
    // Sur mobile, basculer vers le chat
    showChat();
    
    // Simuler des messages (en attendant l'implémentation des vrais messages)
    showWelcomeMessages();
}

// ==================== GESTION DES CHANNELS ====================

// Charger tous les channels
async function loadChannels() {
    try {
        const response = await fetch(`${API_BASE_URL}/channels`);
        if (!response.ok) throw new Error('Erreur lors du chargement des channels');
        
        channels = await response.json();
        renderChannels(channels);
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement des channels', 'error');
    }
}

// Afficher les channels
function renderChannels(channelsToRender) {
    if (currentTab !== 'channels') return;
    
    elements.channelsList.innerHTML = '';
    
    if (channelsToRender.length === 0) {
        elements.channelsList.innerHTML = `
            <div class="p-8 text-center text-gray-500">
                <i class="fas fa-hashtag text-4xl mb-4"></i>
                <p>Aucun channel trouvé</p>
            </div>
        `;
        return;
    }
    
    channelsToRender.forEach(channel => {
        const channelElement = document.createElement('div');
        channelElement.className = 'p-3 md:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors';
        channelElement.innerHTML = `
            <div class="flex items-center space-x-2 md:space-x-3">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-whatsapp-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-hashtag text-white text-sm md:text-lg"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-800 truncate text-sm md:text-base">${channel.name}</h4>
                    <p class="text-xs md:text-sm text-gray-500">${channel.users.length} participant${channel.users.length > 1 ? 's' : ''}</p>
                    <p class="text-xs text-gray-400 hidden md:block">Créé le ${formatDate(channel.createdAt)}</p>
                </div>
                <div class="flex space-x-1 md:space-x-2 flex-shrink-0">
                    <button onclick="editChannel(${channel.id})" class="text-blue-500 hover:text-blue-700 p-1">
                        <i class="fas fa-edit text-sm md:text-base"></i>
                    </button>
                    <button onclick="deleteChannel(${channel.id})" class="text-red-500 hover:text-red-700 p-1">
                        <i class="fas fa-trash text-sm md:text-base"></i>
                    </button>
                </div>
            </div>
        `;
        
        channelElement.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                selectChannel(channel);
            }
        });
        
        elements.channelsList.appendChild(channelElement);
    });
}

// Créer un nouveau channel
async function createChannel(channelData) {
    try {
        const response = await fetch(`${API_BASE_URL}/channels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(channelData)
        });
        
        if (!response.ok) throw new Error('Erreur lors de la création du channel');
        
        const newChannel = await response.json();
        channels.push(newChannel);
        renderChannels(channels);
        showNotification('Channel créé avec succès !');
        closeModal('channel');
        
        return newChannel;
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la création du channel', 'error');
        throw error;
    }
}

// Supprimer un channel
async function deleteChannel(channelId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce channel ?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/channels/${channelId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        channels = channels.filter(channel => channel.id !== channelId);
        renderChannels(channels);
        showNotification('Channel supprimé avec succès !');
        
        // Si le channel supprimé était sélectionné, réinitialiser le chat
        if (currentChannel && currentChannel.id === channelId) {
            resetChat();
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// Sélectionner un channel pour le chat
function selectChannel(channel) {
    currentChannel = channel;
    currentUser = null;
    
    // Mettre à jour l'interface
    elements.chatTitle.textContent = channel.name;
    elements.chatSubtitle.textContent = `${channel.users.length} participant${channel.users.length > 1 ? 's' : ''}`;
    elements.chatHeader.classList.remove('hidden');
    elements.welcomeMessage.classList.add('hidden');
    elements.messagesContainer.classList.remove('hidden');
    elements.messageInputArea.classList.remove('hidden');
    
    // Sur mobile, basculer vers le chat
    showChat();
    
    // Simuler des messages (en attendant l'implémentation des vrais messages)
    showWelcomeMessages();
}

// ==================== GESTION MOBILE ====================

// Ouvrir la sidebar sur mobile
function openSidebar() {
    elements.sidebar.classList.add('open');
    elements.mobileOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fermer la sidebar sur mobile
function closeSidebar() {
    elements.sidebar.classList.remove('open');
    elements.mobileOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

// Basculer entre sidebar et chat sur mobile
function showChat() {
    if (window.innerWidth <= 768) {
        elements.sidebar.classList.remove('open');
        elements.mobileOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Retour à la sidebar depuis le chat
function backToSidebar() {
    if (window.innerWidth <= 768) {
        openSidebar();
    }
}

// Détecter la taille d'écran
function handleResize() {
    if (window.innerWidth > 768) {
        // Desktop : fermer la sidebar mobile
        elements.sidebar.classList.remove('open');
        elements.mobileOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// ==================== GESTION DES MESSAGES ====================

// Afficher des messages de bienvenue
function showWelcomeMessages() {
    const messages = [
        {
            id: 1,
            content: "Salut ! 👋 Bienvenue sur Watsshap !",
            sender: "Système",
            timestamp: new Date(),
            isSystem: true
        },
        {
            id: 2,
            content: "Cette application démontre les avantages des bases de données NoSQL pour la messagerie !",
            sender: "Système",
            timestamp: new Date(),
            isSystem: true
        },
        {
            id: 3,
            content: "Vous pouvez créer des utilisateurs et des channels pour tester les fonctionnalités.",
            sender: "Système",
            timestamp: new Date(),
            isSystem: true
        }
    ];
    
    elements.messagesContainer.innerHTML = '';
    messages.forEach(message => {
        addMessageToChat(message);
    });
}

// Ajouter un message au chat
function addMessageToChat(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `flex ${message.isSystem ? 'justify-center' : 'justify-end'} mb-4`;
    
    const bubbleClass = message.isSystem ? 
        'bg-gray-200 text-gray-700 px-4 py-2 rounded-lg max-w-xs' :
        'chat-bubble sent px-4 py-2 rounded-lg';
    
    messageElement.innerHTML = `
        <div class="${bubbleClass}">
            <p class="text-sm">${message.content}</p>
            <p class="text-xs opacity-70 mt-1">${message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    `;
    
    elements.messagesContainer.appendChild(messageElement);
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
}

// Envoyer un message
async function sendMessage() {
    const messageText = elements.messageInput.value.trim();
    if (!messageText) return;
    
    // Simuler l'envoi d'un message
    const message = {
        id: Date.now(),
        content: messageText,
        sender: currentUser ? currentUser.name : currentChannel ? 'Vous' : 'Utilisateur',
        timestamp: new Date(),
        isSystem: false
    };
    
    addMessageToChat(message);
    elements.messageInput.value = '';
    
    // Simuler une réponse automatique
    setTimeout(() => {
        const responses = [
            "Message reçu ! 📱",
            "Intéressant ! 🤔",
            "D'accord avec vous ! 👍",
            "Merci pour le message ! 😊",
            "C'est noté ! 📝"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const responseMessage = {
            id: Date.now() + 1,
            content: randomResponse,
            sender: currentUser ? currentUser.name : 'Participant',
            timestamp: new Date(),
            isSystem: false
        };
        
        addMessageToChat(responseMessage);
    }, 1000 + Math.random() * 2000);
}

// ==================== GESTION DES MODALS ====================

// Ouvrir un modal
function openModal(type) {
    if (type === 'user') {
        elements.newUserModal.classList.remove('hidden');
        elements.newUserModal.classList.add('flex');
    } else if (type === 'channel') {
        elements.newChannelModal.classList.remove('hidden');
        elements.newChannelModal.classList.add('flex');
    }
}

// Fermer un modal
function closeModal(type) {
    if (type === 'user') {
        elements.newUserModal.classList.add('hidden');
        elements.newUserModal.classList.remove('flex');
        elements.newUserForm.reset();
    } else if (type === 'channel') {
        elements.newChannelModal.classList.add('hidden');
        elements.newChannelModal.classList.remove('flex');
        elements.newChannelForm.reset();
    } else if (type === 'about') {
        elements.aboutSection.classList.add('hidden');
        elements.aboutSection.classList.remove('flex');
    }
}

// Ouvrir la section En Savoir Plus
function openAbout() {
    elements.aboutSection.classList.remove('hidden');
    elements.aboutSection.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

// Mettre à jour les checkboxes des utilisateurs
function updateUsersCheckboxes() {
    elements.usersCheckboxes.innerHTML = '';
    
    users.forEach(user => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'flex items-center space-x-2 p-2 hover:bg-gray-50 rounded';
        checkboxDiv.innerHTML = `
            <input type="checkbox" id="user-${user.id}" value="${user.id}" class="rounded">
            <label for="user-${user.id}" class="text-sm text-gray-700 cursor-pointer">${user.name || 'Utilisateur sans nom'}</label>
        `;
        elements.usersCheckboxes.appendChild(checkboxDiv);
    });
}

// Réinitialiser le chat
function resetChat() {
    currentUser = null;
    currentChannel = null;
    elements.chatHeader.classList.add('hidden');
    elements.welcomeMessage.classList.remove('hidden');
    elements.messagesContainer.classList.add('hidden');
    elements.messageInputArea.classList.add('hidden');
    elements.messagesContainer.innerHTML = '';
}

// ==================== GESTION DES ONGLETS ====================

function switchTab(tab) {
    currentTab = tab;
    
    if (tab === 'users') {
        elements.usersTab.classList.add('text-whatsapp-green', 'border-whatsapp-green');
        elements.usersTab.classList.remove('text-gray-500');
        elements.channelsTab.classList.remove('text-whatsapp-green', 'border-whatsapp-green');
        elements.channelsTab.classList.add('text-gray-500');
        
        elements.usersList.classList.remove('hidden');
        elements.channelsList.classList.add('hidden');
        
        renderUsers(users);
    } else {
        elements.channelsTab.classList.add('text-whatsapp-green', 'border-whatsapp-green');
        elements.channelsTab.classList.remove('text-gray-500');
        elements.usersTab.classList.remove('text-whatsapp-green', 'border-whatsapp-green');
        elements.usersTab.classList.add('text-gray-500');
        
        elements.channelsList.classList.remove('hidden');
        elements.usersList.classList.add('hidden');
        
        renderChannels(channels);
    }
}

// ==================== RECHERCHE ====================

function filterItems(searchTerm) {
    if (currentTab === 'users') {
        const filteredUsers = users.filter(user => 
            (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.phone && user.phone.includes(searchTerm))
        );
        renderUsers(filteredUsers);
    } else {
        const filteredChannels = channels.filter(channel => 
            channel.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderChannels(filteredChannels);
    }
}

// ==================== ÉVÉNEMENTS ====================

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    // Charger les données initiales
    await loadUsers();
    await loadChannels();
    
    // Événements des boutons
    elements.newUserBtn.addEventListener('click', () => openModal('user'));
    elements.newChannelBtn.addEventListener('click', () => openModal('channel'));
    elements.newUserBtnMobile.addEventListener('click', () => openModal('user'));
    elements.newChannelBtnMobile.addEventListener('click', () => openModal('channel'));
    
    // Événements mobile
    elements.mobileMenuBtn.addEventListener('click', openSidebar);
    elements.closeSidebarBtn.addEventListener('click', closeSidebar);
    elements.backToSidebarBtn.addEventListener('click', backToSidebar);
    elements.mobileOverlay.addEventListener('click', closeSidebar);
    
    // Événements section En Savoir Plus
    elements.aboutBtn.addEventListener('click', openAbout);
    elements.closeAboutBtn.addEventListener('click', () => closeModal('about'));
    elements.closeAboutBtnBottom.addEventListener('click', () => closeModal('about'));
    
    // Événements des modals
    elements.closeUserModal.addEventListener('click', () => closeModal('user'));
    elements.closeChannelModal.addEventListener('click', () => closeModal('channel'));
    elements.cancelUserBtn.addEventListener('click', () => closeModal('user'));
    elements.cancelChannelBtn.addEventListener('click', () => closeModal('channel'));
    
    // Événements des formulaires
    elements.newUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            avatar: document.getElementById('userAvatar').value || null
        };
        await createUser(userData);
    });
    
    elements.newChannelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedUsers = Array.from(document.querySelectorAll('#usersCheckboxes input:checked'))
            .map(checkbox => parseInt(checkbox.value));
        
        if (selectedUsers.length === 0) {
            showNotification('Veuillez sélectionner au moins un utilisateur', 'error');
            return;
        }
        
        const channelData = {
            name: document.getElementById('channelName').value,
            userIds: selectedUsers
        };
        await createChannel(channelData);
    });
    
    // Événements des onglets
    elements.usersTab.addEventListener('click', () => switchTab('users'));
    elements.channelsTab.addEventListener('click', () => switchTab('channels'));
    
    // Événement d'envoi de message
    elements.sendMessageBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Événement de recherche
    elements.searchInput.addEventListener('input', (e) => {
        filterItems(e.target.value);
    });
    
    // Fermer les modals en cliquant à l'extérieur
    elements.newUserModal.addEventListener('click', (e) => {
        if (e.target === elements.newUserModal) {
            closeModal('user');
        }
    });
    
    elements.newChannelModal.addEventListener('click', (e) => {
        if (e.target === elements.newChannelModal) {
            closeModal('channel');
        }
    });
    
    // Fermer la section En Savoir Plus en cliquant à l'extérieur
    elements.aboutSection.addEventListener('click', (e) => {
        if (e.target === elements.aboutSection) {
            closeModal('about');
        }
    });
    
    // Événement de redimensionnement
    window.addEventListener('resize', handleResize);
    
    showNotification('Watsshap chargé avec succès ! 🚀', 'success');
});

// Fonctions globales pour les boutons inline
window.editUser = function(userId) {
    showNotification('Fonctionnalité d\'édition à implémenter', 'info');
};

window.deleteUser = deleteUser;

window.editChannel = function(channelId) {
    showNotification('Fonctionnalité d\'édition à implémenter', 'info');
};

window.deleteChannel = deleteChannel;
