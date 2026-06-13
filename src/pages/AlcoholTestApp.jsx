import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button, Badge, Input, Textarea, Label } from '@/components/ui';
import { LayoutDashboard, Users, ClipboardPlus, History, Search, FileText, Shield, Settings, LogOut, ArrowRight, Calendar, Printer, Share2, Eye, HelpCircle } from 'lucide-react';

const menu = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'persons', label: 'Data Orang', icon: Users },
  { key: 'new-test', label: 'Input Tes', icon: ClipboardPlus },
  { key: 'tests', label: 'Riwayat Tes', icon: History },
  { key: 'trace', label: 'Trace', icon: Search },
  { key: 'reports', label: 'Laporan', icon: FileText },
  { key: 'audit', label: 'Audit Log', icon: Shield },
  { key: 'settings', label: 'Pengaturan', icon: Settings },
];

const summary = [
  { label: 'Total Tes Hari Ini', value: '120' },
  { label: 'Normal', value: '100' },
  { label: 'Fail', value: '20' },
  { label: 'Jumlah Orang', value: '85' },
];

const initialPeople = [
  {
    id: 'PRS-001',
    fullName: 'Budi Santoso',
    identityNumber: '123456',
    department: 'Operasional',
    position: 'Supervisor',
    workLocation: 'Gerbang Utama',
    phoneNumber: '081200000001',
    notes: 'Pegawai shift pagi',
    isActive: true,
  },
  {
    id: 'PRS-002',
    fullName: 'Siti Aulia',
    identityNumber: '654321',
    department: 'Security',
    position: 'Officer',
    workLocation: 'Pos Security',
    phoneNumber: '081200000002',
    notes: '',
    isActive: true,
  },
  {
    id: 'PRS-003',
    fullName: 'Rian Putra',
    identityNumber: '778899',
    department: 'Warehouse',
    position: 'Staff',
    workLocation: 'Gudang 2',
    phoneNumber: '081200000003',
    notes: 'Perlu update nomor identitas lama',
    isActive: false,
  },
];

const initialTests = [
  {
    id: 'TST-001',
    personId: 'PRS-001',
    personName: 'Budi Santoso',
    personCode: 'EMP-001',
    identityNumber: '123456',
    department: 'Operasional',
    testDate: '2026-06-13',
    testTime: '08:12',
    locationName: 'Gerbang Utama',
    officerName: 'Admin Internal',
    deviceName: 'Breathalyzer A',
    alcoholValue: 0,
    resultStatus: 'normal',
    notes: 'Pemeriksaan rutin sebelum masuk gerbang.',
  },
  {
    id: 'TST-002',
    personId: 'PRS-002',
    personName: 'Siti Aulia',
    personCode: 'EMP-002',
    identityNumber: '654321',
    department: 'Security',
    testDate: '2026-06-13',
    testTime: '08:30',
    locationName: 'Pos Security',
    officerName: 'Admin Internal',
    deviceName: 'Breathalyzer B',
    alcoholValue: 0.02,
    resultStatus: 'fail',
    notes: 'Hasil di atas nol. Perlu pemeriksaan ulang.',
  },
  {
    id: 'TST-003',
    personId: 'PRS-001',
    personName: 'Budi Santoso',
    personCode: 'EMP-001',
    identityNumber: '123456',
    department: 'Operasional',
    testDate: '2026-06-12',
    testTime: '17:05',
    locationName: 'Gerbang Utama',
    officerName: 'Admin Internal',
    deviceName: 'Breathalyzer A',
    alcoholValue: 0,
    resultStatus: 'normal',
    notes: 'Pemeriksaan sebelum pulang shift.',
  },
];

const initialAuditLogs = [
  {
    id: 'AUD-001',
    action: 'CREATE',
    module: 'TEST',
    recordId: 'TST-001',
    description: 'Menambahkan hasil tes baru untuk Budi Santoso (PRS-001) dengan nilai 0.00 (NORMAL)',
    actorName: 'admin_internal',
    createdAt: '2026-06-13 08:12:45',
    beforeData: null,
    afterData: { personId: 'PRS-001', alcoholValue: 0, resultStatus: 'normal', officerName: 'Admin Internal' },
  },
  {
    id: 'AUD-002',
    action: 'CREATE',
    module: 'TEST',
    recordId: 'TST-002',
    description: 'Menambahkan hasil tes baru untuk Siti Aulia (PRS-002) dengan nilai 0.02 (FAIL)',
    actorName: 'admin_internal',
    createdAt: '2026-06-13 08:30:12',
    beforeData: null,
    afterData: { personId: 'PRS-002', alcoholValue: 0.02, resultStatus: 'fail', officerName: 'Admin Internal' },
  },
  {
    id: 'AUD-003',
    action: 'UPDATE',
    module: 'PERSON',
    recordId: 'PRS-003',
    description: 'Mengubah status keanggotaan Rian Putra (PRS-003) menjadi NONAKTIF',
    actorName: 'superadmin',
    createdAt: '2026-06-12 14:15:22',
    beforeData: { id: 'PRS-003', fullName: 'Rian Putra', isActive: true },
    afterData: { id: 'PRS-003', fullName: 'Rian Putra', isActive: false },
  },
];

const emptyPersonForm = {
  id: '',
  fullName: '',
  identityNumber: '',
  department: '',
  position: '',
  workLocation: '',
  phoneNumber: '',
  notes: '',
  isActive: true,
};

function getResultStatus(value) {
  if (value < 0) return { status: 'invalid', text: 'Nilai alkohol tidak boleh negatif.' };
  if (value === 0) return { status: 'normal', text: 'Nilai 0, hasil otomatis normal.' };
  return { status: 'fail', text: 'Nilai di atas 0, hasil otomatis fail.' };
}

function StatusBadge({ status = 'normal' }) {
  if (status === 'fail') {
    return <Badge className="bg-red-600 text-white hover:bg-red-600">FAIL</Badge>;
  }
  if (status === 'invalid') {
    return <Badge className="bg-amber-500 text-white hover:bg-amber-500">INVALID</Badge>;
  }
  if (status === 'inactive') {
    return <Badge className="bg-slate-500 text-white hover:bg-slate-500">NONAKTIF</Badge>;
  }
  if (status === 'active') {
    return <Badge className="bg-blue-600 text-white hover:bg-blue-600">AKTIF</Badge>;
  }
  return <Badge className="bg-blue-600 text-white hover:bg-blue-600">NORMAL</Badge>;
}

