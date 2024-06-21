import * as THREE from "three";

export const checkpoints = [
    {
        position: new THREE.Vector3(0.85, 0.38, -0.45),
        label: 'Cladire de birouri',
        info: {
            info: '',
            information1: 'Utilizarea sistemelor de management al energiei (EMS) pentru monitorizarea și optimizarea consumului de energie în timp real.',
            information2: 'Implementarea sistemelor de încălzire, ventilație și aer condiționat (HVAC) controlate de senzori care ajustează temperatura și umiditatea în funcție de ocuparea și condițiile meteo.',
            information3: 'Implementarea sistemelor de reciclare a apei gri pentru utilizări ne-potabile, cum ar fi irigațiile sau curățenia.',
            information4: 'Crearea spațiilor verzi exterioare pentru a îmbunătăți calitatea aerului și a oferi un mediu de lucru mai plăcut.',
            information5: 'Promovarea utilizării materialelor reutilizabile și reducerea consumului de articole de unică folosință.'
        },
        color: "rgba(0,72,110,0.6)",
        image: "/images/turn.jpg"
    },
    {
        position: new THREE.Vector3(0.3, 0.2, -0.5),
        label: 'Zona industrială',
        info: {
            info: '',
            information1: 'Utilizarea vehiculelor electrice și hibride pentru transportul intern și logistică pentru a reduce emisiile de CO2.',
            information2: 'Utilizarea tehnologiilor IoT și a sistemelor de gestionare a stocurilor pentru a eficientiza procesele logistice și a reduce pierderile.',
            information3: 'Utilizarea materialelor de construcție eco-friendly și durabile pentru clădirile industriale.',
            information4: 'Utilizarea tehnologiilor de mentenanță predictivă pentru a preveni avariile și a reduce consumul de resurse și emisiile.',
            information5: 'Introducerea biocombustibililor fabricați din deșeuri industriale pentru alimentarea echipamentelor și vehiculelor.'
        },
        color: "rgba(255,94,35,0.6)",
        image: "/images/macara.jpg"
    },
    {
        position: new THREE.Vector3(0.02, -0.05, -0.25),
        label: 'Centru mesagerie și distribuție',
        info: {
            info: '',
            information1: 'Implementarea roboților pentru sortarea și manipularea coletelor pentru a crește eficiența și a reduce erorile.',
            information2: 'Utilizarea dronelor pentru livrări rapide și eficiente în zonele urbane, reducând traficul și emisiile.',
            information3: 'Implementarea senzorilor IoT pentru monitorizarea temperaturii, umidității și locației coletelor în timp real.',
            information4: 'Utilizarea materialelor de ambalare biodegradabile și reciclabile pentru a reduce impactul asupra mediului.',
            information5: 'Utilizarea software-ului avansat pentru optimizarea rutelor de livrare, reducând astfel consumul de combustibil și timpul de livrare.'
        },
        color: "rgba(31,255,233,0.5)",
        image: "/images/call-center.jpg"
    },
    {
        position: new THREE.Vector3(0.5, 0, 0),
        label: 'Centru Tech ',
        info: {
            info: '',
            information1: 'Crearea de acoperișuri verzi pentru a îmbunătăți izolația termică, a reduce efectul de insulă termică urbană și a gestiona apa pluvială.',
            information2: 'Instalarea panourilor solare și a sistemelor eoliene pentru a genera energie verde.',
            information3: 'Algoritmi AI care prezic cererea de energie pe baza modelelor de utilizare și condițiilor meteorologice, permițând ajustări proactive și reducând necesitatea de energie de vârf.',
            information4: 'Implementarea unei rețele dense de senzori IoT pentru a monitoriza parametrii de mediu (temperatură, umiditate, calitatea aerului) și a optimiza condițiile de lucru în timp real.',
            information5: 'Instalarea de toalete și robinete cu consum redus de apă, dotate cu senzori pentru a reduce risipa.'
        },
        color: "rgba(0,255,21,0.6)",
        image: "/images/tech-centrer.jpg"
    },
    {
        position: new THREE.Vector3(0.95, 0.1, -0.05),
        label: 'Spital',
        info: {
            info: 'Instituție medicală care oferă servicii esențiale de diagnostic, tratament și îngrijire pentru pacienți. Acesta dispune de departamente de urgență, laboratoare de diagnostic, săli de operație și unități de terapie intensivă.',
            information1: 'Utilizarea becurilor LED și a sistemelor de iluminat cu senzori de mișcare pentru a reduce consumul de energie.',
            information2: 'Promovarea dosarelor medicale electronice.',
            information3: 'Implementarea unui program de reciclare pentru hârtie, plastic, sticlă și metal. Separarea deșeurilor medicale periculoase de cele nepericuloase.',
            information4: 'Instalarea panourilor solare pe acoperișul spitalului pentru a genera energie verde.\n',
            information5: 'Utilizarea vehiculelor electrice sau hibride pentru transportul pacienților și al personalului medical.'
        },
        color: "rgba(255,0,0,0.5)",
        image: "/images/spital.jpg"
    },
    {
        position: new THREE.Vector3(0.8, -0.15, 0.45),
        label: 'Parc de distracții',
        info: {
            info: '',
            information1: 'Implementarea toaletelor și chiuvetelor cu consum redus de apă, dotate cu senzori pentru a preveni risipa.',
            information2: 'Crearea unor puncte de colectare separată a deșeurilor pentru reciclarea hârtiei, plasticului, metalului și sticlei.',
            information3: 'Instalarea de panouri informative în tot parcul pentru a educa vizitatorii despre măsurile de sustenabilitate implementate.',
            information4: 'Utilizarea materialelor de construcție reciclabile și ecologice, precum și a mobilierului sustenabil.',
            information5: 'Utilizarea ambalajelor biodegradabile și compostabile pentru alimente și băuturi.'
        },
        color: "rgba(255,26,237,0.5)",
        image: "/images/parc-de-distractii.jpg"
    },
    {
        position: new THREE.Vector3(0.3, -0.2, 0.6),
        label: 'Fabrică de prelucrare în detaliu',
        info: {
            info: '',
            information1: 'Implementarea unui sistem de reciclare avansat în interiorul fabricii, unde toate materialele utilizate în procesul de producție sunt reciclate și refolosite în mod continuu.',
            information2: 'Investirea în tehnologii inovatoare, cum ar fi capturarea și stocarea carbonului (CCS), pentru a realiza o fabrică cu emisii zero.',
            information3: 'Încurajarea angajaților să utilizeze vehicule electrice sau biciclete pentru a ajunge la locul de muncă.',
            information4: 'Crearea unui ecosistem industrial în care deșeurile unei fabrici devin resurse pentru alte industrii sau procese.',
            information5: 'Integrarea unor sisteme de agricultură urbană verticală în structurile fabricii pentru a produce alimente pentru angajați și comunitatea locală.'
        },
        color: "rgba(255,174,0,0.7)",
        image: "/images/fabrica.jpg"
    },
    {
        position: new THREE.Vector3(-0.26, -0.18, 0.7),
        label: 'Feribot',
        info: {
            info: '',
            information1: 'Înlocuirea motoarelor cu combustie internă cu propulsie electrică sau hibridă.',
            information2: 'Instalarea unor sisteme de încărcare la bord pentru a permite alimentarea cu energie electrică a feribotului, folosind surse regenerabile precum panouri solare sau turbină eoliană.',
            information3: 'Planificarea traseelor și programului feribotului pentru a minimiza consumul de combustibil și pentru a reduce impactul asupra mediului, folosind un software.',
            information4: 'Implementarea sistemelor de stocare a energiei, cum ar fi bateriile mari de litiu-ion, pentru a gestiona și a optimiza consumul de energie electrică pe feribot.',
            information5: 'Implementarea unor politici de tarifare și stimulente pentru pasagerii și operatorii de feriboturi care optează pentru modalități de transport sustenabile.'
        },
        color: "rgba(92,151,255,0.7)",
        image: "/images/nava-maritima.jpg"
    },
    {
        position: new THREE.Vector3(-0.55, -0.1, 0.6),
        label: 'Centru de control naval',
        info: {
            info: '',
            information1: 'Implementarea sistemelor digitale avansate și IoT pentru a monitoriza și gestiona eficient operațiunile navale.',
            information2: 'Integrarea unui sistem eficient de gestionare a deșeurilor care să includă reciclarea și compostarea.',
            information3: 'Implementarea unei tehnologii de reciclare a apei și de economisire a apei pentru a reduce consumul de apă dulce și pentru a gestiona eficient resursele de apă într-un mediu naval.',
            information4: 'Instalarea panouri solare pe acoperișul clădirii sau turbine eoliene în apropiere pentru a genera energie electrică verde.',
            information5: 'Limitarea degradării biodiversității maritime prin monitorizarea activă a impactului operațiunilor navale asupra habitatelor marine sensibile și implementarea măsurilor de mitigare corespunzătoare.'
        },
        color: "rgba(255,0,76,0.7)",
        image: "/images/turn-de-control.jpg"
    },
    // {
    //     position: new THREE.Vector3(-0.73, -0.15, 0.175),
    //     label: 'Corturi',
    //     info: {
    //         info: '',
    //         information1: '',
    //         information2: '',
    //         information3: '',
    //         information4: '',
    //         information5: ''
    //     },
    //     color: "rgba(255,0,136,0.6)",
    //     image: "/images/corturi.jpg"
    // },
    {
        position: new THREE.Vector3(-0.49, -0.15, -0.35),
        label: 'Parcare',
        info: {
            info: '',
            information1: 'Instalarea unor perdele vegetale în jurul zonei de parcare pentru a reduce efectul insulei de căldură și pentru a îmbunătăți calitatea aerului. Plantele absorb CO2 și poluanții atmosferici, oferind în același timp un habitat pentru biodiversitatea locală.',
            information2: 'Instalarea stațiilor de încărcare pentru vehicule electrice în zona de parcare pentru a încuraja utilizarea transportului electric.',
            information3: 'Utilizarea iluminatului LED sau alte tehnologii de iluminat eficient energetic pentru a reduce consumul de energie al zonei de parcare în timpul nopții.',
            information4: 'Utilizarea barierelor verzi sau ecrane acustice vegetale pentru a reduce poluarea fonică și pentru a oferi un ambient mai plăcut în jurul zonei de parcare.',
            information5: 'Implementarea unor sisteme inteligente de management al cererii de parcare pentru a optimiza utilizarea spațiilor disponibile și pentru a reduce poluarea asociată circulației inutile în căutarea unui loc de parcare.'
        },
        color: "rgba(39,255,74,0.6)",
        image: "/images/parcare.jpg"
    },
];