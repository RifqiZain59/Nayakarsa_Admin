@extends('layouts.app')
@section('page-title', 'Kelola Akun')
@section('content')

<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
<style>
.dataTables_wrapper .dataTables_filter input {
    border: 1px solid #e2e8f0; border-radius: 0.75rem;
    padding: 0.4rem 0.9rem; font-size: 0.85rem; outline: none;
    transition: border-color 0.2s;
}
.dataTables_wrapper .dataTables_filter input:focus { border-color: #10b981; }
.dataTables_wrapper .dataTables_length select {
    border: 1px solid #e2e8f0; border-radius: 0.5rem;
    padding: 0.3rem 0.6rem; font-size: 0.85rem;
}
.dataTables_wrapper .dataTables_info,
.dataTables_wrapper .dataTables_paginate { font-size: 0.82rem; margin-top: 0.75rem; }
.dataTables_wrapper .dataTables_paginate .paginate_button {
    border-radius: 0.5rem !important; padding: 0.25rem 0.6rem !important;
    margin: 0 1px; border: 1px solid transparent !important;
}
.dataTables_wrapper .dataTables_paginate .paginate_button.current {
    background: #10b981 !important; color: #fff !important; border-color: #10b981 !important;
}
.dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(.current) {
    background: #f1f5f9 !important; color: #334155 !important;
}
table.dataTable thead th { border-bottom: 2px solid #f1f5f9 !important; }
table.dataTable tbody tr:hover { background: #f8fafc !important; }
</style>

<div class="space-y-6">

    {{-- Header --}}
    <div class="relative bg-gradient-to-r from-[#0f172a] via-emerald-900 to-emerald-700 rounded-2xl px-8 py-7 text-white overflow-hidden shadow-lg">
        <div class="absolute right-0 top-0 w-64 h-full opacity-10"><svg viewBox="0 0 200 200" fill="currentColor" class="w-full h-full"><circle cx="160" cy="40" r="80"/><circle cx="60" cy="160" r="60"/></svg></div>
        <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                    <p class="text-emerald-300 text-sm font-medium">Kelola Akun</p>
                    <h2 class="text-3xl font-extrabold">Sekolah</h2>
                    <p class="text-emerald-200 text-sm mt-0.5"><span id="header-total">0</span> terdaftar &middot; <span id="header-active">0</span> aktif berlangganan</p>
                </div>
            </div>
            <button onclick="document.getElementById('add-modal').classList.remove('hidden')"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0f172a] font-semibold text-sm rounded-xl shadow hover:bg-emerald-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                Tambah Akun
            </button>
        </div>
    </div>

    {{-- Table --}}
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
                <h3 class="text-base font-bold text-slate-800">Daftar Akun</h3>
                <p class="text-xs text-slate-400 mt-0.5">Pengguna tipe institusi sekolah / korporasi</p>
            </div>
            <span class="text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-semibold border border-emerald-100"><span id="badge-total">0</span> Sekolah</span>
        </div>
        <div class="p-6">
            <table id="tbl-sekolah" class="min-w-full" style="width:100%">
                <thead><tr class="bg-slate-50">
                    <th class="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">#</th>
                    <th class="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pengguna</th>
                    <th class="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Nama Sekolah</th>
                    <th class="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Langganan</th>
                    <th class="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">API Key</th>
                    <th class="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-slate-50" id="table-body">
                </tbody>
            </table>
        </div>
    </div>
</div>

{{-- Add Modal --}}
<div id="add-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onclick="document.getElementById('add-modal').classList.add('hidden')"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-600 to-emerald-800 px-6 py-5 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
                <h3 class="text-lg font-bold text-white">Tambah Akun Sekolah</h3>
                <p class="text-emerald-200 text-xs mt-0.5">Disimpan langsung ke Firebase</p>
            </div>
        </div>
        <form id="add-form" onsubmit="handleAddUser(event)" class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap <span class="text-red-500">*</span></label>
                    <input type="text" name="name" required placeholder="Nama admin" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-slate-50">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email <span class="text-red-500">*</span></label>
                    <input type="email" name="email" required placeholder="admin@sekolah.com" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-slate-50">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password <span class="text-red-500">*</span></label>
                    <input type="password" name="password" required minlength="8" placeholder="Minimal 8 karakter" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-slate-50">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Sekolah</label>
                    <input type="text" name="institution_name" placeholder="SMAN 1 Jakarta" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-slate-50">
                </div>
            </div>
            <div class="bg-emerald-50 rounded-xl p-4 space-y-3 border border-emerald-100">
                <p class="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    Paket Langganan <span class="text-slate-400 font-normal normal-case">(opsional)</span>
                </p>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1.5">Nama Paket</label>
                        <select name="plan_name" class="w-full px-3 py-2.5 rounded-lg border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white">
                            <option value="">-- Pilih Paket --</option>
                            <option value="Basic Plan">Basic Plan</option>
                            <option value="Standard Plan">Standard Plan</option>
                            <option value="Premium Plan">Premium Plan</option>
                            <option value="Enterprise Plan">Enterprise Plan</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1.5">Durasi</label>
                        <select name="duration_days" class="w-full px-3 py-2.5 rounded-lg border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white">
                            <option value="0">-- Pilih Durasi --</option>
                            <option value="30">1 Bulan</option>
                            <option value="90">3 Bulan</option>
                            <option value="180">6 Bulan</option>
                            <option value="365">1 Tahun</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-200">
                <svg class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                <p class="text-xs text-slate-600 font-medium">API Key akan dibuat <strong>otomatis</strong> secara aman</p>
            </div>
            <div class="flex gap-3 pt-1">
                <button type="submit" id="btn-submit-add" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-emerald-200">Simpan Akun</button>
                <button type="button" onclick="document.getElementById('add-modal').classList.add('hidden')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition">Batal</button>
            </div>
        </form>
    </div>
</div>

{{-- Edit Modal --}}
<div id="edit-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onclick="document.getElementById('edit-modal').classList.add('hidden')"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
        <div class="bg-[#059669] px-6 py-5 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </div>
            <div>
                <h3 class="text-lg font-bold text-white">Edit Pengguna</h3>
                <p class="text-emerald-100 text-xs mt-0.5" id="edit-email-label">email@example.com</p>
            </div>
        </div>
        <form id="edit-form" onsubmit="handleEditUser(event)" class="p-6 space-y-4">
            <input type="hidden" name="doc_id" id="edit-doc-id">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap <span class="text-red-500">*</span></label>
                    <input type="text" name="name" id="edit-name" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] transition bg-white">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email (Tidak bisa diubah)</label>
                    <input type="email" name="email" id="edit-email" readonly class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none bg-slate-50 text-slate-600 cursor-not-allowed">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password <span class="text-slate-400 font-normal normal-case">(Isi jika ganti)</span></label>
                    <input type="password" name="password" minlength="8" placeholder="Biarkan kosong" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Sekolah</label>
                    <input type="text" name="institution_name" id="edit-institution" placeholder="SMAN 1 Jakarta" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] transition bg-white">
                </div>
            </div>
            <div class="bg-emerald-50 rounded-xl p-4 space-y-3 border border-emerald-100">
                <p class="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    Paket Langganan
                </p>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1.5">Nama Paket</label>
                        <select name="plan_name" id="edit-plan-name" class="w-full px-3 py-2.5 rounded-lg border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white">
                            <option value="">-- Pilih Paket --</option>
                            <option value="Basic Plan">Basic Plan</option>
                            <option value="Standard Plan">Standard Plan</option>
                            <option value="Premium Plan">Premium Plan</option>
                            <option value="Enterprise Plan">Enterprise Plan</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1.5">Durasi Baru (opsional)</label>
                        <select name="duration_days" id="edit-duration-days" class="w-full px-3 py-2.5 rounded-lg border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white">
                            <option value="0">-- Tambah Durasi --</option>
                            <option value="30">1 Bulan</option>
                            <option value="90">3 Bulan</option>
                            <option value="180">6 Bulan</option>
                            <option value="365">1 Tahun</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="pt-4 flex gap-3">
                <button type="submit" id="btn-submit-edit" class="flex-1 py-2.5 bg-[#059669] hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Simpan Perubahan
                </button>
                <button type="button" onclick="document.getElementById('edit-modal').classList.add('hidden')" class="flex-1 py-2.5 bg-[#e2e8f0] hover:bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl transition">Batal</button>
            </div>
        </form>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
