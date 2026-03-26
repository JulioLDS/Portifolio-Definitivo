// ===== VARIÁVEIS GLOBAIS DE PAGINAÇÃO =====
const ITEMS_PER_PAGE = 6;

const paginationState = {
    projects: {
        currentPage: 1,
        totalPages: 1,
        items: []
    },
    certificates: {
        currentPage: 1,
        totalPages: 1,
        items: []
    }
};

// ===== CARREGAMENTO DE DADOS =====
async function loadData() {
    try {
        const projectsResponse = await fetch('data/projects.json');
        const projects = await projectsResponse.json();
        renderProjects(projects);

        const certificatesResponse = await fetch('data/certificates.json');
        const certificates = await certificatesResponse.json();
        renderCertificates(certificates);

        const technologiesResponse = await fetch('data/technologies.json');
        const technologies = await technologiesResponse.json();
        renderTechnologies(technologies);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// ===== RENDERIZAR PROJETOS =====
function renderProjects(projects) {
    const container = document.getElementById('projects-container');

    if (!projects || projects.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">Nenhum projeto cadastrado ainda.</p>';
        paginationState.projects.totalPages = 0;
        updatePaginationUI('projects');
        return;
    }

    // REVERTER ORDEM (mais recente primeiro)
    const projectsReversed = [...projects].reverse();

    paginationState.projects.items = projectsReversed;
    paginationState.projects.totalPages = Math.ceil(projectsReversed.length / ITEMS_PER_PAGE);
    paginationState.projects.currentPage = 1;

    renderProjectsPage(1);
    updatePaginationUI('projects');
}

function renderProjectsPage(page) {
    const container = document.getElementById('projects-container');
    const state = paginationState.projects;

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const projectsToShow = state.items.slice(startIndex, endIndex);

    container.innerHTML = projectsToShow.map(project => `
        <div class="project-card">
            <div class="project-image ${project.imageClass || ''}">
                ${project.image
            ? `<img src="${project.image}" alt="${project.title}" loading="lazy" onerror="this.parentElement.style.background='linear-gradient(135deg, #273d3c, #151619)'">`
            : ''}
                <div class="project-overlay">
                    ${project.link ? `
                        <a href="${project.link}" target="_blank" class="project-link-btn" title="Ver projeto online">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Ver Projeto</span>
                        </a>
                    ` : ''}
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tech-tags">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    state.currentPage = page;
    updatePaginationUI('projects');
}

// ===== RENDERIZAR CERTIFICADOS =====
function renderCertificates(certificates) {
    const container = document.getElementById('certificates-container');

    if (!certificates || certificates.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">Nenhum certificado cadastrado ainda.</p>';
        paginationState.certificates.totalPages = 0;
        updatePaginationUI('certificates');
        return;
    }

    // REVERTER ORDEM (mais recente primeiro)
    const certificatesReversed = [...certificates].reverse();

    paginationState.certificates.items = certificatesReversed;
    paginationState.certificates.totalPages = Math.ceil(certificatesReversed.length / ITEMS_PER_PAGE);
    paginationState.certificates.currentPage = 1;

    renderCertificatesPage(1);
    updatePaginationUI('certificates');
}

function renderCertificatesPage(page) {
    const container = document.getElementById('certificates-container');
    const state = paginationState.certificates;

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const certificatesToShow = state.items.slice(startIndex, endIndex);

    container.innerHTML = certificatesToShow.map(cert => `
        <div class="certificate-card">
            <div class="certificate-image ${cert.imageClass || ''}">
                ${cert.image
            ? `<img src="${cert.image}" alt="${cert.title}" loading="lazy" onerror="this.parentElement.style.background='linear-gradient(135deg, #273d3c, #151619)'">`
            : ''}
            </div>
            <div class="certificate-info">
                <h3>${cert.title}</h3>
                <p>${cert.issuer}</p>
                <p style="font-size: 0.85rem; margin-top: 10px;">${cert.date}</p>
            </div>
        </div>
    `).join('');

    state.currentPage = page;
    updatePaginationUI('certificates');
}

// ===== RENDERIZAR TECNOLOGIAS =====
function renderTechnologies(technologies) {
    const container = document.getElementById('technologies-container');
    container.innerHTML = technologies.map(tech =>
        `<div class="tech-item">
            <i class="${tech.icon}"></i>
            <span>${tech.name}</span>
        </div>`
    ).join('');
}

// ===== PAGINAÇÃO =====
function changePage(type, direction) {
    const state = paginationState[type];
    const newPage = state.currentPage + direction;

    if (newPage < 1 || newPage > state.totalPages) return;

    if (type === 'projects') {
        renderProjectsPage(newPage);
    } else {
        renderCertificatesPage(newPage);
    }
}

function goToPage(type, page) {
    if (type === 'projects') {
        renderProjectsPage(page);
    } else {
        renderCertificatesPage(page);
    }
}

function updatePaginationUI(type) {
    updatePaginationButtons(type);
    updatePaginationDots(type);
}

function updatePaginationButtons(type) {
    const state = paginationState[type];
    const paginationEl = document.getElementById(`${type}-pagination`);

    if (!paginationEl) return;

    const prevBtn = paginationEl.querySelector('.pagination-btn.prev');
    const nextBtn = paginationEl.querySelector('.pagination-btn.next');

    if (prevBtn) {
        prevBtn.disabled = state.currentPage === 1;
    }

    if (nextBtn) {
        nextBtn.disabled = state.currentPage === state.totalPages;
    }

    if (state.totalPages <= 1) {
        paginationEl.style.display = 'none';
    } else {
        paginationEl.style.display = 'flex';
    }
}

function updatePaginationDots(type) {
    const state = paginationState[type];
    const dotsContainer = document.getElementById(`${type}-dots`);

    if (!dotsContainer) return;

    if (state.totalPages <= 1) {
        dotsContainer.style.display = 'none';
        return;
    }

    dotsContainer.style.display = 'flex';

    dotsContainer.innerHTML = Array.from({ length: state.totalPages }, (_, index) => {
        const pageNumber = index + 1;
        const isActive = pageNumber === state.currentPage;

        return `
            <button 
                class="pagination-dot ${isActive ? 'active' : ''}" 
                onclick="goToPage('${type}', ${pageNumber})"
                aria-label="Página ${pageNumber}"
            ></button>
        `;
    }).join('');
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Sistema de Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => {
                p.classList.remove('active');
            });
            btn.classList.add('active');

            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');

            if (navLinks.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = 'auto';
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
            body.style.overflow = 'auto';
        });
    });

    document.addEventListener('click', (e) => {
        if (hamburger && !hamburger.contains(e.target) && navLinks && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });

    // ===== FORMULÁRIO DE CONTATO COM AJAX =====
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o redirecionamento padrão

            const originalBtnText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            formStatus.style.display = 'none';

            try {
                // Enviar via Fetch API
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = '✅ Mensagem enviada com sucesso!';
                    formStatus.style.color = 'var(--accent-green)';
                    formStatus.style.display = 'block';

                    contactForm.reset();

                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);

                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.errors?.[0]?.message || 'Erro ao enviar');

                }
            } catch (error) {
                console.error('Erro ao enviar:', error);
                formStatus.textContent = '❌ Erro ao enviar. Tente novamente ou use meu email direto.';
                formStatus.style.color = '#ff6b6b';
                formStatus.style.display = 'block';

                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 7000);

            } finally {
                // Restaurar botão
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // Animação de Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.about-container, .showcase-container, .contact-container, .project-card, .certificate-card, .tech-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Remover underline dos links sociais
    document.querySelectorAll('.social-icon, .social-card, .social-card-large, .social-card-small').forEach(link => {
        link.style.textDecoration = 'none';
    });

    // Carregar dados
    loadData();
});