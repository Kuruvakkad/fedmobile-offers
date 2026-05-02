// State structure
const appState = {
    hasPreApprovedOffers: true, // Controlled by debug toggle
    
    // Static sections that always show up
    staticOffers: {
        creditCard: {
            id: 'cc',
            type: 'Credit Card',
            title: 'Credit Card',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
            // details when pre-approved
            successVariant: 'Celesta',
            successAmount: '5,00,000',
            successLink: 'https://creditcards.federalbank.co.in/?utm_source=CC&utm_medium=CCFedMobile&utm_campaign=Apply+For+Credit+Card#/entry',
            // details when NOT pre-approved
            fallbackLink: 'https://creditcards.federalbank.co.in/?utm_source=CC&utm_medium=CCFedMobile&utm_campaign=Apply+For+Credit+Card#/entry'
        },
        personalLoan: {
            id: 'pl',
            type: 'Personal Loan',
            title: 'Personal Loan',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
            successAmount: '3,50,000',
            successRate: '10.5',
            successEmi: '11,350',
            successTenure: '36',
            successLink: 'https://fblapp.federalbank.co.in/byom/webengine/loan',
            fallbackLink: 'https://personalloan.federalbank.co.in/#/entry'
        }
    },
    
    // Dynamic offers that ONLY show if pre-approved
    dynamicOffers: [
        {
            id: 'hl',
            type: 'Home Loan Top-Up',
            title: 'Pre-Approved Home Loan Top-up',
            amount: 'INR 10,00,000',
            desc: 'Special interest rate for your renovation needs.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
            link: '#'
        },
        {
            id: 'car',
            type: 'Car Loan',
            title: 'Pre-Approved Car Loan',
            amount: 'INR 8,00,000',
            desc: 'Drive home your dream car with 100% on-road funding.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="18" height="10" rx="2" ry="2"></rect><path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"></path><circle cx="7" cy="20" r="2"></circle><circle cx="17" cy="20" r="2"></circle></svg>',
            link: '#'
        }
    ]
};

const elements = {
    offersContainer: document.getElementById('offersContainer'),
    debugToggle: document.getElementById('debugToggle'),
    offerModal: document.getElementById('offerModal'),
    modalIcon: document.getElementById('modalIcon'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    modalCtaBtn: document.getElementById('modalCtaBtn'),
    toast: document.getElementById('toast'),
    toastMsg: document.getElementById('toastMsg')
};

let currentActionLink = null;

function init() {
    renderUI();
    setupEventListeners();
}

function renderUI() {
    elements.offersContainer.innerHTML = '';
    let index = 0;

    // 1. Always render Credit Card section
    renderStaticCard(appState.staticOffers.creditCard, index++);
    
    // 2. Always render Personal Loan section
    renderStaticCard(appState.staticOffers.personalLoan, index++);

    // 3. Render dynamic offers only if hasPreApprovedOffers is true
    if (appState.hasPreApprovedOffers) {
        appState.dynamicOffers.forEach((offer) => {
            renderDynamicCard(offer, index++);
        });
    }
}

function renderStaticCard(offer, index) {
    const card = document.createElement('div');
    card.className = 'offer-card animate-fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // When hasPreApprovedOffers is false, they don't get the 'Pre-Approved' badge
    const badgeHtml = appState.hasPreApprovedOffers ? `<div class="offer-badge">Pre-Approved</div>` : '';
    
    card.innerHTML = `
        <div class="offer-header">
            <div class="offer-icon">
                ${offer.icon}
            </div>
            ${badgeHtml}
        </div>
        <div class="offer-title">${offer.title}</div>
        <div class="offer-desc">${appState.hasPreApprovedOffers ? 'Check your pre-approved offer details.' : 'Apply now to check your eligibility.'}</div>
        <div class="offer-action">
            ${appState.hasPreApprovedOffers ? 'View Offer' : 'Check Eligibility'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </div>
    `;

    card.addEventListener('click', () => handleStaticOfferClick(offer));
    elements.offersContainer.appendChild(card);
}

function renderDynamicCard(offer, index) {
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

    card.addEventListener('click', () => {
        currentActionLink = offer.link;
        openModal({
            title: offer.title,
            icon: offer.icon,
            body: `<p>Congratulations! You have a pre-approved offer for ${offer.type}.</p><p>Amount: <span class="highlight-text">${offer.amount}</span></p><p>Click below to proceed.</p>`,
            ctaText: 'Apply Now'
        });
    });
    elements.offersContainer.appendChild(card);
}

function handleStaticOfferClick(offer) {
    let modalData = {
        title: offer.title,
        icon: offer.icon,
        body: '',
        ctaText: ''
    };

    if (appState.hasPreApprovedOffers) {
        if (offer.id === 'cc') {
            modalData.body = `
                <p>Congratulations! You have a Pre-approved Credit Card offer</p>
                <p>Variant: <span class="highlight-text">Federal Bank ${offer.successVariant} Credit Card</span></p>
                <p>Credit Limit: <span class="highlight-text">Rs. ${offer.successAmount}</span></p>
                <p class="highlight-text" style="color: var(--fed-yellow); margin-top: 12px;">Limited period offer!</p>
            `;
            modalData.ctaText = 'Click here to apply!';
            currentActionLink = offer.successLink;
        } else if (offer.id === 'pl') {
            modalData.body = `
                <p>Congratulations! You have a Pre-approved Personal Loan offer</p>
                <p>Loan amount: <span class="highlight-text">Rs. ${offer.successAmount}</span></p>
                <p>Rate of interest: <span class="highlight-text">${offer.successRate}%</span></p>
                <p>EMI: <span class="highlight-text">Rs. ${offer.successEmi}</span></p>
                <p>Tenure: <span class="highlight-text">${offer.successTenure} months</span></p>
                <p class="highlight-text" style="color: var(--fed-yellow); margin-top: 12px;">Limited period offer!</p>
            `;
            modalData.ctaText = 'Click here to apply!';
            currentActionLink = offer.successLink;
        }
    } else {
        // Fallback state
        modalData.body = `<p>Sorry, pre-approved offer is not available. Apply now to check your eligibility!</p>`;
        modalData.ctaText = 'Apply Now';
        currentActionLink = offer.fallbackLink;
    }

    openModal(modalData);
}

function openModal(data) {
    elements.modalIcon.innerHTML = data.icon;
    elements.modalTitle.textContent = data.title;
    elements.modalBody.innerHTML = data.body;
    elements.modalCtaBtn.textContent = data.ctaText;

    elements.offerModal.classList.remove('hidden');
    setTimeout(() => {
        elements.offerModal.classList.add('show');
    }, 10);
}

function closeModal() {
    elements.offerModal.classList.remove('show');
    setTimeout(() => {
        elements.offerModal.classList.add('hidden');
        currentActionLink = null;
    }, 300);
}

function setupEventListeners() {
    elements.debugToggle.addEventListener('change', (e) => {
        appState.hasPreApprovedOffers = e.target.checked;
        renderUI();
    });

    elements.modalCancelBtn.addEventListener('click', closeModal);
    
    elements.modalCtaBtn.addEventListener('click', () => {
        if (currentActionLink) {
            console.log(`Redirecting to: ${currentActionLink}`);
            window.location.href = currentActionLink;
        }
        closeModal();
    });
}

function showToast(message) {
    elements.toastMsg.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
