const NETRIVO_PROGRESS_KEY = 'netrivoProgressV6';

const lessons = {
  'pengantar-konsep': {
    course: 'pengantar', number: '1.1', type: 'content', title: 'Konsep Dasar Jaringan',
    lead: 'Pahami komponen jaringan, aturan komunikasi, model referensi, dan perjalanan data dari pengirim ke penerima.',
    heading: 'Jaringan menghubungkan perangkat melalui media dan protokol yang sama.',
    text: 'Jaringan komputer adalah sistem interkoneksi antarperangkat komputasi atau node yang menggunakan protokol standar untuk berkomunikasi dan mentransmisikan data.',
    image: 'assets/images/jaringanalat.png',
    details: [
      { title: 'Komponen Infrastruktur', items: ['End device meliputi host, server, PC, dan perangkat IoT', 'Intermediate device meliputi switch Layer 2, router Layer 3, firewall, dan access point', 'Media terpandu menggunakan UTP, STP, atau fiber optic; media nirkabel menggunakan gelombang radio dan Wi-Fi'] },
      { title: 'Aturan dan Protokol', items: ['TCP/IP menjadi standar dasar komunikasi internet', 'IP address digunakan sebagai alamat logis dan MAC address sebagai alamat fisik', 'DNS, DHCP, HTTP/HTTPS, dan protokol routing menyediakan layanan jaringan'] },
      { title: 'Model OSI dan TCP/IP', items: ['Application, Presentation, dan Session pada OSI berada dalam Application Layer TCP/IP', 'Transport Layer membawa segment TCP atau datagram UDP', 'Network atau Internet Layer membawa packet IPv4, IPv6, ICMP, dan IPsec', 'Data Link atau Network Access Layer membawa frame Ethernet, Wi-Fi, dan ARP', 'Physical Layer mengirim bit melalui konektor, sinyal listrik, atau cahaya fiber'] },
      { title: 'Proses Enkapsulasi', items: ['Data aplikasi dibungkus secara bertahap menjadi segment, packet, frame, lalu bit', 'Setiap lapisan menambahkan header sesuai fungsinya', 'Perangkat penerima melakukan dekapsulasi untuk memperoleh data asli'] }
    ], next: 'topologi.html'
  },
  'pengantar-topologi': {
    course: 'pengantar', number: '1.2', type: 'content-video', title: 'Jenis Topologi Jaringan',
    lead: 'Bandingkan struktur, keunggulan, kelemahan, biaya, dan ketahanan setiap topologi jaringan.',
    heading: 'Topologi menggambarkan susunan fisik dan jalur logis antar-node.',
    text: 'Pemilihan topologi memengaruhi biaya kabel, skalabilitas, kompleksitas pengelolaan, serta kemampuan jaringan bertahan ketika terjadi gangguan.',
    points: [],
    image: 'assets/images/topologi.png',
    imageAlt: 'Diagram topologi Bus, Star, Ring, Mesh, dan Tree',
    details: [
      { title: 'Topologi Star', items: ['Setiap node terhubung langsung ke switch atau hub pusat', 'Mudah mengisolasi kesalahan dan kegagalan satu kabel tidak mengganggu node lain', 'Perangkat pusat menjadi single point of failure dan membutuhkan lebih banyak kabel'] },
      { title: 'Topologi Bus', items: ['Menggunakan satu kabel backbone dengan terminator pada kedua ujung', 'Biaya instalasi rendah dan hemat kabel', 'Rentan collision; kerusakan backbone memutus seluruh jaringan'] },
      { title: 'Topologi Ring', items: ['Node terhubung melingkar dan transmisi menggunakan token passing', 'Bebas collision serta stabil pada beban tinggi', 'Kerusakan satu node dapat memutus seluruh loop'] },
      { title: 'Topologi Mesh', items: ['Setiap node memiliki koneksi point-to-point dengan jumlah jalur N(N-1)/2', 'Redundansi dan toleransi kesalahan sangat tinggi', 'Biaya, jumlah kabel, dan pengelolaan port sangat besar'] },
      { title: 'Topologi Tree', items: ['Menggabungkan susunan Star dan Bus secara hierarkis', 'Cocok untuk sekolah atau organisasi dengan banyak cabang dan departemen', 'Skalabilitas sangat tinggi, tetapi biaya dan kompleksitas pengelolaan juga meningkat'] },
      { title: 'Matriks Pemilihan', items: ['Star menawarkan skalabilitas tinggi dengan toleransi kesalahan sedang hingga tinggi', 'Bus berbiaya rendah tetapi memiliki toleransi kesalahan sangat rendah', 'Ring stabil, tetapi skalabilitas dan toleransi kesalahannya terbatas', 'Full Mesh paling andal sekaligus paling mahal dan rumit', 'Tree cocok untuk jaringan besar yang membutuhkan hierarki'] }
    ],
    video: 'assets/video/konsep_dasar.mp4', videoTitle: 'Video Pengantar Jaringan', next: 'latihan-pengantar.html'
  },
  'pengantar-latihan': {
    course: 'pengantar', number: '1.3', type: 'practice', title: 'Latihan Pengantar Jaringan',
    lead: 'Jawab lima soal analitis tentang model OSI dan topologi jaringan berdasarkan materi.',
    questions: [
      {
        prompt: 'Pada model OSI, di lapisan manakah pemeriksaan dan penambahan header yang berisi MAC address terjadi?',
        options: ['Network Layer', 'Data Link Layer', 'Transport Layer', 'Physical Layer'],
        answer: 1,
        explanation: 'Data Link Layer atau Layer 2 menambahkan MAC address pengirim dan penerima pada frame.'
      },
      {
        prompt: 'Sebuah perusahaan memiliki 8 server yang menerapkan topologi Full Mesh. Berapa jumlah jalur kabel yang diperlukan?',
        options: ['16 jalur', '28 jalur', '56 jalur', '64 jalur'],
        answer: 1,
        explanation: 'Rumus Full Mesh adalah N(N-1)/2, sehingga 8 x 7 / 2 menghasilkan 28 jalur.'
      },
      {
        prompt: 'Kelemahan utama topologi Star yang dapat melumpuhkan komunikasi seluruh client adalah...',
        options: ['Putusnya salah satu kabel client', 'Kerusakan terminator', 'Single point of failure pada switch pusat', 'Collision data yang tinggi'],
        answer: 2,
        explanation: 'Semua node bergantung pada perangkat pusat, sehingga jaringan terputus ketika switch pusat gagal.'
      },
      {
        prompt: 'Mengapa topologi Ring bebas dari collision meskipun lalu lintas jaringan sedang padat?',
        options: ['Memiliki kabel cadangan otomatis', 'Menggunakan transmisi berbasis Token Passing', 'Menggunakan Switch Layer 3', 'Kecepatan transmisi menyesuaikan secara otomatis'],
        answer: 1,
        explanation: 'Node hanya dapat mengirim data ketika memegang token digital, sehingga pengiriman tidak saling bertabrakan.'
      },
      {
        prompt: 'Jaringan sekolah perlu membagi laboratorium ke beberapa cabang di bawah kendali node utama. Topologi yang paling tepat adalah...',
        options: ['Topologi Bus', 'Topologi Ring', 'Topologi Tree', 'Topologi Mesh'],
        answer: 2,
        explanation: 'Topologi Tree mendukung struktur hierarkis dan segmentasi cabang atau departemen.'
      }
    ], next: 'cisco.html'
  },
  'cisco-pengenalan': {
    course: 'cisco', number: '2.1', type: 'content', title: 'Pengenalan Perangkat Cisco',
    lead: 'Mengenal Cisco IOS, antarmuka CLI, dan mode operasi yang digunakan pada router serta switch.',
    heading: 'Cisco IOS menjadi dasar pengelolaan perangkat Cisco.',
    text: 'Perangkat Cisco adalah lini hardware jaringan buatan Cisco Systems yang dirancang untuk membangun, mengamankan, dan mengelola infrastruktur komunikasi data skala kecil hingga enterprise. Portofolio perangkatnya mencakup router untuk menghubungkan antarjaringan, switch untuk menghubungkan perangkat dalam jaringan lokal (LAN), firewall (Firepower/Secure Firewall) untuk sistem keamanan, serta Access Point untuk jaringan Wi-Fi nirkabel. Dalam penerapannya, perangkat Cisco terbagi menjadi dua kategori manajemen utama, yaitu opsi konvensional yang dikonfigurasi melalui Command Line Interface (CLI) menggunakan sistem operasi Cisco IOS untuk kontrol tingkat tinggi, serta lini Cisco Meraki yang mengusung konsep cloud-managed melalui dashboard berbasis web. Keunggulan utama dari ekosistem perangkat Cisco terletak pada skalabilitas, ketahanan (reliability), dan dukungan protokol jaringan standar industri yang sangat luas.',
    details: [
      { title: 'Mode Operasi CLI', items: ['User EXEC - Router, untuk melihat status terbatas', 'Privileged EXEC - Router, untuk akses status dan konfigurasi', 'Global Configuration - Router(config), untuk konfigurasi umum', 'Interface Configuration - Router(config-if), untuk mengatur interface'] },
      { title: 'Navigasi Dasar', code: ['Router> enable', 'Router# configure terminal', 'Router(config)# exit', 'Router# write memory'] }
    ], next: 'cisco-router.html'
  },
  'cisco-router': {
    course: 'cisco', number: '2.2', type: 'content', title: 'Router Cisco',
    lead: 'Pelajari fungsi, komponen, proses booting, dan konfigurasi dasar router Cisco.',
    heading: 'Router bekerja pada Layer 3 dan meneruskan paket berdasarkan IP.',
    text: 'Router Cisco adalah perangkat jaringan keras (hardware) pabrikan Cisco Systems yang berfungsi menghubungkan dua atau lebih jaringan komputer berbeda, seperti menghubungkan jaringan lokal (LAN) ke jaringan luas (WAN) atau ke internet. Router bekerja pada Layer 3 (Network Layer) dalam model OSI dan menggunakan protokol seperti IP untuk mengarahkan paket data ke tujuan terbaik.',
    image: 'assets/images/cisco.png',
    details: [
      { title: 'Fungsi Utama', items: ['Routing Data (Pengarah Jalur) Menentukan jalur paling efisien untuk mengirimkan paket data dari sumber ke tujuan menggunakan tabel routing (routing table)', 'Menghubungkan Subnet & Jaringan Berbeda Memungkinkan komunikasi antar-VLAN atau antar-jaringan IP yang berbeda subnet', 'Keamanan Jaringan Dilengkapi fitur Access Control List (ACL), firewall, dan enkripsi VPN untuk menyaring lalu lintas data yang mencurigakan', 'Manajemen Bandwidth (QoS) Menerapkan Quality of Service untuk memprioritaskan lalu lintas data penting (seperti panggilan suara/VoIP atau video conference)'] },  
      { title: 'Komponen Dasar Router', items: ['RAM menyimpan running-config dan tabel routing sementara', 'NVRAM menyimpan startup-config', 'Flash menyimpan Cisco IOS', 'ROM menyimpan bootstrap untuk proses booting'] },
      { title: 'Konfigurasi IP Interface', code: ['Router(config)# interface GigabitEthernet0/0', 'Router(config-if)# ip address 192.168.1.1 255.255.255.0', 'Router(config-if)# no shutdown', 'Router(config-if)# description Jaringan_LAN_Kantor'] },
      { title: 'Perintah Verifikasi', items: ['show running-config', 'show startup-config', 'show ip interface brief', 'show ip route', 'show version', 'ping dan traceroute'] }
    ], next: 'cisco-switch.html'
  },
  'cisco-switch': {
    course: 'cisco', number: '2.3', type: 'content', title: 'Switch Cisco',
    lead: 'Pelajari fungsi switch, MAC address table, VLAN, access port, dan trunk.',
    heading: 'Switch bekerja pada Layer 2 dan meneruskan frame berdasarkan MAC address.',
    text: 'Switch Cisco adalah perangkat penghubung utama dalam jaringan lokal (LAN) yang berfungsi untuk menerima, memproses, dan meneruskan paket data ke perangkat tujuan spesifik berdasarkan MAC Address (pada Layer 2 OSI) atau IP Address (pada Switch Layer 3).',
    image:'assets/images/switch_cisco.png',
    details: [
      { title: 'Membuat VLAN', code: ['Switch(config)# vlan 10', 'Switch(config-vlan)# name Marketing', 'Switch(config)# vlan 20', 'Switch(config-vlan)# name Keuangan'] },
      { title: 'Access dan Trunk', code: ['Switch(config-if)# switchport mode access', 'Switch(config-if)# switchport access vlan 10', 'Switch(config-if)# switchport mode trunk', 'Switch(config-if)# switchport trunk allowed vlan 10,20'] },
      { title: 'Perintah Verifikasi', items: ['show vlan brief', 'show mac address-table', 'show interfaces trunk', 'show interfaces status'] }
    ], next: 'cisco-routing.html'
  },
  'cisco-routing': {
    course: 'cisco', number: '2.4', type: 'content-video', title: 'Routing Dasar',
    lead: 'Pahami connected route, static route, dynamic route, dan cara memverifikasi tabel routing.',
    heading: 'Routing menentukan jalur terbaik menuju jaringan tujuan.',
    text: 'Routing dasar adalah proses mengarahkan paket data dari satu jaringan ke jaringan lain yang berbeda subnet menggunakan router atau Switch Layer 3 berdasarkan peta rute yang tersimpan dalam routing table. Untuk melakukan pengarahan rute ini, administrator jaringan dapat menggunakan dua metode utama, yaitu static routing yang dikonfigurasi secara manual untuk jaringan skala kecil yang membutuhkan kontrol penuh, atau dynamic routing yang menggunakan protokol seperti OSPF atau EIGRP untuk memperbarui jalur rute secara otomatis jika terjadi perubahan topologi jaringan.',
    details: [
      { title: 'Static dan Default Route', code: ['Router(config)# ip route [jaringan-tujuan] [subnet-mask] [next-hop]', 'Router(config)# ip route 0.0.0.0 0.0.0.0 [next-hop]'] },
      { title: 'Dynamic Routing', items: ['RIP menggunakan hop count', 'EIGRP menggunakan metric komposit', 'OSPF berbasis link state dan area', 'BGP digunakan untuk routing antar-ISP'] },
      { title: 'Verifikasi Routing', items: ['show ip route', 'show ip route static', 'show ip protocols', 'traceroute [ip-tujuan]'] }
    ],
    video: 'assets/video/cisco.mp4', videoTitle: 'Video Cisco Networking', next: 'latihan-cisco.html'
  },
  'cisco-latihan': {
    course: 'cisco', number: '2.5', type: 'practice', title: 'Latihan Cisco Networking',
    lead: 'Jawab lima soal tentang router, switch, VLAN, dan routing berdasarkan materi Cisco.',
    questions: [
      {
        prompt: 'Berdasarkan layer OSI, router bekerja di layer berapa dan bagaimana forwarding-nya dibandingkan switch?',
        options: ['Router bekerja di Layer 3 berdasarkan alamat IP; switch bekerja di Layer 2 berdasarkan MAC address', 'Router bekerja di Layer 2 berdasarkan MAC address; switch bekerja di Layer 3 berdasarkan IP address', 'Router dan switch sama-sama bekerja di Layer 3 berdasarkan IP address', 'Router bekerja di Layer 1 dan switch bekerja di Layer 4'],
        answer: 0,
        explanation: 'Router bekerja pada Layer 3 menggunakan IP address, sedangkan switch bekerja pada Layer 2 menggunakan MAC address.'
      },
      {
        prompt: 'Konfigurasi mana yang benar untuk hostname Router-Cabang, IP 172.16.1.1/24 pada GigabitEthernet0/0, dan enable secret latihan123?',
        options: ['hostname Router-Cabang\ninterface GigabitEthernet0/0\nip address 172.16.1.1 255.255.255.0\nno shutdown\nenable secret latihan123', 'name Router-Cabang\ninterface Gi0/0\nip addr 172.16.1.1/24\nsecret enable latihan123', 'hostname Router-Cabang\nip address GigabitEthernet0/0 172.16.1.1 255.255.255.0\nenable password latihan123', 'hostname Router-Cabang\ninterface GigabitEthernet0/0\nip address 172.16.1.1/24\nshutdown\nenable secret latihan123'],
        answer: 0,
        explanation: 'Cisco IOS memerlukan konfigurasi pada interface, subnet mask, no shutdown, dan enable secret dari global configuration.'
      },
      {
        prompt: 'Konfigurasi mana yang benar untuk VLAN 10 Guru, VLAN 20 Siswa, Fa0/2 di VLAN 10, dan Fa0/3 di VLAN 20?',
        options: ['vlan 10\nname Guru\nvlan 20\nname Siswa\ninterface FastEthernet0/2\nswitchport mode access\nswitchport access vlan 10\ninterface FastEthernet0/3\nswitchport mode access\nswitchport access vlan 20', 'vlan Guru 10\nvlan Siswa 20\ninterface FastEthernet0/2\nvlan access 10\ninterface FastEthernet0/3\nvlan access 20', 'interface FastEthernet0/2\nswitchport access vlan 10\ninterface FastEthernet0/3\nswitchport access vlan 20\n(tanpa membuat VLAN terlebih dahulu)', 'vlan 10 name Guru vlan 20 name Siswa\nswitchport trunk vlan 10,20 pada FastEthernet0/2 dan 0/3'],
        answer: 0,
        explanation: 'VLAN harus dibuat terlebih dahulu, lalu setiap port diatur sebagai access port dan ditempatkan pada VLAN yang sesuai.'
      },
      {
        prompt: 'Perintah static route mana yang benar untuk menghubungkan 192.168.10.0/24 dan 192.168.20.0/24 melalui link 172.16.0.0/30?',
        options: ['ip route 192.168.10.0 255.255.255.0 172.16.0.2\nip route 192.168.20.0 255.255.255.0 172.16.0.1', 'route static 192.168.10.0/24 via 172.16.0.2\nroute static 192.168.20.0/24 via 172.16.0.1', 'ip route 172.16.0.2 255.255.255.0 192.168.10.0\nip route 172.16.0.1 255.255.255.0 192.168.20.0', 'ip static-route 192.168.10.0 192.168.20.0 172.16.0.0/30'],
        answer: 0,
        explanation: 'Format static route Cisco IOS adalah ip route, diikuti network tujuan, subnet mask, dan next-hop.'
      },
      {
        prompt: 'Kapan static routing sebaiknya digunakan dibandingkan dynamic routing?',
        options: ['Static routing untuk jaringan kecil dan stabil; dynamic routing untuk jaringan besar dan sering berubah', 'Static routing selalu menyesuaikan perubahan topologi secara otomatis', 'Dynamic routing hanya digunakan pada jaringan dengan satu router', 'Keduanya selalu memiliki performa identik pada semua jaringan'],
        answer: 0,
        explanation: 'Static routing mudah dikontrol pada jaringan kecil, sedangkan dynamic routing lebih efisien untuk jaringan besar dan berubah-ubah.'
      }
    ], next: 'mikrotik.html'
  },
  'mikrotik-pengenalan': {
    course: 'mikrotik', number: '3.1', type: 'content', title: 'Pengenalan MikroTik',
    lead: 'Mengenal perangkat MikroTik, RouterBOARD, RouterOS, dan pilihan akses konfigurasinya.',
    heading: 'MikroTik menyediakan perangkat keras dan sistem operasi jaringan.',
    text: 'MikroTik berasal dari Latvia dan banyak digunakan oleh ISP, sekolah, kantor, serta warnet karena menyediakan routing, firewall, bandwidth management, hotspot, VPN, dan wireless.',
    image: 'assets/images/mikrotikalat.png',  
    details: [
      { title: 'Dua Komponen Utama', items: ['RouterOS adalah sistem operasi berbasis Linux untuk menjalankan fungsi jaringan', 'RouterBOARD adalah perangkat keras MikroTik yang telah dilengkapi RouterOS'] },
      { title: 'Cara Mengakses MikroTik', items: ['Winbox melalui antarmuka grafis', 'Webfig melalui browser', 'CLI melalui Terminal, SSH, atau Telnet', 'MikroTik App melalui Android atau iOS'] }
    ], next: 'mikrotik-winbox.html'
  },
  'mikrotik-winbox': {
    course: 'mikrotik', number: '3.2', type: 'content', title: 'Winbox',
    lead: 'Pelajari login, antarmuka, menu penting, dan konfigurasi dasar MikroTik melalui Winbox.',
    heading: 'Winbox adalah antarmuka grafis ringan untuk RouterOS.',
    text: 'Winbox menggunakan port TCP 8291 dan dapat menemukan perangkat melalui MAC address, sehingga cocok untuk mengonfigurasi perangkat baru yang belum memiliki alamat IP.',
    image: 'assets/images/winbox.png', 
    details: [
      { title: 'Login ke Winbox', items: ['Hubungkan komputer ke ether2 sampai ether5', 'Buka Winbox dan pilih tab Neighbors', 'Pilih MAC address perangkat', 'Gunakan login admin dan password awal yang kosong', 'Klik Connect'] },
      { title: 'Menu Penting', items: ['Interfaces untuk interface fisik dan virtual', 'IP > Addresses untuk alamat IP', 'IP > DHCP Server untuk layanan DHCP', 'IP > Firewall untuk NAT dan keamanan', 'IP > Routes untuk tabel routing', 'System > Identity untuk nama perangkat'] },
      { title: 'Konfigurasi Dasar', items: ['Pasang 192.168.10.1/24 pada ether2', 'Aktifkan DHCP Server melalui DHCP Setup', 'Buat NAT srcnat dengan action masquerade pada ether1', 'Gunakan Files atau System > Backup untuk mencadangkan konfigurasi'] }
    ], next: 'mikrotik-routeros.html'
  },
  'mikrotik-routeros': {
    course: 'mikrotik', number: '3.3', type: 'content-video', title: 'RouterOS',
    lead: 'Pelajari akses Terminal, perintah dasar, dan konfigurasi jaringan melalui CLI RouterOS.',
    heading: 'RouterOS mengelola routing, firewall, DHCP, NAT, VPN, dan wireless.',
    text: 'CLI RouterOS dapat diakses melalui New Terminal di Winbox, SSH port 22, Telnet port 23, atau console pada RouterBOARD tertentu.',
    image: 'assets/images/routeros.png', 
    details: [
      { title: 'Perintah Dasar', code: ['/interface print', '/ip address print', '/ip route print', '/system identity print', '/ping 8.8.8.8', '/export'] },
      { title: 'IP, Gateway, dan DNS', code: ['/ip address add address=192.168.10.1/24 interface=ether2', '/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1', '/ip dns set servers=8.8.8.8,8.8.4.4 allow-remote-requests=yes'] },
      { title: 'NAT dan DHCP', code: ['/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade', '/ip pool add name=pool-client ranges=192.168.10.10-192.168.10.100', '/ip dhcp-server add name=dhcp1 interface=ether2 address-pool=pool-client', '/export file=backup-konfigurasi'] }
    ],
    video: 'assets/video/mikrotik.mp4', videoTitle: 'Video Praktik MikroTik', next: 'latihan-mikrotik.html'
  },
  'mikrotik-latihan': {
    course: 'mikrotik', number: '3.4', type: 'practice', title: 'Latihan MikroTik',
    lead: 'Pilih satu jawaban yang paling tepat berdasarkan materi Winbox dan RouterOS.',
    questions: [
      {
        prompt: 'Bagaimana cara masuk ke MikroTik melalui Winbox menggunakan MAC address?',
        options: [
          'Buka Neighbors, pilih MAC address perangkat, masukkan data login, lalu klik Connect',
          'Buka IP > Routes, masukkan MAC address sebagai gateway, lalu klik Apply',
          'Buka New Terminal, ketik MAC address, lalu tekan Enter',
          'Buka System > Identity, masukkan MAC address, lalu klik Connect'
        ],
        answer: 0
      },
      {
        prompt: 'Menu Winbox yang digunakan untuk mengubah nama identitas perangkat adalah...',
        options: ['Interfaces > Ethernet', 'IP > Addresses', 'System > Identity', 'Tools > Profile'],
        answer: 2
      },
      {
        prompt: 'Langkah yang tepat untuk memasang IP 192.168.100.1/24 pada ether2 melalui Winbox adalah...',
        options: [
          'IP > Addresses > tambah alamat 192.168.100.1/24 > pilih interface ether2',
          'IP > DNS > masukkan 192.168.100.1/24 > pilih interface ether2',
          'Interfaces > ether2 > ubah MAC address menjadi 192.168.100.1/24',
          'System > Users > tambah pengguna 192.168.100.1/24 pada ether2'
        ],
        answer: 0
      },
      {
        prompt: 'Fitur Winbox yang memandu konfigurasi DHCP Server secara bertahap adalah...',
        options: ['Quick Set pada menu System', 'DHCP Setup pada IP > DHCP Server', 'Packet Sniffer pada menu Tools', 'Neighbor Discovery pada menu IP'],
        answer: 1
      },
      {
        prompt: 'Konfigurasi apa yang diperlukan agar client dapat menuju internet melalui MikroTik?',
        options: [
          'Default route menuju gateway ISP dan NAT srcnat dengan aksi masquerade',
          'Bridge tanpa IP address dan menonaktifkan seluruh route',
          'DHCP Client pada ether2 tanpa default route dan NAT',
          'Mengganti Identity router dan mengaktifkan Neighbor Discovery'
        ],
        answer: 0
      },
      {
        prompt: 'Rangkaian perintah CLI RouterOS mana yang benar untuk IP ether2, default route, dan NAT masquerade?',
        options: [
          '/ip address add address=192.168.100.1/24 interface=ether2\n/ip route add dst-address=0.0.0.0/0 gateway=192.168.1.1\n/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade',
          '/interface add address=192.168.100.1/24 port=ether2\n/ip gateway set 192.168.1.1\n/firewall enable nat',
          '/ip dns add address=192.168.100.1/24 interface=ether2\n/ip route print gateway=192.168.1.1\n/ip firewall filter add action=masquerade',
          '/system identity set name=192.168.100.1/24\n/ip route remove 0.0.0.0/0\n/ip firewall nat disable'
        ],
        answer: 0
      }
    ], next: 'quiz.html'
  }
};

