
import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const Settings: React.FC = () => {
  const { googleSheetUrl, setGoogleSheetUrl } = useSettings();
  const [url, setUrl] = useState(googleSheetUrl);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setGoogleSheetUrl(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const appsScriptCode = `
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1"); // Ganti "Sheet1" dengan nama sheet Anda
  var data = JSON.parse(e.postData.contents);
  
  if (data.action === 'add') {
    var newRow = data.payload;
    sheet.appendRow([
      newRow.id, newRow.namaAtlet, newRow.umur, newRow.kategori,
      newRow.tinggiBadan, newRow.beratBadan, newRow.bmi, newRow.kategoriBMI,
      newRow.jenisTes, newRow.jarakTempuh || '', newRow.waktuTempuh || '', 
      newRow.levelBleep || '', newRow.shuttleBleep || '',
      newRow.vo2max, newRow.kategoriVo2max, newRow.pelatihId,
      newRow.pelatihNama, new Date(newRow.tanggalTes), newRow.rekomendasi
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', id: newRow.id })).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (data.action === 'delete') {
    var idsToDelete = data.payload.ids;
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var rowsDeleted = 0;
    // Loop backwards to avoid index shifting issues
    for (var i = values.length - 1; i >= 1; i--) {
      var rowId = values[i][0]; // Assuming ID is in the first column
      if (idsToDelete.includes(rowId)) {
        sheet.deleteRow(i + 1);
        rowsDeleted++;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', deleted: rowsDeleted })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1"); // Ganti "Sheet1" dengan nama sheet Anda
  var range = sheet.getDataRange();
  var values = range.getValues();
  var results = [];
  var headers = values[0];
  
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = values[i][j];
    }
    // Convert date back to timestamp for consistency
    row.tanggalTes = new Date(row.tanggalTes).getTime();
    results.push(row);
  }
  
  return ContentService.createTextOutput(JSON.stringify(results)).setMimeType(ContentService.MimeType.JSON);
}
  `;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Pengaturan Sinkronisasi</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="sheetUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL Google Apps Script
            </label>
            <input
              type="url"
              id="sheetUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end items-center space-x-4">
            {saved && <span className="text-green-500 text-sm">Tersimpan!</span>}
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Cara Mengkoneksikan Google Sheet</h3>
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
          <p>
            Untuk menyimpan dan menyinkronkan data tes secara otomatis, Anda perlu membuat jembatan antara aplikasi ini dan Google Sheet Anda menggunakan Google Apps Script.
          </p>
          <ol>
            <li>Buka Google Sheet Anda dan buat sheet baru (atau gunakan yang sudah ada). Pastikan baris pertama (header) memiliki nama kolom berikut persis:
            <br/>
            <code>id, namaAtlet, umur, kategori, tinggiBadan, beratBadan, bmi, kategoriBMI, jenisTes, jarakTempuh, waktuTempuh, levelBleep, shuttleBleep, vo2max, kategoriVo2max, pelatihId, pelatihNama, tanggalTes, rekomendasi</code>
            </li>
            <li>Di Google Sheet, buka <strong>Extensions &gt; Apps Script</strong>.</li>
            <li>Hapus semua kode yang ada di editor dan salin-tempel kode di bawah ini.</li>
            <li>
              <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md my-2">
                <pre className="whitespace-pre-wrap text-xs"><code>{appsScriptCode}</code></pre>
              </div>
            </li>
            <li>Simpan proyek (ikon disket).</li>
            <li>Klik tombol <strong>Deploy &gt; New deployment</strong>.</li>
            <li>Pilih jenis "Web app".</li>
            <li>Pada bagian "Who has access", pilih <strong>"Anyone"</strong> (Siapa Saja). Ini penting agar aplikasi bisa mengirim data.</li>
            <li>Klik "Deploy". Anda mungkin perlu memberikan izin (authorize) pada akun Google Anda.</li>
            <li>Salin "Web app URL" yang diberikan dan tempelkan di kolom input di atas, lalu klik Simpan.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Settings;
