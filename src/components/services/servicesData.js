// Centralized Technical & Commercial Data for Sistemas Cuauhtli Individual Services
// Tailored to the official offerings on https://www.cuauhtli.mx/

export const SERVICES_DATA = {
  'cctv': {
    id: 'cctv',
    slug: 'cctv',
    name: 'CCTV & Videovigilancia con IA',
    badge: 'SISTEMA 01 · VIDEOVIGILANCIA C4',
    shortTitle: 'Circuito Cerrado & Térmicas',
    tagline: 'Detección perimetral autónoma de humanos y vehículos 4K. Cobertura sin puntos ciegos y enlace directo al C4 24/7.',
    heroDescription: 'Diseñamos e instalamos circuitos cerrados de televisión de grado industrial y corporativo. Combinamos analítica de borde (Edge AI) para clasificación en tiempo real, cámaras térmicas para detección en total oscuridad y almacenamiento redundante local y en la nube.',
    stats: [
      { label: 'Resolución Óptica', value: '4K Ultra HD', sub: 'Sensores Sony Starvis' },
      { label: 'Falsas Alarmas', value: '< 1%', sub: 'Filtrado IA humano/vehículo' },
      { label: 'Tiempo de Alerta', value: '< 0.3s', sub: 'Notificación push al C4' },
      { label: 'Garantía en Mano de Obra', value: 'Vitalicia', sub: 'Póliza exclusiva Cuauhtli' },
    ],
    features: [
      {
        title: 'Analítica Perimetral con Deep Learning',
        desc: 'Algoritmos entrenados para discriminar entre personas, vehículos, lluvia, fauna y sombras, eliminando el 99% de las falsas alarmas que saturan a los guardias.',
        icon: 'Eye'
      },
      {
        title: 'Cámaras Térmicas & Visión Nocturna 300m',
        desc: 'Detección de calor corporal a través de humo, niebla y oscuridad absoluta, ideal para bardas perimetrales extensas y patios de maniobras.',
        icon: 'Flame'
      },
      {
        title: 'Grabación Redundante & Cifrado TLS 1.3',
        desc: 'NVRs de misión crítica con arreglo RAID y almacenamiento secundario en la nube blindado contra sabotaje, robo físico o corte de energía.',
        icon: 'HardDrive'
      },
      {
        title: 'Disuasión Activa con Voceo y Estrobos',
        desc: 'Cámaras equipadas con luz estroboscópica roja/azul y altavoz de 110dB que advierte al intruso de forma autónoma antes de que vulnere el inmueble.',
        icon: 'Speaker'
      }
    ],
    architecture: [
      {
        step: '01',
        title: 'Estudio de Puntos Ciegos & Luxometría',
        desc: 'Ingenieros certificados realizan levantamiento tridimensional en sitio, analizando ángulos de visión, sombras e iluminación requerida.'
      },
      {
        step: '02',
        title: 'Cableado Estructurado Blindado (FTP Cat6)',
        desc: 'Tendido con tubería conduit galvanizada pared gruesa y protección contra descargas atmosféricas mediante supresores de picos.'
      },
      {
        step: '03',
        title: 'Montaje de Óptica Motorizada & NVR Central',
        desc: 'Fijación de domos y bullets con protección anti-vandálica IK10 y hermeticidad IP67 certificada.'
      },
      {
        step: '04',
        title: 'Calibración de Reglas de IA & Enlace C4',
        desc: 'Definición de líneas de cruce virtual, zonas de intrusión estricta y sincronización directa con la Central de Monitoreo Cuauhtli.'
      }
    ],
    techSpecs: [
      { param: 'Resolución de Sensor', spec: '8 Megapíxeles (3840 x 2160) @ 30 FPS' },
      { param: 'Lente & Zoom', spec: 'Varifocal motorizado 2.8mm a 12mm con Autofocus inteligente' },
      { param: 'Rango Infrarrojo (Smart IR)', spec: 'Hasta 80 metros en cámaras estándar / 300m en domos PTZ' },
      { param: 'Compresión de Video', spec: 'H.265+ / H.264+ con ahorro de 70% de ancho de banda y disco' },
      { param: 'Grado de Protección Ambiental', spec: 'IP67 (a prueba de agua/polvo) y resistencia al impacto IK10' },
      { param: 'Certificaciones Oficiales', spec: 'NOM-001-SCFI, UL, CE, FCC, cumplimiento de estándar NDAA' },
      { param: 'Marcas Homologadas', spec: 'Hikvision AcuSense, Dahua WizSense, Hanwha Vision, Axis Communications' }
    ],
    useCases: [
      {
        sector: 'Naves Industriales & CEDIS',
        challenge: 'Pérdida hormiga en andenes de carga y puntos ciegos entre racks de 12 metros de altura.',
        solution: 'Cámaras panorámicas 180° en andenes sincronizadas con analítica de placas LPR y lectura de sellos de remolques.'
      },
      {
        sector: 'Corporativos & Oficinas',
        challenge: 'Monitoreo discreto de accesos, elevadores y control de activos sensibles sin invadir la privacidad de los colaboradores.',
        solution: 'Domos empotrables ultracompactos 4K con micrófono bidireccional y máscara de privacidad programable.'
      },
      {
        sector: 'Parques Industriales',
        challenge: 'Perímetros de más de 3 kilómetros expuestos a intrusión nocturna en terrenos baldíos aledaños.',
        solution: 'Cámaras térmicas bi-espectrales con cruce de línea virtual que alertan a la patrulla en sitio en menos de 45 segundos.'
      },
      {
        sector: 'Comercio & Retail',
        challenge: 'Robo en piso de venta, disputas en cajas registradoras y necesidad de mapeo de calor de clientes.',
        solution: 'Cámaras fisheye 360° con analítica de mapas de calor, conteo de personas y zoom óptico dedicado sobre cada terminal POS.'
      }
    ],
    faq: [
      {
        q: '¿Qué sucede con la grabación si se corta la energía eléctrica o el internet?',
        a: 'Todos nuestros sistemas integran respaldo por UPS de grado industrial con autonomía de hasta 4 horas. Además, las cámaras cuentan con ranura microSD para grabación local redundante (Edge Storage) que se sincroniza automáticamente con el NVR en cuanto se restablece la red.'
      },
      {
        q: '¿Puedo ver las cámaras en tiempo real desde mi celular o laptop fuera de México?',
        a: 'Sí. Proveemos acceso mediante aplicaciones móviles y clientes de escritorio cifrados P2P (iOS, Android, Windows y macOS), sin necesidad de IP fija pública ni aperturas inseguras de puertos en tu módem.'
      },
      {
        q: '¿En qué consiste la Garantía Vitalicia de Sistemas Cuauhtli?',
        a: 'Garantizamos de por vida la calidad de nuestro tendido de cableado, conexionado, ponchado y canalización. Si un conector o línea instalada por nuestro equipo presenta fallo por vicios ocultos, la reparación no tiene costo alguno.'
      },
      {
        q: '¿El sistema se puede enlazar a las autoridades o al C5 de la Ciudad de México?',
        a: 'Sí, contamos con protocolos de interoperabilidad compatibles con los esquemas de videovigilancia colaborativa de la SSC y C5, además de enlace prioritario a nuestra Central de Monitoreo C4 Cuauhtli.'
      }
    ]
  },

  'control-acceso': {
    id: 'control-acceso',
    slug: 'control-acceso',
    name: 'Control de Acceso Biométrico & Torniquetes',
    badge: 'SISTEMA 02 · ACCESO INTELIGENTE',
    shortTitle: 'Acceso Facial & Torniquetes',
    tagline: 'Gestión perimetral de flujo masivo con autenticación en menos de 0.2 segundos. Esclusas, torniquetes y lectores RFID.',
    heroDescription: 'Controla el flujo de empleados, contratistas y visitantes sin demoras ni filas. Implementamos terminales de reconocimiento facial 3D anti-suplantación, torniquetes de cristal motorizados, barreras vehiculares de alta velocidad y esclusas de seguridad bancaria.',
    stats: [
      { label: 'Velocidad de Lectura', value: '< 0.2 seg', sub: 'Reconocimiento facial con IA' },
      { label: 'Capacidad Local', value: '50,000+', sub: 'Usuarios y eventos offline' },
      { label: 'Protección Anti-Fraude', value: '100% Liveness', sub: 'Detección de foto/video falso' },
      { label: 'Flujo Peatonal', value: '35 pers/min', sub: 'Por torniquete motorizado' },
    ],
    features: [
      {
        title: 'Reconocimiento Facial con Liveness Detection',
        desc: 'Cámara dual estéreo e infrarroja que verifica la profundidad del rostro en milisegundos, impidiendo el paso con fotografías, videos o máscaras.',
        icon: 'UserCheck'
      },
      {
        title: 'Torniquetes Flap Barrier & Speed Gates',
        desc: 'Chasis de acero inoxidable AISI 304 con alas de cristal templado, sensores anti-atrapamiento y modo de evacuación de emergencia automática.',
        icon: 'ShieldCheck'
      },
      {
        title: 'Control Vehicular TAG UHF & LPR',
        desc: 'Antenas de radiofrecuencia a 900MHz y cámaras lectoras de placas que abren la pluma vehicular a 6 metros sin que el conductor deba detenerse.',
        icon: 'Car'
      },
      {
        title: 'Software de Asistencia & Gestión de Visitas',
        desc: 'Plataforma web para emisión de códigos QR temporales para visitas, sincronización con nómina y reportes de aforo en tiempo real.',
        icon: 'FileSpreadsheet'
      }
    ],
    architecture: [
      {
        step: '01',
        title: 'Auditoría de Flujo & Aforo Máximo',
        desc: 'Calculamos el número exacto de carriles peatonales y vehiculares necesarios para evitar cuellos de botella en horarios pico.'
      },
      {
        step: '02',
        title: 'Instalación de Pasos Físicos & Cerramientos',
        desc: 'Fijación con anclaje químico antisísmico en piso, canalización subterránea y nivelación milimétrica de torniquetes.'
      },
      {
        step: '03',
        title: 'Integración de Controladoras & Electroimanes',
        desc: 'Cableado con protocolo seguro OSDP v2.2 anti-intercepción de datos y fuentes de poder respaldadas por batería de gel.'
      },
      {
        step: '04',
        title: 'Carga de Padrón & Capacitación de RH',
        desc: 'Enrolamiento masivo de colaboradores, configuración de horarios restringidos por perfil y capacitación a personal de seguridad.'
      }
    ],
    techSpecs: [
      { param: 'Tiempo de Identificación', spec: 'Menor a 0.2 segundos por usuario' },
      { param: 'Distancia de Reconocimiento', spec: 'De 0.3 a 2.5 metros de distancia' },
      { param: 'Tecnologías RFID Soportadas', spec: 'Mifare 13.56 MHz, EM-Marine 125 kHz, HID iClass, UHF 902-928 MHz' },
      { param: 'Material de Chasis', spec: 'Acero inoxidable SUS304 de 1.5mm y cristal templado de 10mm' },
      { param: 'Ciclos de Apertura (MTBF)', spec: 'Más de 3,000,000 de ciclos continuos sin mantenimiento' },
      { param: 'Protocolos de Comunicación', spec: 'TCP/IP, RS-485, Wiegand 26/34/66, OSDP v2 con cifrado AES-128' },
      { param: 'Marcas Homologadas', spec: 'ZKTeco Green Label, Suprema, HID Global, Came, dormakaba' }
    ],
    useCases: [
      {
        sector: 'Edificios Corporativos Triple A',
        challenge: 'Acceso desordenado de más de 1,500 inquilinos y repartidores en lobby principal durante la mañana.',
        solution: 'Batería de Speed Gates de cristal con reconocimiento facial sin contacto y torniquete adaptado para sillas de ruedas.'
      },
      {
        sector: 'Plantas Manufactureras & Maquiladoras',
        challenge: 'Pase de tarjeta de un empleado por otro (chequeo fantasma) y retrasos en el cambio de turno de 400 personas.',
        solution: 'Torniquetes de cuerpo completo con biometría facial dual liveness que garantizan el 100% de asistencia real verificada.'
      },
      {
        sector: 'Centros de Distribución & CEDIS',
        challenge: 'Filas de tráileres esperando registro manual en caseta con riesgo de asalto en vía pública.',
        solution: 'Barreras de alto tráfico con lectores TAG UHF a parabrisas y validación automática de chofer con lector biométrico en poste.'
      },
      {
        sector: 'Clubes Deportivos & Condominios',
        challenge: 'Acceso no autorizado de invitados y falta de control de mensualidades y amenidades.',
        solution: 'Envío de pases temporales por WhatsApp mediante código QR dinámico que expira tras un solo uso o tiempo límite.'
      }
    ],
    faq: [
      {
        q: '¿Qué pasa en caso de sismo o incendio con los torniquetes y puertas?',
        a: 'Nuestras controladoras están enlazadas a la alarma contra incendio y cuentan con botón de emergencia tipo hongo. Al activarse, los torniquetes bajan los brazos o abren las alas de par en par automáticamente (Fail-Safe), liberando la ruta de evacuación.'
      },
      {
        q: '¿El reconocimiento facial funciona con poca luz o si la persona usa lentes/cubrebocas?',
        a: 'Sí. Los terminales cuentan con iluminación infrarroja adaptativa y algoritmos avanzados de visión artificial que detectan ojos y estructura ósea aun en penumbra o con accesorios cotidianos.'
      },
      {
        q: '¿Se puede enlazar con nuestro sistema de nómina (ej. NOI, SAP, Meta4)?',
        a: 'Completamente. Desarrollamos o configuramos exportaciones automatizadas en bases de datos SQL o archivos de intercambio para alimentar tu software de nómina sin captura manual.'
      },
      {
        q: '¿Cuántos usuarios simultáneos soporta el sistema?',
        a: 'Desde instalaciones sencillas de 50 usuarios hasta campus universitarios o parques industriales con más de 50,000 colaboradores enrolados en un solo servidor centralizado.'
      }
    ]
  },

  'alarmas': {
    id: 'alarmas',
    slug: 'alarmas',
    name: 'Alarmas & Monitoreo Central C4 24/7',
    badge: 'SISTEMA 03 · DETECCIÓN ACTIVA',
    shortTitle: 'Alarmas & Central C4',
    tagline: 'Detección temprana de intrusión, ruptura y conato de incendio con despacho de patrulla y protocolo C4 garantizado.',
    heroDescription: 'Protegemos tu inmueble mediante sensores inteligentes de grado militar y enlace continuo con nuestra Central de Monitoreo C4 24/7. Detectamos aperturas no autorizadas, cortes de línea, conatos de incendio o intrusión antes de que los sospechosos ingresen.',
    stats: [
      { label: 'Tiempo de Reacción C4', value: '< 15 seg', sub: 'Verificación de señal' },
      { label: 'Canales de Comunicación', value: 'Doble Vía', sub: 'Fibra Óptica + 4G/5G Celular' },
      { label: 'Zonificación Independiente', value: 'Hasta 128 Zonas', sub: 'Particiones por bodega/área' },
      { label: 'Póliza SLA de Arribo', value: 'Garantizada', sub: 'Patrullas de reacción en sitio' },
    ],
    features: [
      {
        title: 'Sensores de Doble Tecnología Microondas + PIR',
        desc: 'Inmunidad total a mascotas, corrientes de aire y roedores; se activan únicamente cuando coinciden la masa térmica y el desplazamiento físico.',
        icon: 'Activity'
      },
      {
        title: 'Contactos Magnéticos para Cortinas Metálicas',
        desc: 'Sensores blindados de aluminio fundido capaces de resistir el paso de montacargas y vibraciones de viento sin generar falsos positivos.',
        icon: 'Lock'
      },
      {
        title: 'Detección de Ruptura de Cristal Acústica',
        desc: 'Micrófono piezoeléctrico calibrado para reconocer la frecuencia sonora exacta del cristal al quebrarse antes de que el intruso ponga un pie adentro.',
        icon: 'Zap'
      },
      {
        title: 'Botones de Pánico Físicos e Inalámbricos',
        desc: 'Activación silenciosa en cajas de cobro, garitas y recámaras que despacha alerta de asalto en código rojo directo al C4 sin alertar al agresor.',
        icon: 'AlertOctagon'
      }
    ],
    architecture: [
      {
        step: '01',
        title: 'Zonificación Perimétrica e Interior',
        desc: 'Diseñamos particiones independientes para que puedas armar el exterior mientras tus colaboradores operan dentro del almacén.'
      },
      {
        step: '02',
        title: 'Cableado Grado Incendio & Antisabotaje',
        desc: 'Conductores apantallados con resistencia de fin de línea (EOL) que detecta si un cable es cortado o puenteado maliciosamente.'
      },
      {
        step: '03',
        title: 'Instalación de Sirenas Bitonales & Estrobos',
        desc: 'Potencia acústica disuasiva de 120 decibeles en gabinete metálico con tamper de pared y batería de contingencia.'
      },
      {
        step: '04',
        title: 'Pruebas de Transmisión & Homologación C4',
        desc: 'Simulacro de apertura no autorizada, prueba de corte de línea telefónica y enlace al software de despacho de patrulla.'
      }
    ],
    techSpecs: [
      { param: 'Número de Zonas', spec: 'De 8 a 128 zonas cableadas e inalámbricas encriptadas PowerG' },
      { param: 'Respaldo Energético', spec: 'Batería de respaldo AGM de 12V 7Ah (hasta 48 horas en reposo)' },
      { param: 'Transmisor Dual', spec: 'Módulo Ethernet IP integrado + Comunicador celular LTE/4G redundante' },
      { param: 'Frecuencia Inalámbrica', spec: 'PowerG 915 MHz con salto de frecuencia FHSS y cifrado AES-128' },
      { param: 'Nivel de Presión Sonora', spec: 'Sirenas de 118 dB a 1 metro con estrobo LED de alta intensidad' },
      { param: 'Normas Cumplidas', spec: 'UL 1023 (Seguridad Doméstica), UL 1610 (Seguridad Comercial Estándar)' },
      { param: 'Marcas Homologadas', spec: 'DSC PowerSeries Neo, Paradox EVO/SP, Resideo Honeywell Home, Bosch' }
    ],
    useCases: [
      {
        sector: 'Bodegas & Naves de Almacenaje',
        challenge: 'Ingreso nocturno por techos de lámina o cortinas perimetrales desatendidas durante fines de semana.',
        solution: 'Sensores de impacto en muros de lámina, barreras infrarrojas sobre bardas y contactos blindados en cortinas.'
      },
      {
        sector: 'Sucursales Bancarias & Joyerías',
        challenge: 'Ataques con soplete, taladro térmico o aperturas forzadas a bóvedas y cajeros automáticos.',
        solution: 'Detectores sísmicos de vibración microfónica y botones de pánico de pedal con código de coacción silencioso.'
      },
      {
        sector: 'Farmacias & Tiendas de Conveniencia',
        challenge: 'Riesgo de asalto a mano armada al personal nocturno y hurto en trastienda.',
        solution: 'Niebla de seguridad que desorienta al delincuente en 3 segundos y botones de pánico inalámbricos tipo llavero.'
      },
      {
        sector: 'Residencias & Condominios',
        challenge: 'Falsas alarmas por mascotas familiares o ramas de árboles que generan desconfianza.',
        solution: 'Sensores con tecnología Pet-Immune hasta 38 kg y confirmación fotográfica por video antes de despachar a la patrulla.'
      }
    ],
    faq: [
      {
        q: '¿Qué hace la Central de Monitoreo C4 cuando se activa una alarma en mi empresa?',
        a: 'En menos de 15 segundos el operador C4 recibe la señal con la zona exacta afectada, verifica el video en vivo de las cámaras asociadas, llama a los contactos de emergencia y despacha a la patrulla de reacción y a los cuerpos de seguridad pública.'
      },
      {
        q: '¿Qué es una clave de coacción (bajo amenaza)?',
        a: 'Es una clave numérica especial que finge desactivar la alarma ante un delincuente, pero envía de manera silenciosa e inmediata un código rojo de "rehén" a la Central Cuauhtli para enviar auxilio urgente.'
      },
      {
        q: '¿El sistema de alarma sigue funcionando si cortan la luz de la calle?',
        a: 'Sí. Todos los paneles cuentan con batería interna de respaldo que mantiene el sistema al 100% por hasta 48 horas, además de transmitir de inmediato la alerta de "Falla de Energía Eléctrica" a tu celular y a nuestro C4.'
      },
      {
        q: '¿Puedo armar y desarmar la alarma desde mi celular?',
        a: 'Sí, mediante la app Cuauhtli Connect puedes armar de forma total o parcial, ver el historial de aperturas con nombre de empleado, y recibir alertas push instantáneas.'
      }
    ]
  },

  'cercas-electrificadas': {
    id: 'cercas-electrificadas',
    slug: 'cercas-electrificadas',
    name: 'Cercas Electrificadas Industriales',
    badge: 'SISTEMA 04 · PROTECCIÓN PERIMETRAL',
    shortTitle: 'Cercas de Alto Voltaje',
    tagline: 'Barrera física y psicológica disuasiva de 12,000 a 14,000 Volts pulsados no letales con sensor de corte.',
    heroDescription: 'Detén al intruso antes de que toque el suelo de tu propiedad. Instalamos cercas electrificadas de alto impacto con pulsos no letales de alto voltaje, postes galvanizados cedula 30, cable de aluminio antioxidante y sensores microprocesados que detectan cortes, flexiones y aterrizajes a tierra.',
    stats: [
      { label: 'Voltaje de Impulso', value: '12,000 - 14,000 V', sub: 'Pulsos de 0.75 milisegundos' },
      { label: 'Corriente Eléctrica', value: '< 5 mA', sub: 'No letal, 100% legal bajo NOM' },
      { label: 'Detección de Corte', value: 'Instantánea', sub: 'Sensor de tensión en línea' },
      { label: 'Vida Útil de Postes', value: '15+ Años', sub: 'Galvanizado en caliente' },
    ],
    features: [
      {
        title: 'Descarga Disuasiva No Letal Normada',
        desc: 'Impulso eléctrico de alta tensión pero bajísimo amperaje que provoca contracción muscular refleja y pánico instantáneo sin poner en riesgo la vida humana.',
        icon: 'Zap'
      },
      {
        title: 'Detección Inteligente de Sabotaje & Corte',
        desc: 'El energizador monitorea el circuito cerrado de forma continua: si un cable es cortado, derivado a tierra o apantallado, la alarma suena en 0.5 segundos.',
        icon: 'Scissors'
      },
      {
        title: 'Aisladores de Polipropileno con Filtro UV',
        desc: 'Material dieléctrico de alta resistencia mecánica que no se cristaliza ni se rompe con la radiación solar extrema, garantizando cero fugas de chispa.',
        icon: 'Layers'
      },
      {
        title: 'Integración Automática con PTZ de CCTV',
        desc: 'Al registrarse un conato en el tramo norte, la cámara de seguridad gira automáticamente hacia ese cuadrante y enfoca al punto de intrusión.',
        icon: 'Crosshair'
      }
    ],
    architecture: [
      {
        step: '01',
        title: 'Cálculo de Tensión Mecánica & Resistencia',
        desc: 'Diseñamos la separación entre postes intermedios y de esquina para garantizar que las líneas nunca queden flojas con el paso de los años.'
      },
      {
        step: '02',
        title: 'Instalación de Postes con Soldadura o Taquete Químico',
        desc: 'Fijación sólida sobre bardas perimetrales o remate sobre rejas tipo Deacero con inclinación hacia el exterior para máxima dificultad de escalada.'
      },
      {
        step: '03',
        title: 'Tendido de Alambre de Aluminio Triple Torsión',
        desc: 'Conductor libre de óxido que asegura una conductividad eléctrica 4 veces superior al alambre galvanizado tradicional.'
      },
      {
        step: '04',
        title: 'Colocación de Varilla de Tierra Física & Calibración',
        desc: 'Instalación de varilla Copperweld de 1.5 metros para garantizar que la descarga cierre circuito eficientemente ante cualquier calzado.'
      }
    ],
    techSpecs: [
      { param: 'Energía de Salida', spec: 'De 2.5 a 6.0 Joules regulables según longitud del perímetro' },
      { param: 'Voltaje en Línea', spec: '12,000 a 14,000 Volts pico pulsados (1 pulso por segundo)' },
      { param: 'Duración del Pulso', spec: 'Menor a 1 milisegundo (cumple IEC 60335-2-76)' },
      { param: 'Líneas Recomendadas', spec: 'De 5 a 10 líneas de cable (altura de 1.00m a 1.80m sobre barda)' },
      { param: 'Consumo Eléctrico Promedio', spec: 'Menor a 8 Watts (equivalente a un foco LED de bajo consumo)' },
      { param: 'Normativa Oficial Mexicana', spec: 'Cumplimiento NOM-001-SEDE-2012 y lineamientos de Protección Civil' },
      { param: 'Marcas de Energizadores', spec: 'JVA Technologies, Yonusa, Nemtek, Speedrite' }
    ],
    useCases: [
      {
        sector: 'Parques Industriales & Patios Fiscales',
        challenge: 'Bardas perimetrales extensas colindantes con vías de ferrocarril o terrenos ejidales desérticos.',
        solution: 'Cercado industrial de 10 líneas sobre barda con zonificación que divide el perímetro en 4 sectores monitoreados.'
      },
      {
        sector: 'Plantas Químicas & Metalúrgicas',
        challenge: 'Materiales costosos (cobre, acero, resinas) acopiados a cielo abierto susceptibles a robo exprés.',
        solution: 'Cerca electrificada con sensor de flexión por resorte que avisa si alguien apoya una escalera o manta sobre el alambre.'
      },
      {
        sector: 'Condominios & Fraccionamientos Privados',
        challenge: 'Necesidad de disuasión visible sin afectar la estética arquitectónica ni provocar accidentes con mascotas.',
        solution: 'Postes con acabado en pintura electrostática gris grafito o negro mate y letreros reglamentarios de advertencia cada 10m.'
      },
      {
        sector: 'Planteles Educativos & Escuelas',
        challenge: 'Vandalismo en periodos vacacionales y robo de equipos de cómputo y cableado de cobre.',
        solution: 'Protección perimetral con encendido automático por horario y botón de prueba rápida en caseta de vigilancia.'
      }
    ],
    faq: [
      {
        q: '¿Es legal tener una cerca electrificada en México?',
        a: 'Totalmente legal. Nuestras instalaciones cumplen estrictamente con la Norma Oficial Mexicana NOM-001-SEDE-2012 y el estándar internacional IEC 60335-2-76. El sistema entrega pulsos no letales y se entrega con letreros oficiales de advertencia a 2 metros de altura mínima.'
      },
      {
        q: '¿Qué pasa si llueve fuerte o caen rayos?',
        a: 'Nuestros aisladores cuentan con ranuras rompe-gotas que evitan que el agua forme puentes conductores que activen falsas alarmas. Además, instalamos desviadores de descargas atmosféricas (supresores de picos) que protegen el energizador ante rayos.'
      },
      {
        q: '¿Cuánto consume de luz una cerca electrificada?',
        a: 'El consumo es mínimo: entre 5 y 10 Watts continuos, lo que representa aproximadamente entre $30 y $50 pesos mexicanos bimestrales en tu recibo de CFE.'
      },
      {
        q: '¿Qué mantenimiento requiere el cercado?',
        a: 'Recomendamos un servicio semestral para revisar la tensión mecánica de los resortes, podar ramas de vegetación que rocen el alambre y medir el ohmiaje de la varilla de tierra física.'
      }
    ]
  },

  'videoporteros': {
    id: 'videoporteros',
    slug: 'videoporteros',
    name: 'Videoporteros & Intercomunicación IP',
    badge: 'SISTEMA 05 · INTERCOMUNICACIÓN',
    shortTitle: 'Videoporteros IP & Apps',
    tagline: 'Comunicación audiovisual 2K para oficinas, corporativos y condominios con apertura remota desde celular.',
    heroDescription: 'Verifica la identidad de cualquier visitante antes de abrir la puerta. Instalamos frentes de calle IP antivandálicos con cámara gran angular de 180°, pantallas táctiles para recepción o departamento y enlace con smartphones para abrir puertas desde cualquier lugar del mundo.',
    stats: [
      { label: 'Resolución de Cámara', value: '2K QHD (4MP)', sub: 'Visión gran angular 180°' },
      { label: 'Apertura Remota', value: 'Vía Smartphone', sub: 'App móvil iOS & Android' },
      { label: 'Protocolo de Audio', value: 'SIP 2.0 Full Duplex', sub: 'Cancelación de eco y ruido' },
      { label: 'Capacidad Edificios', value: 'Hasta 500 Deptos', sub: 'Por frente de calle modular' },
    ],
    features: [
      {
        title: 'Frente de Calle Modular Antivandálico IK08',
        desc: 'Construcción en aluminio cepillado con teclado numérico retroiluminado, lector de tarjetas y directorio digital para búsqueda rápida de residentes.',
        icon: 'Monitor'
      },
      {
        title: 'Llamada Directa a Smartphone sin Costo',
        desc: 'Cuando el visitante toca el timbre en la entrada, tu celular suena como llamada telefónica mostrando el video en vivo antes de contestar.',
        icon: 'Smartphone'
      },
      {
        title: 'Apertura de Múltiples Accesos Independientes',
        desc: 'Dos salidas de relé seco para abrir por separado la cerradura magnética de la puerta peatonal y accionar el portón vehicular automatizado.',
        icon: 'Key'
      },
      {
        title: 'Intercomunicación Interna entre Oficinas',
        desc: 'Llamadas de voz y video gratuitas entre departamentos, caseta de vigilancia, recepción y salas de juntas sin cables telefónicos antiguos.',
        icon: 'MessageSquare'
      }
    ],
    architecture: [
      {
        step: '01',
        title: 'Diseño de Red IP & Switch PoE',
        desc: 'Tendido con cable UTP Cat6 certificado que transmite simultáneamente video, audio bidireccional y energía eléctrica por el mismo cable (PoE).'
      },
      {
        step: '02',
        title: 'Fijación de Frente de Calle en Fachada',
        desc: 'Empotrado o sobrepuesto con visera protectora contra lluvia y sol, calibrando el ángulo visual hacia la altura promedio del rostro humano.'
      },
      {
        step: '03',
        title: 'Instalación de Monitores Touch Interiores',
        desc: 'Montaje de pantallas de 7 o 10 pulgadas en muro con interfaz intuitiva para adultos mayores y personal de vigilancia.'
      },
      {
        step: '04',
        title: 'Vinculación a Servidor Cloud & App Móvil',
        desc: 'Configuración de cuentas maestras y enrolamiento de teléfonos familiares o corporativos mediante código QR seguro.'
      }
    ],
    techSpecs: [
      { param: 'Sensor de Video', spec: 'CMOS 4 Megapíxeles 2K con WDR verdadero de 120 dB' },
      { param: 'Ángulo de Visión', spec: 'Horizontal 180° / Vertical 96° (sin puntos ciegos a nivel de piso)' },
      { param: 'Alimentación Eléctrica', spec: 'PoE Estándar IEEE 802.3af o 12V DC' },
      { param: 'Audio Digital', spec: 'Micrófono omnidireccional con supresión de ruido ambiental por DSP' },
      { param: 'Pantallas Interiores', spec: 'Panel táctil capacitivo IPS de 7" o 10.1" con resolución 1024x600' },
      { param: 'Cerraduras Compatibles', spec: 'Electroimanes de 600/1200 lbs, contra-chapas eléctricas, pistones para portón' },
      { param: 'Marcas Homologadas', spec: 'Hikvision Villa & Multi-Apartment, Dahua IP Intercom, Fanvil, Akuvox' }
    ],
    useCases: [
      {
        sector: 'Condominios & Torres de Departamentos',
        challenge: 'Falta de vigilancia en accesos compartidos y cables de interfón viejos trozados en ductos inaccesibles.',
        solution: 'Frente de calle IP sobre red Ethernet compartida con directorio digital que marca directamente al departamento o al celular del dueño.'
      },
      {
        sector: 'Oficinas Corporativas & Coworking',
        challenge: 'Recepción desatendida a la hora de comida con paquetes de mensajería (Amazon, DHL) devueltos por falta de quién reciba.',
        solution: 'El mensajero toca el timbre y la recepcionista le contesta desde su celular, abriendo la puerta a distancia para que deje el paquete.'
      },
      {
        sector: 'Residencias de Alto Perfil',
        challenge: 'Necesidad de ver claramente quién está afuera sin acercarse a la ventana o puerta principal.',
        solution: 'Monitores touch colocados en cocina y recámara principal que permiten abrir el cancel peatonal con un solo toque.'
      },
      {
        sector: 'Clínicas & Consultorios Médicos',
        challenge: 'Control de acceso a salas de espera sin que el médico deba interrumpir la consulta para abrir.',
        solution: 'Pulsador en escritorio y pantalla compacta que muestra la llegada de pacientes y autoriza la entrada electrónicamente.'
      }
    ],
    faq: [
      {
        q: '¿Qué necesito para que el videoportero timbre en mi celular?',
        a: 'Solo requieres que el frente de calle esté conectado al internet de tu inmueble (módem o switch) y descargar la app oficial gratuita. No tiene mensualidades ni cargos ocultos.'
      },
      {
        q: '¿Puedo integrar las cámaras de mi CCTV a la pantalla del videoportero?',
        a: 'Sí. Las pantallas táctiles interiores de 7 y 10 pulgadas pueden visualizar no solo el frente de calle, sino también hasta 16 cámaras de tu circuito cerrado IP existente.'
      },
      {
        q: '¿Qué pasa si alguien intenta arrancar o dañar el frente de calle?',
        a: 'El equipo integra un sensor antisabotaje (Tamper switch) en su parte posterior que activa una sirena ensordecedora y envía una fotografía de alerta inmediata a los monitores y celulares.'
      },
      {
        q: '¿Se pueden usar tarjetas o contraseñas además de tocar el timbre?',
        a: 'Sí, los frentes de calle modulares incluyen lector de tarjetas Mifare/NFC y teclado numérico para que los colaboradores o residentes ingresen con su propio PIN sin necesidad de llamar.'
      }
    ]
  }
};
