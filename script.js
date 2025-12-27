// CineBook - Frontend-only movie ticket booking (cleaned)

/* ---------- Data Structures ---------- */
class BSTNode { constructor(key,movie){ this.key=key; this.movie=movie; this.left=null; this.right=null } }
class MovieBST {
  constructor(){ this.root=null }
  insert(title,movie){ const key=title.toLowerCase(); const node=new BSTNode(key,movie); if(!this.root){ this.root=node; return } let cur=this.root; while(true){ if(key<cur.key){ if(!cur.left){cur.left=node;break} cur=cur.left } else { if(!cur.right){cur.right=node;break} cur=cur.right } } }
  inorder(){ const res=[]; (function trav(n){ if(!n) return; trav(n.left); res.push(n.movie); trav(n.right) })(this.root); return res }
  searchMatches(q){ const matches=[]; const ql=q.toLowerCase(); (function trav(n){ if(!n) return; trav(n.left); if(n.key.includes(ql)) matches.push(n.movie); trav(n.right) })(this.root); return matches }
}

class MaxHeapPQ {
  constructor(){ this.heap=[] }
  size(){ return this.heap.length }
  push(item){ this.heap.push(item); this._heapifyUp(this.heap.length-1) }
  pop(){ if(!this.size()) return null; const top=this.heap[0]; const last=this.heap.pop(); if(this.size()){ this.heap[0]=last; this._heapifyDown(0) } return top }
  peek(){ return this.heap[0] }
  _swap(i,j){ [this.heap[i],this.heap[j]]=[this.heap[j],this.heap[i]] }
  _heapifyUp(i){ while(i>0){ const p=Math.floor((i-1)/2); if(this.heap[i].priority<=this.heap[p].priority) break; this._swap(i,p); i=p } }
  _heapifyDown(i){ const n=this.size(); while(true){ let largest=i; const l=2*i+1; const r=2*i+2; if(l<n && this.heap[l].priority>this.heap[largest].priority) largest=l; if(r<n && this.heap[r].priority>this.heap[largest].priority) largest=r; if(largest===i) break; this._swap(i,largest); i=largest } }
  remove(matchFn){ for(let i=0;i<this.heap.length;i++){ if(matchFn(this.heap[i])){ const last=this.heap.pop(); if(i===this.heap.length) return true; this.heap[i]=last; this._heapifyUp(i); this._heapifyDown(i); return true } } return false }
  toArray(){ return this.heap.slice().sort((a,b)=>b.priority-a.priority) }
}

/* ---------- App Data ---------- */
// Curated trending movies (20 items) with genres
const movies = [
  { title:'The Shawshank Redemption', poster:'https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg', duration:'3h 22m', rating:'9.3', genre:'Drama' },
  { title:'The Godfather', poster:'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg', duration:'2h 55m', rating:'9.2', genre:'Crime' },
  { title:'The Dark Knight', poster:'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg', duration:'2h 32m', rating:'9.0', genre:'Action' },
  { title:'Pulp Fiction', poster:'https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg', duration:'2h 34m', rating:'8.9', genre:'Crime' },
  { title:'Forrest Gump', poster:'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg', duration:'2h 22m', rating:'8.8', genre:'Drama' },
  { title:'Inception', poster:'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg', duration:'2h 28m', rating:'8.8', genre:'Thriller' },
  { title:'Interstellar', poster:'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg', duration:'2h 49m', rating:'8.6', genre:'Sci‑Fi' },
  { title:'Parasite', poster:'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png', duration:'2h 12m', rating:'8.6', genre:'Drama' },
  { title:'Joker', poster:'https://upload.wikimedia.org/wikipedia/en/e/e1/Joker_%282019_film%29_poster.jpg', duration:'2h 2m', rating:'8.5', genre:'Drama' },
  { title:'Oppenheimer', poster:'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg', duration:'3h 0m', rating:'8.6', genre:'Drama' },
  { title:'The Matrix', poster:'https://upload.wikimedia.org/wikipedia/en/d/db/The_Matrix.png', duration:'2h 16m', rating:'8.7', genre:'Sci‑Fi' },
  { title:'Avengers: Endgame', poster:'https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg', duration:'3h 1m', rating:'8.4', genre:'Action' },
  { title:'Dune', poster:'https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg', duration:'2h 35m', rating:'8.2', genre:'Sci‑Fi' },
  { title:'Gladiator', poster:'https://upload.wikimedia.org/wikipedia/en/f/fb/Gladiator_%282000_film_poster%29.png', duration:'2h 35m', rating:'8.5', genre:'Action' },
  { title:'Titanic', poster:'https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png', duration:'1h 41m', rating:'7.4', genre:'Action' },
  { title:'La La Land', poster:'https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png', duration:'2h 8m', rating:'8.0', genre:'Musical' },
  { title:'Top Gun: Maverick', poster:'https://upload.wikimedia.org/wikipedia/en/1/13/Top_Gun_Maverick_Poster.jpg', duration:'2h 11m', rating:'8.3', genre:'Action' },
  { title:'Spider-Man: No Way Home', poster:'https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg', duration:'2h 28m', rating:'8.3', genre:'Action' },
  { title:'Avatar', poster:'https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg', duration:'2h 42m', rating:'7.8', genre:'Adventure' },
  { title:'The Conjuring', poster:'https://upload.wikimedia.org/wikipedia/en/8/8c/The_Conjuring_poster.jpg', duration:'1h 52m', rating:'7.6', genre:'Horror' }
];


const theatres = [
  { name:'Aurora Cinemas', location:'Downtown', rows:6, cols:8, times:['9:00 AM','12:00 PM','3:00 PM','6:00 PM'] },
  // Galaxy has two sections (Stalls + Balcony)
  { name:'Galaxy Theatre', location:'Uptown', sections:[{name:'Stalls',rows:4,cols:8},{name:'Balcony',rows:4,cols:8}], times:['10:00 AM','1:00 PM','4:00 PM','7:00 PM'] },
  // Starlight with two equal sections
  { name:'Starlight Multiplex', location:'Mall', sections:[{name:'Left',rows:5,cols:6},{name:'Right',rows:5,cols:6}], times:['11:00 AM','2:00 PM','5:00 PM','8:00 PM'] },
  { name:'Indie House', location:'East Side', rows:6, cols:6, times:['10:30 AM','1:30 PM','4:30 PM'] }
];