async function sha256(msg) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg.toLowerCase().trim()));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
function generateRandomApiKey() {
    return Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(16).padStart(2, '0')).join('');
}
async function getIpAddress() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch(e) {
        return 'Unknown IP';
    }
}

const SUPERADMIN_ID = "{{ hash('sha256', auth()->user()->firebase_uid) }}";
let dataTable;

$(document).ready(function() {
    dataTable = $('#tbl-sekolah').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/id.json',
            lengthMenu: "Tampilkan _MENU_ data",
            search: "Cari:"
        },
        columnDefs: [ { orderable: false, targets: 5 } ]
    });

    const db = firebase.firestore();
    db.collection('superadmin').doc(SUPERADMIN_ID).collection('sekolah')
      .onSnapshot(snapshot => {
          dataTable.clear();
          let activeCount = 0;
          let i = 1;

          snapshot.forEach(doc => {
              const user = doc.data();
              const hasSub = user.subscription && user.subscription.isActive;
              if(hasSub) activeCount++;
              
              const initials = user.name ? user.name.charAt(0).toUpperCase() : '?';
              const nameHtml = `
                  <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">${initials}</div>
                      <div>
                          <p class="text-sm font-semibold text-slate-800">${user.name || '—'}</p>
                          <p class="text-xs text-slate-400">${user.email || '—'}</p>
                      </div>
                  </div>
              `;
              
              let subHtml = '<span class="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">Tidak ada</span>';
              let planName = '';
              if(hasSub) {
                  const endDate = user.subscription.endDate ? new Date(user.subscription.endDate.toMillis()).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : '—';
                  planName = user.subscription.planName;
                  subHtml = `
                      <div>
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>${planName}
                          </span>
                          <p class="text-[10px] text-slate-400 mt-0.5">s/d ${endDate}</p>
                      </div>
                  `;
              }
              
              let apiHtml = '<span class="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">Tidak ada</span>';
              if(user.hasApiKey) {
                  apiHtml = `
                      <span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono bg-slate-100 text-slate-600">
                          <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                          Aktif
                      </span>
                  `;
              }

              const actionsHtml = `
                  <div class="flex items-center gap-2">
                      <button onclick="openEditModal('${doc.id}', '${user.name}', '${user.email}', '${user.institutionName || ''}', '${planName}')"
                          class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          Edit
                      </button>
                      <button type="button" onclick="deleteUserFirebase('${doc.id}', '${user.email}')" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                  </div>
              `;

              dataTable.row.add([
                  `<span class="text-sm text-slate-400">${i++}</span>`,
                  nameHtml,
                  `<span class="text-sm text-slate-600 font-medium">${user.institutionName || '—'}</span>`,
                  subHtml,
                  apiHtml,
                  actionsHtml
              ]);
          });
          dataTable.draw();

          document.getElementById('header-total').textContent = snapshot.size;
          document.getElementById('badge-total').textContent = snapshot.size;
          document.getElementById('header-active').textContent = activeCount;
      });
});

