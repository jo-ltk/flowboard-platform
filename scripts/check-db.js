const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  try {
    const workspaces = await prisma.workspace.findMany();
    console.log('Workspaces Count:', workspaces.length);
    if (workspaces.length > 0) {
      console.log('First Workspace:', JSON.stringify(workspaces[0], null, 2));
    }
    
    const projects = await prisma.project.findMany();
    console.log('Projects Count:', projects.length);
    if (projects.length > 0) {
      console.log('First Project:', JSON.stringify(projects[0], null, 2));
    }

    const tasks = await prisma.task.findMany();
    console.log('Tasks Count:', tasks.length);
  } catch (err) {
    console.error('Error connecting to DB:', err);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