function PlaceholderPage({ title, description }) {
  return (
    <Card className="border-blue-100 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-blue-950">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50 p-8 text-sm text-slate-600">
          Halaman ini sudah disiapkan sebagai skeleton dan siap diisi pada tahap coding berikutnya.
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPage({ onNavigate, tests }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} className="border-blue-100 bg-white shadow-sm">
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-3xl text-blue-950">{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="border-blue-100 bg-white shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-blue-950">Tes Terbaru</CardTitle>
            <CardDescription>Ringkasan hasil pemeriksaan terbaru hari ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tests.slice(0, 5).map((test) => (
                <div key={test.id} className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <div>
                    <div className="font-medium text-blue-950">{test.personName}</div>
                    <div className="text-sm text-slate-600">{test.id} • {test.testDate} {test.testTime}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-700">{test.alcoholValue}</div>
                    <StatusBadge status={test.resultStatus} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950">Quick Actions</CardTitle>
            <CardDescription>Akses cepat ke fitur utama.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-blue-700 text-white hover:bg-blue-800" onClick={() => onNavigate('new-test')}>+ Input Tes Baru</Button>
            <Button variant="outline" className="w-full border-blue-200 text-blue-800" onClick={() => onNavigate('persons')}>Data Orang</Button>
            <Button variant="outline" className="w-full border-blue-200 text-blue-800" onClick={() => onNavigate('reports')}>Buat Laporan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InputTesPage({ persons, onSaveTest, appSettings }) {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(persons[0] || null);
  const [testDate, setTestDate] = useState('2026-06-13');
  const [testTime, setTestTime] = useState('08:15');
  const [location, setLocation] = useState(appSettings.defaultLocation);
  const [officer, setOfficer] = useState(appSettings.defaultOfficer);
  const [device, setDevice] = useState(appSettings.defaultDevice);
  const [alcoholValue, setAlcoholValue] = useState('0');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filteredPeople = useMemo(() => {
    const q = query.toLowerCase();
    return persons.filter((person) => {
      const searchable = [person.fullName, person.id, person.identityNumber, person.department].join(' ').toLowerCase();
      return searchable.includes(q);
    });
  }, [persons, query]);

  const numericValue = Number(alcoholValue);
  const result = getResultStatus(Number.isNaN(numericValue) ? -1 : numericValue);
  const canSubmit = selectedPerson && testDate && testTime && officer && alcoholValue !== '' && result.status !== 'invalid';

  const resetForm = () => {
    setQuery('');
    setSelectedPerson(persons[0] || null);
    setTestDate('2026-06-13');
    setTestTime('08:15');
    setLocation(appSettings.defaultLocation);
    setOfficer(appSettings.defaultOfficer);
    setDevice(appSettings.defaultDevice);
    setAlcoholValue('0');
    setNotes('');
    setSubmitted(false);
  };

  const handleSave = () => {
    if (!canSubmit) return;
    onSaveTest({
      personId: selectedPerson.id,
      personName: selectedPerson.fullName,
      identityNumber: selectedPerson.identityNumber,
      department: selectedPerson.department,
      testDate,
      testTime,
      locationName: location,
      officerName: officer,
      deviceName: device,
      alcoholValue: numericValue,
      resultStatus: result.status,
      notes,
    });
    setSubmitted(true);
  };

  if (!persons.length) {
    return (
      <Card className="border-blue-100 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-blue-950">Input Tes Baru</CardTitle>
          <CardDescription>Belum ada data orang aktif untuk dipilih.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50 p-8 text-sm text-slate-600">
            Tambahkan data orang terlebih dahulu sebelum melakukan input tes.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-100 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-blue-950">Input Tes Baru</CardTitle>
          <CardDescription>Halaman inti untuk input hasil pemeriksaan alkohol dengan status otomatis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="mb-3 text-sm font-semibold text-blue-900">A. Identitas Orang</div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Cari nama / ID / identitas</Label>
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari orang..." className="border-blue-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Pilih orang</Label>
                    <div className="space-y-2">
                      {filteredPeople.map((person) => (
                        <button
                          key={person.id}
                          onClick={() => setSelectedPerson(person)}
                          className={`w-full rounded-lg border px-3 py-3 text-left ${selectedPerson?.id === person.id ? 'border-blue-700 bg-blue-100' : 'border-blue-100 bg-white hover:bg-blue-50'}`}
                        >
                          <div className="font-medium text-blue-950">{person.fullName}</div>
                          <div className="text-sm text-slate-600">{person.id} • {person.identityNumber} • {person.department}</div>
                        </button>
                      ))}
                      {filteredPeople.length === 0 && (
                        <div className="rounded-lg border border-dashed border-blue-200 bg-white p-3 text-sm text-slate-600">
                          Data orang tidak ditemukan.
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedPerson && (
                    <div className="grid gap-3 rounded-lg border border-blue-100 bg-white p-4 md:grid-cols-2">
                      <div>
                        <div className="text-xs text-slate-500">Nama</div>
                        <div className="font-medium text-blue-950">{selectedPerson.fullName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">ID Orang</div>
                        <div className="font-medium text-blue-950">{selectedPerson.id}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Identitas</div>
                        <div className="font-medium text-blue-950">{selectedPerson.identityNumber}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Departemen</div>
                        <div className="font-medium text-blue-950">{selectedPerson.department}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="mb-3 text-sm font-semibold text-blue-900">B. Data Pemeriksaan</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tanggal Tes</Label>
                    <Input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} className="border-blue-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Jam Tes</Label>
                    <Input type="time" value={testTime} onChange={(e) => setTestTime(e.target.value)} className="border-blue-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Lokasi Tes</Label>
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} className="border-blue-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Petugas Pemeriksa</Label>
                    <Input value={officer} onChange={(e) => setOfficer(e.target.value)} className="border-blue-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Alat / Device</Label>
                    <Input value={device} onChange={(e) => setDevice(e.target.value)} className="border-blue-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Alcohol Value</Label>
                    <Input type="number" step="0.01" value={alcoholValue} onChange={(e) => setAlcoholValue(e.target.value)} className="border-blue-200" />
                    <div className="text-xs text-slate-500">0 = normal, di atas 0 = fail, nilai negatif tidak valid.</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Label>Catatan</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tambahkan catatan bila diperlukan..." className="min-h-24 border-blue-200" />
                </div>
              </div>

              <div className={`rounded-xl border p-4 ${result.status === 'fail' ? 'border-red-200 bg-red-50' : result.status === 'invalid' ? 'border-amber-200 bg-amber-50' : 'border-blue-100 bg-blue-50'}`}>
                <div className="mb-3 text-sm font-semibold text-blue-900">C. Hasil Otomatis</div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs text-slate-500">Nilai Alkohol</div>
                    <div className="text-lg font-semibold text-slate-900">{alcoholValue === '' ? '-' : alcoholValue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Status</div>
                    <div className="mt-1"><StatusBadge status={result.status} /></div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs text-slate-500">Keterangan</div>
                    <div className="font-medium text-slate-900">{result.text}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-blue-700 text-white hover:bg-blue-800" disabled={!canSubmit} onClick={handleSave}>Simpan Tes</Button>
                <Button variant="outline" className="border-blue-200 text-blue-800" onClick={resetForm}>Reset</Button>
                <Button variant="outline" className="border-blue-200 text-blue-800">Batal</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {submitted && selectedPerson && (
        <Card className="border-blue-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950">Data Tes Berhasil Disimpan</CardTitle>
            <CardDescription>Contoh state sukses setelah submit data pemeriksaan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="text-xs text-slate-500">Nama</div>
                <div className="font-medium text-blue-950">{selectedPerson.fullName}</div>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="text-xs text-slate-500">Waktu Tes</div>
                <div className="font-medium text-blue-950">{testDate} {testTime}</div>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="text-xs text-slate-500">Nilai Alkohol</div>
                <div className="font-medium text-blue-950">{alcoholValue}</div>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="text-xs text-slate-500">Status</div>
                <div className="mt-1"><StatusBadge status={result.status} /></div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button className="bg-blue-700 text-white hover:bg-blue-800">Lihat Detail</Button>
              <Button variant="outline" className="border-blue-200 text-blue-800">Download PDF</Button>
              <Button variant="outline" className="border-blue-200 text-blue-800">Share</Button>
              <Button variant="outline" className="border-blue-200 text-blue-800" onClick={resetForm}>Input Lagi</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PersonFormPanel({ mode, form, setForm, onSave, onCancel }) {
  const isDetail = mode === 'detail';
  const title = mode === 'create' ? 'Tambah Data Orang' : mode === 'edit' ? 'Edit Data Orang' : 'Detail Data Orang';

  return (
    <Card className="border-blue-100 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-blue-950">{title}</CardTitle>
        <CardDescription>Master data orang untuk kebutuhan input tes dan tracing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input value={form.fullName} disabled={isDetail} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="border-blue-200" />
          </div>
          <div className="space-y-2">
            <Label>Nomor Identitas</Label>
            <Input value={form.identityNumber} disabled={isDetail} onChange={(e) => setForm({ ...form, identityNumber: e.target.value })} className="border-blue-200" />
          </div>
          <div className="space-y-2">
            <Label>Departemen / Unit</Label>
            <Input value={form.department} disabled={isDetail} onChange={(e) => setForm({ ...form, department: e.target.value })} className="border-blue-200" />
          </div>
          <div className="space-y-2">
            <Label>Jabatan</Label>
            <Input value={form.position} disabled={isDetail} onChange={(e) => setForm({ ...form, position: e.target.value })} className="border-blue-200" />
          </div>
          <div className="space-y-2">
            <Label>Lokasi Kerja</Label>
            <Input value={form.workLocation} disabled={isDetail} onChange={(e) => setForm({ ...form, workLocation: e.target.value })} className="border-blue-200" />
          </div>
          <div className="space-y-2">
            <Label>Nomor HP</Label>
            <Input value={form.phoneNumber} disabled={isDetail} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="border-blue-200" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Catatan</Label>
          <Textarea value={form.notes} disabled={isDetail} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="min-h-24 border-blue-200" />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex gap-3">
            <Button type="button" variant={form.isActive ? 'default' : 'outline'} className={form.isActive ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border-blue-200 text-blue-800'} disabled={isDetail} onClick={() => setForm({ ...form, isActive: true })}>Aktif</Button>
            <Button type="button" variant={!form.isActive ? 'default' : 'outline'} className={!form.isActive ? 'bg-slate-700 text-white hover:bg-slate-800' : 'border-blue-200 text-blue-800'} disabled={isDetail} onClick={() => setForm({ ...form, isActive: false })}>Nonaktif</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {mode !== 'detail' && (
            <Button className="bg-blue-700 text-white hover:bg-blue-800" disabled={!form.fullName || !form.identityNumber} onClick={onSave}>Simpan</Button>
          )}
          <Button variant="outline" className="border-blue-200 text-blue-800" onClick={onCancel}>{mode === 'detail' ? 'Tutup' : 'Batal'}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DataOrangPage({ persons, setPersons }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mode, setMode] = useState('list');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [form, setForm] = useState(emptyPersonForm);

  const filteredPersons = useMemo(() => {
    return persons.filter((person) => {
      const searchable = [person.id, person.fullName, person.identityNumber, person.department, person.position].join(' ').toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && person.isActive) || (statusFilter === 'inactive' && !person.isActive);
      return matchesQuery && matchesStatus;
    });
  }, [persons, query, statusFilter]);

  const startCreate = () => {
    setMode('create');
    setSelectedPerson(null);
    setForm(emptyPersonForm);
  };

  const startEdit = (person) => {
    setMode('edit');
    setSelectedPerson(person);
    setForm(person);
  };

  const openDetail = (person) => {
    setMode('detail');
    setSelectedPerson(person);
    setForm(person);
  };

  const savePerson = () => {
    if (mode === 'create') {
      const nextId = `PRS-${String(persons.length + 1).padStart(3, '0')}`;
      setPersons([{ ...form, id: nextId }, ...persons]);
      setMode('list');
      setForm(emptyPersonForm);
      return;
    }

    if (mode === 'edit' && selectedPerson) {
      setPersons(persons.map((person) => (person.id === selectedPerson.id ? { ...form, id: selectedPerson.id } : person)));
      setMode('list');
      setSelectedPerson(null);
      setForm(emptyPersonForm);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <Card className="border-blue-100 bg-white shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-blue-950">Data Orang</CardTitle>
                <CardDescription>Kelola master data orang untuk kebutuhan pemeriksaan dan tracing.</CardDescription>
              </div>
              <Button className="bg-blue-700 text-white hover:bg-blue-800" onClick={startCreate}>+ Tambah Orang</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama / ID / identitas" className="border-blue-200 md:col-span-2" />
              <div className="grid grid-cols-3 gap-2">
                <Button variant={statusFilter === 'all' ? 'default' : 'outline'} className={statusFilter === 'all' ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border-blue-200 text-blue-800'} onClick={() => setStatusFilter('all')}>Semua</Button>
                <Button variant={statusFilter === 'active' ? 'default' : 'outline'} className={statusFilter === 'active' ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border-blue-200 text-blue-800'} onClick={() => setStatusFilter('active')}>Aktif</Button>
                <Button variant={statusFilter === 'inactive' ? 'default' : 'outline'} className={statusFilter === 'inactive' ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border-blue-200 text-blue-800'} onClick={() => setStatusFilter('inactive')}>Nonaktif</Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-blue-100">
              <div className="grid grid-cols-12 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950">
                <div className="col-span-2">ID Orang</div>
                <div className="col-span-3">Nama</div>
                <div className="col-span-2">Identitas</div>
                <div className="col-span-2">Departemen</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Aksi</div>
              </div>
              {filteredPersons.map((person) => (
                <div key={person.id} className="grid grid-cols-12 items-center border-t border-blue-100 px-4 py-3 text-sm">
                  <div className="col-span-2 font-medium text-blue-950">{person.id}</div>
                  <div className="col-span-3">{person.fullName}</div>
                  <div className="col-span-2">{person.identityNumber}</div>
                  <div className="col-span-2">{person.department}</div>
                  <div className="col-span-1">
                    <StatusBadge status={person.isActive ? 'active' : 'inactive'} />
                  </div>
                  <div className="col-span-2 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-800" onClick={() => openDetail(person)}>Detail</Button>
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-800" onClick={() => startEdit(person)}>Edit</Button>
                  </div>
                </div>
              ))}
              {filteredPersons.length === 0 && (
                <div className="p-6 text-sm text-slate-600">Tidak ada data orang yang sesuai dengan filter.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {mode === 'list' ? (
          <Card className="border-blue-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-950">Ringkasan Data Orang</CardTitle>
              <CardDescription>Gambaran cepat master data orang saat ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="text-xs text-slate-500">Total Orang</div>
                <div className="text-2xl font-semibold text-blue-950">{persons.length}</div>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="text-xs text-slate-500">Aktif</div>
                <div className="text-2xl font-semibold text-blue-950">{persons.filter((person) => person.isActive).length}</div>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="text-xs text-slate-500">Nonaktif</div>
                <div className="text-2xl font-semibold text-blue-950">{persons.filter((person) => !person.isActive).length}</div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <PersonFormPanel mode={mode} form={form} setForm={setForm} onSave={savePerson} onCancel={() => { setMode('list'); setSelectedPerson(null); setForm(emptyPersonForm); }} />
        )}
      </div>
    </div>
  );
}

function RiwayatTesPage({ tests }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setTestDate] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const searchable = [test.id, test.personName, test.locationName, test.officerName].join(' ').toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || test.resultStatus === statusFilter;
      const matchesDate = !dateFilter || test.testDate === dateFilter;
      return matchesQuery && matchesStatus && matchesDate;
    });
  }, [tests, query, statusFilter, dateFilter]);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <Card className="border-blue-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950">Riwayat Tes</CardTitle>
            <CardDescription>Daftar seluruh hasil pemeriksaan alkohol internal dengan filter pencarian.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama / ID tes / petugas / lokasi" className="border-blue-200 md:col-span-2" />
              <Input type="date" value={dateFilter} onChange={(e) => setTestDate(e.target.value)} className="border-blue-200" />
              <div className="grid grid-cols-3 gap-2">
                <Button variant={statusFilter === 'all' ? 'default' : 'outline'} className={statusFilter === 'all' ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border-blue-200 text-blue-800'} onClick={() => setStatusFilter('all')}>Semua</Button>
                <Button variant={statusFilter === 'normal' ? 'default' : 'outline'} className={statusFilter === 'normal' ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border-blue-200 text-blue-800'} onClick={() => setStatusFilter('normal')}>Normal</Button>
                <Button variant={statusFilter === 'fail' ? 'default' : 'outline'} className={statusFilter === 'fail' ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border-blue-200 text-blue-800'} onClick={() => setStatusFilter('fail')}>Fail</Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-blue-100">
              <div className="grid grid-cols-12 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950">
                <div className="col-span-2">ID Tes</div>
                <div className="col-span-3">Nama</div>
                <div className="col-span-2">Waktu</div>
                <div className="col-span-2">Lokasi</div>
                <div className="col-span-1">Nilai</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Aksi</div>
              </div>
              {filteredTests.map((test) => (
                <div key={test.id} className="grid grid-cols-12 items-center border-t border-blue-100 px-4 py-3 text-sm">
                  <div className="col-span-2 font-medium text-blue-950">{test.id}</div>
                  <div className="col-span-3">{test.personName}</div>
                  <div className="col-span-2">{test.testDate} {test.testTime}</div>
                  <div className="col-span-2">{test.locationName}</div>
                  <div className="col-span-1 font-semibold">{test.alcoholValue}</div>
                  <div className="col-span-1">
                    <StatusBadge status={test.resultStatus} />
                  </div>
                  <div className="col-span-1">
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-800" onClick={() => setSelectedTest(test)}>Detail</Button>
                  </div>
                </div>
              ))}
              {filteredTests.length === 0 && (
                <div className="p-6 text-sm text-slate-600">Tidak ada hasil pemeriksaan yang sesuai dengan filter.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {selectedTest ? (
          <Card className="border-blue-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-950">Detail Hasil Tes</CardTitle>
              <CardDescription>Informasi lengkap dan jejak audit pemeriksaan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs text-slate-500">ID Tes</div>
                    <div className="font-semibold text-blue-950">{selectedTest.id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Status</div>
                    <div className="mt-1"><StatusBadge status={selectedTest.resultStatus} /></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t pt-3">
                <div className="text-sm font-semibold text-blue-900">A. Identitas Orang</div>
                <div className="grid gap-2 text-sm md:grid-cols-2">
                  <div>
                    <div className="text-xs text-slate-500">Nama Lengkap</div>
                    <div className="font-medium text-slate-900">{selectedTest.personName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">ID Orang</div>
                    <div className="font-medium text-slate-900">{selectedTest.personId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Departemen</div>
                    <div className="font-medium text-slate-900">{selectedTest.department}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Identitas</div>
                    <div className="font-medium text-slate-900">{selectedTest.identityNumber}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t pt-3">
                <div className="text-sm font-semibold text-blue-900">B. Data Pemeriksaan</div>
                <div className="grid gap-2 text-sm md:grid-cols-2">
                  <div>
                    <div className="text-xs text-slate-500">Tanggal & Jam</div>
                    <div className="font-medium text-slate-900">{selectedTest.testDate} {selectedTest.testTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Lokasi</div>
                    <div className="font-medium text-slate-900">{selectedTest.locationName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Petugas</div>
                    <div className="font-medium text-slate-900">{selectedTest.officerName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Alat</div>
                    <div className="font-medium text-slate-900">{selectedTest.deviceName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Nilai Alkohol</div>
                    <div className="font-semibold text-blue-950">{selectedTest.alcoholValue}</div>
                  </div>
                </div>
                {selectedTest.notes && (
                  <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                    <div className="text-xs text-slate-500 mb-1">Catatan</div>
                    {selectedTest.notes}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Button className="bg-blue-700 text-white hover:bg-blue-800">Download PDF</Button>
                <Button variant="outline" className="border-blue-200 text-blue-800">Share</Button>
                <Button variant="outline" className="border-blue-200 text-blue-800" onClick={() => setSelectedTest(null)}>Tutup</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-blue-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-950">Statistik Pemeriksaan</CardTitle>
              <CardDescription>Ringkasan akumulasi seluruh data tes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="text-xs text-slate-500">Total Pemeriksaan</div>
                <div className="text-2xl font-semibold text-blue-950">{tests.length}</div>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="text-xs text-slate-500">Hasil Normal</div>
                <div className="text-2xl font-semibold text-blue-950">{tests.filter((t) => t.resultStatus === 'normal').length}</div>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="text-xs text-slate-500">Hasil Fail</div>
                <div className="text-2xl font-semibold text-blue-950">{tests.filter((t) => t.resultStatus === 'fail').length}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TracePage({ persons, tests }) {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);

  const filteredPeople = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return persons.filter((person) => {
      const searchable = [person.fullName, person.id, person.identityNumber, person.department].join(' ').toLowerCase();
      return searchable.includes(q);
    });
  }, [persons, query]);

  const personTests = useMemo(() => {
    if (!selectedPerson) return [];
    return tests.filter((test) => test.personId === selectedPerson.id);
  }, [tests, selectedPerson]);

  const stats = useMemo(() => {
    if (personTests.length === 0) return { total: 0, normal: 0, fail: 0 };
    const total = personTests.length;
    const normal = personTests.filter((t) => t.resultStatus === 'normal').length;
    const fail = personTests.filter((t) => t.resultStatus === 'fail').length;
    return { total, normal, fail };
  }, [personTests]);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6">
        <Card className="border-blue-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950">Trace Orang</CardTitle>
            <CardDescription>Cari orang untuk melacak kronologi riwayat pemeriksaan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nama / ID / Identitas</Label>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ketik nama atau NRP..." className="border-blue-200" />
            </div>

            {query && (
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Hasil Pencarian</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredPeople.map((person) => (
                    <button
                      key={person.id}
                      onClick={() => setSelectedPerson(person)}
                      className={`w-full rounded-lg border px-3 py-3 text-left transition ${selectedPerson?.id === person.id ? 'border-blue-700 bg-blue-100' : 'border-blue-100 bg-white hover:bg-blue-50'}`}
                    >
                      <div className="font-medium text-blue-950">{person.fullName}</div>
                      <div className="text-sm text-slate-600">{person.id} • {person.identityNumber}</div>
                    </button>
                  ))}
                  {filteredPeople.length === 0 && (
                    <div className="text-sm text-slate-500 py-2">Orang tidak ditemukan.</div>
                  )}
                </div>
              </div>
            )}

            {selectedPerson && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
                <div className="text-sm font-semibold text-blue-900">Profil Terpilih</div>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-xs text-slate-500">Nama Lengkap</div>
                    <div className="font-semibold text-blue-950">{selectedPerson.fullName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Departemen</div>
                    <div className="font-medium text-slate-800">{selectedPerson.department}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Jabatan</div>
                    <div className="font-medium text-slate-800">{selectedPerson.position || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Lokasi Kerja</div>
                    <div className="font-medium text-slate-800">{selectedPerson.workLocation || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Status Akun</div>
                    <div className="mt-1"><StatusBadge status={selectedPerson.isActive ? 'active' : 'inactive'} /></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-2 space-y-6">
        {selectedPerson ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-blue-100 bg-white shadow-sm">
                <CardHeader className="py-4">
                  <CardDescription className="text-xs">Total Pemeriksaan</CardDescription>
                  <CardTitle className="text-2xl text-blue-950">{stats.total}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-blue-100 bg-white shadow-sm">
                <CardHeader className="py-4">
                  <CardDescription className="text-xs">Normal</CardDescription>
                  <CardTitle className="text-2xl text-blue-950">{stats.normal}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-blue-100 bg-white shadow-sm">
                <CardHeader className="py-4">
                  <CardDescription className="text-xs">Fail</CardDescription>
                  <CardTitle className="text-2xl text-red-650">{stats.fail}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card className="border-blue-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-blue-950">Timeline Hasil Pemeriksaan</CardTitle>
                <CardDescription>Riwayat pengujian alkohol yang terurut secara kronologis.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 border-l border-blue-200 space-y-6">
                  {personTests.map((test) => (
                    <div key={test.id} className="relative">
                      <div className="absolute -left-9 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-blue-200 bg-white">
                        <Calendar className="h-3 w-3 text-blue-700" />
                      </div>
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-blue-950">{test.id}</span>
                            <span className="mx-2 text-slate-400">•</span>
                            <span className="text-sm text-slate-600">{test.testDate} {test.testTime}</span>
                          </div>
                          <StatusBadge status={test.resultStatus} />
                        </div>
                        <div className="grid gap-3 text-sm md:grid-cols-3">
                          <div>
                            <div className="text-xs text-slate-500">Nilai Alkohol</div>
                            <div className="font-semibold text-blue-950">{test.alcoholValue}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Lokasi</div>
                            <div className="font-medium text-slate-800">{test.locationName}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Petugas</div>
                            <div className="font-medium text-slate-800">{test.officerName}</div>
                          </div>
                        </div>
                        {test.notes && (
                          <div className="rounded-lg bg-white p-2.5 text-xs text-slate-600 border border-blue-50">
                            {test.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {personTests.length === 0 && (
                    <div className="text-sm text-slate-600 p-4">Tidak ada riwayat pemeriksaan untuk orang ini.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-blue-100 bg-white shadow-sm h-full flex items-center justify-center">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-blue-950">Silakan Cari & Pilih Orang</h3>
              <p className="text-sm text-slate-600 max-w-sm mt-1">Gunakan panel kiri untuk mencari pegawai berdasarkan nama, ID, atau NRP guna melihat tracing pemeriksaan lengkap.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function LaporanPage({ persons, tests }) {
  const [reportType, setReportType] = useState('periode');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-13');
  const [selectedPerson, setSelectedPerson] = useState(persons[0] || null);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [previewGenerated, setPreviewGenerated] = useState(false);

  const departments = useMemo(() => {
    const list = new Set(persons.map((p) => p.department).filter(Boolean));
    return ['all', ...Array.from(list)];
  }, [persons]);

  const reportData = useMemo(() => {
    if (!previewGenerated) return [];
    return tests.filter((test) => {
      const matchesDate = test.testDate >= startDate && test.testDate <= endDate;
      const matchesType = reportType === 'periode' ? (
        departmentFilter === 'all' || test.department === departmentFilter
      ) : (
        test.personId === selectedPerson?.id
      );
      return matchesDate && matchesType;
    });
  }, [tests, startDate, endDate, reportType, selectedPerson, departmentFilter, previewGenerated]);

  const stats = useMemo(() => {
    const total = reportData.length;
    const normal = reportData.filter((t) => t.resultStatus === 'normal').length;
    const fail = reportData.filter((t) => t.resultStatus === 'fail').length;
    return { total, normal, fail };
  }, [reportData]);

  const whatsappMessage = useMemo(() => {
    if (!previewGenerated) return '';
    const lines = [
      `*LAPORAN PEMERIKSAAN ALKOHOL INTERNAL*`,
      `Tipe Laporan: ${reportType === 'periode' ? 'Laporan Periode' : 'Laporan Per Orang'}`,
      `Periode: ${startDate} s/d ${endDate}`,
      reportType === 'periode' ? `Departemen: ${departmentFilter === 'all' ? 'Semua' : departmentFilter}` : `Nama: ${selectedPerson?.fullName} (${selectedPerson?.id})`,
      `---------------------------------`,
      `Total Pemeriksaan: ${stats.total}`,
      `Normal: ${stats.normal}`,
      `Fail: ${stats.fail}`,
      `---------------------------------`,
      `Laporan lengkap PDF dapat diakses di portal internal.`,
    ];
    return encodeURIComponent(lines.join('\n'));
  }, [reportType, startDate, endDate, departmentFilter, selectedPerson, stats, previewGenerated]);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6">
        <Card className="border-blue-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950">Filter Laporan</CardTitle>
            <CardDescription>Tentukan cakupan data laporan yang ingin dicetak atau dibagikan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Jenis Laporan</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant={reportType === 'periode' ? 'default' : 'outline'} className={reportType === 'periode' ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border-blue-200 text-blue-800'} onClick={() => { setReportType('periode'); setPreviewGenerated(false); }}>Periode</Button>
                <Button variant={reportType === 'person' ? 'default' : 'outline'} className={reportType === 'person' ? 'bg-blue-700 text-white hover:bg-blue-800' : 'border-blue-200 text-blue-800'} onClick={() => { setReportType('person'); setPreviewGenerated(false); }}>Per Orang</Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Mulai Tanggal</Label>
                <Input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPreviewGenerated(false); }} className="border-blue-200" />
              </div>
              <div className="space-y-2">
                <Label>Sampai Tanggal</Label>
                <Input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPreviewGenerated(false); }} className="border-blue-200" />
              </div>
            </div>

            {reportType === 'periode' ? (
              <div className="space-y-2">
                <Label>Departemen</Label>
                <select value={departmentFilter} onChange={(e) => { setDepartmentFilter(e.target.value); setPreviewGenerated(false); }} className="w-full rounded-lg border border-blue-200 p-2 text-sm bg-white">
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept === 'all' ? 'Semua Departemen' : dept}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Pilih Orang</Label>
                <select value={selectedPerson?.id || ''} onChange={(e) => { setSelectedPerson(persons.find(p => p.id === e.target.value)); setPreviewGenerated(false); }} className="w-full rounded-lg border border-blue-200 p-2 text-sm bg-white">
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.id})</option>
                  ))}
                </select>
              </div>
            )}

            <Button className="w-full bg-blue-700 text-white hover:bg-blue-800" onClick={() => setPreviewGenerated(true)}>Generate Laporan</Button>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-2 space-y-6">
        {previewGenerated ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-blue-100 bg-white shadow-sm">
                <CardHeader className="py-4">
                  <CardDescription className="text-xs">Total Tes Terfilter</CardDescription>
                  <CardTitle className="text-2xl text-blue-950">{stats.total}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-blue-100 bg-white shadow-sm">
                <CardHeader className="py-4">
                  <CardDescription className="text-xs">Hasil Normal</CardDescription>
                  <CardTitle className="text-2xl text-blue-950">{stats.normal}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-blue-100 bg-white shadow-sm">
                <CardHeader className="py-4">
                  <CardDescription className="text-xs">Hasil Fail</CardDescription>
                  <CardTitle className="text-2xl text-red-650">{stats.fail}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card className="border-blue-100 bg-white shadow-sm">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-blue-100 pb-4">
                  <div>
                    <CardTitle className="text-blue-950">Preview Dokumen Laporan</CardTitle>
                    <CardDescription>Representasi visual draf cetak PDF laporan.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-800 gap-2" onClick={() => window.print()}>
                      <Printer className="h-4 w-4" /> Print PDF
                    </Button>
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-800 gap-2" onClick={() => window.open(`https://api.whatsapp.com/send?text=${whatsappMessage}`, '_blank')}>
                      <Share2 className="h-4 w-4" /> Share WA
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm space-y-6 max-h-[500px] overflow-y-auto">
                  <div className="text-center border-b pb-4">
                    <h2 className="text-xl font-bold text-blue-950">LAPORAN PEMERIKSAAN KADAR ALKOHOL</h2>
                    <p className="text-sm text-slate-500">SISTEM INTEGRASI PEMERIKSAAN KARYAWAN INTERNAL</p>
                    <p className="text-xs text-slate-400 mt-1">Periode: {startDate} s/d {endDate}</p>
                  </div>

                  <div className="grid gap-4 text-sm md:grid-cols-2">
                    <div>
                      <div className="text-xs text-slate-500">Tipe Laporan</div>
                      <div className="font-semibold text-blue-950">{reportType === 'periode' ? 'REKAPITULASI PERIODE' : 'REKAPITULASI INDIVIDUAL'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Kriteria Saringan</div>
                      <div className="font-semibold text-blue-950">{reportType === 'periode' ? `Dept: ${departmentFilter === 'all' ? 'Semua' : departmentFilter}` : `Nama: ${selectedPerson?.fullName} (${selectedPerson?.id})`}</div>
                    </div>
                  </div>

                  <table className="w-full text-sm border-collapse border border-blue-100">
                    <thead>
                      <tr className="bg-blue-50 text-blue-950 text-left">
                        <th className="border border-blue-100 p-2">No</th>
                        <th className="border border-blue-100 p-2">Waktu</th>
                        <th className="border border-blue-100 p-2">Nama</th>
                        <th className="border border-blue-100 p-2">ID</th>
                        <th className="border border-blue-100 p-2">Nilai</th>
                        <th className="border border-blue-100 p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((test, index) => (
                        <tr key={test.id} className="hover:bg-slate-50">
                          <td className="border border-blue-100 p-2">{index + 1}</td>
                          <td className="border border-blue-100 p-2">{test.testDate} {test.testTime}</td>
                          <td className="border border-blue-100 p-2">{test.personName}</td>
                          <td className="border border-blue-100 p-2">{test.personId}</td>
                          <td className="border border-blue-100 p-2 font-semibold">{test.alcoholValue}</td>
                          <td className="border border-blue-100 p-2">
                            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${test.resultStatus === 'fail' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {test.resultStatus.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {reportData.length === 0 && (
                        <tr>
                          <td colSpan="6" className="border border-blue-100 p-4 text-center text-slate-500">Tidak ada data untuk periode terpilih.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="border-t pt-4 text-right text-xs text-slate-400">
                    Dokumen ini dihasilkan secara otomatis oleh sistem internal Alcohol Test App pada tanggal 13 Juni 2026.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-blue-100 bg-white shadow-sm h-full flex items-center justify-center">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-blue-950">Laporan Belum Dihasilkan</h3>
              <p className="text-sm text-slate-600 max-w-sm mt-1">Isi kriteria saringan di panel kiri kemudian klik "Generate Laporan" untuk memuat draf dokumen PDF dan share-link.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function AuditLogPage({ auditLogs }) {
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedTest] = useState(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const searchable = [log.id, log.description, log.actorName, log.recordId].join(' ').toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      return matchesQuery && matchesAction;
    });
  }, [auditLogs, query, actionFilter]);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <Card className="border-blue-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950">Audit Trail</CardTitle>
            <CardDescription>Pencatatan riwayat perubahan data untuk integritas dan trace audit internal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari deskripsi / aktor / record ID..." className="border-blue-200 md:col-span-2" />
              <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="rounded-lg border border-blue-200 p-2 text-sm bg-white">
                <option value="all">Semua Aksi</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div className="overflow-hidden rounded-xl border border-blue-100">
              <div className="grid grid-cols-12 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950">
                <div className="col-span-2">Waktu</div>
                <div className="col-span-1">Aksi</div>
                <div className="col-span-2">Modul</div>
                <div className="col-span-5">Deskripsi Ringkas</div>
                <div className="col-span-1">User</div>
                <div className="col-span-1">Aksi</div>
              </div>
              {filteredLogs.map((log) => (
                <div key={log.id} className="grid grid-cols-12 items-center border-t border-blue-100 px-4 py-3 text-sm">
                  <div className="col-span-2 text-slate-500 text-xs">{log.createdAt}</div>
                  <div className="col-span-1">
                    <Badge variant="outline" className={log.action === 'CREATE' ? 'border-green-300 text-green-700 bg-green-50' : 'border-blue-300 text-blue-700 bg-blue-50'}>
                      {log.action}
                    </Badge>
                  </div>
                  <div className="col-span-2 font-medium text-slate-700">{log.module}</div>
                  <div className="col-span-5 text-slate-600 truncate pr-3">{log.description}</div>
                  <div className="col-span-1 text-xs text-blue-900 font-semibold">{log.actorName}</div>
                  <div className="col-span-1">
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-800 p-2" onClick={() => setSelectedTest(log)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="p-6 text-sm text-slate-600">Tidak ada audit log yang sesuai dengan kriteria filter.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {selectedLog ? (
          <Card className="border-blue-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-950">Detail Audit Log</CardTitle>
              <CardDescription>Perbandingan data detail aktivitas audit trail.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-2">
                <div className="grid grid-cols-2 text-sm">
                  <div>
                    <div className="text-xs text-slate-500">ID Log</div>
                    <div className="font-semibold text-blue-950">{selectedLog.id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Aktor / Pelaku</div>
                    <div className="font-semibold text-blue-950">{selectedLog.actorName}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-2">Waktu</div>
                <div className="text-sm font-medium text-slate-900">{selectedLog.createdAt}</div>
              </div>

              <div className="space-y-2 text-sm">
                <Label>Deskripsi Aktivitas</Label>
                <div className="rounded-lg border bg-slate-50 p-3 text-slate-700 leading-relaxed">
                  {selectedLog.description}
                </div>
              </div>

              {selectedLog.beforeData && (
                <div className="space-y-2 text-sm">
                  <Label>Data Sebelum (Before)</Label>
                  <pre className="rounded-lg border bg-slate-950 p-3 text-xs text-green-400 overflow-x-auto">
                    {JSON.stringify(selectedLog.beforeData, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.afterData && (
                <div className="space-y-2 text-sm">
                  <Label>Data Sesudah (After)</Label>
                  <pre className="rounded-lg border bg-slate-950 p-3 text-xs text-blue-400 overflow-x-auto">
                    {JSON.stringify(selectedLog.afterData, null, 2)}
                  </pre>
                </div>
              )}

              <Button variant="outline" className="w-full border-blue-200 text-blue-800" onClick={() => setSelectedTest(null)}>Tutup Detail</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-blue-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-950">Informasi Kontrol</CardTitle>
              <CardDescription>Keamanan & Keandalan Berkas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                Setiap manipulasi data (tambah, hapus, cetak, share, modifikasi data orang) akan terekam secara permanen di dalam modul **Audit Log** ini demi menjaga kepatuhan regulasi internal.
              </p>
              <p>
                Aktor bertindak selaku admin penanggung jawab dari stasiun pengujian bersangkutan.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function SettingsPage({ settings, onSaveSettings }) {
  const [appName, setAppName] = useState(settings.appName);
  const [defaultLocation, setDefaultLocation] = useState(settings.defaultLocation);
  const [defaultOfficer, setDefaultOfficer] = useState(settings.defaultOfficer);
  const [defaultDevice, setDefaultDevice] = useState(settings.defaultDevice);
  const [reportTemplate, setReportTemplate] = useState(settings.reportTemplate);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveSettings({
      appName,
      defaultLocation,
      defaultOfficer,
      defaultDevice,
      reportTemplate,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <Card className="border-blue-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950">Konfigurasi Sistem</CardTitle>
            <CardDescription>Kelola parameter bawaan aplikasi dan preferensi cetak internal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nama Aplikasi</Label>
                <Input value={appName} onChange={(e) => setAppName(e.target.value)} className="border-blue-200" />
              </div>
              <div className="space-y-2">
                <Label>Bawaan Lokasi Stasiun Tes</Label>
                <Input value={defaultLocation} onChange={(e) => setDefaultLocation(e.target.value)} className="border-blue-200" />
              </div>
              <div className="space-y-2">
                <Label>Bawaan Petugas Pemeriksa</Label>
                <Input value={defaultOfficer} onChange={(e) => setDefaultOfficer(e.target.value)} className="border-blue-200" />
              </div>
              <div className="space-y-2">
                <Label>Bawaan Nama Alat (Breathalyzer)</Label>
                <Input value={defaultDevice} onChange={(e) => setDefaultDevice(e.target.value)} className="border-blue-200" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Template Laporan PDF</Label>
                <select value={reportTemplate} onChange={(e) => setReportTemplate(e.target.value)} className="w-full rounded-lg border border-blue-200 p-2 text-sm bg-white">
                  <option value="standard">Standard Internal (Kop Biru)</option>
                  <option value="minimalist">Minimalis Hitam Putih</option>
                  <option value="compact">Kompak (Tanpa Kop)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="bg-blue-700 text-white hover:bg-blue-800" onClick={handleSave}>Simpan Perubahan</Button>
            </div>

            {saved && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                Pengaturan sistem berhasil disimpan secara lokal dan akan langsung diterapkan pada transaksi berikutnya.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-blue-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-950">Petunjuk Bantuan</CardTitle>
            <CardDescription>Bantuan operasional pengaturan default stasiun tes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <div className="flex gap-3 items-start">
              <HelpCircle className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
              <p>
                Mengubah **Bawaan Lokasi, Petugas, dan Nama Alat** akan secara otomatis mengisi kolom formulir ketika admin membuka menu **Input Tes Baru**, sehingga mengurangi repetisi pengetikan manual di lapangan.
              </p>
            </div>
            <p className="pt-2">
              Pengaturan ini tersimpan di memory sesi MVP dan akan langsung terhubung ke database terpusat pada fase integrasi backend REST API.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AlcoholTestAppSkeleton() {
  const [active, setActive] = useState('dashboard');
  const [persons, setPersons] = useState(initialPeople);
  const [tests, setTests] = useState(initialTests);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [appSettings, setAppSettings] = useState({
    appName: 'Alcohol Test App',
    defaultLocation: 'Gerbang Utama',
    defaultOfficer: 'Admin Internal',
    defaultDevice: 'Breathalyzer A',
    reportTemplate: 'standard',
  });
  const activeItem = useMemo(() => menu.find((item) => item.key === active), [active]);

  const saveTest = (newTest) => {
    const nextId = `TST-${String(tests.length + 1).padStart(3, '0')}`;
    const nextTest = { ...newTest, id: nextId };
    setTests([nextTest, ...tests]);

    // Record automatically to audit log
    const nextAuditId = `AUD-${String(auditLogs.length + 1).padStart(3, '0')}`;
    const newLog = {
      id: nextAuditId,
      action: 'CREATE',
      module: 'TEST',
      recordId: nextId,
      description: `Menambahkan hasil tes baru untuk ${newTest.personName} (${newTest.personId}) dengan nilai ${newTest.alcoholValue.toFixed(2)} (${newTest.resultStatus.toUpperCase()})`,
      actorName: 'admin_internal',
      createdAt: '2026-06-13 08:35:00',
      beforeData: null,
      afterData: { personId: newTest.personId, alcoholValue: newTest.alcoholValue, resultStatus: newTest.resultStatus },
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const saveSettings = (newSettings) => {
    setAppSettings(newSettings);

    // Record automatically to audit log
    const nextAuditId = `AUD-${String(auditLogs.length + 1).padStart(3, '0')}`;
    const newLog = {
      id: nextAuditId,
      action: 'UPDATE',
      module: 'SETTINGS',
      recordId: 'CFG-001',
      description: `Mengubah konfigurasi default sistem oleh admin`,
      actorName: 'admin_internal',
      createdAt: '2026-06-13 08:40:00',
      beforeData: appSettings,
      afterData: newSettings,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-12">
        <aside className="col-span-3 bg-blue-950 p-4 text-white lg:col-span-2">
          <div className="mb-6 rounded-xl bg-blue-900 p-4">
            <div className="text-lg font-semibold">{appSettings.appName}</div>
            <div className="text-sm text-blue-100">Internal MVP</div>
          </div>

          <nav className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const selected = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${selected ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-blue-900'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-blue-900 pt-4">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-blue-100 hover:bg-blue-900">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="col-span-9 p-6 lg:col-span-10">
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div>
              <h1 className="text-2xl font-semibold text-blue-950">{activeItem?.label}</h1>
              <p className="text-sm text-slate-600">Skeleton frontend untuk MVP pemeriksaan alkohol internal dengan tampilan dominan biru.</p>
            </div>
            <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-900">
              Admin Internal
            </div>
          </div>

          {active === 'dashboard' && <DashboardPage onNavigate={setActive} tests={tests} />}
          {active === 'persons' && <DataOrangPage persons={persons} setPersons={setPersons} />}
          {active === 'new-test' && <InputTesPage persons={persons.filter((person) => person.isActive)} onSaveTest={saveTest} appSettings={appSettings} />}
          {active === 'tests' && <RiwayatTesPage tests={tests} />}
          {active === 'trace' && <TracePage persons={persons} tests={tests} />}
          {active === 'reports' && <LaporanPage persons={persons} tests={tests} />}
          {active === 'audit' && <AuditLogPage auditLogs={auditLogs} />}
          {active === 'settings' && <SettingsPage settings={appSettings} onSaveSettings={saveSettings} />}
        </main>
      </div>
    </div>
  );
}