const courses = [
  { id: 'pengantar', number: '01', title: 'Pengantar Jaringan', topicCount: 2, items: [
    ['pengantar-konsep', 'Konsep Dasar Jaringan', 'materi.html'],
    ['pengantar-topologi', 'Jenis Topologi Jaringan', 'topologi.html'],
    ['pengantar-latihan', 'Latihan Mandiri', 'latihan-pengantar.html']
  ]},
  { id: 'cisco', number: '02', title: 'Cisco Networking', topicCount: 4, items: [
    ['cisco-pengenalan', 'Pengenalan Perangkat Cisco', 'cisco.html'],
    ['cisco-router', 'Router Cisco', 'cisco-router.html'],
    ['cisco-switch', 'Switch Cisco', 'cisco-switch.html'],
    ['cisco-routing', 'Routing Dasar', 'cisco-routing.html'],
    ['cisco-latihan', 'Latihan Mandiri', 'latihan-cisco.html']
  ]},
  { id: 'mikrotik', number: '03', title: 'MikroTik', topicCount: 3, items: [
    ['mikrotik-pengenalan', 'Pengenalan MikroTik', 'mikrotik.html'],
    ['mikrotik-winbox', 'Winbox', 'mikrotik-winbox.html'],
    ['mikrotik-routeros', 'RouterOS', 'mikrotik-routeros.html'],
    ['mikrotik-latihan', 'Latihan Mandiri', 'latihan-mikrotik.html']
  ]}
];