// Small SVG fallback image (data URI) to avoid external load failures
const FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="50%" fill="#9ca3af" font-size="16" font-family="Arial" text-anchor="middle" alignment-baseline="middle">No Image</text></svg>`);

/* ---------- Persistence ---------- */
const BOOKINGS_KEY = 'cinebook_bookings_v1';
const SEATS_KEY = 'cinebook_seats_v1';
const PRICES_KEY = 'cinebook_prices_v1';
const CANCELED_KEY = 'cinebook_cancellations_v1';
let bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '{}');
let seatMaps = JSON.parse(localStorage.getItem(SEATS_KEY) || '{}');
let cancellations = JSON.parse(localStorage.getItem(CANCELED_KEY) || '[]');
let pricesMap = JSON.parse(localStorage.getItem(PRICES_KEY) || '{}');
function saveState(){ localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings)); localStorage.setItem(SEATS_KEY, JSON.stringify(seatMaps)); localStorage.setItem(CANCELED_KEY, JSON.stringify(cancellations)); localStorage.setItem(PRICES_KEY, JSON.stringify(pricesMap)); }

// deterministic-ish hash to int
function _hashToInt(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h += (h<<1) + (h<<4) + (h<<7) + (h<<8) + (h<<24); } return Math.abs(h >>> 0); }

// get or create a stable price for a show (movie, theatre, time)
function getShowPrice(movieTitle, theatreName, time){ try{
  const key = `${movieTitle}||${theatreName}||${time}`;
  if(pricesMap[key]) return pricesMap[key];
  // create a deterministic price in range 300-450 rounded to 10
  const seed = _hashToInt(key);
  const price = 300 + (seed % 151); // 300..450
  const rounded = Math.round(price/10)*10;
  pricesMap[key]=rounded; saveState(); return rounded;
}catch(e){ return 350 } }

// Reset stored bookings/seat maps and seed a few demo booked seats and cancellations
function resetAndSeedDemo(){
  bookings = {};
  seatMaps = {};
  cancellations = [];
  // seed few booked seats for demo (no active bookings)
  try{
    const demoPairs = [
      {m: movies[0].title, t: theatres[0].name, time: theatres[0].times[0], seats:[[2,3],[4,5]]},
      {m: movies[1].title, t: theatres[1].name, time: theatres[1].times[1], seats:[[0,0],[1,1]]}
    ];
    for(const p of demoPairs){
      const key = seatMapKey(p.m,p.t,p.time);
      const th = theatres.find(x=>x.name===p.t) || theatres[0];
      const map = Array.from({length:th.rows}, ()=> Array.from({length:th.cols}, ()=>0));
      for(const s of p.seats) if(map[s[0]] && typeof map[s[0]][s[1]]!=='undefined') map[s[0]][s[1]] = 1;
      seatMaps[key] = map;
    }

  }catch(e){ console.warn('seeding demo failed', e) }
  saveState();
}

/* ---------- UI refs ---------- */
const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const bookingStatusBtn = document.getElementById('bookingStatusBtn');
const homeSection = document.getElementById('homeSection');
const theatreSection = document.getElementById('theatreSection');
const timeSlotsSection = document.getElementById('timeSlotsSection');
const seatsSection = document.getElementById('seatsSection');
const confirmSection = document.getElementById('confirmSection');
const statusSection = document.getElementById('statusSection');
const selectedMovieTitleEl = document.getElementById('selectedMovieTitle');
const theatresList = document.getElementById('theatresList');
const seatsHeader = document.getElementById('seatsHeader');
const seatsGrid = document.getElementById('seatsGrid');
const timeSlotInfo = document.getElementById('timeSlotInfo');
const confirmBookingBtn = document.getElementById('confirmBooking');
const confirmMsg = document.getElementById('confirmMsg');
const tokenInput = document.getElementById('tokenInput');
const viewBookingBtn = document.getElementById('viewBooking');
const tabActive = document.getElementById('tabActive');
const tabCancellations = document.getElementById('tabCancellations');
const bookingPopup = document.getElementById('bookingPopup');

/* ---------- App state ---------- */
let bst = new MovieBST();
let selectedMovie=null, selectedTheatre=null, selectedTime=null;
let selectedDate=null;
let currentSeatMap=null, currentPQ=null, currentKey=null, selectedSeats=[];
let desiredSeatCount = 1;
let previewBestActive = false;
let currentBestPreview = [];

/* ---------- Helpers ---------- */
function seatMapKey(movieTitle,theatreName,time){ return `${movieTitle}||${theatreName}||${time}` }
function debounce(fn,wait=250){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),wait) } }

/* ---------- Rendering Movies & Search ---------- */
function loadMoviesIntoBST(){ for(const m of movies) bst.insert(m.title,m) }

function renderMovies(list){ moviesGrid.innerHTML=''; for(const m of list){ const card=document.createElement('div'); card.className='movie-card'; card.innerHTML=`<div class="rating-badge">⭐ ${m.rating}</div><div class="genre-tag">${m.genre}</div><img class="poster" src="${m.poster}" alt="${m.title}" /><div class="movie-info"><h3>${m.title}</h3><div class="meta">${m.duration}</div><div style="margin-top:6px"><button data-title="${m.title}">Book Now</button></div></div>`; moviesGrid.appendChild(card); card.querySelector('button').onclick = ()=>openTheatres(m) } }

// ensure poster fallback if some images fail to load
// safeImage: tries the main src, then an alternate (data-alt), then falls back to inline SVG
function safeImage(img){ if(!img) return; img.onerror = null; img.onerror = ()=>{ try{ if(img.dataset && img.dataset.alt && img.src!==img.dataset.alt){ img.onerror = null; img.src = img.dataset.alt; return } }catch(e){} img.onerror=null; img.src = FALLBACK_IMG } }

// enhance renderMovies to attach onerror fallback
function renderMovies(list){ moviesGrid.innerHTML=''; for(const m of list){ const card=document.createElement('div'); card.className='movie-card';
  // prepare a small alternate poster (picsum seeded) to try if main poster fails
  const alt = `https://picsum.photos/seed/${encodeURIComponent(m.title)}/300/450`;
  card.innerHTML = `<div class="rating-badge">⭐ ${m.rating}</div><div class="genre-tag">${m.genre}</div><img class="poster" src="${m.poster}" data-alt="${alt}" alt="${m.title}" /><div class="movie-info"><h3>${m.title}</h3><div class="meta">${m.duration}</div><div style="margin-top:6px"><button data-title="${m.title}">Book Now</button></div></div>`;
    const img = card.querySelector('img'); safeImage(img); moviesGrid.appendChild(card); card.querySelector('button').onclick = ()=>openTheatres(m)
  } }