async function handleAddUser(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-submit-add');
    btn.disabled = true;
    btn.innerText = 'Menyimpan...';

    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const instName = form.institution_name.value;
    const planName = form.plan_name.value;
    const durDays = parseInt(form.duration_days.value) || 0;
    const type = 'sekolah';

    try {
        const db = firebase.firestore();
        const idHash = await sha256(crypto.randomUUID() + email);
        const passwordHash = await sha256(password);
        
        // Generate raw API Key, but store hash
        const rawApiKey = generateRandomApiKey();
        const apiKeyHash = await sha256(rawApiKey);
        
        const data = {
            uidHash: idHash,
            role: 'user',
            institutionType: type,
            name: name,
            email: email,
            passwordHash: passwordHash, // stored securely
            apiKeyHash: apiKeyHash,     // stored securely
            hasApiKey: true,
            institutionName: instName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (planName && durDays > 0) {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + durDays);
            data.subscription = {
                planName: planName,
                isActive: true,
                endDate: firebase.firestore.Timestamp.fromDate(endDate)
            };
        }

        // Save main user document inside superadmin -> SUPERADMIN_ID -> sekolah -> idHash
        await db.collection('superadmin').doc(SUPERADMIN_ID).collection(type).doc(idHash).set(data);
        
        // Save to logs subcollection
        const ip = await getIpAddress();
        await db.collection('superadmin').doc(SUPERADMIN_ID).collection('logs').add({
            activity: `Membuat akun ${type} baru (${email})`,
            ipAddress: ip,
            device: navigator.userAgent,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        document.getElementById('add-modal').classList.add('hidden');
        form.reset();
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil Didaftarkan!',
            html: `Akun <b>${name}</b> berhasil disimpan ke Firebase.<br><br><div class="text-left bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2"><span class="text-xs font-bold text-slate-500 uppercase">API Key (Sekali Tampil):</span><br><code class="text-sm text-slate-800 break-all select-all font-mono">${rawApiKey}</code></div><p class="text-xs text-red-500 mt-3">*Sistem hanya menyimpan versi sandi rahasia. Salin API Key ini sekarang!</p>`,
            confirmButtonColor: '#059669'
        });
        
    } catch(e) {
        console.error("Error adding user:", e);
        Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data: ' + e.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerText = 'Simpan Akun';
    }
}

