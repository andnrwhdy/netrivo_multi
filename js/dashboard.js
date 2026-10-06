// Dashboard presentation only. Lesson and evaluation rules remain in their own pages.
const dashboardCourses = {
  pengantar: ['pengantar-konsep', 'pengantar-topologi', 'pengantar-latihan'],
  cisco: ['cisco-pengenalan', 'cisco-router', 'cisco-switch', 'cisco-routing', 'cisco-latihan'],
  mikrotik: ['mikrotik-pengenalan', 'mikrotik-winbox', 'mikrotik-routeros', 'mikrotik-latihan']
};

const dashboardSteps = Object.values(dashboardCourses).flat();
const savedDashboardProgress = window.NetrivoSession?.read('netrivoProgressV6', []) ?? [];
const completedDashboardSteps = new Set(Array.isArray(savedDashboardProgress) ? savedDashboardProgress : []);
const completedDashboardCount = dashboardSteps.filter((step) => completedDashboardSteps.has(step)).length;
const dashboardPercent = Math.round((completedDashboardCount / dashboardSteps.length) * 100);

const dashboardPercentEl = document.querySelector('[data-dashboard-percent]');
const dashboardCountEl = document.querySelector('[data-dashboard-count]');
const dashboardBar = document.querySelector('[data-dashboard-bar]');
const dashboardNextEl = document.querySelector('[data-dashboard-next]');
const dashboardTrack = document.querySelector('.dashboard-progress-track');

if (dashboardPercentEl) dashboardPercentEl.textContent = `${dashboardPercent}%`;
if (dashboardCountEl) dashboardCountEl.textContent = `${completedDashboardCount} dari ${dashboardSteps.length} langkah selesai`;
if (dashboardTrack) dashboardTrack.setAttribute('aria-valuenow', String(dashboardPercent));
if (dashboardBar) dashboardBar.style.width = `${dashboardPercent}%`;

const dashboardCourseNames = { pengantar: 'Pengantar Jaringan', cisco: 'Cisco Networking', mikrotik: 'MikroTik' };
const nextCourse = Object.entries(dashboardCourses).find(([, steps]) => steps.some((step) => !completedDashboardSteps.has(step)))?.[0];
if (dashboardNextEl) dashboardNextEl.textContent = nextCourse ? `Lanjutkan: ${dashboardCourseNames[nextCourse]}` : 'Semua materi selesai';

const evaluationStatus = document.querySelector('[data-evaluation-status]');
if (evaluationStatus) evaluationStatus.textContent = completedDashboardCount === dashboardSteps.length ? 'Seluruh materi selesai' : 'Tersedia untuk dicoba';
