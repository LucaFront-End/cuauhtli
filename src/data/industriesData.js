// src/data/industriesData.js
// Comprehensive data for the 8 specialized industries / giros

export const INDUSTRIES = [
  {
    id: 'bancos',
    slug: 'bancos',
    name: 'Bancos & Sector Financiero',
    shortName: 'Bancos',
    iconName: 'Landmark',
    eyebrow: 'MÁXIMA SEGURIDAD FÍSICA Y LÓGICA · REGULACIÓN CNBV',
    tagline: 'Blindaje integral para sucursales, bóvedas, cajas y centros de cómputo.',
    description: 'Soluciones de grado bancario diseñadas bajo estrictos protocolos de la Comisión Nacional Bancaria y de Valores (CNBV). Detección de merodeo en cajeros automáticos, esclusas antibalas automatizadas, y central C4 antisecuestro con enlace redundante.',
    statMetric: '99.99%',
    statLabel: 'Disponibilidad operativa redundante',
    complianceBadge: 'Normativa CNBV & Burocratización Cero',
    heroImage: '/assets/industries/bancos.jpg',
    keySolutions: [
      {
        title: 'CCTV 4K con IA & Bóvedas',
        badge: 'Analítica Forense',
        desc: 'Cámaras antivandálicas IK10 con reconocimiento facial, conteo bidireccional y analítica de merodeo en cajeros y cajas de seguridad.',
        icon: 'Camera',
      },
      {
        title: 'Esclusas de Acceso & Biometría Dual',
        badge: 'Grado Antibalas',
        desc: 'Interbloqueo de puertas blindadas para acceso a bóveda y áreas restringidas con biometría dactilar y facial anti-suplantación.',
        icon: 'KeyRound',
      },
      {
        title: 'Alarmas Antisecuestro & Sensores Sísmicos',
        badge: 'Central C4 24/7',
        desc: 'Pulsadores silenciosos bajo mostrador, sensores de impacto sísmico en cajas fuertes y respuesta inmediata coordinada con C5.',
        icon: 'BellRing',
      },
      {
        title: 'Cableado Blindado Cat 6A / Fibra Cifrada',
        badge: 'Aislamiento VLAN',
        desc: 'Infraestructura de datos certificada, canalización en tubería conduit pared gruesa y gabinetes rack de acceso restringido.',
        icon: 'Network',
      },
    ],
    recommendedEquip: [
      'Domos antivandálicos IK10 4K con audio bidireccional',
      'Esclusas electrónicas de interbloqueo con chapas magnéticas de 1,200 lbs',
      'Sensores sísmicos y térmicos para bóvedas y ATMs',
      'Racks con cerradura biométrica y monitoreo de temperatura',
      'UPS de grado industrial con respaldo de energía de 4 horas',
      'Botones de asalto inalámbricos de doble acción anti-error'
    ],
    packages: [
      {
        name: 'Sucursal Bancaria Estándar',
        scope: 'Hasta 5 ventanillas, acceso principal y cajero exterior',
        points: '16 Cámaras 4K + 2 Esclusas + 8 Sensores sísmicos + Alarma C4',
        sla: 'SLA < 1 hr en sitio'
      },
      {
        name: 'Sede Regional / Bóveda Central',
        scope: 'Bóveda de valores, cajas de seguridad y centro de datos',
        points: '32 a 64 Cámaras IA + Biometría multi-esclusa + Fibra blindada',
        sla: 'SLA < 30 min prioritario'
      }
    ]
  },
  {
    id: 'escuelas',
    slug: 'escuelas',
    name: 'Escuelas, Colegios & Universidades',
    shortName: 'Escuelas',
    iconName: 'GraduationCap',
    eyebrow: 'PROTECCIÓN ESCOLAR INTEGRAL · PROTOCOLOS SEP & PROTECCIÓN CIVIL',
    tagline: 'Seguridad preventiva para alumnos, entrega segura y control de campus.',
    description: 'Ambientes escolares seguros sin perder la calidez educativa. Controlamos accesos peatonales y vehiculares en horas pico, agilizamos la entrega de alumnos con videoporteros y credencialización, y cubrimos pasillos, canchas y perímetros.',
    statMetric: '< 15 seg',
    statLabel: 'Tiempo de validación en entrega de alumnos',
    complianceBadge: 'Protocolos de Seguridad Escolar & Protección Civil',
    heroImage: '/assets/industries/escuelas.jpg',
    keySolutions: [
      {
        title: 'Videoporteros IP & Entrega Segura',
        badge: 'Control Parental',
        desc: 'Validación de tutores autorizados mediante pantalla digital en caseta, reduciendo filas vehiculares y evitando entregas erróneas.',
        icon: 'KeyRound',
      },
      {
        title: 'Cámaras ColorVu en Patios & Pasillos',
        badge: 'Cero Puntos Ciegos',
        desc: 'Visión nocturna a color y resolución ultra nítida en áreas deportivas, accesos perimetrales, escaleras y laboratorios.',
        icon: 'Camera',
      },
      {
        title: 'Perifoneo & Alerta Sísmica Centralizada',
        badge: 'Protección Civil',
        desc: 'Audio distribuido para simulacros, evacuaciones de emergencia ante sismo y avisos generales a salones y áreas abiertas.',
        icon: 'Radio',
      },
      {
        title: 'Red Wi-Fi Mesh de Alta Densidad',
        badge: 'Cobertura Concurrente',
        desc: 'Conectividad inalámbrica estable para cientos de laptops y tablets simultáneas en aulas, auditorios y bibliotecas sin caídas.',
        icon: 'Network',
      },
    ],
    recommendedEquip: [
      'Videoporteros multiapartamentales y consolas para caseta',
      'Cámaras tipo bala con disuasión activa por luz y sirena',
      'Torniquetes trípode con lectores de credencial escolar RFID',
      'Altavoces IP resistentes a intemperie para voceo y alerta sísmica',
      'Access Points Wi-Fi 6 de alta concurrencia (150+ alumnos por AP)',
      'Reloj checador de huella/rostro para docentes conforme a STPS'
    ],
    packages: [
      {
        name: 'Colegio Nivel Básico (K-12)',
        scope: '1 a 2 accesos, patio cívico y salones',
        points: '16 a 24 Cámaras + Videoportero + Voceo de emergencia + Wi-Fi',
        sla: 'SLA < 2 hrs'
      },
      {
        name: 'Campus Universitario / Preparatoria',
        scope: 'Múltiples edificios, estacionamiento y áreas verdes',
        points: '48+ Cámaras + Torniquetes vehiculares/peatonales + Red Mesh',
        sla: 'SLA < 1.5 hrs'
      }
    ]
  },
  {
    id: 'almacenes',
    slug: 'almacenes',
    name: 'Almacenes, CEDIS & Logística',
    shortName: 'Almacenes',
    iconName: 'Warehouse',
    eyebrow: 'BLINDAJE LOGÍSTICO · CERTIFICACIONES CTPAT Y OEA',
    tagline: 'Trazabilidad de carga, control de andenes y seguridad perimetral.',
    description: 'Diseñado para centros de distribución y naves industriales con alto tráfico de tractocamiones. Erradicamos robo hormiga, protegemos patios de maniobras con cercas de alto voltaje y monitoreamos entradas y salidas con lectura automática de placas (LPR).',
    statMetric: '99.8%',
    statLabel: 'Tasa de lectura en placas LPR a 30 km/h',
    complianceBadge: 'Alineado a Estándares CTPAT & Cadena de Suministro',
    heroImage: '/assets/industries/almacenes.jpg',
    keySolutions: [
      {
        title: 'Cercas Electrificadas de Alto Voltaje',
        badge: 'Disuasión Activa',
        desc: 'Descargas no letales reguladas, sensores de flexión de poste y monitoreo continuo contra corte o aterrizamiento de hilo.',
        icon: 'ShieldAlert',
      },
      {
        title: 'LPR & Barreras Vehiculares Rápidas',
        badge: 'Automatización de Patios',
        desc: 'Lectura de matrículas de trailers y camionetas, apertura automática de pluma y registro digital con fotografía de chofer.',
        icon: 'Navigation',
      },
      {
        title: 'Domos PTZ 32x & Cámaras Térmicas',
        badge: 'Patios de Maniobras',
        desc: 'Seguimiento automático de intrusos a más de 300 metros incluso en oscuridad total, niebla o lluvia intensa.',
        icon: 'Camera',
      },
      {
        title: 'GPS & Telemetría para Flotas',
        badge: 'Control de Combustible',
        desc: 'Rastreo satelital para camiones y montacargas con sensor de apertura de puertas, botón de pánico y paro de motor remoto.',
        icon: 'Navigation',
      },
    ],
    recommendedEquip: [
      'Cámaras térmicas bispectrales para perímetro exterior',
      'Domos PTZ con zoom óptico 32x y seguimiento inteligente',
      'Barreras vehiculares de uso rudo (ciclo continuo de 1.5 segundos)',
      'Energizadores de cerco eléctrico con enlace TCP/IP al C4',
      'Red Wi-Fi industrial para lectores de código de barras (handhelds)',
      'Gabinete para servidor NVR con almacenamiento RAID de 90 días'
    ],
    packages: [
      {
        name: 'CEDIS Mediano (2,000 a 5,000 m²)',
        scope: 'Andenes de carga, almacén de rack y patio frontal',
        points: '24 Cámaras + LPR en acceso + Cerca 200m + Wi-Fi WMS',
        sla: 'SLA < 2 hrs'
      },
      {
        name: 'Parque Logístico Mega-Hub (+15,000 m²)',
        scope: 'Perímetro completo, múltiples esclusas y báscula',
        points: '64+ Cámaras PTZ + Térmicas + Cerca 800m + GPS Flotillas',
        sla: 'SLA < 1 hr en sitio'
      }
    ]
  },
  {
    id: 'oficinas',
    slug: 'oficinas',
    name: 'Oficinas & Edificios Corporativos',
    shortName: 'Oficinas',
    iconName: 'Building2',
    eyebrow: 'ELEGANCIA ARQUITECTÓNICA & CUMPLIMIENTO STPS',
    tagline: 'Acceso ágil sin contacto, gestión de visitas y estética impecable.',
    description: 'Soluciones que se integran con la arquitectura corporativa sin cables visibles. Control de acceso facial de alta velocidad para colaboradores, kioscos de autoservicio para visitas, reloj checador para la Reforma de 40 Horas y cableado certificado.',
    statMetric: '< 0.2s',
    statLabel: 'Tiempo de paso en torniquete facial',
    complianceBadge: 'Cumplimiento STPS NOM-035/037 & Reforma Laboral',
    heroImage: '/assets/industries/oficinas.jpg',
    keySolutions: [
      {
        title: 'Torniquetes Ópticos & Biometría Facial',
        badge: 'Cero Fricción',
        desc: 'Alas de cristal templado motorizadas con reconocimiento facial rápido sin cubrebocas y lectura de código QR dinámico.',
        icon: 'KeyRound',
      },
      {
        title: 'Kioscos Digitales de Visitas',
        badge: 'Recepción Inteligente',
        desc: 'Registro express con captura de identificación oficial, aviso automático por WhatsApp al anfitrión y código QR de paso.',
        icon: 'Monitor',
      },
      {
        title: 'Reloj Checador STPS 40 Horas',
        badge: 'Auditable STPS',
        desc: 'Control de asistencia biométrico con reportes inalterables de horas laboradas, retardos y horas extra para evitar multas.',
        icon: 'Clock',
      },
      {
        title: 'Cableado Estructurado Cat 6A / Racks',
        badge: 'Certificación Fluke',
        desc: 'Organización impecable en site de datos, etiquetado normativo y certificación punto a punto para telefonía IP y servidores.',
        icon: 'Network',
      },
    ],
    recommendedEquip: [
      'Torniquetes ópticos de acero inoxidable y cristal batiente',
      'Terminales de reconocimiento facial con sensor de calor vivo',
      'Pantallas LED corporativas para lobby y señalización digital',
      'Cámaras mini-domo 4K discretas de color blanco o negro',
      'Racks cerrados con PDU inteligente y monitoreo térmico',
      'Sistema de videovigilancia en elevadores con enlaces inalámbricos'
    ],
    packages: [
      {
        name: 'Piso de Oficinas Corporativo',
        scope: 'Recepción, salas de juntas y área operativa',
        points: '2 Accesos faciales + 12 Cámaras + Cableado 48 nodos Cat 6A',
        sla: 'SLA < 2 hrs'
      },
      {
        name: 'Torre Corporativa Completa',
        scope: 'Lobby principal, estacionamiento subterráneo y 10+ niveles',
        points: 'Batería de 6 torniquetes + Kioscos + 60+ Cámaras + Site Tier II',
        sla: 'SLA < 1 hr en sitio'
      }
    ]
  },
  {
    id: 'hospitales',
    slug: 'hospitales',
    name: 'Hospitales, Clínicas & Laboratorios',
    shortName: 'Hospitales',
    iconName: 'Stethoscope',
    eyebrow: 'BIOSEGURIDAD & PROTECCIÓN EN ÁREAS CRÍTICAS',
    tagline: 'Monitoreo higiénico de quirófanos, farmacias y urgencias.',
    description: 'Sistemas con estrictos criterios sanitarios: controles de acceso con sensores sin tacto y biometría para personal médico, videovigilancia continua en farmacias de narcóticos controlados, y alerta de emergencia para código azul y evacuación.',
    statMetric: '100%',
    statLabel: 'Apertura automática ante alarma de incendio',
    complianceBadge: 'Estándares COFEPRIS & Normas Hospitalarias',
    heroImage: '/assets/industries/hospitales.jpg',
    keySolutions: [
      {
        title: 'Accesos Sin Contacto & Quirófanos',
        badge: 'Máxima Higiene',
        desc: 'Sensores de proximidad infrarrojos tipo onda en mano y reconocimiento facial que evitan contaminación cruzada en áreas estériles.',
        icon: 'KeyRound',
      },
      {
        title: 'CCTV en Farmacia & Narcóticos',
        badge: 'Custodia Estricta',
        desc: 'Cámaras 4K sobre anaqueles de medicamentos controlados con almacenamiento prolongado para auditorías de COFEPRIS.',
        icon: 'Camera',
      },
      {
        title: 'Voceo & Código Azul / Evacuación',
        badge: 'Respuesta Médica',
        desc: 'Zonificación de audio independiente para piso de hospitalización, terapia intensiva, urgencias y áreas de consulta externa.',
        icon: 'Radio',
      },
      {
        title: 'Red Segura de Telemedicina',
        badge: 'Cifrado Hospitalario',
        desc: 'Infraestructura de cableado categoría 6A dedicada para transferencia de estudios de resonancia, rayos X y expediente clínico.',
        icon: 'Network',
      },
    ],
    recommendedEquip: [
      'Pulsadores sin tacto de acero quirúrgico inoxidable',
      'Cerraduras electromagnéticas interconectadas a la alarma contra incendios',
      'Cámaras domo antivandálicas con recubrimiento antibacteriano',
      'Consolas de voceo multizona para central de enfermería',
      'Sensores de humo fotoeléctricos con notificación inmediata a C4',
      'Sistemas de respaldo de energía ininterrumpida (UPS médico)'
    ],
    packages: [
      {
        name: 'Clínica Especializada / Laboratorio',
        scope: 'Recepción, toma de muestras, farmacia y consultorios',
        points: '16 Cámaras + 4 Accesos higiénicos + Alarma contra incendio',
        sla: 'SLA < 1.5 hrs'
      },
      {
        name: 'Complejo Hospitalario',
        scope: 'Urgencias, quirófanos, terapia intensiva y pisos de cuartos',
        points: '48+ Cámaras + Esclusas de aislamiento + Voceo Código Azul',
        sla: 'SLA < 45 min de emergencia'
      }
    ]
  },
  {
    id: 'residencias',
    slug: 'residencias',
    name: 'Residencias & Fraccionamientos',
    shortName: 'Residencias',
    iconName: 'Home',
    eyebrow: 'TRANQUILIDAD FAMILIAR · GESTIÓN VECINAL DESDE EL CELULAR',
    tagline: 'Casería inteligente, acceso con tag RFID y cerca electrificada.',
    description: 'La solución definitiva para privadas y condominios que buscan erradicar intrusiones y agilizar la entrada de colonos y paquetería. Videoporteros IP que timbran directo en la app de cada vecino y cerco perimetral monitoreado 24/7.',
    statMetric: '0',
    statLabel: 'Filas en caseta con Tag RFID vehicular',
    complianceBadge: 'Privacidad de Datos LFPDPPP & Protocolo Vecinal',
    heroImage: '/assets/industries/residencias.jpg',
    keySolutions: [
      {
        title: 'Videoportero IP Multiapartamental',
        badge: 'App Vecinal Móvil',
        desc: 'Los residentes reciben videollamada en su smartphone cuando llega una visita o repartidor, abriendo puertas desde cualquier lugar.',
        icon: 'KeyRound',
      },
      {
        title: 'Control Vehicular con Tag RFID',
        badge: 'Paso Fluido',
        desc: 'Antena de largo alcance que detecta el tag adherido al parabrisas a 6 metros, abriendo la pluma sin bajar el cristal.',
        icon: 'Navigation',
      },
      {
        title: 'Cerca Electrificada con Monitoreo',
        badge: 'Muro Perimetral',
        desc: 'Cerco disuasivo de 6 a 8 hilos de alto voltaje sobre muros o rejas con sirena estroboscópica y reporte automático en caseta.',
        icon: 'ShieldAlert',
      },
      {
        title: 'CCTV ColorVu en Calles & Parque',
        badge: 'Visión Nocturna 24/7',
        desc: 'Grabación a todo color incluso en la noche en áreas comunes, juegos infantiles, caseta de vigilancia y bardas traseras.',
        icon: 'Camera',
      },
    ],
    recommendedEquip: [
      'Placas de calle para videoportero IP con teclado y pantalla LCD',
      'Barreras vehiculares con brazo articulado o recto y sensor de fotocelda',
      'Antenas lectoras RFID de frecuencia UHF para tags en parabrisas',
      'Energizadores de cerco eléctrico con batería de respaldo de 48 horas',
      'Cámaras ColorVu 4K con tecnología AcuSense de detección humana/vehículo',
      'Monitor de vigilancia multi-cámara para escritorio de guardia en caseta'
    ],
    packages: [
      {
        name: 'Privada / Cerrada Residencial (20 a 50 casas)',
        scope: 'Caseta única, pluma vehicular y perímetro',
        points: 'Videoportero IP + 1 Barrera con Tag + Cerca 150m + 8 Cámaras',
        sla: 'SLA < 2 hrs'
      },
      {
        name: 'Macro-Condominio / Fraccionamiento (+150 casas)',
        scope: 'Doble carril (visitas/residentes), casa club y 2 accesos',
        points: '2 Baterías de plumas + LPR + Cerca 500m + 24 Cámaras + NVR C4',
        sla: 'SLA < 1.5 hrs'
      }
    ]
  },
  {
    id: 'constructoras',
    slug: 'constructoras',
    name: 'Constructoras & Desarrollos en Obra',
    shortName: 'Constructoras',
    iconName: 'HardHat',
    eyebrow: 'SEGURIDAD PROVISIONAL EN OBRA NEGRA & CONTROL DE CUADRILLAS',
    tagline: 'Vigilancia autónoma 4G, resguardo de maquinaria y torniquetes móviles.',
    description: 'Blindamos predios en edificación antes de contar con luz definitiva o internet fijo. Torres solares con cámaras térmicas para evitar robo de varilla y cable de cobre, torniquetes portátiles para pase de lista STPS y bitácora fotográfica de avance.',
    statMetric: '100%',
    statLabel: 'Autónomo con energía solar y 4G LTE',
    complianceBadge: 'Seguridad e Higiene STPS en Obra & Seguro de Construcción',
    heroImage: '/assets/industries/constructoras.jpg',
    keySolutions: [
      {
        title: 'Torres Solares de Vigilancia 4G',
        badge: 'Cero Cables Requeridos',
        desc: 'Mástil móvil telescópico con panel solar, batería de ciclo profundo y cámaras 360° conectadas a la red celular 4G.',
        icon: 'Camera',
      },
      {
        title: 'Control de Acceso en Contenedor',
        badge: 'Credencialización STPS',
        desc: 'Torniquetes trípode montados en caseta móvil para validar Seguro Social (IMSS) de cada albañil y contratista al entrar.',
        icon: 'KeyRound',
      },
      {
        title: 'Detección Térmica en Patios de Acero',
        badge: 'Cero Robo Nocturno',
        desc: 'Sensores térmicos que disparan reflector LED y sirena al detectar presencia humana en el almacén de varilla, cobre o maquinaria.',
        icon: 'ShieldAlert',
      },
      {
        title: 'Cámaras Time-Lapse de Avance',
        badge: 'Bitácora para Inversionistas',
        desc: 'Registro fotográfico en ultra alta definición programado cada 10 minutos para generar video time-lapse del progreso constructivo.',
        icon: 'Monitor',
      },
    ],
    recommendedEquip: [
      'Remolques y mástiles de vigilancia solar autónoma 4G',
      'Cámaras térmicas con analítica perimetral de intrusión',
      'Torniquetes portátiles en estructura reforzada con lector biométrico',
      'Alarmas inalámbricas de largo alcance con botón de pánico de obra',
      'Proyectores LED de 200W con activación automática por sensor PIR',
      'Enlaces inalámbricos punto a punto para conectar camper de supervisión'
    ],
    packages: [
      {
        name: 'Obra en Proceso / Edificación Media',
        scope: 'Perímetro provisional, acceso de cuadrillas y bodega de insumos',
        points: '1 Torre Solar 4G + Torniquete STPS + 4 Cámaras fijas',
        sla: 'SLA < 2 hrs'
      },
      {
        name: 'Desarrollo Inmobiliario / Nave Industrial',
        scope: 'Predio de más de 10,000 m² con maquinaria pesada',
        points: '2 a 3 Torres Solares + Detección térmica + Múltiples torniquetes',
        sla: 'SLA < 1.5 hrs'
      }
    ]
  },
  {
    id: 'plazas-comerciales',
    slug: 'plazas-comerciales',
    name: 'Plazas Comerciales & Centros Retail',
    shortName: 'Plazas Comerciales',
    iconName: 'ShoppingBag',
    eyebrow: 'AFORO INTELIGENTE, PANTALLAS PUBLICITARIAS & PREVENCIÓN',
    tagline: 'Conteo de afluencia, estacionamiento automatizado y marketing visual.',
    description: 'Solución integral para malls, plazas comerciales y strip centers. Optimizamos la rentabilidad mediante mapas de calor y conteo de visitantes, controlamos estacionamientos con cobro automatizado y ofrecemos pantallas LED gigantes de alto brillo.',
    statMetric: '+300%',
    statLabel: 'Impacto visual con pantallas LED publicitarias',
    complianceBadge: 'Coordinación con C5 / Seguridad Pública & Protección Civil',
    heroImage: '/assets/industries/plazas.jpg',
    keySolutions: [
      {
        title: 'Conteo de Personas & Mapas de Calor',
        badge: 'Business Intelligence',
        desc: 'Métricas precisas de tráfico peatonal por pasillo y tienda ancla para justificar rentas comerciales y medir horas pico.',
        icon: 'Camera',
      },
      {
        title: 'Estacionamiento Automatizado con Cobro',
        badge: 'Cero Fugas de Ingreso',
        desc: 'Emisores de boletos con código QR, lectura de placas (LPR), cajeros automáticos de pago y plumas de alta velocidad.',
        icon: 'Navigation',
      },
      {
        title: 'Pantallas LED Publicitarias Gigantes',
        badge: 'Outdoor / Indoor',
        desc: 'Módulos LED de alto brillo visibles bajo luz solar directa para pauta publicitaria comercial y anuncios de la plaza.',
        icon: 'Monitor',
      },
      {
        title: 'Audio Ambiental & Voceo de Evacuación',
        badge: 'Experiencia & Seguridad',
        desc: 'Música ambiental de alta fidelidad distribuida por zonas y corte automático para perifoneo de emergencias o niños extraviados.',
        icon: 'Radio',
      },
    ],
    recommendedEquip: [
      'Cámaras con lente ojo de pez 360° para plazas centrales y pasillos',
      'Cámaras estereoscópicas de doble lente para conteo de personas (98% precisión)',
      'Pantallas LED P3.9 outdoor con protección contra lluvia IP65',
      'Barreras vehiculares con cajeros de cobro en efectivo y tarjeta',
      'Sistemas de altavoces de plafón e interperie para audio distribuido',
      'Centro de monitoreo C4 in-situ con videowall para personal de seguridad'
    ],
    packages: [
      {
        name: 'Plaza Express / Strip Mall (10 a 30 locales)',
        scope: 'Pasillo comercial, estacionamiento abierto y fachada',
        points: '16 Cámaras 360° + LPR en pluma + Audio ambiental',
        sla: 'SLA < 2 hrs'
      },
      {
        name: 'Centro Comercial / Mall Regional (+60 locales)',
        scope: 'Múltiples pisos, estacionamiento subterráneo y plazoleta',
        points: '64+ Cámaras con analítica + Pantalla LED gigante + Cajeros cobro',
        sla: 'SLA < 1 hr prioritario'
      }
    ]
  }
];
