// Menampilkan keterangan saat lencana skill diklik
function tampilkanInfo(pesan) {
  const kotakInfo = document.getElementById('infoSkill');
  kotakInfo.textContent = pesan;
}

// Menukar arah gradasi ungu dan biru toska
const tombolTukar = document.getElementById('tombolTukar');
tombolTukar.addEventListener('click', function() {
  document.body.classList.toggle('tukar-warna');
});