function openEditModal(docId, name, email, instName, planName) {
    document.getElementById('edit-doc-id').value = docId;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-email-label').textContent = email;
    document.getElementById('edit-institution').value = instName !== 'undefined' ? instName : '';
    document.getElementById('edit-plan-name').value = planName || '';
    document.getElementById('edit-duration-days').value = '0';
    document.getElementById('edit-form').password.value = '';
    
    document.getElementById('edit-modal').classList.remove('hidden');
}

async function handleEditUser(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-submit-edit');
    btn.disabled = true;
    btn.innerText = 'Menyimpan...';

    const form = event.target;
    const docId = form.doc_id.value;
    const name = form.name.value;
    const password = form.password.value;
    const instName = form.institution_name.value;
    const planName = form.plan_name.value;
    const durDays = parseInt(form.duration_days.value) || 0;
    const type = 'sekolah';

    try {
        const db = firebase.firestore();
        
        // update doc
        const updateData = {
            name: name,
            institutionName: instName
        };
        
        if (password) {
            updateData.passwordHash = await sha256(password);
        }
        
        if (planName && durDays > 0) {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + durDays);
            updateData.subscription = {
                planName: planName,
                isActive: true,
                endDate: firebase.firestore.Timestamp.fromDate(endDate)
            };
        }
        await db.collection('superadmin').doc(SUPERADMIN_ID).collection(type).doc(docId).update(updateData);
        
        const ip = await getIpAddress();
        await db.collection('superadmin').doc(SUPERADMIN_ID).collection('logs').add({
            activity: `Memperbarui profil ${type} (${name})`,
            ipAddress: ip,
            device: navigator.userAgent,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        document.getElementById('edit-modal').classList.add('hidden');
        Swal.fire({
            icon: 'success',
            title: 'Tersimpan!',
            text: 'Data berhasil diperbarui di Firebase.',
            showConfirmButton: false,
            timer: 1500
        });
    } catch(e) {
        console.error("Error updating user:", e);
        Swal.fire('Gagal', 'Terjadi kesalahan: ' + e.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerText = 'Simpan Perubahan';
    }
}

async function deleteUserFirebase(docId, email) {
    Swal.fire({
        title: 'Hapus Akun?',
        text: "Akun ini akan dihapus permanen dari Firebase!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const db = firebase.firestore();
                await db.collection('superadmin').doc(SUPERADMIN_ID).collection('sekolah').doc(docId).delete();
                
                const ip = await getIpAddress();
                await db.collection('superadmin').doc(SUPERADMIN_ID).collection('logs').add({
                    activity: `Menghapus akun sekolah (${email})`,
                    ipAddress: ip,
                    device: navigator.userAgent,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                Swal.fire({
                    icon: 'success',
                    title: 'Terhapus!',
                    text: 'Akun telah dihapus.',
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (e) {
                console.error("Gagal menghapus dari Firebase:", e);
                Swal.fire('Gagal', 'Tidak dapat menghapus data.', 'error');
            }
        }
    });
}
</script>
@endsection