// compute numeric capacity for theatres (supports sections)
function computeCapacity(t){ if(!t) return 0; if(Array.isArray(t.sections)) return t.sections.reduce((s,sec)=> s + ((sec.rows||0)*(sec.cols||0)), 0); return (t.rows||0) * (t.cols||0); }

// format INR
function formatINR(n){ return '₹' + (typeof n==='number'? n.toLocaleString('en-IN') : n); }

// seat label helper: converts {r,c, s?} into human label like F5 (and includes section name if available)
function seatLabelForBooking(b, s){ try{ const r = s.r; const c = s.c; const letter = String.fromCharCode(65 + (r||0)); const col = (typeof c==='number')? (c+1) : ''; const th = theatres.find(t=>t.name=== (b.theatre || selectedTheatre && selectedTheatre.name)); if(s.s!==undefined && th && Array.isArray(th.sections) && th.sections[s.s]){ const secName = th.sections[s.s].name || `S${s.s+1}`; return `${secName} ${letter}${col}` } return `${letter}${col}` }catch(e){ return `[${(s.r||0)+1},${(s.c||0)+1}]` } }

function seatLabelFromIndices(r,c){ try{ const letter = String.fromCharCode(65 + (r||0)); return `${letter}${(c+1)}` }catch(e){ return `${r+1},${c+1}` } }

// after rendering theatres we need to bind select handlers
const mo = new MutationObserver(()=>{ attachSelectHandlers() });
mo.observe(document.getElementById('theatresList'), { childList:true, subtree:true });

const doSearch = debounce(()=>{ const q=searchInput.value.trim(); if(!q) { renderMovies(bst.inorder()); return } const res=bst.searchMatches(q); renderMovies(res) },200);
searchInput.addEventListener('input', doSearch);
searchBtn.onclick = ()=>{ const q=searchInput.value.trim(); if(!q) renderMovies(bst.inorder()); else renderMovies(bst.searchMatches(q)); }

/* ---------- Theatres ---------- */
function openTheatres(movie){ selectedMovie=movie; if(selectedMovieTitleEl) selectedMovieTitleEl.textContent = movie.title; theatresList.innerHTML='';
  // render movie summary
  const sum = document.getElementById('movieSummary'); sum.innerHTML = `<img src="${movie.poster}" alt="${movie.title}" /><div class="info"><h3>${movie.title}</h3><div class="meta">${movie.genre} • ${movie.duration}</div><div class="badges"><span class="pill">${tLocationPlaceholder()}</span></div></div>`;
  // ensure poster fallback
  try{ safeImage(sum.querySelector('img')) }catch(e){}
  // render theatres as grid cards
  theatresList.classList.add('theatre-grid');
  for(const t of theatres){ const node=document.createElement('div'); node.className='theatre-card'; node.innerHTML = `<div class="left"><div class="icon">🎬</div><div class="info"><h3>${t.name}</h3><div class="meta">${t.location || ''}</div></div></div><div class="right"><div class="meta">Capacity: ${computeCapacity(t)} seats</div><div><div class="select-link">Select →</div></div></div>`; theatresList.appendChild(node) }
  showSection(theatreSection);
}

// small helper because we can't easily embed objects into onclick with quotes; we'll register handlers after creation
function tLocationPlaceholder(){ return 'Premium' }

// After DOM rendered, attach proper handlers for Select links (safer method)
function attachSelectHandlers(){ document.querySelectorAll('.select-link').forEach(el=>{ el.onclick = (e)=>{ const card = el.closest('.theatre-card'); const name = card.querySelector('.info h3').textContent; const t = theatres.find(x=>x.name===name); if(!t) return; openTimeSlots(selectedMovie, t); } }) }

// Open time slots screen for a movie + theatre
function openTimeSlots(movie, theatre){ selectedMovie = movie; selectedTheatre = theatre; document.getElementById('timeMovieSummary').innerHTML = `<img src="${movie.poster}" alt="${movie.title}" /><div class="info"><h3>${movie.title}</h3><div class="meta">${movie.genre} • ${movie.duration}</div><div class="badges"><span class="pill">${theatre.name}</span><span class="pill">Premium Available</span></div></div>`;
  try{ safeImage(document.getElementById('timeMovieSummary').querySelector('img')) }catch(e){}
  const container = document.getElementById('timeSlotsContainer'); container.innerHTML = '';
  const now = new Date(); for(let d=0; d<3; d++){ const date = new Date(now.getFullYear(), now.getMonth(), now.getDate()+d); const section = document.createElement('div'); section.className='time-section'; const heading = document.createElement('h4'); heading.textContent = d===0? `Today: ${date.toDateString()}` : d===1? `Tomorrow: ${date.toDateString()}` : `${date.toLocaleDateString()}`; section.appendChild(heading);
    const row = document.createElement('div'); row.className='time-row'; for(const time of theatre.times){ const pill = document.createElement('div'); pill.className='time-pill'; const price = getShowPrice(movie.title, theatre.name, time); pill.innerHTML = `<div style="font-weight:700">${time}</div><div style="font-size:13px;color:#9fb0c9">${formatINR(price)}</div>`; pill.onclick = ()=>{ // set selected time and open seats (pass date string)
          openSeats(movie, theatre, time, date.toDateString());
        }; row.appendChild(pill) }
    section.appendChild(row); container.appendChild(section);
  }
  showSection(timeSlotsSection);
}

