@extends('layouts.app')
@section('page-title', 'Dashboard')
@section('content')
<div class="space-y-6">

    <!-- Welcome Banner -->
    <div class="relative bg-gradient-to-r from-[#0f172a] via-[#1e3a5f] to-[#1e40af] rounded-2xl px-8 py-7 text-white overflow-hidden shadow-lg">
        <div class="absolute right-0 top-0 w-64 h-full opacity-10">
            <svg viewBox="0 0 200 200" fill="currentColor" class="w-full h-full"><circle cx="160" cy="40" r="80"/><circle cx="60" cy="160" r="60"/></svg>
        </div>
        <div class="relative">
            <p class="text-blue-300 text-sm font-medium mb-1">Selamat datang,</p>
            <h2 class="text-3xl font-extrabold mb-1">{{ auth()->user()->name }} 👋</h2>
            <p class="text-blue-200 text-sm">Kelola pengguna Absensi Wajah, API Keys, dan langganan dari sini.</p>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
                <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Users</p>
                <p class="text-3xl font-extrabold text-slate-800 leading-none mt-0.5">{{ $usersCount }}</p>
            </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
                <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">Langganan Aktif</p>
                <p class="text-3xl font-extrabold text-slate-800 leading-none mt-0.5">{{ $activeSubscriptions }}</p>
            </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div>
                <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Langganan</p>
                <p class="text-3xl font-extrabold text-slate-800 leading-none mt-0.5">{{ $subscriptionsCount }}</p>
            </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div>
                <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">API Keys Aktif</p>
                <p class="text-3xl font-extrabold text-slate-800 leading-none mt-0.5">{{ $apiKeysCount }}</p>
            </div>
        </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Donut Chart: User by Role -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 class="text-sm font-bold text-slate-800 mb-1">Distribusi Pengguna</h3>
            <p class="text-xs text-slate-400 mb-4">Perbandingan role superadmin vs user</p>
            <div class="flex items-center justify-center">
                <canvas id="roleChart" width="220" height="220" style="max-width:220px;max-height:220px;"></canvas>
            </div>
            <div class="flex justify-center gap-6 mt-4">
                <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-blue-500"></span><span class="text-xs text-slate-600 font-medium">Superadmin ({{ $superadminCount }})</span></div>
                <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-slate-300"></span><span class="text-xs text-slate-600 font-medium">User ({{ $regularUserCount }})</span></div>
            </div>
        </div>

        <!-- Bar Chart: Users by Institution -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 class="text-sm font-bold text-slate-800 mb-1">Pengguna per Institusi</h3>
            <p class="text-xs text-slate-400 mb-4">Data dari Sekolah, Universitas & Perusahaan</p>
            <canvas id="instChart" height="220"></canvas>
        </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
                <h3 class="text-base font-bold text-slate-800">Pengguna Terbaru</h3>
                <p class="text-xs text-slate-400 mt-0.5">5 pengguna yang baru bergabung</p>
            </div>
            <span class="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-semibold">{{ $usersCount }} Total</span>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead><tr class="bg-slate-50 border-b border-slate-100">
                    <th class="px-6 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">#</th>
                    <th class="px-6 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                    <th class="px-6 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                    <th class="px-6 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Langganan</th>
                    <th class="px-6 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-slate-50">
                    @forelse($users as $index => $user)
                    <tr class="hover:bg-slate-50 transition">
                        <td class="px-6 py-4 text-sm text-slate-400">{{ $index + 1 }}</td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">{{ strtoupper(substr($user->name,0,1)) }}</div>
                                <div><p class="text-sm font-semibold text-slate-800">{{ $user->name }}</p><p class="text-xs text-slate-400">{{ $user->email }}</p></div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            @if($user->role === 'superadmin')
                                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>Superadmin</span>
                            @else
                                <span class="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">User</span>
                            @endif
                        </td>
                        <td class="px-6 py-4">
                            @if($user->subscriptions->count() > 0)
                                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700"><span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>{{ $user->subscriptions->last()->plan_name }}</span>
                            @else
                                <span class="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">Tidak ada</span>
                            @endif
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <form action="{{ route('superadmin.users.apikey', $user->id) }}" method="POST">@csrf<button type="submit" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition">🔑 API Key</button></form>
                                <button onclick="document.getElementById('sub-modal-{{ $user->id }}').classList.remove('hidden')" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition">+ Subscribe</button>
                            </div>
                        </td>
                    </tr>
                    <!-- Subscription Modal -->
                    <div id="sub-modal-{{ $user->id }}" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onclick="document.getElementById('sub-modal-{{ $user->id }}').classList.add('hidden')"></div>
                        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
                            <div class="bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] px-6 py-5"><h3 class="text-lg font-bold text-white">Tambah Langganan</h3><p class="text-blue-300 text-sm mt-0.5">Untuk: <span class="font-semibold text-blue-200">{{ $user->name }}</span></p></div>
                            <form action="{{ route('superadmin.users.subscription', $user->id) }}" method="POST" class="p-6 space-y-4">@csrf
                                <div><label class="block text-sm font-semibold text-slate-700 mb-1.5">Nama Paket</label><input type="text" name="plan_name" required placeholder="e.g. Premium Plan" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"></div>
                                <div><label class="block text-sm font-semibold text-slate-700 mb-1.5">Durasi (Hari)</label><input type="number" name="duration_days" required min="1" placeholder="30" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"></div>
                                <div class="flex gap-3 pt-2"><button type="submit" class="flex-1 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition">Simpan</button><button type="button" onclick="document.getElementById('sub-modal-{{ $user->id }}').classList.add('hidden')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl transition">Batal</button></div>
                            </form>
                        </div>
                    </div>
                    @empty
                    <tr><td colspan="5" class="px-6 py-12 text-center text-slate-400"><p class="font-semibold text-sm">Belum ada pengguna</p></td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Donut - Role distribution
    new Chart(document.getElementById('roleChart'), {
        type: 'doughnut',
        data: {
            labels: ['Superadmin', 'User'],
            datasets: [{ data: [{{ $superadminCount }}, {{ $regularUserCount }}], backgroundColor: ['#3b82f6','#e2e8f0'], borderWidth: 0, hoverOffset: 6 }]
        },
        options: { cutout: '72%', plugins: { legend: { display: false } } }
    });

    // Bar - Per Institution
    new Chart(document.getElementById('instChart'), {
        type: 'bar',
        data: {
            labels: ['🏫 Sekolah', '🎓 Universitas', '🏢 Perusahaan'],
            datasets: [{
                label: 'Pengguna',
                data: [{{ $sekolahCount }}, {{ $universitasCount }}, {{ $perusahaanCount }}],
                backgroundColor: ['#3b82f6', '#6366f1', '#10b981'],
                borderRadius: 10,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { precision: 0 } },
                x: { grid: { display: false } }
            }
        }
    });
});
</script>
@endsection