const requiredLessonIds = courses.flatMap((course) => course.items.map((item) => item[0]));

function readProgress() {
  const saved = NetrivoSession.read(NETRIVO_PROGRESS_KEY, []);
  return new Set(Array.isArray(saved) ? saved : []);
}

function completeLesson(id) {
  const progress = readProgress();
  progress.add(id);
  NetrivoSession.write(NETRIVO_PROGRESS_KEY, [...progress]);
}

function isLessonUnlocked(course, index, progress) {
  return index === 0 || course.items.slice(0, index).every(([stepId]) => progress.has(stepId));
}

function renderSidebar(activeId, progress) {
  const course = courses.find((item) => item.id === lessons[activeId].course);
  const courseLessonIds = course.items.map((item) => item[0]);
  const completed = courseLessonIds.filter((id) => progress.has(id)).length;
  const percent = Math.round((completed / courseLessonIds.length) * 100);
  const links = course.items.map(([id, title, href], index) => {
    const state = progress.has(id) ? ' completed' : '';
    const typeClass = lessons[id].type === 'practice' ? ' practice-step' : lessons[id].type === 'video' ? ' video-step' : '';
    const locked = !isLessonUnlocked(course, index, progress);
    return `<a class="${id === activeId ? 'active' : ''}${state}${typeClass}${locked ? ' locked' : ''}" href="${locked ? '#' : href}"${locked ? ' aria-disabled="true" title="Selesaikan submateri sebelumnya"' : ''}>${title}</a>`;
  }).join('');
  const currentGroup = `<section class="module-course-group is-active">
    <div class="module-course-title"><strong>${course.title}</strong></div>
    <div class="module-subtopics">${links}</div>
  </section>`;
  const railSteps = course.items.map(([stepId, title, href], index) => {
    const isCompleted = progress.has(stepId);
    const isActive = stepId === activeId;
    const locked = !isLessonUnlocked(course, index, progress);
    const label = locked ? `${title} - selesaikan submateri sebelumnya` : title;
    return `<a class="module-rail-step${isCompleted ? ' completed' : ''}${isActive ? ' active' : ''}${locked ? ' locked' : ''}" href="${locked ? '#' : href}" title="${label}" aria-label="${label}"${locked ? ' aria-disabled="true"' : ''}${isActive ? ' aria-current="page"' : ''}><span aria-hidden="true">${isCompleted ? '&#10003;' : ''}</span></a>`;
  }).join('');

  return `<header class="module-topbar"><a class="module-dashboard-link" href="index.html"><span aria-hidden="true">&#8592;</span><strong>Kembali ke dashboard</strong></a></header>
  <aside class="module-sidebar">
    <div class="module-sidebar-head">
      <div class="module-brand" aria-label="Netrivo">
        <img class="module-logo-expanded" src="assets/images/DESAIN GRAFIS logo 1.png" alt="Netrivo" />
        <img class="module-logo-collapsed" src="assets/images/DESAIN GRAFIS logo 2.png" alt="Netrivo" />
      </div>
      <button class="module-sidebar-toggle" type="button" aria-label="Tutup navigasi" aria-expanded="true" title="Tutup navigasi"><span aria-hidden="true">&#8249;</span><img src="assets/images/DESAIN GRAFIS logo 2.png" alt="" aria-hidden="true" /></button>
    </div>
    <nav class="module-rail-progress" aria-label="Progres submateri">${railSteps}</nav>
    <section class="course-summary" aria-label="Progres materi"><span>Progres Belajar</span><h2>${course.title}</h2><div class="summary-progress"><i style="width:${percent}%"></i></div><div class="summary-meta"><span>${completed} / ${courseLessonIds.length} langkah</span><strong>${percent}%</strong></div></section>
    <div class="module-tabs"><span class="active">Daftar Submateri</span><span>Progres ${percent}%</span></div>
    <nav class="module-list module-curriculum" aria-label="Alur ${course.title}"><p class="module-group">Alur Materi</p>${currentGroup}</nav>
  </aside>`;
}

