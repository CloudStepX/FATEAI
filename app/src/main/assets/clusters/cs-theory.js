(window.SEED=window.SEED||{})["CS Theory"]={
 "Big-O and complexity": [
  {
   "t": "Big-O notation describes how an algorithm's running time or memory use grows as the input size n grows. It ignores constants and small terms and usually states the worst case, so it is an upper bound on growth."
  },
  {
   "t": "Common growth rates from fastest to slowest: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n), O(n^2) quadratic, O(2^n) exponential, O(n!) factorial."
  },
  {
   "t": "O(1) constant time means the work does not depend on input size. Reading an array element by index and an average hash table lookup are O(1)."
  },
  {
   "t": "O(log n) means each step cuts the problem down by a constant fraction. Binary search on a sorted list is O(log n): doubling the input adds just one step, and 1,000,000 items need only about 20 steps."
  },
  {
   "t": "O(n) linear time means one pass over the data, like finding the largest number in an unsorted list. Doubling the input doubles the work."
  },
  {
   "t": "O(n log n) is the cost of efficient sorting. Merge sort and heap sort are always O(n log n), and quicksort is O(n log n) on average."
  },
  {
   "t": "O(n^2) quadratic time usually comes from a loop inside a loop over the same data. Bubble sort, selection sort and insertion sort (worst case) are O(n^2). Making the input 10 times bigger makes the work about 100 times bigger."
  },
  {
   "t": "O(2^n) exponential time means every extra item doubles the work, as when brute force tries every subset. It becomes unusable at around 40 to 50 items. O(n!) is even worse and appears when trying every ordering."
  },
  {
   "t": "To work out Big-O, drop constants and lower terms: 3n^2 + 5n + 20 is O(n^2), because for large n the n^2 term dominates."
  },
  {
   "t": "Steps one after another add, nested steps multiply. Two separate loops over n items are O(n) + O(n) = O(n). A loop over n with a loop over m inside is O(n times m)."
  },
  {
   "t": "Best, average and worst case can differ. Linear search takes 1 step at best and n steps at worst. Quicksort is O(n log n) on average but O(n^2) in the worst case."
  },
  {
   "t": "Big-O is an upper bound, Big-Omega is a lower bound, and Big-Theta is a tight bound that is both. In everyday talk people say Big-O when they really mean Big-Theta."
  },
  {
   "t": "Space complexity measures extra memory used as input grows. Merge sort needs O(n) extra space, while in-place sorts like heap sort need O(1) extra space."
  },
  {
   "t": "Amortized cost averages an occasional expensive step over many cheap ones. Appending to a dynamic array is O(1) amortized because the array doubles its capacity only now and then."
  },
  {
   "t": "Typical costs: array access by index O(1), search in an unsorted array O(n), insert in the middle of an array O(n). Linked list access by position O(n), insert after a known node O(1). Hash table lookup O(1) on average and O(n) worst case. Balanced binary search tree search O(log n). Heap insert O(log n) and read the minimum O(1)."
  },
  {
   "t": "To find Big-O of code, count how many times the innermost statement runs. A loop that halves the remaining range each time is O(log n). For recursion write a recurrence: T(n) = 2T(n/2) + n solves to O(n log n), which is merge sort."
  },
  {
   "t": "Naive recursive Fibonacci is O(2^n) because it recomputes the same values again and again. With memoization (saving results) it becomes O(n)."
  },
  {
   "t": "P is the set of problems that can be solved in polynomial time. NP is the set of problems whose answers can be checked in polynomial time. Whether P equals NP is an open question and one of the Millennium Prize problems."
  },
  {
   "t": "NP-complete problems are the hardest in NP: if any one of them could be solved quickly, all of NP could be. Examples are Boolean satisfiability (SAT), the travelling salesman decision problem and subset sum. Real programs use heuristics or approximations for them."
  },
  {
   "t": "The halting problem, proved by Alan Turing in 1936, shows that no program can decide for every possible program and input whether it will finish or run forever. Some questions about programs are undecidable."
  }
 ],
 "Algorithm ideas": [
  {
   "t": "Divide and conquer splits a problem into smaller copies of itself, solves them and combines the answers. Merge sort, quicksort and binary search work this way."
  },
  {
   "t": "Dynamic programming solves overlapping subproblems once and stores the results, so the work is not repeated. Examples are Fibonacci with memoization, shortest paths and the knapsack problem."
  },
  {
   "t": "A greedy algorithm always picks the best-looking choice right now. It is fast and gives the best answer for some problems, like making change with standard coins or Dijkstra's shortest path, but not for all problems."
  },
  {
   "t": "Recursion is a function calling itself on a smaller input. It needs a base case that stops the calls, or it runs until the call stack overflows."
  },
  {
   "t": "Breadth-first search explores a graph level by level using a queue and finds the fewest-step path. Depth-first search goes as deep as it can using a stack or recursion and then backtracks."
  },
  {
   "t": "A stable sort keeps equal items in their original order. Merge sort and insertion sort are stable, while quicksort and heap sort usually are not."
  },
  {
   "t": "A hash function turns data of any size into a fixed-size number. Hash tables use it to jump straight to a bucket. Two keys landing in the same bucket is a collision and is handled by chaining or probing."
  }
 ],
 "Computing basics": [
  {
   "t": "A bit is one binary digit, 0 or 1. A byte is 8 bits and holds 256 values (0 to 255). Kilobyte, megabyte and gigabyte are about a thousand, a million and a billion bytes."
  },
  {
   "t": "Binary is base 2. The place values are 1, 2, 4, 8, 16 and so on, so 1011 in binary is 8 + 2 + 1 = 11. Hexadecimal is base 16 and uses 0-9 and A-F, so one hex digit is exactly 4 bits and FF is 255."
  },
  {
   "t": "Two's complement is how computers store negative integers: flip all the bits of the positive number and add 1. An 8-bit signed integer ranges from -128 to 127."
  },
  {
   "t": "Floating-point numbers store a sign, an exponent and a fraction, so many decimals cannot be stored exactly. That is why 0.1 + 0.2 gives 0.30000000000000004 in most languages. Never compare floats with exact equality, and use whole cents for money."
  },
  {
   "t": "Logic gates AND, OR, NOT and XOR combine bits. Billions of tiny switches built from them make up a processor."
  },
  {
   "t": "The CPU repeats a cycle: fetch an instruction from memory, decode it, execute it. Clock speed in GHz is how many cycles happen each second, and more cores let it run several instruction streams at once."
  },
  {
   "t": "The memory hierarchy goes from small and fast to large and slow: registers, CPU cache, RAM, then storage (SSD or hard disk). Programs run faster when the data they need is already close to the CPU."
  },
  {
   "t": "RAM is fast, temporary working memory that is lost when power goes off. Storage keeps data permanently."
  },
  {
   "t": "The stack holds function calls and local variables and is cleaned up automatically when a function returns. The heap holds data that lives until freed or garbage collected, such as objects created with new."
  },
  {
   "t": "A compiler translates the whole program into machine code before it runs (C, Rust, Go). An interpreter runs the code line by line (classic Python). Many languages mix both, such as Java compiling to bytecode that a virtual machine runs."
  },
  {
   "t": "A Turing machine is a simple imagined machine with a tape, a head and a table of rules. Anything a computer can compute, a Turing machine can compute, which is the basis of computability theory."
  },
  {
   "t": "An abstraction hides detail behind a simple interface. Computers are layers of abstraction: hardware, operating system, programming language, libraries, your app."
  }
 ],
 "Operating systems": [
  {
   "t": "An operating system (OS) manages the hardware and gives programs a safe, shared way to use it. Its main jobs are running processes, managing memory, handling files and drivers for devices. Windows, macOS, Linux, Android and iOS are operating systems."
  },
  {
   "t": "The kernel is the core of the OS that runs with full hardware privileges. Programs run in user mode and ask the kernel for services through system calls, such as opening a file or sending data over the network."
  },
  {
   "t": "A process is a running program with its own memory space. A thread is a path of execution inside a process, and threads in the same process share its memory, so they are cheaper to create but can interfere with each other."
  },
  {
   "t": "The scheduler decides which process or thread gets the CPU next. Round robin gives each a short time slice in turn, and priority scheduling favors important tasks. Preemptive scheduling lets the OS interrupt a running task."
  },
  {
   "t": "A context switch saves the state of one running task and loads another. It is what makes many programs seem to run at once on a single core, and it costs a little time each switch."
  },
  {
   "t": "Virtual memory gives each process its own private address space, mapped to real RAM in fixed-size blocks called pages. When RAM is full the OS can move rarely used pages to disk (swap). Thrashing is when the system spends most of its time swapping instead of working."
  },
  {
   "t": "A page fault happens when a program touches a page that is not in RAM. The OS then loads it from disk, or stops the program if the address is invalid, which is the classic segmentation fault."
  },
  {
   "t": "A file system organizes storage into files and folders. It keeps metadata such as names, sizes and permissions, and tracks which blocks hold each file. Common ones are NTFS, FAT32, exFAT, ext4 and APFS."
  },
  {
   "t": "A deadlock happens when tasks wait on each other forever. It needs four conditions together: mutual exclusion, hold and wait, no preemption and circular wait. Removing any one prevents it."
  },
  {
   "t": "A race condition is when the result depends on the unpredictable timing of threads touching shared data. A mutex (lock) lets one thread at a time enter a critical section, and a semaphore allows a limited number of threads in."
  },
  {
   "t": "An interrupt is a signal from hardware, such as a keypress or network packet, that makes the CPU pause its work and run a handler. A timer interrupt is how the OS regains control to switch tasks."
  },
  {
   "t": "The boot process: firmware (BIOS or UEFI) tests the hardware, a bootloader loads the kernel, the kernel starts, and then the first user process launches the rest of the system."
  },
  {
   "t": "Permissions control who may read, write or run a file. On Linux and Android each file has an owner, a group and everyone else, shown like rwxr-xr--."
  },
  {
   "t": "Android is built on the Linux kernel. Each app runs in its own sandboxed process under its own user ID, and it must declare permissions in AndroidManifest.xml to use things like the camera or the internet."
  },
  {
   "t": "Device drivers are kernel code that let the OS talk to specific hardware such as a graphics card or printer."
  },
  {
   "t": "Virtualization lets one machine run several operating systems at once using a hypervisor. A container shares the host kernel and isolates just the process and its files, so it is lighter than a virtual machine."
  }
 ],
 "Networking": [
  {
   "t": "A network is devices exchanging data using agreed rules called protocols. The Internet is a network of networks that all speak the TCP/IP protocols."
  },
  {
   "t": "The TCP/IP model has four layers: link (Ethernet, Wi-Fi), internet (IP), transport (TCP, UDP) and application (HTTP, DNS, SMTP). The seven-layer OSI model splits it as physical, data link, network, transport, session, presentation and application."
  },
  {
   "t": "Data is sent as packets: small chunks, each with a header giving the source and destination address. Packets can take different routes and are put back in order at the other end. This is packet switching."
  },
  {
   "t": "An IP address is the number that identifies a device on a network. An IPv4 address is 32 bits written as four numbers from 0 to 255, like 192.168.1.10, which allows about 4.3 billion addresses. IPv6 uses 128 bits, written in hexadecimal, and was created because IPv4 addresses ran out."
  },
  {
   "t": "Private IP ranges are 10.0.0.0 to 10.255.255.255, 172.16.0.0 to 172.31.255.255 and 192.168.0.0 to 192.168.255.255. They are not routed on the public Internet. NAT in your router lets many devices share one public address."
  },
  {
   "t": "A subnet is a block of addresses. CIDR notation such as 192.168.1.0/24 says the first 24 bits are the network part, leaving 8 bits for hosts: 256 addresses, of which 254 are usable for devices."
  },
  {
   "t": "A MAC address is a 48-bit hardware address burned into a network card, used inside the local network. The IP address is where a device is on the network, and the MAC address identifies the card."
  },
  {
   "t": "A port number picks which program on a device receives the data. Common ports: 80 HTTP, 443 HTTPS, 22 SSH, 53 DNS, 25 SMTP, 21 FTP. An IP address plus a port identifies one connection endpoint."
  },
  {
   "t": "TCP is reliable: it sets up a connection, numbers the data, resends lost packets and keeps order, which suits web pages and email. UDP is fast and has no guarantees, which suits live video, voice calls and games."
  },
  {
   "t": "The TCP three-way handshake opens a connection: the client sends SYN, the server replies SYN-ACK, and the client sends ACK. After that, data can flow."
  },
  {
   "t": "A switch connects devices inside one local network and forwards frames by MAC address. A router connects different networks and forwards packets by IP address. A modem converts signals for your ISP line, and a Wi-Fi access point provides wireless links."
  },
  {
   "t": "DHCP automatically gives a device its IP address, gateway and DNS server when it joins a network. ARP finds the MAC address that goes with an IP address on the local network."
  },
  {
   "t": "Bandwidth is how much data can move per second (Mbps). Latency is the delay for one trip, measured in milliseconds. A high-bandwidth link can still feel slow if latency is high. The ping command measures round-trip latency."
  },
  {
   "t": "A firewall allows or blocks traffic by rules such as port, address and protocol. A VPN wraps your traffic in an encrypted tunnel to another server."
  },
  {
   "t": "A LAN is a local network such as your home. A WAN spans a large area and the Internet is the largest WAN. Wi-Fi is wireless Ethernet, Bluetooth is for short-range personal devices, and cellular networks (4G, 5G) connect through towers."
  }
 ],
 "How the internet works": [
  {
   "t": "The Internet is a global network of networks. Your device connects to an ISP, which connects to larger networks, joined at exchange points and carried over fiber cables, including undersea cables. The web is just one service that runs on the Internet, alongside email, messaging and streaming."
  },
  {
   "t": "DNS (Domain Name System) turns names like example.com into IP addresses. The lookup checks the browser cache, the operating system, then a resolver, which asks a root server, then the .com server, then the domain's own authoritative server, and caches the answer."
  },
  {
   "t": "A URL has parts: scheme (https), host (www.example.com), optional port, path (/page), query (?q=cats) and fragment (#top). The scheme says which protocol to use."
  },
  {
   "t": "What happens when you open a web page: the browser looks up the domain with DNS, opens a TCP connection to the server, sets up TLS encryption for https, sends an HTTP request, receives the HTML, then fetches the CSS, scripts and images it names and draws the page."
  },
  {
   "t": "HTTP is the request and response protocol of the web. A request has a method (GET to read, POST to send data, PUT to replace, DELETE to remove), a path and headers. The response has a status code, headers and a body."
  },
  {
   "t": "HTTP status codes: 200 OK, 201 Created, 301 moved permanently, 304 not modified, 400 bad request, 401 not logged in, 403 forbidden, 404 not found, 429 too many requests, 500 server error, 503 service unavailable. The first digit gives the class: 2 success, 3 redirect, 4 your error, 5 server error."
  },
  {
   "t": "HTTPS is HTTP inside TLS encryption. The server proves its identity with a certificate signed by a trusted authority, and the two sides agree on a secret key, so others on the network cannot read or change the data. The padlock means the connection is encrypted, not that the site is honest."
  },
  {
   "t": "Public-key cryptography uses a pair of keys: what one encrypts only the other can decrypt. It lets two strangers set up a secret safely. TLS uses it to agree on a fast shared key, then encrypts the data with that."
  },
  {
   "t": "A client asks and a server answers. Your browser or app is the client, and the server is a computer that listens for requests. An API is a set of URLs a program can call to get data, often returned as JSON."
  },
  {
   "t": "A CDN (content delivery network) keeps copies of files on servers around the world so they are served from a place close to you, which cuts latency. A load balancer spreads requests across many servers."
  },
  {
   "t": "Cookies are small pieces of data a site stores in your browser. They keep you logged in by sending a session ID with each request, and they can also be used for tracking. HTTP itself is stateless, which means every request stands alone."
  },
  {
   "t": "Email uses SMTP to send between servers, and IMAP or POP3 to read from your mailbox. WebSockets keep a connection open so the server can push data at any time, which is how chat and live scores work."
  },
  {
   "t": "HTTP/1.1 sends requests one at a time per connection. HTTP/2 multiplexes many requests over one connection, and HTTP/3 runs over QUIC on UDP to cut delays further."
  },
  {
   "t": "Cloud computing means renting servers, storage and services over the Internet instead of owning them. A static site is plain files served as they are, which is how GitHub Pages hosts a site for free."
  },
  {
   "t": "A web page is HTML for structure, CSS for appearance and JavaScript for behavior. The browser parses the HTML into a tree called the DOM and then draws it."
  }
 ],
 "Data formats": [
  {
   "t": "A text file stores characters. A binary file stores raw bytes meant for a program to interpret, such as images and executables. A file extension like .png is only a label, and the real format is recognised by the bytes inside, often a signature at the start."
  },
  {
   "t": "Character encoding maps characters to numbers. ASCII covers 128 characters. Unicode gives every character in every language a code point, and UTF-8 stores those code points in 1 to 4 bytes, matching ASCII for English text. UTF-8 is the standard on the web."
  },
  {
   "t": "CSV is plain text with one record per line and values separated by commas. It is simple and opens in any spreadsheet, but it has no types and values with commas must be quoted. TSV uses tabs."
  },
  {
   "t": "JSON (JavaScript Object Notation) is a text format for structured data: objects in curly braces with key-value pairs, arrays in square brackets, and values that are strings, numbers, true, false or null. Keys and strings need double quotes, and no comments or trailing commas are allowed. Most web APIs use it."
  },
  {
   "t": "XML stores data in nested tags like <name>Sam</name>. It is verbose but supports attributes, namespaces and schemas, and it is used in Android layouts, RSS feeds and SVG. HTML looks similar but is for web pages."
  },
  {
   "t": "YAML is a human-friendly format that uses indentation instead of brackets. It is common in configuration files, such as GitHub Actions workflows, but its whitespace rules are easy to break."
  },
  {
   "t": "Markdown is plain text with light marks, like # for headings, * for emphasis and - for lists, that converts to HTML. README files are usually Markdown."
  },
  {
   "t": "Base64 turns binary data into plain text using 64 safe characters, making it about a third larger. It is used to embed images in HTML and to send attachments in email. It is encoding, not encryption."
  },
  {
   "t": "PNG is lossless and supports transparency, so it suits screenshots and logos. JPEG is lossy and small, so it suits photos. GIF has 256 colors and simple animation. WebP and AVIF compress better. SVG is vector, stored as XML text, and stays sharp at any size."
  },
  {
   "t": "Lossless compression, like ZIP, PNG and FLAC, lets you rebuild the original exactly. Lossy compression, like JPEG, MP3 and most video, throws away detail people are unlikely to notice to get much smaller files."
  },
  {
   "t": "Audio formats: WAV is uncompressed, FLAC is lossless compressed, and MP3, AAC and Ogg Vorbis are lossy. A higher bitrate in kbps generally means better quality and a bigger file."
  },
  {
   "t": "A video file has a container and codecs. MP4, MKV and WebM are containers that hold video, audio and subtitles, and H.264, H.265 and AV1 are codecs that compress the video."
  },
  {
   "t": "PDF is a fixed-layout document format that looks the same everywhere. DOCX, XLSX and PPTX are zipped bundles of XML files, and an Android APK is a ZIP archive too."
  },
  {
   "t": "Dates and times: Unix time counts seconds since 1 January 1970 UTC. ISO 8601 writes dates as 2026-10-26T14:30:00Z, with year first so that sorting the text sorts the dates. Store times in UTC and convert for display."
  },
  {
   "t": "Serialization turns in-memory data into bytes or text to save or send it, and deserialization turns it back. JSON, XML and Protocol Buffers are serialization formats, and the last is compact and binary."
  },
  {
   "t": "Endianness is the byte order of multi-byte numbers. Little-endian stores the least significant byte first, as x86 and ARM usually do, and big-endian stores it last, as network protocols do."
  },
  {
   "t": "A MIME type labels content on the web, like text/html, application/json, image/png and application/pdf, and is sent in the Content-Type header."
  },
  {
   "t": "A relational database stores data in tables of rows and columns that are queried with SQL. Key-value and document databases store flexible records instead, and SQLite keeps a whole database in one file."
  }
 ]
};