function showSection(el){ [homeSection,theatreSection,timeSlotsSection,seatsSection,confirmSection,statusSection].forEach(s=>{ if(s===el) s.style.display='block'; else s.style.display='none' }) }

/* ---------- Seats & Priority Queue ---------- */
function openSeats(movie,theatre,time, dateStr){ selectedMovie=movie; selectedTheatre=theatre; selectedTime=time; selectedDate = dateStr || ''; selectedSeats=[]; seatsHeader.textContent = `${theatre.name} — ${time}`; timeSlotInfo.textContent = theatre.sections? `Layout: multiple sections` : `Layout: ${theatre.rows} x ${theatre.cols}`; currentKey = seatMapKey(movie.title,theatre.name,time) + (selectedDate? `||${selectedDate}`:'');
  let map = seatMaps[currentKey];
  if(!map){
    if(theatre.sections){
      // create sections array of maps
      const obj = { sections: [] };
      for(const s of theatre.sections){ const m = Array.from({length:s.rows}, ()=> Array.from({length:s.cols}, ()=>0)); for(let r=0;r<s.rows;r++) for(let c=0;c<s.cols;c++) if(Math.random()<0.12) m[r][c]=1; obj.sections.push(m) }
      map = obj; seatMaps[currentKey]=map; saveState();
    } else {
      map = Array.from({length:theatre.rows}, ()=> Array.from({length:theatre.cols}, ()=>0)); // random demo bookings
      for(let r=0;r<theatre.rows;r++) for(let c=0;c<theatre.cols;c++) if(Math.random()<0.12) map[r][c]=1; seatMaps[currentKey]=map; saveState();
    }
  }
  currentSeatMap = map;
  // build PQ (for both single map and sections)
  currentPQ = new MaxHeapPQ(); const topKeys = [];
  if(theatre.sections && map.sections){
    // build list of candidate seats with priority for each section
    map.sections.forEach((m,i)=>{
      const rows = m.length, cols = m[0].length; const middleCol = Math.floor((cols-1)/2);
      for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) if(m[r][c]===0){ const rowIndex = rows - 1 - r; const priority = (rows - rowIndex)*1000 - Math.abs(c-middleCol)*10; topKeys.push({s:i,row:r,col:c,priority}) }
    });
    topKeys.sort((a,b)=>b.priority-a.priority);
    // store full sorted list in heap so we can slice top N later
    currentPQ.heap = topKeys.slice();
    currentPQ._isSectionTop = true;
  } else {
    const rows = theatre.rows, cols = theatre.cols; const middleCol=Math.floor((cols-1)/2);
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) if(map[r][c]===0){ const rowIndex = rows - 1 - r; const priority = (rows - rowIndex)*1000 - Math.abs(c-middleCol)*10; currentPQ.push({row:r,col:c,priority}) }
    currentPQ._isSectionTop = false;
  }
  renderSeats(); showSection(seatsSection);
}

function renderSeats(){ seatsGrid.innerHTML=''; const prioritySet = new Set();
  // compute top N priority seats where N = desiredSeatCount
  const topItems = currentPQ? (currentPQ._isSectionTop? currentPQ.heap.slice(0, desiredSeatCount) : currentPQ.toArray().slice(0, desiredSeatCount)) : [];
  // build best-preview set from currentBestPreview (independent of user selection)
  const bestPreviewSet = new Set();
  (currentBestPreview||[]).forEach(it=>{ if(it.s!==undefined) bestPreviewSet.add(`${it.s}:${it.r},${it.c}`); else bestPreviewSet.add(`${it.r},${it.c}`) });
  // build a set of priority markers; support section keys 's:row,col'
  topItems.forEach(it=>{ if(it.s!==undefined) prioritySet.add(`${it.s}:${it.row},${it.col}`); else prioritySet.add(`${it.row},${it.col}`) });
  // show screen graphic
  const screenGraphic = document.createElement('div'); screenGraphic.className='screen-graphic'; seatsGrid.appendChild(screenGraphic);

  const wrap = document.createElement('div'); wrap.className='seats-wrap';
  // if currentSeatMap has sections, render each section with gap
  if(currentSeatMap && currentSeatMap.sections){ currentSeatMap.sections.forEach((m,si)=>{
      const sectionWrap = document.createElement('div'); sectionWrap.className='section-wrap'; const nameLabel = document.createElement('div'); nameLabel.className='section-name'; nameLabel.textContent = (selectedTheatre.sections && selectedTheatre.sections[si] && selectedTheatre.sections[si].name) ? selectedTheatre.sections[si].name : `Section ${si+1}`; sectionWrap.appendChild(nameLabel);
      const grid = document.createElement('div'); grid.className='seats-grid-inner';
      for(let r=0;r<m.length;r++){
        const rowDiv=document.createElement('div'); rowDiv.className='row';
        for(let c=0;c<m[0].length;c++){
          const btn=document.createElement('div'); btn.className='seat'; btn.dataset.r=r; btn.dataset.c=c; btn.dataset.s=si;
          const key = `${si}:${r},${c}`;
          if(m[r][c]===1){ btn.classList.add('booked'); btn.title='Booked' }
          else if(selectedSeats.find(s=>s.r==r&&s.c==c&&s.s==si)){ btn.classList.add('selected') }
          else if(bestPreviewSet.has(key)){ btn.classList.add('best-preview') }
          else if(prioritySet.has(key)){ btn.classList.add('priority') }
          else { btn.classList.add('available') }
          btn.onclick=()=>handleSeatClickSection(si,r,c);
          try{ btn.textContent = seatLabelFromIndices(r,c); btn.style.fontWeight = '700'; }catch(e){}
          rowDiv.appendChild(btn)
        }
        grid.appendChild(rowDiv)
      }
      sectionWrap.appendChild(grid); wrap.appendChild(sectionWrap)
    })
  } else {
    const rows=currentTheatreRows(), cols=currentTheatreCols(); const grid = document.createElement('div'); grid.className='seats-grid-inner';
    for(let r=0;r<rows;r++){
      const rowDiv=document.createElement('div'); rowDiv.className='row';
      for(let c=0;c<cols;c++){
        const btn=document.createElement('div'); btn.className='seat'; btn.dataset.r=r; btn.dataset.c=c;
        const key=`${r},${c}`;
        if(currentSeatMap[r][c]===1){ btn.classList.add('booked'); btn.title='Booked' }
        else if(selectedSeats.find(s=>s.r==r&&s.c==c)){ btn.classList.add('selected') }
        else if(bestPreviewSet.has(key)){ btn.classList.add('best-preview') }
        else if(prioritySet.has(key)){ btn.classList.add('priority') }
        else { btn.classList.add('available') }
        btn.onclick=()=>handleSeatClick(r,c);
        btn.textContent = seatLabelFromIndices(r,c);
        btn.style.fontWeight = '700';
        rowDiv.appendChild(btn)
      }
      grid.appendChild(rowDiv)
    }
    wrap.appendChild(grid)
  }
  seatsGrid.appendChild(wrap);
  // center view adjustments
  setTimeout(()=>{ try{ seatsGrid.scrollLeft = 0; seatsGrid.scrollTop = 0 }catch(e){} },50);
}