function usesArticleLayout(lesson, id) {
  return lesson.type !== 'practice' && (id === 'pengantar-konsep' || lesson.course === 'cisco' || lesson.course === 'mikrotik');
}

function renderContent(lesson, id, progress) {
  if (lesson.type === 'practice') {
    const compactCiscoIntro = id === 'cisco-latihan';
    const practiceIntro = `<div class="lesson-reading-intro">${compactCiscoIntro ? '' : `<span>Latihan Materi ${lesson.number.charAt(0)}</span>`}<h2>${lesson.title}</h2>${compactCiscoIntro ? '' : `<p>${lesson.lead}</p>`}</div>`;
    if (lesson.questions) {
      const questions = lesson.questions.map((question, questionIndex) => {
        const options = question.options.map((option, optionIndex) => `<button type="button" data-multi-option="${optionIndex}" data-question-index="${questionIndex}"><strong>${String.fromCharCode(65 + optionIndex)}.</strong><span>${option}</span></button>`).join('');
        return `<section class="practice-question-block"><span class="question-tag">Soal ${questionIndex + 1} dari ${lesson.questions.length}</span><h3>${question.prompt}</h3><div class="exercise-options">${options}</div><p class="question-feedback" data-question-feedback="${questionIndex}" aria-live="polite"></p></section>`;
      }).join('');
      return `<section class="lesson-reading-card lesson-practice">${practiceIntro}<div class="practice-content"><div class="practice-question-list">${questions}</div><p class="practice-feedback" data-practice-feedback aria-live="polite">Jawab semua soal dengan benar untuk menyelesaikan latihan.</p></div></section>`;
    }
    if (lesson.tasks) {
      const tasks = lesson.tasks.map((task, index) => `<label class="practice-task"><span>${index + 1}. ${task}</span><textarea rows="4" data-practice-task="${index}" placeholder="Tulis jawabanmu di sini..."></textarea></label>`).join('');
      return `<section class="lesson-reading-card lesson-practice">${practiceIntro}<div class="practice-content"><div class="practice-task-list">${tasks}</div><p class="practice-feedback" data-practice-feedback aria-live="polite">Isi seluruh jawaban untuk menyelesaikan latihan.</p></div></section>`;
    }
    const options = lesson.options.map((option, index) => `<button type="button" data-practice-option="${index}">${String.fromCharCode(65 + index)}. ${option}</button>`).join('');
    return `<section class="lesson-reading-card lesson-practice">${practiceIntro}<div class="practice-content"><span class="question-tag">Pertanyaan latihan</span><h3>${lesson.question}</h3><div class="exercise-options">${options}</div><p class="practice-feedback" data-practice-feedback aria-live="polite"></p></div></section>`;
  }
  const points = (lesson.points || []).map((point, index) => `<div><strong>0${index + 1}</strong><span>${point}</span></div>`).join('');
  const pointSection = points ? `<div class="reading-points">${points}</div>` : '';
  const materialImage = lesson.image ? `<figure class="lesson-material-figure"><img src="${lesson.image}" alt="${lesson.imageAlt || lesson.title}" /></figure>` : '';
  const details = (lesson.details || []).map((detail) => {
    const items = detail.items ? `<ul>${detail.items.map((item) => `<li>${item}</li>`).join('')}</ul>` : '';
    const code = detail.code ? `<pre><code>${detail.code.join('\n')}</code></pre>` : '';
    const headingTag = usesArticleLayout(lesson, id) ? 'h2' : 'h3';
    return `<section class="lesson-detail-card"><${headingTag}>${detail.title}</${headingTag}>${items}${code}</section>`;
  }).join('');
  const detailSection = details ? `<div class="lesson-details">${details}</div>` : '';
  const article = usesArticleLayout(lesson, id)
    ? `<article class="lesson-reading-card lesson-reading-flow"><div class="lesson-reading-body"><p>${lesson.text}</p>${materialImage}${pointSection}${detailSection}</div></article>`
    : `<article class="lesson-reading-card lesson-reading-flow"><div class="lesson-reading-intro"><h2>${lesson.heading}</h2><p>${lesson.lead}</p></div><div class="lesson-reading-body"><section><h3>${lesson.title}</h3><p>${lesson.text}</p></section>${materialImage}${pointSection}${detailSection}</div></article>`;
  if (!lesson.video) return article;
  const video = `<section class="lesson-video-section embedded-lesson-video" id="materi-video"><div class="lesson-video-copy"><span>Video Materi</span><h2>${lesson.videoTitle}</h2><p>Tonton video sampai selesai untuk menuntaskan materi ini dan membuka langkah berikutnya.</p></div><div class="lesson-video-frame"><video controls playsinline preload="metadata" data-lesson-video><source src="${lesson.video}" type="video/mp4" />Browser kamu tidak mendukung pemutar video.</video></div></section>`;
  return article + video;
}

