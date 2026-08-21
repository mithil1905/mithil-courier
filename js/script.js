/**
 * MITHIL COURIER SERVICES - CORE JAVASCRIPT
 * Interactive functionality, rate calculator, tracking simulator, multi-step booking wizard, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStatsCounter();
  initQuickCalculator();
  initTrackingSystem();
  initBookingWizard();
  initFaqAccordion();
  initContactForm();
  initSupportModal();
});

/* ==========================================================================
   1. NAVBAR & HEADER CONTROLS
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // Highlight active page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   2. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute('data-target') || el.innerText.replace(/[^0-9]/g, ''), 10);
        const suffix = el.getAttribute('data-suffix') || '+';
        let count = 0;
        const duration = 1800;
        const increment = Math.ceil(targetValue / (duration / 25));

        const timer = setInterval(() => {
          count += increment;
          if (count >= targetValue) {
            count = targetValue;
            clearInterval(timer);
          }
          el.innerHTML = `${count.toLocaleString()}<span>${suffix}</span>`;
        }, 25);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   3. QUICK SHIPPING RATE CALCULATOR
   ========================================================================== */
function initQuickCalculator() {
  const calcBtn = document.getElementById('calc-estimate-btn');
  const weightInput = document.getElementById('calc-weight');
  const serviceSelect = document.getElementById('calc-service');
  const resultDisplay = document.getElementById('calc-price-display');

  function calculateRate() {
    if (!resultDisplay) return;
    const weight = parseFloat(weightInput?.value) || 1;
    const serviceMultiplier = parseFloat(serviceSelect?.value) || 1.0;
    
    // Base formula: Base fare ($12 / ₹120) + (Weight * Rate) * Multiplier
    const baseFare = 80;
    const perKgRate = 45;
    const calculated = Math.round((baseFare + (weight * perKgRate)) * serviceMultiplier);
    
    resultDisplay.textContent = `₹${calculated.toLocaleString()}`;
  }

  if (calcBtn) {
    calcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calculateRate();
      showToast('Estimated rate calculated successfully!');
    });
  }

  if (weightInput) weightInput.addEventListener('input', calculateRate);
  if (serviceSelect) serviceSelect.addEventListener('change', calculateRate);
}

/* ==========================================================================
   4. SHIPMENT TRACKING ENGINE & SIMULATOR
   ========================================================================== */
const mockShipments = {
  'MCS-88219': {
    id: 'MCS-88219',
    status: 'Out for Delivery',
    statusClass: 'badge-orange',
    origin: 'Mumbai Hub, MH',
    destination: 'Bengaluru Central, KA',
    sender: 'Mithil Tech Logistics',
    receiver: 'Deekshitha K.',
    service: 'Express Air Priority',
    estDelivery: 'Today, by 6:00 PM',
    progressPercent: 85,
    events: [
      { time: 'Today, 08:30 AM', title: 'Out for Delivery', desc: 'Package assigned to courier agent Rajesh K. for final delivery.', active: true },
      { time: 'Today, 05:15 AM', title: 'Arrived at Destination Facility', desc: 'Package reached Bengaluru East Sorting Hub.', active: true },
      { time: 'Yesterday, 10:45 PM', title: 'In Transit via Air Cargo', desc: 'Departed Mumbai Central Airport Hub.', active: true },
      { time: 'Yesterday, 04:20 PM', title: 'Package Picked Up & Scanned', desc: 'Consignment booked and verified at Bandra Logistics Center.', active: true }
    ]
  },
  'MCS-40912': {
    id: 'MCS-40912',
    status: 'In Transit',
    statusClass: 'badge',
    origin: 'New Delhi HQ',
    destination: 'Hyderabad Hub, TS',
    sender: 'Apex Solutions Pvt Ltd',
    receiver: 'Vikram Sharma',
    service: 'Standard Surface',
    estDelivery: 'Tomorrow, 2:00 PM',
    progressPercent: 55,
    events: [
      { time: 'Today, 02:10 AM', title: 'Departed Transit Sorting Hub', desc: 'Package in transit between Bhopal Hub and Nagpur Junction.', active: true },
      { time: 'Yesterday, 07:45 PM', title: 'Arrived at National Hub', desc: 'Consolidated with regional freight consignment.', active: true },
      { time: 'Yesterday, 11:30 AM', title: 'Booking Processed', desc: 'Shipment registered and barcode label generated.', active: true }
    ]
  },
  'MCS-10554': {
    id: 'MCS-10554',
    status: 'Delivered Successfully',
    statusClass: 'badge-success',
    origin: 'Chennai Port',
    destination: 'Pune Tech Park, MH',
    sender: 'Global Imports Co.',
    receiver: 'Ananya Roy',
    service: 'Hyper-Priority Cargo',
    estDelivery: 'Delivered on Aug 14',
    progressPercent: 100,
    events: [
      { time: 'Aug 14, 01:15 PM', title: 'Delivered to Recipient', desc: 'Signed and received by Ananya Roy (OTP verified).', active: true },
      { time: 'Aug 14, 09:00 AM', title: 'Out for Delivery', desc: 'Courier on the way to delivery address.', active: true },
      { time: 'Aug 13, 08:30 PM', title: 'Reached Pune Sorting Facility', desc: 'Security cleared and sorted for morning route.', active: true },
      { time: 'Aug 13, 10:00 AM', title: 'Shipment Picked Up', desc: 'Package processed at Chennai Central Terminal.', active: true }
    ]
  }
};

