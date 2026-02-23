const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Check for workspaces
    const workspaces = await prisma.workspace.findMany();
    console.log('Workspaces:', workspaces.length);
    
    // Check for projects
    const projects = await prisma.project.findMany();
    console.log('Projects:', projects.length);
    
    // Check for tasks
    const tasks = await prisma.task.findMany();
    console.log('Tasks:', tasks.length);
    
    // Get first project if exists
    if (projects.length > 0) {
      console.log('First project:', projects[0]);
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
