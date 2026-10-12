/**
 * Jupyter Notebook (.ipynb) generator for MSc Field Spectroscopy Practical Labs.
 * Creates clean, validated, ready-to-execute Python notebooks with Markdown tutorials,
 * LaTeX mathematical derivations, and annotated analysis code.
 */
import type { PracticalLab, CourseModule } from '../types';

export function generateJupyterNotebook(module: CourseModule, lab: PracticalLab): string {
  const pythonSnippet =
    lab.codeSnippets.find((s) => s.language === 'python') || lab.codeSnippets[0];

  const cells = [
    {
      cell_type: 'markdown',
      metadata: {},
      source: [
        `# MSc Course: Principles of Field Spectroscopy\n`,
        `## Module ${module.moduleNumber}: ${module.title}\n`,
        `### ${lab.title}\n`,
        `\n`,
        `---\n`,
        `**Software Environment:** ${lab.softwareEnvironment}  \n`,
        `**ECTS Credits:** ${module.ectsCredits} | **Duration:** ${module.durationHours} Hours  \n`,
        `**Primary Packages:** \`${lab.primaryPackages.join('`, `')}\`\n`,
        `\n`,
        `### 🎯 Learning Objectives\n`,
        ...lab.learningObjectives.map((obj) => `- ${obj}\n`),
        `\n`,
        `### 📊 Curated Sample Dataset\n`,
        `- **File Name:** \`${lab.sampleDataset.name}\`\n`,
        `- **Description:** ${lab.sampleDataset.description}\n`,
        `- **Spectral Coverage:** ${lab.sampleDataset.spectralRange}\n`,
        `- **Sensor Hardware:** ${lab.sampleDataset.sensor}\n`,
        `- **Band Count:** ${lab.sampleDataset.bandsCount} spectral channels\n`,
        `\n`,
        `---\n`
      ]
    },
    {
      cell_type: 'markdown',
      metadata: {},
      source: [
        `### 1. Environment Setup & Dependency Installation\n`,
        `Run the cell below to verify that all necessary scientific computing packages are installed.\n`
      ]
    },
    {
      cell_type: 'code',
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        `# Install required scientific libraries if not already present\n`,
        `# !pip install numpy scipy matplotlib pandas\n`,
        `\n`,
        `import numpy as np\n`,
        `import matplotlib.pyplot as plt\n`,
        `import pandas as pd\n`,
        `\n`,
        `# Set publication-quality figure aesthetics for MSc reporting\n`,
        `plt.rcParams['figure.dpi'] = 150\n`,
        `plt.rcParams['font.size'] = 10\n`,
        `plt.rcParams['axes.grid'] = True\n`,
        `plt.rcParams['grid.alpha'] = 0.3\n`,
        `print("✓ Scientific environment loaded successfully.")\n`
      ]
    },
    {
      cell_type: 'markdown',
      metadata: {},
      source: [
        `### 2. Core Lab Implementation Code\n`,
        `**${pythonSnippet?.title || 'Laboratory Implementation'}**  \n`,
        `${pythonSnippet?.description || ''}\n`
      ]
    },
    {
      cell_type: 'code',
      execution_count: null,
      metadata: {},
      outputs: [],
      source: pythonSnippet ? pythonSnippet.code.split('\n').map((line) => line + '\n') : []
    },
    {
      cell_type: 'markdown',
      metadata: {},
      source: [
        `### 3. Student Hands-On Assignments & Analytical Tasks\n`,
        `Complete the following tasks in dedicated code cells below and record your interpretations.\n`,
        `\n`,
        ...lab.studentTasks.map((t, i) => `#### Task ${i + 1}\n${t}\n\n`),
        `\n`,
        `---\n`,
        `### 4. Expected Deliverable\n`,
        `${lab.expectedOutputSummary}\n`
      ]
    },
    {
      cell_type: 'code',
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        `# [STUDENT CODE CELL 1] Insert your analysis code for Task 1 here:\n`,
        `\n`
      ]
    },
    {
      cell_type: 'code',
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        `# [STUDENT CODE CELL 2] Insert your analysis code for Task 2 here:\n`,
        `\n`
      ]
    }
  ];

  const notebook = {
    cells,
    metadata: {
      kernelspec: {
        display_name: 'Python 3 (ipykernel)',
        language: 'python',
        name: 'python3'
      },
      language_info: {
        codemirror_mode: {
          name: 'ipython',
          version: 3
        },
        file_extension: '.py',
        mimetype: 'text/x-python',
        name: 'python',
        nbconvert_exporter: 'python',
        pygments_lexer: 'ipython3',
        version: '3.10.0'
      }
    },
    nbformat: 4,
    nbformat_minor: 5
  };

  return JSON.stringify(notebook, null, 2);
}

export function downloadJupyterNotebook(module: CourseModule, lab: PracticalLab): void {
  const jsonContent = generateJupyterNotebook(module, lab);
  const blob = new Blob([jsonContent], { type: 'application/x-ipynb+json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MSc_Spec_Module_${module.moduleNumber}_Lab_${lab.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.ipynb`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
