const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');
  
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'main-workspace' },
    update: {},
    create: {
      name: 'Main Workspace',
      slug: 'main-workspace',
      planType: 'pro',
    },
  });

  const project = await prisma.project.create({
    data: {
      name: 'FlowBoard Evolution',
      description: 'Major architectural overhaul and aesthetic refinement.',
      workspaceId: workspace.id,
    },
  });

  await prisma.task.createMany({
    data: [
      { title: 'Finalize core design system tokens', status: 'COMPLETED', priority: 'HIGH', projectId: project.id },
      { title: 'Implement responsive dashboard sidebar', status: 'IN_PROGRESS', priority: 'MEDIUM', projectId: project.id },
      { title: 'Define micro-interaction motion curves', status: 'TODO', priority: 'LOW', projectId: project.id },
      { title: 'Refactor project view for editorial aesthetic', status: 'TODO', priority: 'HIGH', projectId: project.id },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