function availableSeatsList(){ const list=[]; if(currentSeatMap && currentSeatMap.sections){ currentSeatMap.sections.forEach((m,si)=>{ for(let r=0;r<m.length;r++) for(let c=0;c<m[0].length;c++) if(m[r][c]===0 && !selectedSeats.find(s=>s.s==si&&s.r==r&&s.c==c)) list.push({s:si,r,c}) }) } else if(Array.isArray(currentSeatMap)){ for(let r=0;r<currentSeatMap.length;r++) for(let c=0;c<currentSeatMap[0].length;c++) if(currentSeatMap[r][c]===0 && !selectedSeats.find(s=>s.r==r&&s.c==c)) list.push({r,c}) } return list }

function setSeatError(msg){ try{ const el = document.getElementById('seatError'); if(!el) return; el.textContent = msg || ''; }catch(e){} }

function autoSelectBestSeats(targetCount){ const needed = targetCount - selectedSeats.length; if(needed<=0) return; const avail = availableSeatsList(); if(!avail.length) return; // pick from priority if available
  const picks = [];
  // prefer priority seats from currentPQ if present
  if(currentPQ && !currentPQ._isSectionTop){ const pq = currentPQ.toArray(); for(const p of pq){ if(p && p.row!==undefined){ if(!selectedSeats.find(s=>s.r==p.row&&s.c==p.col) && (!currentSeatMap[p.row][p.col]||currentSeatMap[p.row][p.col]===0)) picks.push({r:p.row,c:p.col}); if(picks.length>=needed) break } } }
  if(picks.length<needed && currentPQ && currentPQ._isSectionTop){ for(const p of currentPQ.heap){ if(p && p.s!==undefined){ if(!selectedSeats.find(s=>s.s==p.s&&s.r==p.row&&s.c==p.col)) picks.push({s:p.s,r:p.row,c:p.col}); if(picks.length>=needed) break } } }
  // fallback to available list
  if(picks.length<needed){ for(const a of avail){ if(!picks.find(x=> (x.r==a.r && x.c==a.c && x.s==a.s))) picks.push(a); if(picks.length>=needed) break } }
  // add picks to selectedSeats
  for(const p of picks.slice(0,needed)) selectedSeats.push(p);
  renderSeats();
}

// Return an array of best seat objects (does not modify selectedSeats)
function getBestSeats(targetCount){ const picks = []; if(!currentPQ) return picks; const needed = targetCount; if(currentPQ && !currentPQ._isSectionTop){ const pq = currentPQ.toArray(); for(const p of pq){ if(p && p.row!==undefined){ if(!selectedSeats.find(s=>s.r==p.row&&s.c==p.col) && (!currentSeatMap[p.row][p.col]||currentSeatMap[p.row][p.col]===0)) picks.push({r:p.row,c:p.col}); if(picks.length>=needed) break } } }
  if(picks.length<needed && currentPQ && currentPQ._isSectionTop){ for(const p of currentPQ.heap){ if(p && p.s!==undefined){ if(!selectedSeats.find(s=>s.s==p.s&&s.r==p.row&&s.c==p.col)) picks.push({s:p.s,r:p.row,c:p.col}); if(picks.length>=needed) break } } }
  // fallback to available list
  if(picks.length<needed){ const avail = availableSeatsList(); for(const a of avail){ if(!picks.find(x=> (x.r==a.r && x.c==a.c && x.s==a.s))) picks.push(a); if(picks.length>=needed) break } }
  return picks.slice(0, needed);
}

// Replace current selection with best seats up to targetCount
function applyBestSeats(targetCount){ const picks = getBestSeats(targetCount); if(!picks || picks.length===0){ setSeatError('No best seats available'); return } // set preview, do not modify user's selection
  previewBestActive = true; currentBestPreview = picks.slice(); setSeatError(''); renderSeats(); }

function currentTheatreRows(){ return selectedTheatre? selectedTheatre.rows:0 }
function currentTheatreCols(){ return selectedTheatre? selectedTheatre.cols:0 }

function handleSeatClick(r,c){
  try{ if(currentSeatMap[r][c]===1) return; const already = selectedSeats.find(s=>s.r==r&&s.c==c); if(already){ selectedSeats = selectedSeats.filter(s=>!(s.r==r&&s.c==c)); setSeatError(''); renderSeats(); return } // trying to select
    if(selectedSeats.length >= desiredSeatCount){ setSeatError(`You can select up to ${desiredSeatCount} seat(s).`); return }
    selectedSeats.push({r,c}); setSeatError(''); renderSeats();
  }catch(e){}
}

function handleSeatClickSection(sIndex,r,c){
  try{
    const map = currentSeatMap && currentSeatMap.sections? currentSeatMap.sections[sIndex]:null; if(!map) return; if(map[r][c]===1) return; const already = selectedSeats.find(s=>s.r==r&&s.c==c&&s.s==sIndex);
    if(already){ selectedSeats = selectedSeats.filter(s=> !(s.s==sIndex&&s.r==r&&s.c==c) ); setSeatError(''); renderSeats(); return }
    if(selectedSeats.length >= desiredSeatCount){ setSeatError(`You can select up to ${desiredSeatCount} seat(s).`); return }
    selectedSeats.push({s:sIndex,r,c}); setSeatError(''); renderSeats();
  }catch(e){}
}

