// JavaScript personalizado para TechadosAcosta
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling para los enlaces del navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Ajuste para el navbar fijo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cambiar el estilo del navbar al hacer scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
            navbar.style.backgroundColor = 'rgba(52, 58, 64, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
    });

    // Animación de aparición de elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar las tarjetas de servicios
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Efecto de escritura para el título principal
    const heroTitle = document.querySelector('.hero-section h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        const typeWriter = function() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        setTimeout(typeWriter, 1000);
    }

    // FORMULARIO DE CONTACTO - CORREGIDO
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario usando los atributos name correctos
            const nombre = this.querySelector('input[name="nombre"]').value.trim();
            const telefono = this.querySelector('input[name="telefono"]').value.trim();
            const ubicacion = this.querySelector('input[name="ubicacion"]').value.trim();
            const material = this.querySelector('select[name="material"]').value.trim();
            const proyecto = this.querySelector('textarea[name="proyecto"]').value.trim();
            const terminos = this.querySelector('#acepto-terminos').checked;
            
            // Debug - mostrar valores en consola
            console.log('Valores del formulario:', {
                nombre, telefono, ubicacion, material, proyecto, terminos
            });
            
            // Validación básica
            if (!nombre) {
                mostrarAlerta('Por favor, ingresa tu nombre completo.', 'danger');
                return;
            }
            if (!telefono) {
                mostrarAlerta('Por favor, ingresa tu teléfono.', 'danger');
                return;
            }
            if (!ubicacion) {
                mostrarAlerta('Por favor, ingresa tu ubicación.', 'danger');
                return;
            }
            if (!material) {
                mostrarAlerta('Por favor, selecciona un material.', 'danger');
                return;
            }
            if (!proyecto) {
                mostrarAlerta('Por favor, describe tu proyecto.', 'danger');
                return;
            }
            if (!terminos) {
                mostrarAlerta('Por favor, acepta recibir información.', 'danger');
                return;
            }
            
            // Preparar mensaje para WhatsApp
            const mensajeWhatsApp = `*Nueva solicitud de cotización*\n\n` +
                `*Nombre:* ${nombre}\n` +
                `*Teléfono:* ${telefono}\n` +
                `*Ubicación:* ${ubicacion}\n` +
                `*Material de interés:* ${material}\n` +
                `*Descripción del proyecto:* ${proyecto}\n\n` +
                `Enviado desde: Techados Acosta`;
            
            // Preparar datos para email
            const datosEmail = {
                nombre,
                telefono,
                ubicacion,
                material,
                proyecto,
                fecha: new Date().toLocaleString('es-MX')
            };
            
            // Mostrar opciones de envío
            mostrarOpcionesEnvio(mensajeWhatsApp, datosEmail);
            
            // Limpiar el formulario
            this.reset();
        });
    }

    // Función para mostrar alertas
    function mostrarAlerta(mensaje, tipo) {
        // Crear elemento de alerta
        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
        alerta.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        // Añadir al body
        document.body.appendChild(alerta);
        // Eliminar automáticamente después de 5 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.remove();
            }
        }, 5000);
    }

    // Función para mostrar opciones de envío
    function mostrarOpcionesEnvio(mensajeWhatsApp, datosEmail) {
        // Crear modal de opciones
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">¿Cómo deseas enviar la cotización?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p>Tu solicitud está lista. Elige cómo enviarla:</p>
                        <div class="d-grid gap-2">
                            <button id="enviar-whatsapp" class="btn btn-success btn-lg">
                                <i class="bi bi-whatsapp me-2"></i>
                                Enviar por WhatsApp
                                <small class="d-block">+52 (81) 1587-6112</small>
                            </button>
                            <button id="enviar-email" class="btn btn-primary btn-lg">
                                <i class="bi bi-envelope me-2"></i>
                                Enviar por Email
                                <small class="d-block">techadosacosta@gmail.com</small>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Mostrar modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        
        // Event listeners para los botones
        document.getElementById('enviar-whatsapp').addEventListener('click', function() {
            enviarPorWhatsApp(mensajeWhatsApp);
            bootstrapModal.hide();
        });
        
        document.getElementById('enviar-email').addEventListener('click', function() {
            enviarPorEmail(datosEmail);
            bootstrapModal.hide();
        });
        
        // Limpiar modal al cerrar
        modal.addEventListener('hidden.bs.modal', function() {
            modal.remove();
        });
    }

    // Función para enviar por WhatsApp
    function enviarPorWhatsApp(mensaje) {
        const numeroWhatsApp = '528115876112'; // Número de prueba
        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
        
        // Abrir WhatsApp
        window.open(urlWhatsApp, '_blank');
        
        mostrarAlerta('Redirigiendo a WhatsApp...', 'success');
    }

    // Función para enviar por Email - Versión mejorada
    function enviarPorEmail(datos) {
        // Crear modal con opciones de email
        const modalEmail = document.createElement('div');
        modalEmail.className = 'modal fade';
        modalEmail.style.zIndex = '10000';
        modalEmail.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Enviar Cotización por Email</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <strong>Para:</strong> techadosacosta@gmail.com
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Opción 1: Copiar y pegar</label>
                            <textarea id="email-content" class="form-control" rows="12" readonly>Asunto: Nueva Solicitud de Cotización - Techados Acosta

Estimados Techados Acosta,

He enviado una nueva solicitud de cotización con los siguientes datos:

DATOS DEL CLIENTE:
• Nombre: ${datos.nombre}
• Teléfono: ${datos.telefono}
• Ubicación: ${datos.ubicacion}

PROYECTO:
• Material de interés: ${datos.material}
• Descripción del proyecto: ${datos.proyecto}

FECHA DE SOLICITUD: ${datos.fecha}

Por favor, contactarme lo antes posible para agendar la visita sin costo.

Saludos cordiales,
${datos.nombre}</textarea>
                            <button id="copiar-email" class="btn btn-success mt-2">
                                <i class="bi bi-clipboard me-2"></i>Copiar Texto
                            </button>
                        </div>
                        
                        <div class="text-center">
                            <p><strong>Opción 2: Abrir Gmail directamente</strong></p>
                            <button id="abrir-gmail" class="btn btn-danger">
                                <i class="bi bi-google me-2"></i>Abrir Gmail
                            </button>
                            
                            <p class="mt-3"><strong>Opción 3: Intentar cliente de email</strong></p>
                            <button id="abrir-mailto" class="btn btn-primary">
                                <i class="bi bi-envelope me-2"></i>Abrir Cliente Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalEmail);
        const bootstrapModalEmail = new bootstrap.Modal(modalEmail);
        bootstrapModalEmail.show();
        
        // Función copiar al portapapeles
        document.getElementById('copiar-email').addEventListener('click', function() {
            const textarea = document.getElementById('email-content');
            textarea.select();
            document.execCommand('copy');
            this.innerHTML = '<i class="bi bi-check2 me-2"></i>¡Copiado!';
            this.className = 'btn btn-success mt-2';
            
            // Mostrar instrucciones
            mostrarAlerta('Texto copiado. Ahora ve a tu email y pégalo en un nuevo mensaje a techadosacosta@gmail.com', 'success');
        });
        
        // Abrir Gmail
        document.getElementById('abrir-gmail').addEventListener('click', function() {
            const asunto = encodeURIComponent('Nueva Solicitud de Cotización - Techados Acosta');
            const cuerpo = encodeURIComponent(`Estimados Techados Acosta,

He enviado una nueva solicitud de cotización con los siguientes datos:

DATOS DEL CLIENTE:
• Nombre: ${datos.nombre}
• Teléfono: ${datos.telefono}  
• Ubicación: ${datos.ubicacion}

PROYECTO:
• Material de interés: ${datos.material}
• Descripción del proyecto: ${datos.proyecto}

FECHA DE SOLICITUD: ${datos.fecha}

Por favor, contactarme lo antes posible para agendar la visita sin costo.

Saludos cordiales,
${datos.nombre}`);
            
            const urlGmail = `https://mail.google.com/mail/?view=cm&fs=1&to=techadosacosta@gmail.com&su=${asunto}&body=${cuerpo}`;
            window.open(urlGmail, '_blank');
            bootstrapModalEmail.hide();
        });
        
        // Intentar mailto tradicional
        document.getElementById('abrir-mailto').addEventListener('click', function() {
            const emailDestino = 'techadosacosta@gmail.com';
            const asunto = encodeURIComponent('Nueva Solicitud de Cotización - Techados Acosta');
            const cuerpoEmail = encodeURIComponent(`Estimados Techados Acosta,

DATOS DEL CLIENTE:
• Nombre: ${datos.nombre}
• Teléfono: ${datos.telefono}
• Ubicación: ${datos.ubicacion}

PROYECTO:
• Material: ${datos.material}  
• Descripción: ${datos.proyecto}

FECHA: ${datos.fecha}

Por favor contactarme para agendar visita sin costo.

Saludos,
${datos.nombre}`);
            
            window.location.href = `mailto:${emailDestino}?subject=${asunto}&body=${cuerpoEmail}`;
            bootstrapModalEmail.hide();
        });
        
        // Limpiar modal
        modalEmail.addEventListener('hidden.bs.modal', function() {
            modalEmail.remove();
        });
    }

    // Efecto parallax ligero en el hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });

    // Contador animado para estadísticas (si decides agregarlo)
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Efecto hover mejorado para las tarjetas
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });

    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));

    // Añadir efectos de partículas al hero (opcional)
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 193, 7, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: float 3s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.appendChild(particle);
        }
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 3000);
    }

    // Crear partículas cada cierto tiempo
    setInterval(createParticle, 200);

    // CSS para la animación de partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            from {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            to {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('Techados Acosta - Sitio web cargado correctamente');
});