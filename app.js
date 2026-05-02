// Mock Data simulating MIS table fetch
const mockOffers = [
    {
        id: 'o1',
        type: 'Credit Card',
        title: 'Pre-Approved Celesta Credit Card',
        amount: 'INR 5,00,000',
        desc: 'Zero joining fee with exclusive airport lounge access and rewards.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>'
    },
    {
        id: 'o2',
        type: 'Personal Loan',
        title: 'Instant Personal Loan',
        amount: 'INR 3,50,000',
        desc: 'No documentation required. Funds disbursed in 3 minutes.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>'
    },
    {
        id: 'o3',
        type: 'Home Loan Top-Up',
        title: 'Pre-Approved Home Loan Top-up',
        amount: 'INR 10,00,000',
        desc: 'Special interest rate for your renovation needs.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
    },
    {
        id: 'o4',
        type: 'Gold Loan Top-Up',
        title: 'Pre-Approved Gold Loan Top-Up',
        amount: 'INR 1,50,000',
        desc: 'Leverage your existing gold deposits for instant liquidity.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>'
    },
    {
        id: 'o5',
        type: 'Car Loan',
        title: 'Pre-Approved Car Loan',
        amount: 'INR 8,00,000',
        desc: 'Drive home your dream car with 100% on-road funding.',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="18" height="10" rx="2" ry="2"></rect><path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"></path><circle cx="7" cy="20" r="2"></circle><circle cx="17" cy="20" r="2"></circle></svg>'
    }
];

const elements = {
    offersContainer: document.getElementById('offersContainer'),
    emptyState: document.getElementById('emptyState'),
    debugToggle: document.getElementById('debugToggle'),
    ssoModal: document.getElementById('ssoModal'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    modalConfirmBtn: document.getElementById('modalConfirmBtn'),
    modalOfferName: document.getElementById('modalOfferName'),
    toast: document.getElementById('toast'),
    toastMsg: document.getElementById('toastMsg')
};

let currentSelectedOffer = null;

// Initialize app
function init() {
    renderOffers(mockOffers);
    setupEventListeners();
}

// Render offers to DOM
function renderOffers(offers) {
    elements.offersContainer.innerHTML = '';
    
    if (!offers || offers.length === 0) {
        elements.offersContainer.classList.add('hidden');
        elements.emptyState.classList.remove('hidden');
        return;
    }

    elements.emptyState.classList.add('hidden');
    elements.offersContainer.classList.remove('hidden');

    offers.forEach((offer, index) => {
        const card = document.createElement('div');
        card.className = 'offer-card animate-fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="offer-header">
                <div class="offer-icon">
                    ${offer.icon}
                </div>
                <div class="offer-badge">Pre-Approved</div>
            </div>
            <div class="offer-title">${offer.title}</div>
            <div class="offer-amount">${offer.amount}</div>
            <div class="offer-desc">${offer.desc}</div>
            <div class="offer-action">
                Avail Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
        `;

        card.addEventListener('click', () => openModal(offer));
        elements.offersContainer.appendChild(card);
    });
}

function setupEventListeners() {
    elements.debugToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            renderOffers(mockOffers);
        } else {
            renderOffers([]);
        }
    });

    elements.modalCancelBtn.addEventListener('click', closeModal);
    
    elements.modalConfirmBtn.addEventListener('click', () => {
        closeModal();
        if (currentSelectedOffer) {
            console.log(`[SSO REDIRECT LOG] User confirmed redirect to Loan Portal for: ${currentSelectedOffer.title} (ID: ${currentSelectedOffer.id})`);
            showToast(`Redirecting to portal for ${currentSelectedOffer.type}...`);
        }
    });
}

function openModal(offer) {
    currentSelectedOffer = offer;
    elements.modalOfferName.textContent = offer.title;
    elements.ssoModal.classList.remove('hidden');
    // slight delay to allow display:block to apply before animating opacity
    setTimeout(() => {
        elements.ssoModal.classList.add('show');
    }, 10);
}

function closeModal() {
    elements.ssoModal.classList.remove('show');
    setTimeout(() => {
        elements.ssoModal.classList.add('hidden');
        currentSelectedOffer = null;
    }, 300); // wait for transition
}

function showToast(message) {
    elements.toastMsg.textContent = message;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// Boot up
document.addEventListener('DOMContentLoaded', init);
