const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

// 1. Initialize function to populate the projects array
function initialize() {
  return new Promise((resolve, reject) => {
    try {
      projectData.forEach((item) => {
        const sectorInfo = sectorData.find((e) => e.id === item.sector_id);
        projects.push({
          ...item,
          sector: sectorInfo ? sectorInfo.sector_name : "Unknown Sector",
        });
      });
      resolve();
    } catch (err) {
      reject(`Initialization failed: ${err}`);
    }
  });
}

// 2. Return all projects
function getAllProjects() {
  return new Promise((resolve, reject) => {
    if (projects.length > 0) {
      resolve(projects);
    } else {
      reject("No projects available");
    }
  });
}

// 3. Return a specific project by its ID
function getProjectById (projectId) {
  return new Promise((resolve, reject) => {
    const project = projects.find((e) => e.id === projectId);
    if (project) {
      resolve(project);
    } else {
      reject("Project not found");
    }
  });
}

// 4. Return all projects by a specific sector
function getProjectsBySector(arg_sector) {
  return new Promise((resolve, reject) => {
    const sectorProjects = projects.filter((e) => 
      e.sector.toLowerCase().includes(arg_sector.toLowerCase())
    );
    if (sectorProjects.length > 0) {
      resolve(sectorProjects);
    } else {
      reject("No projects found in this sector");
    }
  });
}

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };