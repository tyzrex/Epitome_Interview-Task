// prisma/seed.ts
import { db } from '@/lib/db';
import { faker } from '@faker-js/faker';

const programs = [
  'Bachelors in Computer Science',
  'Masters in Business',
  'PhD in Physics',
  'Undergraduate Arts',
  'Masters in Psychology',
  'Diploma in Design',
  'MBA',
];

const statuses = [
  'Approved',
  'Pending',
  'Interview Scheduled',
  'Rejected',
  'Documents Required',
];

async function main() {
  //check if the database is empty
  const count = await db.student.count();
  if (count > 0) {
    console.log('Database already seeded. Skipping seed.');
    return;
  }
  console.log('Seeding database...');

  const students = Array.from({ length: 500 }).map(() => ({
    name: faker.person.fullName(),
    program: faker.helpers.arrayElement(programs),
    status: faker.helpers.arrayElement(statuses),
    applicationDate: faker.date.between({
      from: '2023-01-01',
      to: '2024-12-31',
    }),
  }));

  await db.student.createMany({
    data: students,
  });

  console.log(`✅ Seeded ${students.length} students`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
