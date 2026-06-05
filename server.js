const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Placementor.html'));
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

const roleLabels = {
  sde: 'Software Development Engineer',
  frontend: 'Frontend Developer',
  backend: 'Backend Developer',
  fullstack: 'Full Stack Developer',
  data: 'Data Scientist',
  devops: 'DevOps Engineer'
};

function getRoleBonus(role) {
  switch (role) {
    case 'frontend':
      return 6;
    case 'backend':
      return 8;
    case 'fullstack':
      return 10;
    case 'data':
      return 7;
    case 'devops':
      return 9;
    default:
      return 5;
  }
}

function getStatus(score) {
  if (score >= 80) return { text: 'Placement Ready', className: 'good' };
  if (score >= 55) return { text: 'On the Right Track', className: 'yellow' };
  return { text: 'Needs Improvement', className: 'red' };
}

function analyzeResume(file) {
  const sizeKb = file.size / 1024;
  let score = 35;
  score += Math.min(25, sizeKb / 6);
  if (/\.(pdf|docx?|txt)$/i.test(file.originalname)) {
    score += 25;
  }
  return Math.min(100, Math.round(score));
}

function buildProjects(role) {
  const baseProjects = [
    {
      name: 'REST API Backend',
      desc: 'Build a RESTful backend with authentication, CRUD, and testing.',
      difficulty: 'intermediate',
      tags: ['node.js', 'express', 'mongodb', 'rest api']
    },
    {
      name: 'Portfolio Website',
      desc: 'Showcase projects, skills, and a resume in a polished portfolio.',
      difficulty: 'beginner',
      tags: ['html', 'css', 'javascript', 'react']
    }
  ];

  if (role === 'frontend') {
    baseProjects.unshift({
      name: 'Modern UI Dashboard',
      desc: 'Create a responsive dashboard with charts and interactive filters.',
      difficulty: 'intermediate',
      tags: ['react', 'tailwind', 'charts', 'api']
    });
  }

  if (role === 'backend') {
    baseProjects.unshift({
      name: 'Microservices Architecture',
      desc: 'Develop a backend with services, queues, and API gateways.',
      difficulty: 'advanced',
      tags: ['node.js', 'express', 'docker', 'kubernetes']
    });
  }

  if (role === 'data') {
    baseProjects.unshift({
      name: 'Data Analysis Pipeline',
      desc: 'Process a dataset and build visualizations from insights.',
      difficulty: 'intermediate',
      tags: ['python', 'pandas', 'sql', 'visualization']
    });
  }

  return baseProjects;
}

app.post('/api/analyze', upload.single('resume'), (req, res) => {
  const { github, linkedin, leetcode, codechef, targetRole, communication } = req.body;
  if (!github || !targetRole || !communication || !req.file) {
    return res.status(400).json({ error: 'Required fields: github, targetRole, communication, resume' });
  }

  const communicationRating = parseInt(communication, 10) || 5;
  const resumeScore = analyzeResume(req.file);
  const githubScore = Math.min(100, github.length * 3 + 10);
  const codingScore = Math.min(100, githubScore + (leetcode ? 12 : 0) + (codechef ? 10 : 0) + getRoleBonus(targetRole));
  const skillsScore = Math.min(100, 30 + (linkedin ? 12 : 0) + (codingScore / 6));
  const experienceScore = Math.min(100, 10 + (linkedin ? 15 : 0) + (codechef ? 8 : 0));
  const projectsScore = Math.min(100, codingScore + 8);
  const communicationScore = Math.min(100, communicationRating * 18);

  const totalScore = Math.round(
    projectsScore * 0.25 +
    skillsScore * 0.2 +
    codingScore * 0.2 +
    resumeScore * 0.15 +
    experienceScore * 0.1 +
    communicationScore * 0.1
  );

  const status = getStatus(totalScore);
  const response = {
    username: github,
    targetRole: roleLabels[targetRole] || 'Candidate',
    totalScore,
    status: status.text,
    statusClass: status.className,
    breakdown: [
      { name: 'Projects', score: projectsScore, weight: 25 },
      { name: 'Skills', score: skillsScore, weight: 20 },
      { name: 'DSA / Coding', score: codingScore, weight: 20 },
      { name: 'Resume Quality', score: resumeScore, weight: 15 },
      { name: 'Experience', score: experienceScore, weight: 10 },
      { name: 'Communication', score: communicationScore, weight: 10 }
    ],
    skills: {
      have: ['Algorithms', 'Git', 'GitHub'],
      need: ['System Design', 'SQL', 'Docker', 'API Development', 'Linux']
    },
    projects: buildProjects(targetRole),
    courses: [
      { title: 'Data Structures & Algorithms', label: 'DSA', priority: 'high' },
      { title: 'System Design for Interviews', label: 'Architecture', priority: 'medium' },
      { title: 'Java for Interview Prep', label: 'Language', priority: 'medium' },
      { title: 'SQL & Database Design', label: 'Database', priority: 'medium' }
    ],
    tips: [
      'Include achievements, certifications, or hackathon wins',
      'Add 2-3 strong, well-described projects',
      'Include standard sections: Education, Experience, Skills, Projects',
      'Consider condensing your resume to 1-2 pages'
    ],
    experience: [
      'Apply to internships on LinkedIn, Internshala, or AngelList',
      'Take on freelance projects via Upwork or Fiverr to build real-world experience',
      'Contribute to open-source projects on GitHub to demonstrate collaboration skills',
      'Build a personal portfolio website to showcase your work'
    ],
    portfolio: {
      hasPortfolio: Boolean(linkedin),
      message: linkedin
        ? 'Your portfolio signals a presence online. Keep it updated and linked in your resume.'
        : 'Build a personal portfolio website to showcase your projects, skills, and achievements.'
    },
    roadmap: [
      { week: 'Week 1-2', title: 'Build Core Skills', tasks: ['Complete 1 course on missing technology', 'Build a small practice project', 'Study documentation and tutorials'] },
      { week: 'Week 3-5', title: 'Build Impressive Projects', tasks: ['Start one full-stack project', 'Deploy it live with documentation', 'Add it to GitHub with a polished README'] },
      { week: 'Week 5-6', title: 'Polish Your Resume', tasks: ['Rewrite project descriptions with metrics', 'Add relevant skills and certifications', 'Get feedback from peers or mentors'] },
      { week: 'Week 6-8', title: 'Gain Real Experience', tasks: ['Apply to internships or freelance gigs', 'Contribute to open-source projects', 'Build a portfolio website'] }
    ]
  };

  fs.unlink(req.file.path, () => {});
  return res.json(response);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Placementor backend running on http://localhost:${PORT}`);
});
