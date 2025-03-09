/********************************************************************************
 * WEB322 – Assignment 02
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: ___Tzuyi Lin___ Student ID: __127201234__ Date: __2025/3/10__
 *
 ********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects");
const path = require("path");

const app = express();
const port = 3000;

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static('public'));

// Initialize the projects array before starting the server
async function initializeServer() {
  try {
    await projectData.initialize();

    app.get("/", (req, res) => {
      res.render("home", { page: "/" });
    });

    app.get("/about", (req, res) => {
      res.render("about", { page: "/about" });
    });

    app.get("/solutions/projects", async (req, res) => {
      try {
        const { sector } = req.query;
        let projects = await projectData.getAllProjects();

        if (sector) {
          projects = projects.filter((proj) => proj.sector.toLowerCase() === sector.toLowerCase());
          if (projects.length === 0) {
            return res.status(404).json({ error: `No projects found for the sector: ${sector}`});
          }
        }

        res.render("projects", {
          projects: projects,
          page: "/solutions/projects",
        });
      } catch (err) {
        res.status(500).render("404", { message: "Failed to retrieve projects" });
      }
    });

    app.get("/solutions/projects/:id", async (req, res) => {
      try {
        const projectId = parseInt(req.params.id, 10);
        const project = await projectData.getProjectById(projectId);

        if (!project) {
          return res.status(404).render("404", { message: `Project ID ${projectId} not found.` });
        }

        res.render("project", {
          project: project,
          page: "",
        });
      } catch (err) {
        res.status(500).render("404", { message: "Unable to find requested project." });
      }
    });

    app.use((req, res) => {
      res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for." });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to initialize projects:", err);
  }
}

initializeServer();