function initTrackingSystem() {
  const trackingForm = document.getElementById('tracking-form');
  const trackInput = document.getElementById('tracking-code-input');
  const trackingResultContainer = document.getElementById('tracking-result-section');
  const sampleChips = document.querySelectorAll('.sample-code-chip');

  // Fill sample tracking numbers
  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const code = chip.getAttribute('data-code') || chip.innerText.trim();
      if (trackInput) {
        trackInput.value = code;
        renderTrackingInfo(code);
      }
    });
  });

  // Check URL query parameters for ?track=MCS-XXXX
  const urlParams = new URLSearchParams(window.location.search);
  const trackQuery = urlParams.get('track');
  if (trackQuery && trackInput) {
    trackInput.value = trackQuery;
    renderTrackingInfo(trackQuery);
  }

  if (trackingForm) {
    trackingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = trackInput?.value.trim().toUpperCase();
      if (!code) {
        showToast('Please enter a valid tracking number or AWB code', 'warning');
        return;
      }
      renderTrackingInfo(code);
    });
  }

  function renderTrackingInfo(code) {
    if (!trackingResultContainer) {
      // If we are on index.html, redirect to tracking.html?track=code
      window.location.href = `tracking.html?track=${encodeURIComponent(code)}`;
      return;
    }

    let shipment = mockShipments[code];

    // If custom unknown code, dynamically generate a realistic shipment state
    if (!shipment) {
      shipment = {
        id: code,
        status: 'In Transit',
        statusClass: 'badge',
        origin: 'Central Logistics Hub',
        destination: 'Customer Delivery Address',
        sender: 'Registered Merchant / Sender',
        receiver: 'Verified Consignee',
        service: 'Express Cargo Logistics',
        estDelivery: 'Estimated within 24-48 Hours',
        progressPercent: 60,
        events: [
          { time: 'Today, Just Now', title: 'In Transit to Destination Hub', desc: `Shipment ${code} scanned at regional relay hub.`, active: true },
          { time: 'Today, 04:00 AM', title: 'Dispatched from Hub', desc: 'Loaded into secure transport vehicle.', active: true },
          { time: 'Yesterday, 06:30 PM', title: 'Shipment Processed', desc: 'Package weighed, scanned and manifested.', active: true }
        ]
      };
    }

    trackingResultContainer.style.display = 'block';
    trackingResultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Render shipment details
    trackingResultContainer.innerHTML = `
      <div class="tracking-console-card">
        <div class="shipment-header-status">
          <div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">TRACKING ID / AWB</div>
            <div class="shipment-id-badge">${shipment.id} <i class="far fa-copy" style="font-size: 1rem; cursor: pointer; margin-left: 8px;" title="Copy Code" onclick="copyToClipboard('${shipment.id}')"></i></div>
          </div>
          <div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">CURRENT STATUS</div>
            <span class="badge ${shipment.statusClass}">
              <span class="pulse-dot"></span> ${shipment.status}
            </span>
          </div>
          <div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">ESTIMATED ARRIVAL</div>
            <div style="font-weight: 700; color: var(--text-pure);">${shipment.estDelivery}</div>
          </div>
          <div>
            <button class="btn btn-glass btn-sm" onclick="window.print()">
              <i class="fas fa-print"></i> Print Slip
            </button>
          </div>
        </div>

        <!-- Route Indicator -->
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center; background: rgba(255,255,255,0.02); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 24px;">
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Origin</span>
            <h4 style="font-size: 1.1rem; color: var(--cyan-primary);"><i class="fas fa-map-pin"></i> ${shipment.origin}</h4>
          </div>
          <div style="text-align: center; color: var(--text-muted);">
            <i class="fas fa-plane" style="font-size: 1.4rem; color: var(--orange-accent);"></i>
            <div style="font-size: 0.75rem; margin-top: 4px;">${shipment.service}</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Destination</span>
            <h4 style="font-size: 1.1rem; color: var(--emerald-success);"><i class="fas fa-location-dot"></i> ${shipment.destination}</h4>
          </div>
        </div>

        <!-- Live GPS Map Visual -->
        <div class="tracking-map-box" style="margin-top: 0; margin-bottom: 30px;">
          <div class="tracking-map-img-wrap">
            <img src="../images/tracking-map.jpg" alt="Active GPS Map Telemetry">
            <div class="tracking-map-overlay">
              <div class="tracking-radar-tag">
                <span class="pulse-dot"></span> Live Telematics: Active GPS Link (Satellite Transponder #88)
              </div>
              <div class="tracking-map-footer-info">
                <span style="font-size: 0.88rem; color: #fff;"><i class="fas fa-truck-fast" style="color: var(--cyan-primary); margin-right: 8px;"></i> Transit Speed: <strong>64 km/h</strong></span>
                <span style="font-size: 0.88rem; color: var(--emerald-success);"><i class="fas fa-shield-check"></i> Seal Intact</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Visual Stepped Bar -->
        <div class="tracking-timeline-bar">
          <div class="progress-active-line" style="width: ${shipment.progressPercent}%;"></div>
          
          <div class="track-node completed">
            <div class="node-icon-circle"><i class="fas fa-box"></i></div>
            <div class="node-title">Booked</div>
            <div class="node-time">Origin Hub</div>
          </div>
          <div class="track-node ${shipment.progressPercent >= 40 ? 'completed' : 'active'}">
            <div class="node-icon-circle"><i class="fas fa-truck-ramp-box"></i></div>
            <div class="node-title">Sorted</div>
            <div class="node-time">Relay Hub</div>
          </div>
          <div class="track-node ${shipment.progressPercent >= 75 ? (shipment.progressPercent === 100 ? 'completed' : 'active') : ''}">
            <div class="node-icon-circle"><i class="fas fa-truck-fast"></i></div>
            <div class="node-title">Out for Delivery</div>
            <div class="node-time">Local Hub</div>
          </div>
          <div class="track-node ${shipment.progressPercent === 100 ? 'completed' : ''}">
            <div class="node-icon-circle"><i class="fas fa-house-circle-check"></i></div>
            <div class="node-title">Delivered</div>
            <div class="node-time">Destination</div>
          </div>
        </div>

        <!-- Journey Event Logs -->
        <div class="tracking-logs-card">
          <h4 style="font-size: 1.1rem; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-clock-rotate-left" style="color: var(--cyan-primary);"></i> Real-Time Activity Log
          </h4>
          <div class="logs-timeline">
            ${shipment.events.map(ev => `
              <div class="log-item">
                <div class="log-timestamp">${ev.time}</div>
                <div class="log-details">
                  <h5>${ev.title}</h5>
                  <p>${ev.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    showToast(`Tracking details loaded for ${code}`);
  }
}

/* ==========================================================================
   5. MULTI-STEP BOOKING WIZARD
   ========================================================================== */
function initBookingWizard() {
  const wizard = document.getElementById('booking-wizard-form');
  if (!wizard) return;

  let currentStep = 1;
  const totalSteps = 4;

  const stepIndicators = document.querySelectorAll('.step-indicator');
  const stepPanes = document.querySelectorAll('.wizard-step-pane');
  const prevBtn = document.getElementById('wizard-prev-btn');
  const nextBtn = document.getElementById('wizard-next-btn');

  // Summary Elements
  const summarySender = document.getElementById('sum-sender');
  const summaryReceiver = document.getElementById('sum-receiver');
  const summaryWeight = document.getElementById('sum-weight');
  const summaryService = document.getElementById('sum-service');
  const summaryTotal = document.getElementById('sum-total');

  function updateStepUI() {
    stepPanes.forEach(pane => {
      const stepNum = parseInt(pane.getAttribute('data-step'), 10);
      if (stepNum === currentStep) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    stepIndicators.forEach(ind => {
      const stepNum = parseInt(ind.getAttribute('data-step'), 10);
      if (stepNum === currentStep) {
        ind.classList.add('active');
        ind.classList.remove('completed');
      } else if (stepNum < currentStep) {
        ind.classList.remove('active');
        ind.classList.add('completed');
      } else {
        ind.classList.remove('active', 'completed');
      }
    });

    // Button states
    if (prevBtn) {
      prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    }

    if (nextBtn) {
      if (currentStep === totalSteps) {
        nextBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm & Book Shipment';
        nextBtn.classList.remove('btn-primary');
        nextBtn.classList.add('btn-orange');
      } else {
        nextBtn.innerHTML = 'Next Step <i class="fas fa-arrow-right"></i>';
        nextBtn.classList.add('btn-primary');
        nextBtn.classList.remove('btn-orange');
      }
    }

    recalculateBookingSummary();
  }

  function validateStep(step) {
    if (step === 1) {
      const sName = document.getElementById('sender-name')?.value.trim();
      const sPhone = document.getElementById('sender-phone')?.value.trim();
      const sPin = document.getElementById('sender-pincode')?.value.trim();
      if (!sName || !sPhone || !sPin) {
        showToast('Please fill all required sender fields', 'warning');
        return false;
      }
    } else if (step === 2) {
      const rName = document.getElementById('receiver-name')?.value.trim();
      const rPhone = document.getElementById('receiver-phone')?.value.trim();
      const rPin = document.getElementById('receiver-pincode')?.value.trim();
      if (!rName || !rPhone || !rPin) {
        showToast('Please fill all required receiver fields', 'warning');
        return false;
      }
    } else if (step === 3) {
      const weight = parseFloat(document.getElementById('pkg-weight')?.value) || 0;
      if (weight <= 0) {
        showToast('Please specify a valid package weight', 'warning');
        return false;
      }
    }
    return true;
  }

  function recalculateBookingSummary() {
    const sCity = document.getElementById('sender-city')?.value || 'Origin';
    const rCity = document.getElementById('receiver-city')?.value || 'Destination';
    const weight = parseFloat(document.getElementById('pkg-weight')?.value) || 1.0;
    
    const selectedService = document.querySelector('input[name="service_tier"]:checked');
    const serviceName = selectedService?.getAttribute('data-name') || 'Standard Surface';
    const serviceMultiplier = parseFloat(selectedService?.value) || 1.0;

    const insuranceChecked = document.getElementById('addon-insurance')?.checked;
    const fragileChecked = document.getElementById('addon-fragile')?.checked;

    let baseRate = 99;
    let weightRate = weight * 50;
    let addOnTotal = (insuranceChecked ? 49 : 0) + (fragileChecked ? 35 : 0);
    let total = Math.round((baseRate + weightRate) * serviceMultiplier + addOnTotal);

    if (summarySender) summarySender.textContent = `${sCity}`;
    if (summaryReceiver) summaryReceiver.textContent = `${rCity}`;
    if (summaryWeight) summaryWeight.textContent = `${weight} kg`;
    if (summaryService) summaryService.textContent = serviceName;
    if (summaryTotal) summaryTotal.textContent = `₹${total.toLocaleString()}`;

    return total;
  }

  // Radio cards selector highlight
  const radioCards = document.querySelectorAll('.service-radio-card');
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        recalculateBookingSummary();
      }
    });
  });

  // Watch input changes to update summary live
  const watchInputs = ['sender-city', 'receiver-city', 'pkg-weight', 'addon-insurance', 'addon-fragile'];
  watchInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', recalculateBookingSummary);
      el.addEventListener('change', recalculateBookingSummary);
    }
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validateStep(currentStep)) return;

      if (currentStep < totalSteps) {
        currentStep++;
        updateStepUI();
        window.scrollTo({ top: wizard.offsetTop - 100, behavior: 'smooth' });
      } else {
        // Submit & Generate Confirmation
        completeBooking();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentStep > 1) {
        currentStep--;
        updateStepUI();
      }
    });
  }

  // Direct step indicator click
  stepIndicators.forEach(ind => {
    ind.addEventListener('click', () => {
      const stepTarget = parseInt(ind.getAttribute('data-step'), 10);
      if (stepTarget < currentStep || validateStep(currentStep)) {
        currentStep = stepTarget;
        updateStepUI();
      }
    });
  });

  function completeBooking() {
    const randomAWB = 'MCS-' + Math.floor(10000 + Math.random() * 90000);
    const modal = document.getElementById('booking-success-modal');
    const modalAwb = document.getElementById('modal-awb-code');
    const modalTrackBtn = document.getElementById('modal-track-link');

    if (modalAwb) modalAwb.textContent = randomAWB;
    if (modalTrackBtn) modalTrackBtn.setAttribute('href', `tracking.html?track=${randomAWB}`);
    if (modal) modal.classList.add('open');

    showToast(`Booking Successful! Generated AWB: ${randomAWB}`, 'success');
  }

  updateStepUI();
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other FAQs
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAns = other.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        }
      });
    }
  });
}

/* ==========================================================================
   7. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value;
    showToast(`Thank you, ${name || 'Customer'}! Your inquiry has been dispatched to our support hub.`, 'success');
    contactForm.reset();
  });
}

/* ==========================================================================
   8. SUPPORT MODAL & GLOBAL HELPERS
   ========================================================================== */
function initSupportModal() {
  const chatBtn = document.getElementById('floating-chat-trigger');
  const chatModal = document.getElementById('quick-chat-modal');
  const closeModals = document.querySelectorAll('.modal-close-btn, .modal-close-trigger');

  if (chatBtn && chatModal) {
    chatBtn.addEventListener('click', () => {
      chatModal.classList.add('open');
    });
  }

  closeModals.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.classList.remove('open');
      });
    });
  });

  // Close when clicking background
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('open');
    }
  });
}

/* Global Helpers */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = 'fas fa-info-circle';
  if (type === 'success') icon = 'fas fa-circle-check';
  if (type === 'warning') icon = 'fas fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="${icon}" style="color: var(--cyan-primary); font-size: 1.2rem;"></i>
    <span style="font-size: 0.92rem; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${text} to clipboard!`, 'success');
  }).catch(() => {
    showToast('Failed to copy', 'warning');
  });
}