/* ---------- Booking & Confirmation Popup ---------- */
function confirmBooking(){ if(selectedSeats.length===0){ alert('Select at least one seat'); return }
  // Book only the seats the user has selected. Do not auto-select additional seats here.
  if(selectedSeats.length===0){ alert('No seats available to select'); return }
  for(const s of selectedSeats){
    if(s.s!==undefined && currentSeatMap && currentSeatMap.sections){ currentSeatMap.sections[s.s][s.r][s.c]=1; if(currentPQ) currentPQ.remove(x=> (x.s===s.s && x.row===s.r && x.col===s.c) ) }
    else if(currentSeatMap && Array.isArray(currentSeatMap)) { currentSeatMap[s.r][s.c]=1; if(currentPQ) currentPQ.remove(x=>x.row===s.r && x.col===s.c) }
  }
  const token = 'CBK' + Math.floor(100000 + Math.random()*900000);
  bookings[token] = { token, movie:selectedMovie.title, theatre:selectedTheatre.name, time:selectedTime, date:selectedDate||'', seats:selectedSeats.slice(), timestamp: new Date().toISOString() };
  seatMaps[currentKey]=currentSeatMap; saveState(); selectedSeats=[]; renderSeats(); // show popup
  showBookingPopup(bookings[token], 'success'); }

