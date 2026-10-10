import { jsPDF } from 'jspdf';
import { CareerReport, Roadmap, UserProfile } from '../types';

export function exportCareerReportToPDF(report: CareerReport, profile: UserProfile): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = 20;
    }
  };

  // Top Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(167, 139, 250); // Purple 400
  doc.text('CAREERSCOUT AI • CAREER INTELLIGENCE REPORT', margin, 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(`${profile.name}'s Career Assessment`, margin, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(
    `Target Role: ${profile.preferred_role}  |  Education: ${profile.degree} (${profile.branch})`,
    margin,
    33
  );

  // Readiness Score Badge in Header
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - margin - 42, 10, 42, 24, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(96, 165, 250); // Blue 400
  doc.text(`${report.readiness_score}/100`, pageWidth - margin - 21, 20, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  doc.text('READINESS INDEX', pageWidth - margin - 21, 28, { align: 'center' });

  y = 52;

  const drawSectionHeader = (title: string, r = 79, g = 70, b = 229) => {
    checkPageBreak(14);
    doc.setFillColor(r, g, b);
    doc.rect(margin, y, 3, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin + 6, y + 4.8);
    y += 10;
  };

  // Executive Assessment
  drawSectionHeader('Executive Assessment', 124, 58, 237);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(report.summary, contentWidth);
  checkPageBreak(summaryLines.length * 5 + 6);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 5 + 4;

  if (report.market_insights) {
    const insightText = `Indian Market Insight: ${report.market_insights}`;
    const insightLines = doc.splitTextToSize(insightText, contentWidth - 8);
    const boxHeight = insightLines.length * 4.8 + 6;
    checkPageBreak(boxHeight + 6);
    doc.setFillColor(245, 243, 255); // Light purple tint
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(91, 33, 182);
    doc.text(insightLines, margin + 4, y + 5.5);
    y += boxHeight + 8;
  } else {
    y += 4;
  }

  // Core Strengths
  drawSectionHeader('Core Strengths', 16, 185, 129);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  report.top_strengths.forEach((strength) => {
    const lines = doc.splitTextToSize(`•  ${strength}`, contentWidth - 4);
    checkPageBreak(lines.length * 5 + 2);
    doc.text(lines, margin + 2, y);
    y += lines.length * 5 + 2;
  });
  y += 4;

  // Priority Focus Gaps
  drawSectionHeader('Priority Focus Gaps', 245, 158, 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  report.top_weaknesses.forEach((weakness) => {
    const lines = doc.splitTextToSize(`•  ${weakness}`, contentWidth - 4);
    checkPageBreak(lines.length * 5 + 2);
    doc.text(lines, margin + 2, y);
    y += lines.length * 5 + 2;
  });
  y += 4;

  // High-Impact Portfolio Projects
  drawSectionHeader('High-Impact Portfolio Projects to Build', 37, 99, 235);
  report.recommended_projects.forEach((proj, idx) => {
    const descLines = doc.splitTextToSize(proj.description, contentWidth - 8);
    const techStackStr = `Tech Stack: ${proj.tech_stack.join(', ')}`;
    const techLines = doc.splitTextToSize(techStackStr, contentWidth - 8);
    const valueLines = doc.splitTextToSize(`Impact: ${proj.portfolio_value}`, contentWidth - 8);

    const cardHeight = 10 + descLines.length * 4.5 + techLines.length * 4.5 + valueLines.length * 4.5 + 8;
    checkPageBreak(cardHeight + 4);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'FD');

    let cy = y + 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${proj.title} [${proj.difficulty}]`, margin + 4, cy);
    cy += 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(descLines, margin + 4, cy);
    cy += descLines.length * 4.5 + 1.5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    doc.text(techLines, margin + 4, cy);
    cy += techLines.length * 4.5 + 1.5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(5, 150, 105);
    doc.text(valueLines, margin + 4, cy);

    y += cardHeight + 4;
  });
  y += 4;

  // Curated Free Learning Resources
  drawSectionHeader('Curated Free Learning Resources', 147, 51, 234);
  report.recommended_learning_resources.forEach((res) => {
    const line = `•  ${res.name} (${res.type} • ${res.estimated_time}) — ${res.url_or_topic}`;
    const lines = doc.splitTextToSize(line, contentWidth - 4);
    checkPageBreak(lines.length * 5 + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(lines, margin + 2, y);
    y += lines.length * 5 + 2;
  });
  y += 4;

  // Interview Drill Topics
  drawSectionHeader('Interview Drill Topics', 79, 70, 229);
  report.interview_preparation_topics.forEach((topic, idx) => {
    const lines = doc.splitTextToSize(`${idx + 1}.  ${topic}`, contentWidth - 4);
    checkPageBreak(lines.length * 5 + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(lines, margin + 2, y);
    y += lines.length * 5 + 2;
  });

  // Add page numbers & footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated by CareerScout AI  •  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const safeName = profile.name.replace(/\s+/g, '_') || 'Candidate';
  doc.save(`CareerScout_Intelligence_Report_${safeName}.pdf`);
}

export function exportRoadmapToPDF(roadmap: Roadmap): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = 20;
    }
  };

  // Top Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(96, 165, 250);
  doc.text('CAREERSCOUT AI • 30-DAY EXECUTION SPRINT', margin, 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text(`${roadmap.target_role} Roadmap`, margin, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);
  const subtitle = roadmap.target_company
    ? `Targeting ${roadmap.target_company}  •  ${roadmap.total_days} Days Plan`
    : `${roadmap.total_days} Days Technical Preparation Plan`;
  doc.text(subtitle, margin, 30);

  y = 46;

  // Summary
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(roadmap.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 5 + 6;

  roadmap.weeks.forEach((week) => {
    checkPageBreak(18);
    doc.setFillColor(37, 99, 235);
    doc.rect(margin, y, 3, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Week ${week.week}: ${week.title}`, margin + 6, y + 4.8);
    y += 7;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text(week.theme, margin + 6, y + 3);
    y += 7;

    week.days.forEach((day) => {
      const taskLines = doc.splitTextToSize(day.task, contentWidth - 8);
      const boxHeight = 14 + taskLines.length * 4.5;
      checkPageBreak(boxHeight + 4);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`Day ${day.day}: ${day.goal}`, margin + 4, y + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235);
      doc.text(`${day.topic}  •  ${day.estimated_hours} hrs`, margin + 4, y + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(taskLines, margin + 4, y + 14.5);

      y += boxHeight + 3;
    });

    y += 4;
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated by CareerScout AI  •  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const safeRole = roadmap.target_role.replace(/\s+/g, '_') || 'Roadmap';
  doc.save(`CareerScout_30Day_Roadmap_${safeRole}.pdf`);
}
