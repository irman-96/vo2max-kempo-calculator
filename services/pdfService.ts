
import { TestResult } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (result: TestResult) => {
  try {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let cursorY = 25;

    // Helper: Reset text settings to absolute normal
    const resetToNormal = () => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      (doc as any).setCharSpace(0); 
      doc.setLineHeightFactor(1.5);
    };

    // Helper: Clean Markdown and weird chars
    const cleanText = (text: string) => {
      return text
        .replace(/\*\*/g, '') 
        .replace(/###/g, '')  
        .replace(/₂/g, '2')   
        .trim();
    };

    // --- 1. HEADER ---
    doc.setFillColor(67, 56, 202); 
    doc.rect(0, 0, pageWidth, 42, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN ANALISIS FISIK', margin, 26);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dateStr = new Date(result.tanggalTes).toLocaleDateString('id-ID', { 
      day: '2-digit', month: 'long', year: 'numeric' 
    });
    doc.text(`Kempo High Performance | ${dateStr} | Pelatih: ${result.pelatihNama}`, margin, 34);
    
    // Decorative line
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(margin, 36, margin + 40, 36);

    cursorY = 55;

    // --- 2. SUMMARY TABLE ---
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Ringkasan Atlet', margin, cursorY);
    cursorY += 6;

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      body: [
        ['Nama Atlet', result.namaAtlet, 'Tinggi Badan', `${result.tinggiBadan} cm`],
        ['Umur', `${result.umur} Tahun`, 'Berat Badan', `${result.beratBadan} kg`],
        ['Kategori', result.kategori, 'BMI', `${result.bmi} (${result.kategoriBMI})`],
        ['Jenis Tes', result.jenisTes.replace('₂', '2'), 'VO2max', `${result.vo2max} ml/kg/min`],
        ['Status VO2max', result.kategoriVo2max, 'ID Pelatih', result.pelatihId]
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3.5, font: 'helvetica' },
      headStyles: { fillColor: [67, 56, 202] },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [248, 248, 248], width: 35 },
        2: { fontStyle: 'bold', fillColor: [248, 248, 248], width: 35 }
      }
    });

    cursorY = (doc as any).lastAutoTable.finalY + 15;

    // --- 3. RECOMMENDATIONS ---
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(67, 56, 202);
    doc.text('Analisis Mendalam & Rekomendasi Latihan', margin, cursorY);
    cursorY += 10;

    const lines = result.rekomendasi.split('\n');
    
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine === '---') return;

      if (cursorY > pageHeight - 30) {
        doc.addPage();
        cursorY = 25;
      }

      resetToNormal();

      // Heading 3 (###)
      if (trimmedLine.startsWith('###')) {
        cursorY += 4;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(67, 56, 202);
        const text = cleanText(trimmedLine);
        doc.text(text, margin, cursorY, { align: 'left' });
        cursorY += 8;
      } 
      // Bullet Points (*)
      else if (trimmedLine.startsWith('*')) {
        const text = `• ${cleanText(trimmedLine.substring(1))}`;
        const textDimensions = doc.getTextDimensions(text, { maxWidth: contentWidth - 5 });
        
        doc.text(text, margin + 2, cursorY, { maxWidth: contentWidth - 5, align: 'left' });
        cursorY += textDimensions.h + 2.5;
      }
      // Normal Paragraphs
      else {
        const text = cleanText(trimmedLine);
        const textDimensions = doc.getTextDimensions(text, { maxWidth: contentWidth });
        
        doc.text(text, margin, cursorY, { maxWidth: contentWidth, align: 'left' });
        cursorY += textDimensions.h + 2.5;
      }
    });

    // --- 4. FOOTER ---
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Decorative line at footer
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.setFont('helvetica', 'italic');
      doc.text(
        `Laporan Fisik Atlet Kempo | VO2max Kempo Calculator AI | Halaman ${i} dari ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    doc.save(`Laporan_Fisik_${result.namaAtlet.replace(/\s+/g, '_')}.pdf`);

  } catch (error) {
    console.error("PDF Export failed:", error);
    alert("Gagal mengekspor PDF. Pastikan data lengkap.");
  }
};

export const exportHistoryToPDF = (results: TestResult[]) => {
  try {
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(67, 56, 202);
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('REKAPITULASI RIWAYAT TES FISIK KEMPO', pageWidth / 2, 18, { align: 'center' });

    const head = [['Nama Atlet', 'Umur', 'Tanggal', 'Jenis Tes', 'VO2max', 'Kategori', 'BMI']];
    const body = results.map(r => [
      r.namaAtlet,
      r.umur,
      new Date(r.tanggalTes).toLocaleDateString('id-ID'),
      r.jenisTes.replace('₂', '2'),
      r.vo2max,
      r.kategoriVo2max,
      `${r.bmi} (${r.kategoriBMI})`
    ]);

    autoTable(doc, {
      startY: 40,
      head: head,
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [67, 56, 202], fontStyle: 'bold' },
      styles: { fontSize: 8.5, font: 'helvetica' },
      alternateRowStyles: { fillColor: [250, 250, 250] }
    });

    doc.save(`Riwayat_Tes_Kempo_${Date.now()}.pdf`);
  } catch (err) {
    console.error(err);
    alert("Gagal mengekspor riwayat.");
  }
};
