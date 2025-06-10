import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Subject, Grade, GradeStatistics } from '../types';
import { calculateAverage, getGradeDescription, getGradeColor } from './gradeCalculations';
import { TEXTS } from '../localization/de';

export interface PDFExportOptions {
  includeStatistics: boolean;
  includeAllGrades: boolean;
  semester?: string;
  subjectId?: string;
}

export class PDFExportService {
  private generateHTML(
    subjects: Subject[],
    grades: Grade[],
    statistics: GradeStatistics,
    options: PDFExportOptions
  ): string {
    const currentDate = new Date().toLocaleDateString('de-DE');
    
    // Filter data based on options
    let filteredGrades = grades;
    let filteredSubjects = subjects;
    
    if (options.semester) {
      filteredGrades = grades.filter(grade => grade.semester === options.semester);
    }
    
    if (options.subjectId) {
      filteredGrades = grades.filter(grade => grade.subjectId === options.subjectId);
      filteredSubjects = subjects.filter(subject => subject.$id === options.subjectId);
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Noten-Übersicht</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
              margin: 40px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #4f46e5;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .statistics {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 12px;
              margin-bottom: 30px;
            }
            .statistics h2 {
              margin: 0 0 15px 0;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
            }
            .stat-item {
              background: rgba(255, 255, 255, 0.1);
              padding: 12px;
              border-radius: 8px;
              backdrop-filter: blur(10px);
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .stat-label {
              font-size: 14px;
              opacity: 0.9;
            }
            .subject-section {
              margin-bottom: 30px;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              overflow: hidden;
            }
            .subject-header {
              padding: 15px 20px;
              font-weight: bold;
              font-size: 18px;
              color: white;
            }
            .grades-table {
              width: 100%;
              border-collapse: collapse;
            }
            .grades-table th,
            .grades-table td {
              padding: 12px 20px;
              text-align: left;
              border-bottom: 1px solid #f3f4f6;
            }
            .grades-table th {
              background-color: #f9fafb;
              font-weight: 600;
              color: #374151;
            }
            .grade-value {
              font-weight: bold;
              padding: 4px 8px;
              border-radius: 4px;
              color: white;
            }
            .subject-average {
              background-color: #f9fafb;
              font-weight: bold;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            .grade-excellent { background-color: #22c55e; }
            .grade-good { background-color: #84cc16; }
            .grade-satisfactory { background-color: #f59e0b; }
            .grade-sufficient { background-color: #ef4444; }
            .grade-poor { background-color: #f43f5e; }
            .grade-insufficient { background-color: #a855f7; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Noten-Übersicht</h1>
            <p>Erstellt am: ${currentDate}</p>
            ${options.semester ? `<p>Semester: ${options.semester}</p>` : ''}
          </div>

          ${options.includeStatistics ? this.generateStatisticsHTML(statistics) : ''}

          <div class="subjects">
            ${filteredSubjects.map(subject => {
              const subjectGrades = filteredGrades.filter(grade => grade.subjectId === subject.$id);
              if (subjectGrades.length === 0 && !options.includeAllGrades) return '';
              
              const average = calculateAverage(subjectGrades);
              
              return `
                <div class="subject-section">
                  <div class="subject-header" style="background-color: ${subject.color};">
                    ${subject.name}
                    ${average > 0 ? `(Durchschnitt: ${average.toFixed(2)})` : ''}
                  </div>
                  
                  ${subjectGrades.length > 0 ? `
                    <table class="grades-table">
                      <thead>
                        <tr>
                          <th>Datum</th>
                          <th>Art</th>
                          <th>Note</th>
                          <th>Gewichtung</th>
                          <th>Beschreibung</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${subjectGrades.map(grade => `
                          <tr>
                            <td>${grade.date ? new Date(grade.date).toLocaleDateString('de-DE') : '-'}</td>
                            <td>${grade.type}</td>
                            <td>
                              <span class="grade-value ${this.getGradeClass(grade.value)}">
                                ${grade.value.toFixed(1)}
                              </span>
                            </td>
                            <td>${(grade.weight * 100).toFixed(0)}%</td>
                            <td>${getGradeDescription(grade.value)}</td>
                          </tr>
                        `).join('')}
                        ${average > 0 ? `
                          <tr class="subject-average">
                            <td colspan="2"><strong>Durchschnitt</strong></td>
                            <td>
                              <span class="grade-value ${this.getGradeClass(average)}">
                                ${average.toFixed(2)}
                              </span>
                            </td>
                            <td colspan="2">${getGradeDescription(average)}</td>
                          </tr>
                        ` : ''}
                      </tbody>
                    </table>
                  ` : `
                    <div style="padding: 20px; text-align: center; color: #666;">
                      Keine Noten vorhanden
                    </div>
                  `}
                </div>
              `;
            }).join('')}
          </div>

          <div class="footer">
            <p>Erstellt mit Noten Tracker App</p>
            <p>Deutsche Notenskala: 1,0 (Sehr gut) bis 6,0 (Ungenügend)</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateStatisticsHTML(statistics: GradeStatistics): string {
    return `
      <div class="statistics">
        <h2>📈 Statistiken</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${statistics.overall.toFixed(2)}</div>
            <div class="stat-label">Gesamtdurchschnitt</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${statistics.weighted.toFixed(2)}</div>
            <div class="stat-label">Gewichteter Durchschnitt</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${Object.keys(statistics.subjectAverages).length}</div>
            <div class="stat-label">Anzahl Fächer</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${Object.keys(statistics.semesterAverages).length}</div>
            <div class="stat-label">Anzahl Semester</div>
          </div>
        </div>
      </div>
    `;
  }

  private getGradeClass(grade: number): string {
    if (grade <= 1.5) return 'grade-excellent';
    if (grade <= 2.5) return 'grade-good';
    if (grade <= 3.5) return 'grade-satisfactory';
    if (grade <= 4.0) return 'grade-sufficient';
    if (grade <= 5.0) return 'grade-poor';
    return 'grade-insufficient';
  }

  async exportToPDF(
    subjects: Subject[],
    grades: Grade[],
    statistics: GradeStatistics,
    options: PDFExportOptions = {
      includeStatistics: true,
      includeAllGrades: true,
    }
  ): Promise<void> {
    try {
      const html = this.generateHTML(subjects, grades, statistics, options);
      
      const { uri } = await printToFileAsync({
        html,
        base64: false,
      });

      await shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: 'Noten-Übersicht teilen',
      });
    } catch (error) {
      console.error('PDF export error:', error);
      throw new Error('Fehler beim Erstellen der PDF-Datei');
    }
  }

  async exportSubjectToPDF(
    subject: Subject,
    grades: Grade[],
    statistics: GradeStatistics
  ): Promise<void> {
    await this.exportToPDF(
      [subject],
      grades,
      statistics,
      {
        includeStatistics: false,
        includeAllGrades: true,
        subjectId: subject.$id,
      }
    );
  }

  async exportSemesterToPDF(
    subjects: Subject[],
    grades: Grade[],
    statistics: GradeStatistics,
    semester: string
  ): Promise<void> {
    await this.exportToPDF(
      subjects,
      grades,
      statistics,
      {
        includeStatistics: true,
        includeAllGrades: true,
        semester,
      }
    );
  }
}

export const pdfExportService = new PDFExportService();
