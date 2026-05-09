export const metadata = {
  title: 'Pengaturan — Nayakarsa Admin',
  description: 'Konfigurasi sistem Nayakarsa Admin',
};

function SettingSection({ title, desc, children }) {
  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          {desc && <div className="card-subtitle">{desc}</div>}
        </div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
        {desc && <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0, marginLeft: '20px' }}>{children}</div>
    </div>
  );
}

function Toggle({ defaultOn = false }) {
  return (
    <div style={{
      width: '44px', height: '24px', borderRadius: '99px',
      background: defaultOn ? 'var(--primary)' : '#cbd5e1',
      position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
      flexShrink: 0
    }}>
      <div style={{
        position: 'absolute', top: '3px',
        left: defaultOn ? '22px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%', background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s'
      }} />
    </div>
  );
}

function TextInput({ placeholder, defaultValue, type = 'text' }) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      style={{
        padding: '8px 12px', border: '1px solid var(--border-color)',
        borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit',
        color: 'var(--text-primary)', background: 'white',
        width: '220px', outline: 'none',
        transition: 'border-color 0.2s'
      }}
    />
  );
}

export default function PengaturanPage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="section-badge">⚙️ Pengaturan</div>
          <h1>Pengaturan Sistem</h1>
          <p>Konfigurasi sistem, akun, dan preferensi admin Nayakarsa.</p>
        </div>
        <button className="btn btn-primary">💾 Simpan Perubahan</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Side nav */}
        <div className="card" style={{ padding: '12px', position: 'sticky', top: '88px' }}>
          {[
            { icon: '👤', label: 'Profil Admin' },
            { icon: '🔒', label: 'Keamanan' },
            { icon: '🔔', label: 'Notifikasi' },
            { icon: '🎨', label: 'Tampilan' },
            { icon: '⚙️', label: 'Sistem' },
            { icon: '🗄️', label: 'Backup Data' },
          ].map((item, i) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px',
              fontSize: '13.5px', fontWeight: i === 0 ? 600 : 500,
              color: i === 0 ? 'var(--primary)' : 'var(--text-secondary)',
              background: i === 0 ? 'rgba(79,70,229,0.08)' : 'transparent',
              cursor: 'pointer', transition: 'all 0.15s'
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Settings sections */}
        <div>
          <SettingSection title="👤 Profil Admin" desc="Informasi akun dan identitas administrator">
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '26px', fontWeight: 800, color: 'white', flexShrink: 0
              }}>SA</div>
              <div>
                <button className="btn btn-secondary btn-sm" style={{ marginRight: '8px' }}>📷 Ganti Foto</button>
                <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: 'none' }}>Hapus</button>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>JPG, PNG maks 2MB</div>
              </div>
            </div>
            <SettingRow label="Nama Lengkap" desc="Nama yang tampil di sistem">
              <TextInput defaultValue="Super Admin" />
            </SettingRow>
            <SettingRow label="Email" desc="Alamat email untuk login">
              <TextInput defaultValue="admin@nayakarsa.id" type="email" />
            </SettingRow>
            <SettingRow label="No. Telepon" desc="Nomor kontak admin">
              <TextInput defaultValue="+62 812-3456-7890" />
            </SettingRow>
          </SettingSection>

          <SettingSection title="🔒 Keamanan" desc="Kelola kata sandi dan keamanan akun">
            <SettingRow label="Ganti Kata Sandi" desc="Terakhir diubah 30 hari lalu">
              <button className="btn btn-secondary btn-sm">Ganti Password</button>
            </SettingRow>
            <SettingRow label="Autentikasi Dua Faktor" desc="Tambah lapisan keamanan ekstra">
              <Toggle defaultOn={true} />
            </SettingRow>
            <SettingRow label="Sesi Login" desc="Durasi sesi sebelum logout otomatis">
              <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer' }}>
                <option>30 menit</option>
                <option selected>1 jam</option>
                <option>4 jam</option>
                <option>24 jam</option>
              </select>
            </SettingRow>
          </SettingSection>

          <SettingSection title="🔔 Notifikasi" desc="Atur preferensi notifikasi sistem">
            <SettingRow label="Email Notifikasi" desc="Terima laporan melalui email">
              <Toggle defaultOn={true} />
            </SettingRow>
            <SettingRow label="Notifikasi Jadwal Baru" desc="Pemberitahuan saat jadwal baru ditambahkan">
              <Toggle defaultOn={true} />
            </SettingRow>
            <SettingRow label="Notifikasi Barcode Dicetak" desc="Pemberitahuan saat barcode dicetak">
              <Toggle defaultOn={false} />
            </SettingRow>
            <SettingRow label="Laporan Mingguan" desc="Rekap otomatis setiap Senin pagi">
              <Toggle defaultOn={true} />
            </SettingRow>
          </SettingSection>

          <SettingSection title="⚙️ Sistem" desc="Pengaturan umum aplikasi">
            <SettingRow label="Nama Aplikasi" desc="Nama yang muncul di browser">
              <TextInput defaultValue="Nayakarsa Admin" />
            </SettingRow>
            <SettingRow label="Zona Waktu" desc="Zona waktu untuk semua tanggal">
              <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer' }}>
                <option selected>WIB (UTC+7)</option>
                <option>WITA (UTC+8)</option>
                <option>WIT (UTC+9)</option>
              </select>
            </SettingRow>
            <SettingRow label="Format Tanggal" desc="Cara penulisan tanggal di sistem">
              <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer' }}>
                <option selected>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
                <option>MM/DD/YYYY</option>
              </select>
            </SettingRow>
            <div style={{ paddingTop: '14px' }}>
              <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: 'none' }}>🗑 Hapus Semua Cache</button>
            </div>
          </SettingSection>
        </div>
      </div>
    </div>
  );
}