function showBookingPopup(b, mode=false){
  const mv = movies.find(x=>x.title===b.movie) || {poster:''};
  const seatStrs = (b.seats||[]).map(s=>seatLabelForBooking(b,s));
  // mode: false|'view'|'success'|'cancel'
  let headerText = 'Your Ticket';
  let headerIcon = '🎫';
  let headerGradient = 'linear-gradient(90deg,#4fb3ff,#29a0ff)';
  if(mode === 'success') { headerText = 'Booking Successful'; headerIcon = '🎉'; headerGradient = 'linear-gradient(90deg,#ff9a33,#ffb020)'; }
  if(mode === 'cancel') { headerText = 'Booking Cancelled'; headerIcon = '✔'; headerGradient = 'linear-gradient(90deg,#24b47e,#0f8b5a)'; }
  bookingPopup.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-ticket centered-ticket">
        <div class="ticket-top" style="background:${headerGradient};padding:18px;border-top-left-radius:12px;border-top-right-radius:12px;text-align:center;color:#081018;font-weight:800">${headerIcon}<div style="font-size:18px;margin-top:8px">${headerText}</div></div>
        <div style="padding:18px 20px">
          <div style="display:flex;gap:14px;align-items:center">
            <div style="flex:0 0 96px"><img id="bp-img" src="${mv.poster}" alt="${b.movie}" style="width:96px;height:130px;object-fit:cover;border-radius:8px"/></div>
            <div style="flex:1">
              <div style="font-size:18px;font-weight:800;color:#fff">${b.movie}</div>
              <div style="color:#9fb0c9;margin-top:6px">${mv.genre||''} • ${mv.duration||''}</div>
              <div style="margin-top:12px;color:#cfe3f5">Booking ID: <strong id="bp-id">${b.token}</strong> <button id="copyTicket" class="copy-btn" style="margin-left:8px">Copy</button></div>
            </div>
          </div>
          <div style="margin-top:14px;background:rgba(255,255,255,0.02);padding:12px;border-radius:8px;color:#dbe7f6">
            <div style="display:flex;justify-content:space-between;padding:6px 0"><div>Hall</div><div style="font-weight:700">${b.theatre}</div></div>
            <div style="display:flex;justify-content:space-between;padding:6px 0"><div>Date</div><div style="font-weight:700">${b.date? b.date : new Date().toDateString()}</div></div>
            <div style="display:flex;justify-content:space-between;padding:6px 0"><div>Time</div><div style="font-weight:700">${b.time}</div></div>
            <div style="display:flex;justify-content:space-between;padding:6px 0"><div>Seats</div><div style="font-weight:700">${seatStrs.join(', ')}</div></div>
          </div>
          <div style="margin-top:16px;display:flex;justify-content:center"><button id="closePopup" class="close-btn">Close</button></div>
        </div>
      </div>
    </div>`;
  // ensure the popup is a direct child of body for predictable centering
  try{ if(bookingPopup.parentElement !== document.body) document.body.appendChild(bookingPopup) }catch(e){}
  bookingPopup.style.display='block';
  try{ safeImage(document.getElementById('bp-img')) }catch(e){}
  // copy ticket id handler
  try{ document.getElementById('copyTicket').onclick = ()=>{ const id = document.getElementById('bp-id').innerText; navigator.clipboard?.writeText(id).then(()=>alert('Ticket ID copied')) } }catch(e){}
  document.getElementById('closePopup').onclick = ()=>{ bookingPopup.style.display='none'; showSection(homeSection) };
}

/* ---------- Booking Status & Cancellation ---------- */
function renderBookingHistory(){ // build Active and Cancellations panes in the status view
  let htmlActive = '<h3 class="active-heading">Active Bookings</h3>';
  let htmlCancel = '<h3 class="cancel-heading">Cancellations</h3>';
  const active = Object.values(bookings);
  if(active.length){ htmlActive += '<div class="booking-list">';
    for(const b of active){
      const mv = movies.find(x=>x.title===b.movie) || {poster:''};
      // helper to map section names to Front/Back when applicable
      const mapSection = (theatreName, sIndex)=>{
        try{
          const th = theatres.find(t=>t.name===theatreName);
          if(!th || !th.sections || typeof sIndex==='undefined') return null;
          const sec = th.sections[sIndex]; if(!sec) return null;
          const name = (sec.name||'').toString().toLowerCase(); if(name.includes('stall')) return 'Front'; if(name.includes('balcony')) return 'Back'; return sec.name || `Section ${sIndex+1}`;
        }catch(e){ return null }
      };
      const seatsStr = (b.seats||[]).map(s=>{
        const label = seatLabelFromIndices(s.r,s.c);
        if(s.s!==undefined){ const mapped = mapSection(b.theatre, s.s); return mapped? `${mapped} ${label}` : `${label}` }
        return `${label}`
      }).join(', ');
      htmlActive += `<div class="booking-item"><div class="thumb"><img src="${mv.poster}" data-token="${b.token}"/></div><div class="info"><div class="line title"><strong>${b.movie}</strong></div><div class="line theatre">${b.theatre}</div><div class="line time">${b.time}${b.date? ' • ' + b.date : ''}</div><div class="line seats">Seats: ${seatsStr}</div></div><div class="actions"><button data-id="${b.token}" class="showTicketBtn">Show Ticket</button><button data-id="${b.token}" class="cancelBtn">Cancel Now</button></div></div>`;
    }
    htmlActive += '</div>'
  } else {
    htmlActive += '<p class="empty-msg">No active bookings found</p>';
  }

  if(cancellations.length){ htmlCancel += '<div class="booking-list">';
    for(const c of cancellations.slice().reverse()){
      const mv = movies.find(x=>x.title===c.movie) || {poster:c.poster||''};
      const seatsStr = (c.seats||[]).map(s=> seatLabelForBooking(c,s)).join(', ');
      const cancelledAt = c.cancelledAt ? new Date(c.cancelledAt).toLocaleString() : '';
      htmlCancel += `<div class="booking-item"><div class="thumb"><img src="${mv.poster}"/></div><div class="info"><div class="line title"><strong>${c.movie}</strong></div><div class="line theatre">${c.theatre}</div><div class="line time">${c.time}${c.date? ' • ' + c.date : ''}</div><div class="line seats">Seats: ${seatsStr}</div><div class="line cancelled">Cancelled: ${cancelledAt}</div></div></div>`;
    }
    htmlCancel += '</div>'
  } else {
    htmlCancel += '<p class="empty-msg">No cancellations yet</p>';
  }

  // populate panes
  tabActive.innerHTML = htmlActive;
  tabCancellations.innerHTML = htmlCancel;
  // ensure thumbnails have fallback in both panes
  [tabActive, tabCancellations].forEach(pane=>{ try{ pane.querySelectorAll('img').forEach(i=> safeImage(i)) }catch(e){} });
  // attach cancel handlers
  tabActive.querySelectorAll('.cancelBtn').forEach(btn=> btn.onclick = ()=>{ const id = btn.dataset.id; if(!confirm('Cancel booking '+id+'?')) return; cancelBooking(id) });
  // attach show ticket handlers
  tabActive.querySelectorAll('.showTicketBtn').forEach(btn=> btn.onclick = ()=>{ const id = btn.dataset.id; const b = bookings[id]; if(b) showBookingPopup(b,false); else alert('Booking not found') });
}

function cancelBooking(token){ const b = bookings[token]; if(!b) { alert('Booking not found'); renderBookingHistory(); return }
  const key = seatMapKey(b.movie,b.theatre,b.time) + (b.date? `||${b.date}` : ''); const map = seatMaps[key]; if(map){
    // support sectioned maps
    for(const s of b.seats){ if(s.s!==undefined && map.sections && map.sections[s.s]){ map.sections[s.s][s.r][s.c]=0 } else if(Array.isArray(map)){ map[s.r][s.c]=0 } }
    seatMaps[key]=map
    // if the user is currently viewing this show's seat map, rebuild the PQ so freed seats re-enter prioritization immediately
    try{
      if(currentKey===key){
        currentSeatMap = map;
        currentPQ = new MaxHeapPQ();
        const theatre = theatres.find(t=>t.name===b.theatre);
        if(theatre && theatre.sections && map.sections){
          const topKeys = [];
          map.sections.forEach((m,i)=>{ const rows=m.length, cols=m[0].length; const middleCol=Math.floor((cols-1)/2); for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) if(m[r][c]===0){ const rowIndex = rows - 1 - r; const priority = (rows - rowIndex)*1000 - Math.abs(c-middleCol)*10; topKeys.push({s:i,row:r,col:c,priority}) } });
          topKeys.sort((a,b)=>b.priority-a.priority);
          currentPQ.heap = topKeys.slice(0,3);
          currentPQ._isSectionTop = true;
        } else if(theatre){
          const rows = theatre.rows, cols = theatre.cols; const middleCol = Math.floor((cols-1)/2);
          for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) if(map[r][c]===0){ const rowIndex = rows - 1 - r; const priority = (rows - rowIndex)*1000 - Math.abs(c-middleCol)*10; currentPQ.push({row:r,col:c,priority}) }
          currentPQ._isSectionTop = false;
        }
        if(seatsSection.style.display==='block') renderSeats();
      }
    }catch(e){}
  }
  cancellations.push(Object.assign({}, b, { cancelledAt: new Date().toISOString() })); delete bookings[token]; saveState(); renderBookingHistory();
  try{ // hide status overlay and show compact cancel popup
    try{ if(typeof statusSection !== 'undefined' && statusSection){ statusSection.style.display='none'; statusSection.classList.remove('status-modal-open'); } }catch(e){}
    showBookingPopup(b, 'cancel');
  }catch(e){ alert('Cancelled '+token) }
}

// show ticket popup (detailed view similar to boarding pass)
function showTicketPopup(b){
  // reuse the booking ticket layout for consistency
  showBookingPopup(b);
}

// view by token
viewBookingBtn.onclick = ()=>{
  const token = tokenInput.value.trim(); if(!token){ alert('Enter token'); return }
  const b = bookings[token]; if(!b){ tabActive.innerHTML = `<p>No active booking ${token}</p>`; return }
  const mv = movies.find(x=>x.title===b.movie) || {poster:''};
  tabActive.innerHTML = `
    <div class="booking-card-view">
      <div class="bc-left"><img src="${mv.poster}" alt="${b.movie}"/></div>
      <div class="bc-right">
        <h3>${b.movie}</h3>
        <div class="meta">${b.theatre} • ${b.time} ${b.date? ' • ' + b.date : ''}</div>
        <div class="meta">Seats: ${(b.seats||[]).map(s=>seatLabelForBooking(b,s)).join(', ')}</div>
        <div class="meta">ID: <strong>${b.token}</strong></div>
        <div class="bc-actions"><button id="showTicketFromView" class="showTicketBtn">Show Ticket</button><button id="cancelS" class="cancelBtn">Cancel</button></div>
      </div>
    </div>`;
  // ensusre image fallback
  tabActive.querySelectorAll('img').forEach(i=> safeImage(i));
  document.getElementById('cancelS').onclick = ()=>{ if(!confirm('Cancel '+token+'?')) return; cancelBooking(token) }
  document.getElementById('showTicketFromView').onclick = ()=> showBookingPopup(b,false);
}

// show a cancellation success popup (reuses bookingPopup)
function showCancelSuccess(b, token){ const mv = movies.find(x=>x.title===b.movie) || {poster:''}; bookingPopup.innerHTML = `
  <div class="modal-overlay">
    <div class="modal-popup large">
      <div class="modal-ticket cancel-success">
        <div style="text-align:center;margin-bottom:6px">
          <div class="success-icon">✔</div>
        </div>
        <h2 style="text-align:center;margin:6px 0 8px 0">Booking Cancelled</h2>
        <p style="text-align:center;color:#bfcbd9;margin:0 0 14px 0">Your booking has been successfully cancelled. The seats are now available for others.</p>
        <div class="cancel-details">
          <div class="row"><div class="label">Movie</div><div class="value">${b.movie}</div></div>
          <div class="row"><div class="label">Hall</div><div class="value">${b.theatre}</div></div>
          <div class="row"><div class="label">Time</div><div class="value">${b.time}${b.date? ' • ' + b.date : ''}</div></div>
          <div class="row"><div class="label">Seats</div><div class="value">${(b.seats||[]).map(s=>seatLabelForBooking(b,s)).join(', ')}</div></div>
        </div>
        <div style="margin-top:18px;display:flex;justify-content:center"><button id="closeCancel" class="done-btn">Done</button></div>
      </div>
    </div>
  </div>`;
  // hide the status modal (if open) so the cancel popup appears centered on the viewport
  try{ if(typeof statusSection !== 'undefined' && statusSection){ statusSection.style.display='none'; statusSection.classList.remove('status-modal-open'); } }catch(e){}
  try{ if(bookingPopup.parentElement !== document.body) document.body.appendChild(bookingPopup) }catch(e){}
  bookingPopup.style.display='block'; try{ safeImage(document.getElementById('cn-img')) }catch(e){}
  document.getElementById('closeCancel').onclick = ()=>{ bookingPopup.style.display='none'; renderBookingHistory(); }
}

/* ---------- Init ---------- */
function init(){ loadMoviesIntoBST(); renderMovies(bst.inorder()); confirmBookingBtn.onclick = confirmBooking;
  bookingStatusBtn.onclick = ()=>{ 
    renderBookingHistory();
    // ensure both panes are visible (no tabs) and append status overlay
    try{ if(statusSection.parentElement !== document.body) document.body.appendChild(statusSection) }catch(e){}
    tabActive.style.display = 'block'; tabCancellations.style.display = 'block';
    statusSection.classList.add('status-modal-open'); statusSection.style.display = 'block'; };
  document.getElementById('backToHome1').onclick = ()=>showSection(homeSection); document.getElementById('backToHome2').onclick = ()=>showSection(homeSection); document.getElementById('backToTheatres').onclick = ()=>showSection(theatreSection);
  document.getElementById('closeStatus').onclick = ()=>{ statusSection.style.display='none'; statusSection.classList.remove('status-modal-open'); showSection(homeSection); };
  // allow Enter in token input
  tokenInput.addEventListener('keyup', (e)=>{ if(e.key==='Enter') viewBookingBtn.click() });
  // back from time slots to theatre list
  const backToMovie = document.getElementById('backToMovie'); if(backToMovie) backToMovie.onclick = ()=>showSection(theatreSection);
  // Reset stored bookings and seat maps to start fresh (per user request) and seed a couple of demo booked seats
  resetAndSeedDemo();
  // seat count controls
  try{
    const dec = document.getElementById('decreaseSeats');
    const inc = document.getElementById('increaseSeats');
    const disp = document.getElementById('seatCountDisplay');
    if(disp) disp.textContent = String(desiredSeatCount);
    if(dec) dec.onclick = ()=>{ desiredSeatCount = Math.max(1, desiredSeatCount-1); if(selectedSeats.length>desiredSeatCount){ // drop excess selections
        while(selectedSeats.length>desiredSeatCount) selectedSeats.pop(); setSeatError('');
      }
      if(disp) disp.textContent = String(desiredSeatCount);
      // update preview if active
      if(previewBestActive) currentBestPreview = getBestSeats(desiredSeatCount);
      renderSeats(); }
    if(inc) inc.onclick = ()=>{ const avail = availableSeatsList(); const maxPossible = (avail? avail.length + selectedSeats.length : desiredSeatCount+1); if(desiredSeatCount >= maxPossible){ setSeatError('No more seats available'); return } desiredSeatCount = Math.min(maxPossible, desiredSeatCount+1); if(disp) disp.textContent = String(desiredSeatCount); setSeatError('');
        // update preview if active
        if(previewBestActive) currentBestPreview = getBestSeats(desiredSeatCount);
        renderSeats(); }
    // best seats button toggles preview (non-destructive)
    const bestBtn = document.getElementById('bestSeatsBtn'); if(bestBtn) bestBtn.onclick = ()=>{
      if(previewBestActive){ previewBestActive = false; currentBestPreview = []; bestBtn.textContent = 'Best Seats'; setSeatError(''); renderSeats(); }
      else { const picks = getBestSeats(desiredSeatCount); if(!picks || !picks.length){ setSeatError('No best seats available'); return } previewBestActive = true; currentBestPreview = picks.slice(); bestBtn.textContent = 'Hide Best'; setSeatError(''); renderSeats(); }
    };
  }catch(e){}
  // no tab switching — both Active bookings and Cancellations are shown sequentially
  showSection(homeSection);
}

init(); 