function initLessonPage() {
  const id = document.body.dataset.lesson;
  const lesson = lessons[id];
  if (!lesson) return;
  const progress = readProgress();
  const activeCourse = courses.find((course) => course.id === lesson.course);
  const activeIndex = activeCourse.items.findIndex(([stepId]) => stepId === id);
  if (!isLessonUnlocked(activeCourse, activeIndex, progress)) {
    const firstIncomplete = activeCourse.items.findIndex(([stepId]) => !progress.has(stepId));
    window.location.replace(activeCourse.items[Math.max(0, firstIncomplete)][2]);
    return;
  }
  document.title = `${lesson.title} - Netrivo`;
  const visited = NetrivoSession.read('netrivoVisitedLessons', []);
  NetrivoSession.write('netrivoVisitedLessons', [...new Set([...(Array.isArray(visited) ? visited : []), id])]);
  NetrivoSession.write('netrivoCurrentLesson', id);
  document.body.classList.toggle('lesson-article', usesArticleLayout(lesson, id));
  const pageHeader = id === 'cisco-latihan' ? '' : `<header class="module-content-head"><h1>${lesson.title}</h1>${usesArticleLayout(lesson, id) ? '' : `<p>${lesson.lead}</p>`}</header>`;
  document.body.innerHTML = `<div class="module-shell">${renderSidebar(id, progress)}<main class="module-main"><div class="module-content">${pageHeader}${renderContent(lesson, id, progress)}<div class="module-next-step"><button type="button" data-complete-lesson ${(lesson.type === 'practice' || lesson.video || lesson.type === 'content') && !progress.has(id) ? 'disabled' : ''}>${progress.has(id) ? 'Selanjutnya' : lesson.type === 'practice' ? 'Jawab dengan benar' : lesson.video ? 'Tonton video sampai selesai' : 'Baca sampai selesai'}</button></div></div></main></div>`;

  const completeButton = document.querySelector('[data-complete-lesson]');
  const goNext = () => { window.location.href = lesson.next; };
  const moduleShell = document.querySelector('.module-shell');
  const sidebarToggle = document.querySelector('.module-sidebar-toggle');
  const setSidebarState = (collapsed) => {
    moduleShell.classList.toggle('is-sidebar-collapsed', collapsed);
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Buka navigasi' : 'Tutup navigasi');
    sidebarToggle.title = collapsed ? 'Buka navigasi' : 'Tutup navigasi';
    sidebarToggle.querySelector('span').textContent = collapsed ? '\u203a' : '\u2039';
  };

  let sidebarCollapsed = false;
  try {
    sidebarCollapsed = NetrivoSession.read('netrivoSidebarCollapsed', false) === true;
  } catch {
    sidebarCollapsed = false;
  }
  setSidebarState(sidebarCollapsed);
  sidebarToggle.addEventListener('click', () => {
    sidebarCollapsed = !moduleShell.classList.contains('is-sidebar-collapsed');
    setSidebarState(sidebarCollapsed);
    try {
      NetrivoSession.write('netrivoSidebarCollapsed', sidebarCollapsed);
    } catch {
      // The sidebar still works when browser storage is unavailable.
    }
  });

  document.querySelectorAll('.module-list a.locked, .module-rail-step.locked').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });

  if (progress.has(id)) completeButton.addEventListener('click', goNext);

  if (lesson.type === 'content' && !progress.has(id)) {
    const readingKey = `netrivoRead:${id}`;
    const nextStep = document.querySelector('.module-next-step');
    const unlockNextButton = () => {
      NetrivoSession.write(readingKey, true);
      completeButton.disabled = false;
      completeButton.textContent = 'Selanjutnya';
    };
    if (NetrivoSession.read(readingKey, false)) {
      unlockNextButton();
    } else if ('IntersectionObserver' in window) {
      const readingObserver = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        unlockNextButton();
        readingObserver.disconnect();
      }, { threshold: 0.7 });
      readingObserver.observe(nextStep);
    } else {
      unlockNextButton();
    }
    completeButton.addEventListener('click', () => { completeLesson(id); goNext(); });
  }

  if (lesson.video && !progress.has(id)) {
    const video = document.querySelector('[data-lesson-video]');
    const videoKey = `netrivoVideo:${id}`;
    const savedVideo = NetrivoSession.read(videoKey, {});
    video.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(savedVideo.time)) video.currentTime = Math.min(savedVideo.time, video.duration || 0);
    }, { once: true });
    video.addEventListener('timeupdate', () => {
      NetrivoSession.write(videoKey, { time: video.currentTime, ended: savedVideo.ended === true });
    });
    const unlockVideo = () => {
      savedVideo.ended = true;
      NetrivoSession.write(videoKey, { time: video.currentTime, ended: true });
      completeButton.disabled = false;
      completeButton.textContent = 'Selanjutnya';
      completeButton.addEventListener('click', () => { completeLesson(id); goNext(); }, { once: true });
    };
    video.addEventListener('ended', unlockVideo, { once: true });
    if (savedVideo.ended) unlockVideo();
  }

  if (lesson.type === 'practice') {
    const feedback = document.querySelector('[data-practice-feedback]');
    const multiOptions = Array.from(document.querySelectorAll('[data-multi-option]'));
    if (multiOptions.length) {
      const practiceKey = `netrivoPractice:${id}`;
      const savedPractice = NetrivoSession.read(practiceKey, {});
      const selectedAnswers = lesson.questions.map((question, index) => {
        const answer = savedPractice.answers?.[index];
        return Number.isInteger(answer) && answer >= 0 && answer < question.options.length ? answer : null;
      });
      const updatePractice = () => {
        multiOptions.forEach((option) => {
          const selected = selectedAnswers[Number(option.dataset.questionIndex)];
          option.disabled = progress.has(id) || selected !== null;
          option.classList.toggle('selected-choice', selected === Number(option.dataset.multiOption));
        });
        document.querySelectorAll('[data-question-feedback]').forEach((item, index) => {
          item.textContent = selectedAnswers[index] === null ? '' : 'Jawaban sudah dipilih.';
        });
        const answeredCount = selectedAnswers.filter((answer) => answer !== null).length;
        const correctCount = selectedAnswers.filter((answer, index) => answer === lesson.questions[index].answer).length;
        const finished = answeredCount === lesson.questions.length;
        const passed = finished && correctCount >= Math.ceil(lesson.questions.length * .75);
        NetrivoSession.write(practiceKey, { answers: selectedAnswers, correct: correctCount,
          score: Math.round(correctCount / lesson.questions.length * 100),
          status: progress.has(id) ? 'completed' : passed ? 'passed' : finished ? 'retry' : 'in-progress' });
        completeButton.disabled = !progress.has(id) && !finished;
        completeButton.dataset.action = passed ? 'complete' : finished ? 'retry' : '';
        completeButton.textContent = progress.has(id) || passed ? 'Selanjutnya' : finished ? 'Ulangi latihan' : `${answeredCount} / ${lesson.questions.length} dijawab`;
        feedback.textContent = finished
          ? `${correctCount} dari ${lesson.questions.length} jawaban benar. ${passed ? 'Latihan berhasil diselesaikan.' : 'Kamu perlu mengulangi latihan.'}`
          : 'Pilih satu jawaban pada setiap soal. Jawaban yang dipilih tidak dapat diubah.';
      };
      const resetPractice = (shouldScroll = false) => {
        selectedAnswers.fill(null);
        updatePractice();
        if (shouldScroll) document.querySelector('.practice-question-block')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      multiOptions.forEach((button) => {
        button.addEventListener('click', () => {
          const questionIndex = Number(button.dataset.questionIndex);
          const optionIndex = Number(button.dataset.multiOption);
          if (progress.has(id) || selectedAnswers[questionIndex] !== null) return;
          selectedAnswers[questionIndex] = optionIndex;
          updatePractice();
        });
      });
      completeButton.addEventListener('click', () => {
        if (progress.has(id) || completeButton.disabled) return;
        if (completeButton.dataset.action === 'retry') {
          resetPractice(true);
          return;
        }
        if (completeButton.dataset.action !== 'complete') return;
        completeLesson(id);
        goNext();
      });
      updatePractice();
      return;
    }
    const taskInputs = Array.from(document.querySelectorAll('[data-practice-task]'));
    if (taskInputs.length) {
      const updateTasks = () => {
        const complete = taskInputs.every((input) => input.value.trim().length >= 10);
        completeButton.disabled = !complete;
        completeButton.textContent = complete ? 'Selanjutnya' : 'Lengkapi semua jawaban';
        feedback.textContent = complete ? 'Semua jawaban sudah terisi. Kamu dapat menyelesaikan latihan.' : 'Isi seluruh jawaban dengan minimal 10 karakter.';
      };
      taskInputs.forEach((input) => input.addEventListener('input', updateTasks));
      completeButton.addEventListener('click', () => {
        if (completeButton.disabled) return;
        completeLesson(id);
        goNext();
      });
      updateTasks();
      return;
    }
    document.querySelectorAll('[data-practice-option]').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-practice-option]').forEach((option) => option.classList.remove('selected', 'wrong'));
        const correct = Number(button.dataset.practiceOption) === lesson.answer;
        button.classList.add(correct ? 'selected' : 'wrong');
        feedback.textContent = correct ? 'Jawaban benar. Latihan materi ini selesai.' : 'Jawaban belum tepat. Coba periksa kembali materinya.';
        if (!correct) return;
        completeButton.disabled = false;
        completeButton.textContent = 'Selanjutnya';
        if (completeButton.dataset.ready !== 'true') {
          completeButton.dataset.ready = 'true';
          completeButton.addEventListener('click', () => { completeLesson(id); goNext(); }, { once: true });
        }
      });
    });
  }

  document.querySelectorAll('.evaluation-link.is-locked').forEach((link) => link.addEventListener('click', (event) => event.preventDefault()));

  if (window.location.hash) {
    window.requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView());
  }
}

initLessonPage();
